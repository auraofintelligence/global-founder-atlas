"""Validate the funding refresh without network access or third-party packages."""
import datetime
import json
import pathlib
import re
import subprocess
from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit

ROOT = pathlib.Path(__file__).resolve().parents[1]
load = lambda name: json.loads((ROOT / name).read_text(encoding='utf-8-sig'))
data = load('data/opportunities.json')
archive = load('data/opportunity-archive.json')
meta = load('data/funding-refresh.json')
ids = {o['id'] for o in data}
assert len(ids) == len(data), 'Duplicate programme ID'
assert len({r['id'] for r in archive['rounds']}) == len(archive['rounds']), 'Duplicate round ID'
assert meta['programmes_after'] == len(data)
assert meta['active_programmes'] == sum(o['status_class'] != 'closed' for o in data)
assert set(meta['closed_programme_ids']) == {o['id'] for o in data if o['status_class'] == 'closed'}
assert set(meta['archived_round_ids']) == {r['id'] for r in archive['rounds']}
baseline = json.loads(subprocess.check_output(
    ['git', 'show', meta['baseline_commit'] + ':data/opportunities.json'], cwd=ROOT))
old = {o['id']: o for o in baseline}
assert set(meta['new_ids']) == ids - old.keys()
assert len(old) == meta['programmes_before']
assert old.keys() <= ids, 'An existing programme was deleted'
critical = {'status','opens','closes','eligibility','au_eligible','requires_local','stage',
            'funding_amount','support_type','equity','ip_conditions','matching_required',
            'other_benefits','key_documents'}
theme_keys = {t['key'] for t in load('data/themes.json')['projectAreas']}
for o in data:
    assert set(old[next(iter(old))]) <= set(o), 'Incomplete programme: ' + o['id']
    assert o['status_class'] in {'open','soon','recurring','unknown','closed'}
    assert set(o['themes']) <= theme_keys, 'Unapproved theme: ' + o['id']
    v = o['verification']
    assert v['checked_on'] == meta['checked_on']
    confirmed, unverified = set(v['confirmed_fields']), set(v['unverified_fields'])
    assert not confirmed & unverified
    assert confirmed | unverified == critical, 'Missing verification coverage: ' + o['id']
    for date_field in ('opens', 'closes'):
        if date_field in confirmed:
            assert 'TBC' not in o[date_field], 'Indicative date marked confirmed: ' + o['id']
    assert v['notes'] and v['sources']
    assert all(urlsplit(s['url']).scheme == 'https' for s in v['sources'])
    assert all(0 <= score <= 5 for score in o['scores'].values())
    assert set(o['scores']) == {'elig','value','align','early','infra','ip','reloc','cred'}
    assert not re.search('[\u2013\u2014]', json.dumps(o, ensure_ascii=False)), 'Unwanted dash: ' + o['id']
for r in archive['rounds']:
    assert r['programme_id'] in ids
    assert r['record'] == old[r['programme_id']], 'Historical snapshot was altered'
    assert r['reason'] and r['sources']
    assert datetime.date.fromisoformat(r['closed_on'][:10]) < datetime.date.fromisoformat(r['archived_on'])
assert sum(w['pct'] for w in load('data/strategy.json')['weights']) == 100
for path, references in [('data/themes.json','lenses'),('data/strategy.json','buckets')]:
    assert all(set(x['ids']) <= ids for x in load(path)[references])
assert all(set(p.get('match',[])) <= ids for layer in load('data/ecosystem.json')['layers'] for p in layer['projects'])

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.targets = []
    def handle_starttag(self, tag, attrs):
        self.targets += [v for k,v in attrs if k in {'href','src'} and v]

for page in ROOT.glob('*.html'):
    parser = Links()
    parser.feed(page.read_text(encoding='utf-8-sig'))
    for target in parser.targets:
        url = urlsplit(target)
        if url.scheme or url.netloc or not url.path:
            continue
        assert (page.parent / unquote(url.path)).exists(), f'Broken local link: {page.name} -> {target}'
print(f'PASS: {len(data)} records, {meta["active_programmes"]} active profiles, {len(archive["rounds"])} intact archived rounds; verification coverage, references, scores and local links')
