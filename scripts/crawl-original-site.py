#!/usr/bin/env python3
"""Crawl humanitypathwaysglobal.com and extract all image URLs per page."""
import json, re, os, sys, time, urllib.parse, hashlib
from pathlib import Path
import urllib.request

BASE = "https://humanitypathwaysglobal.com"
UA = "Mozilla/5.0 (compatible; hpg-mirror/1.0)"
OUT = Path("/tmp/hpg-crawl")
OUT.mkdir(parents=True, exist_ok=True)

# Pages listed from home nav + likely initiative slugs (crawl navigation + follow links)
SEED_PATHS = [
    "/", "/hpg-vision", "/hpg-initiatives", "/hpg-staff",
    "/hpg-board-of-directors", "/hpg-sponsorship", "/global-leaders-summit",
    "/gylfh", "/hpg-blog", "/contact-us-1", "/volunteer-application-3",
    "/board-of-dir-application", "/annual-reports",
]

# Guess initiative slugs (we'll also discover via crawl)
INITIATIVE_GUESSES = [
    "/nazarene-mission", "/megabridge-kenya", "/sante-vie-meilleure",
    "/svm-togo", "/cuba-congo", "/triumphant-philippines",
    "/project-wings", "/project-wings-soaring", "/hope-for-a-good-life",
    "/seishin-plus", "/cpbi", "/hpg-executive-academy",
    "/humble-pathways", "/mkcf-sierra-leone", "/youth-stem-robotics",
    "/rainroot-wata", "/humane-initiative", "/humane-initiative-south-sudan",
]

def fetch(path):
    url = BASE + path if path.startswith("/") else path
    fn = OUT / ("page_" + re.sub(r"[^a-z0-9]+", "_", path.strip("/").lower() or "home") + ".html")
    if fn.exists() and fn.stat().st_size > 0:
        return fn.read_text(errors="ignore"), True
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=25) as r:
            body = r.read().decode("utf-8", errors="ignore")
            code = r.status
        if code >= 400:
            return None, False
        fn.write_text(body)
        return body, True
    except Exception as e:
        print(f"  FAIL {url}: {e}", file=sys.stderr)
        return None, False

def find_internal_links(html):
    out = set()
    for m in re.finditer(r'href="([^"#?]+)"', html):
        h = m.group(1)
        if h.startswith("/") and not h.startswith("//"):
            if h.startswith("/m/") or h.startswith("/manifest"):
                continue
            out.add(h)
    return out

# Image extraction: <img src=...>, srcset, data-src, style url(), any wsimg reference
WSIMG_RE = re.compile(r'(?:https?:)?//img1\.wsimg\.com/[^\s"\'<>)]+', re.I)
IMG_TAG_RE = re.compile(r'<img\b[^>]+>', re.I)
ATTR_RE = re.compile(r'(src|data-src|data-lazy|data-original|srcset|data-srcset|content|href)\s*=\s*"([^"]+)"', re.I)

def canonical_wsimg(url):
    """Given a wsimg url with /:/... transforms, return the base image url without transforms."""
    if url.startswith("//"):
        url = "https:" + url
    # img1.wsimg.com/isteam/ip/UUID/filename.jpg/:/rs=... -> strip trailing /:/...
    m = re.match(r'(https?://img1\.wsimg\.com/[^?#]+?)(/:/.*)?$', url)
    if m:
        return m.group(1)
    return url

def extract_images(html, page_path):
    entries = []
    seen = set()

    def add(raw, ctx=""):
        u = canonical_wsimg(raw)
        if not u or "wsimg.com" not in u:
            return
        if u in seen:
            return
        seen.add(u)
        entries.append({"url": u, "raw": raw, "context": ctx})

    # 1. Every wsimg url anywhere in the doc
    for m in WSIMG_RE.finditer(html):
        add(m.group(0), "raw")

    # 2. <img> tags with nearest heading/text hint
    for m in IMG_TAG_RE.finditer(html):
        tag = m.group(0)
        alt = re.search(r'\balt\s*=\s*"([^"]*)"', tag, re.I)
        alt_txt = alt.group(1) if alt else ""
        for am in ATTR_RE.finditer(tag):
            v = am.group(2)
            if "wsimg" in v:
                for piece in re.split(r'[\s,]+', v):
                    if "wsimg" in piece:
                        add(piece.split(" ")[0], f"img alt={alt_txt!r}")

    # 3. srcset in <source>
    for m in re.finditer(r'<source\b[^>]+>', html, re.I):
        for am in ATTR_RE.finditer(m.group(0)):
            v = am.group(2)
            for piece in re.split(r'[\s,]+', v):
                if "wsimg" in piece:
                    add(piece, "source")

    # 4. style="background-image:url(...)"
    for m in re.finditer(r'background-image\s*:\s*url\(([^)]+)\)', html, re.I):
        u = m.group(1).strip('"\' ')
        if "wsimg" in u:
            add(u, "css-bg")

    return entries

def main():
    to_visit = list(SEED_PATHS) + INITIATIVE_GUESSES
    visited = set()
    pages = {}
    while to_visit:
        p = to_visit.pop(0)
        if p in visited:
            continue
        visited.add(p)
        html, ok = fetch(p)
        if not ok or not html:
            pages[p] = {"ok": False, "images": []}
            continue
        # discover more internal links
        for h in find_internal_links(html):
            if h not in visited and h not in to_visit:
                to_visit.append(h)
        imgs = extract_images(html, p)
        pages[p] = {"ok": True, "images": imgs, "html_size": len(html)}
        print(f"OK  {p}  ({len(imgs)} imgs)")

    out = OUT / "crawl.json"
    out.write_text(json.dumps(pages, indent=2))
    print(f"\nWrote {out}  pages={len(pages)}")

if __name__ == "__main__":
    main()
