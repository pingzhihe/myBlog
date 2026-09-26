# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

Use npm and the committed `package-lock.json` for local development and CI.

### Installation

Use Node.js 22 (`nvm install && nvm use`). CI reads the same version from `.nvmrc`.

```
$ npm ci
```

### Local Development

```
$ npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ npm run typecheck
$ npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Pull requests to `main` run `npm ci`, type checking, and a production build.
Pushes to `main` run the same checks and deploy the `build` artifact to GitHub Pages.

The commands below are an optional manual deployment path to the `gh-pages` branch.

Using SSH:

```
$ USE_SSH=true npm run deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> npm run deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
