<p align="center">
  ✨ Dynamically insert environment variables into bundled file and extract them in runtime ✨
</p>
<br/>
<p align="center">
  <a href="https://github.com/release-kit/client-dynamic-env/actions?query=branch%3Amain">
    <img src="https://github.com/release-kit/client-dynamic-env/actions/workflows/test-and-build.yml/badge.svg?event=push&branch=main" alt="typescript-library CI Status" />
  </a>
  <a href="https://opensource.org/licenses/MIT" rel="nofollow">
    <img src="https://img.shields.io/github/license/release-kit/client-dynamic-env" alt="License">
  </a>
  <a href="https://www.npmjs.com/package/@release-kit/client-dynamic-env" rel="nofollow">
    <img src="https://img.shields.io/npm/dw/@release-kit/client-dynamic-env.svg" alt="npm">
  </a>
  <a href="https://www.npmjs.com/package/@release-kit/client-dynamic-env" rel="nofollow">
    <img src="https://img.shields.io/github/stars/release-kit/client-dynamic-env" alt="stars">
  </a>
</p>

## Before you start

The README on `main` branch may contain some unreleased changes.

Go to [`release/latest`](https://github.com/release-kit/client-dynamic-env/tree/release/latest) branch to see the actual README for the latest version from NPM.

## Navigation

- [Installation](#installation)
- [Contrubuting](#contributing)
- [Maintenance](#maintenance)
  - [Regular flow](#regular-flow)
  - [Prerelease from](#prerelease-flow)
  - [Conventions](#conventions)

## Installation

NPM:

```sh
npm install @release-kit/client-dynamic-env
```

Yarn:

```sh
yarn add @release-kit/client-dynamic-env
```

## Usage

### Dynamically insert env

Add to your Docker entrypoint script:

```sh
# will also use .env.production and .env.production.local
export CDE_ENV="production"
# will use .env files located in apps/client directory
export CDE_ENV_DIR="apps/client"
# will take only envs prefixed with VITE_
export CDE_ENV_PREFIX="VITE_"
# will insert filtered envs into /client/dist/index.html file
export CDE_DESTINATION="/client/dist/index.html"
# will replace {{ ENV }} with filtered envs base64 string
export CDE_SLOT="{{ ENV }}"

source <(wget -qO- https://raw.githubusercontent.com/release-kit/client-dynamic-env/main/scripts/insert.sh)
```

The scripts loads `.env` files using the following order:

- `.env` (lowest priority)
- `.env.$CDE_ENV`
- `.env.$CDE_ENV.local`
- `.env.local` (highest priority)

Environment variables are always expanded, so you can reuse them.

### Extract env on client

Assume we have the following in our `index.html`:

```html
<head>
  <script>
    window.env = '{{ ENV }}'
  </script>
</head>
```

We can extract env from `window.env` in production, and from `import.meta.env` / `process.env` in development:

```tsx
import { extractEnv } from '@release-kit/client-dynamic-env'

export const env = extractEnv({
  env: import.meta.env.DEV ? 'development' : 'production',
  developmentEnv: import.meta.env,
  productionSource: window.env,
  validate: (env) => {
    if (!env.VITE_API_URL) throw new Error('No VITE_API_URL specified')
    return { apiUrl: env.VITE_API_URL }
  },
})
```

## Contributing

1. Fork this repo
2. Use the [Regular flow](#regular-flow)

Please follow [Conventions](#conventions)

## Maintenance

The dev branch is `main` - any developer changes is merged in there.

Also, there is a `release/latest` branch. It always contains the actual source code for release published with `latest` tag.

All changes is made using Pull Requests - push is forbidden. PR can be merged only after successfull `test-and-build` workflow checks.

When PR is merged, `release-drafter` workflow creates/updates a draft release. The changelog is built from the merged branch scope (`feat`, `fix`, etc) and PR title. When release is ready - we publish the draft.

Then, the `release` workflow handles everything:

- It runs tests, builds a package, and publishes it
- It synchronizes released tag with `release/latest` branch

### Regular flow

1. Create [feature branch](#conventions)
2. Make changes in your feature branch and [commit](#conventions)
3. Create a Pull Request from your feature branch to `main`  
   The PR is needed to test the code before pushing to release branch
4. If your PR contains breaking changes, don't forget to put a `BREAKING CHANGES` label
5. Merge the PR in `main`
6. All done! Now you have a drafted release - just publish it when ready

### Prerelease flow

1. Assume your prerelease tag is `beta`
2. Create `release/beta` branch
3. Create [feature branch](#conventions)
4. Make changes in your feature branch and [commit](#conventions)
5. Create a Pull Request from your feature branch to `release/beta`  
   The PR is needed to test the code before pushing to release branch
6. Create Github release with tag like `v1.0.0-beta`, pointing to `release/beta` branch  
   For next `beta` versions use semver build syntax: `v1.0.0-beta+1`
7. After that, the `release` workflow will publish your package with the `beta` tag
8. When the `beta` version is ready to become `latest` - create a Pull Request from `release/beta` to `main` branch
9. Continue from the [Regular flow's](#regular-flow) #5 step

### Conventions

**Feature branches**:

- Should start with `feat/`, `fix/`, `docs/`, `refactor/`, and etc., depending on the changes you want to propose (see [pr-labeler.yml](./.github/pr-labeler.yml) for a full list of scopes)

**Commits**:

- Should follow the [Conventional Commits specification](https://www.conventionalcommits.org)
- You can find supported types and scopes into `.cz-config.js`

**Pull requests**:

- Should have human-readable name, for example: "Add a TODO list feature"
- Should describe changes
- Should have correct labels
