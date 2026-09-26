# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

Use Bun 1.4.2 and the committed `bun.lock` for local development and CI.
The Bun version is pinned in `package.json`; CI reads it with `oven-sh/setup-bun`.

### Installation

Use Node.js 22 (`nvm install && nvm use`). CI reads the same version from `.nvmrc`.
Bun manages dependencies and scripts; Docusaurus continues to run with Node.js.
Install [Bun 1.4.2](https://bun.com/docs/installation) and check `bun --version`.

```
$ bun install --frozen-lockfile
```

To add or remove dependencies, use `bun add <package>` or `bun remove <package>`.
Commit both `package.json` and `bun.lock` after dependency changes.

Security overrides in `package.json` pin `serialize-javascript` to `7.1.2` for
`copy-webpack-plugin` and `css-minimizer-webpack-plugin`, and `uuid` to `11.1.1`
for `sockjs`. These address upstream security advisories while preserving the
CommonJS API used by these packages. Keep Bun 1.4.2 for the scoped overrides
and lockfile format. Reassess these overrides when upgrading Docusaurus; remove
them once upstream dependency ranges include patched versions. Run `bun audit`
after dependency updates.

### Local Development

```
$ bun run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ bun run typecheck
$ bun run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Source layout

- `src/pages/`: homepage and bookmarks routes, with styles in adjacent CSS Modules.
- `src/components/`: shared index heading and the homepage video player, each with its own styles.
- `src/theme/`: Docusaurus overrides for the journal index, footer, and color mode toggle. Check these overrides when upgrading Docusaurus.
- `src/css/custom.css`: shared design tokens, base styles, and overrides for Docusaurus navigation and reading pages.
- `src/css/layout.module.css`: shared page width, index spacing, and section labels.
- `static/fonts/fonts.css`: shared font faces and typography roles for both the site and prototype. See [font sources and licenses](static/fonts/README.md); `/fonts` exposes license links and IPA font restoration instructions to readers.
- `docs/` and `blog/`: authored content; `static/img/`: images and video used by the site.
- `charles-home.html`: standalone design reference. The deployed homepage is `src/pages/index.tsx`.

Keep component-specific styles beside their components. Use the global stylesheet for site-wide tokens and Docusaurus elements that are not locally overridden.

### Deployment

Pull requests to `main` run `bun install --frozen-lockfile`, type checking, and a production build.
Pushes to `main` run the same checks and deploy the `build` artifact to GitHub Pages.

The commands below are an optional manual deployment path to the `gh-pages` branch.

Using SSH:

```
$ USE_SSH=true bun run deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> bun run deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
