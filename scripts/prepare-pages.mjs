import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const normalizeBasePath = (value) => {
  if (!value || value === '/') {
    return '/';
  }

  const trimmed = value.trim();
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  const withoutDuplicateTrailingSlashes = withLeadingSlash.replace(/\/+$/, '');

  return `${withoutDuplicateTrailingSlashes}/`;
};

const inferBasePath = () => {
  const explicitBasePath = process.env.VITE_BASE_PATH;
  if (explicitBasePath) {
    return normalizeBasePath(explicitBasePath);
  }

  const repository = process.env.GITHUB_REPOSITORY;
  if (!repository) {
    return '/';
  }

  const [owner, repo] = repository.split('/');
  if (!owner || !repo) {
    return '/';
  }

  return repo === `${owner}.github.io` ? '/' : normalizeBasePath(repo);
};

const basePath = inferBasePath();
const pathSegmentsToKeep = basePath === '/' ? 0 : basePath.split('/').filter(Boolean).length;
const publicDir = path.resolve(process.cwd(), 'public');

const spa404 = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Humanity Pathways Global</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script>
      const pathSegmentsToKeep = ${pathSegmentsToKeep};
      const { location } = window;
      const redirectUrl =
        location.protocol +
        "//" +
        location.hostname +
        (location.port ? \":\" + location.port : "") +
        location.pathname
          .split("/")
          .slice(0, 1 + pathSegmentsToKeep)
          .join("/") +
        "/?/" +
        location.pathname
          .slice(1)
          .split("/")
          .slice(pathSegmentsToKeep)
          .join("/")
          .replace(/&/g, "~and~") +
        (location.search ? "&" + location.search.slice(1).replace(/&/g, "~and~") : "") +
        location.hash;

      location.replace(redirectUrl);
    </script>
  </head>
  <body></body>
</html>
`;

await mkdir(publicDir, { recursive: true });
await writeFile(path.join(publicDir, '404.html'), spa404);
await writeFile(path.join(publicDir, '.nojekyll'), '');

console.log(`Prepared GitHub Pages support files for base path: ${basePath}`);
