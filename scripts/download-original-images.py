#!/usr/bin/env python3
"""Download all original HPG image URLs and build the source inventory."""
import json, os, re, sys, hashlib, urllib.parse, urllib.request, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "images" / "original-hpg"
OUT_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR = ROOT / "scripts" / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

CRAWL = Path("/tmp/hpg-crawl")
UA = "Mozilla/5.0 (compatible; hpg-mirror/1.0)"

# --- Load staff team-data (person -> image URL) ---
staff = json.load(open(CRAWL / "staff-team.json"))

# --- Load per-page image lists ---
page_imgs = json.load(open(CRAWL / "page-images.json"))

# Clean up unfinished URL fragments (trailing '(1', etc.)
def is_clean_url(u: str) -> bool:
    # keep only URLs ending in an image extension
    return bool(re.search(r'\.(jpe?g|png|gif|webp)$', u, re.I))

# Some pages had truncated URLs (e.g. ending "Untitled%20design(1"). Repair by trying candidate suffixes.
CANDIDATE_SUFFIXES = [").png", ").jpg", ").jpeg", ".png", ".jpg", ".jpeg"]

def try_head(url):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA}, method="HEAD")
        with urllib.request.urlopen(req, timeout=15) as r:
            return r.status == 200 and int(r.headers.get("content-length","0") or "1") > 0
    except Exception:
        return False

def repair(url):
    if is_clean_url(url):
        return url
    for suf in CANDIDATE_SUFFIXES:
        cand = url + suf
        if try_head(cand):
            return cand
    return None

# Assemble target list (source_url, page_slug, context)
targets = {}  # url -> {"pages": set, "context": str}

# staff records — page: /hpg-staff, context: name
STAFF_PAGE = "/hpg-staff"
for r in staff:
    img = r.get("image")
    if not img:
        continue
    img = img.replace("http://","https://")
    targets.setdefault(img, {"pages": set(), "contexts": []})
    targets[img]["pages"].add(STAFF_PAGE)
    targets[img]["contexts"].append(f"staff:{r['name']}")

# page images
SLUG_TO_PATH = {
    "home": "/", "hpg_vision": "/hpg-vision", "hpg_initiatives": "/hpg-initiatives",
    "gylfh": "/gylfh", "global_leaders_summit": "/global-leaders-summit",
    "hpg_sponsorship": "/hpg-sponsorship", "hpg_board_of_directors": "/hpg-board-of-directors",
    "megabridge_kenya": "/megabridge-kenya", "svm_togo": "/svm-togo",
    "cuba_congo": "/cuba-congo", "triumphant_philippines": "/triumphant-philippines",
    "project_wings": "/project-wings", "seishin_plus": "/seishin-plus",
    "cpbi": "/cpbi", "hpg_executive_academy": "/hpg-executive-academy",
    "humble_pathways": "/humble-pathways", "hpg_staff": "/hpg-staff",
}
for slug, urls in page_imgs.items():
    path = SLUG_TO_PATH.get(slug, "/" + slug.replace("_","-"))
    for u in urls:
        u = u.replace("http://","https://")
        if not is_clean_url(u):
            fixed = repair(u)
            if not fixed:
                print(f"  [skip broken] {u}")
                continue
            u = fixed
        targets.setdefault(u, {"pages": set(), "contexts": []})
        targets[u]["pages"].add(path)

print(f"Distinct URLs: {len(targets)}")

# Deterministic local filename from source basename + short hash
def local_name(url):
    basename = urllib.parse.unquote(url.rsplit("/", 1)[-1])
    stem, ext = os.path.splitext(basename)
    stem = re.sub(r"[^A-Za-z0-9._-]+", "-", stem).strip("-.")
    if not ext:
        ext = ".jpg"
    ext = ext.lower()
    h = hashlib.sha1(url.encode()).hexdigest()[:8]
    return f"{stem}-{h}{ext}"

# Download
inventory = []
for url in sorted(targets):
    fn = OUT_DIR / local_name(url)
    if not fn.exists() or fn.stat().st_size < 200:
        print(f"  downloading {url}")
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                data = r.read()
            if not data or len(data) < 200:
                raise RuntimeError(f"tiny response {len(data)} bytes")
            fn.write_bytes(data)
        except Exception as e:
            print(f"    FAIL: {e}", file=sys.stderr)
            inventory.append({
                "source_url": url, "local_path": None,
                "pages": sorted(targets[url]["pages"]),
                "contexts": targets[url]["contexts"],
                "status": "download_failed", "error": str(e),
            })
            continue
    inventory.append({
        "source_url": url,
        "local_path": f"/images/original-hpg/{fn.name}",
        "bytes": fn.stat().st_size,
        "pages": sorted(targets[url]["pages"]),
        "contexts": targets[url]["contexts"],
        "status": "downloaded",
    })

out_json = DATA_DIR / "original-site-image-inventory.json"
out_json.write_text(json.dumps(inventory, indent=2))
print(f"Wrote {out_json}  entries={len(inventory)}  ok={sum(1 for e in inventory if e['status']=='downloaded')}")
