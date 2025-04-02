# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - Unreleased

### Added

- possibility to filter regionsList with a keyboard([130](https://github.com/boarlabsxyz/razom/pull/130))

### Changed

- all className attr to cebab case format ([126](https://github.com/boarlabsxyz/razom/pull/126))

### Fixed

- ability to generate a preview deployment URL for Razom ([136](https://github.com/boarlabsxyz/razom/pull/136))

## [1.5.0] - Unreleased

### Added

- registration functionality ([105](https://github.com/boarlabsxyz/razom/pull/105))
- regionsList component ([117](https://github.com/boarlabsxyz/razom/pull/117))
- Google Auth ([118](https://github.com/boarlabsxyz/razom/pull/118))
- reset filter button to the map section ([128](https://github.com/boarlabsxyz/razom/pull/128))
- region filed to create initiative page, get the list from db to display on web-site ([141](https://github.com/boarlabsxyz/razom/pull/141))
- deploy backend on the railway server ([132](https://github.com/boarlabsxyz/razom/pull/132))

### Changed

- ProductionVercelDeploy.yaml and PreviewVercelDeploy.yaml into one file deploy.yaml([#114](https://github.com/boarlabsxyz/razom/pull/114))

### Fixed

- CORS rules to proper work with initiatives ([113](https://github.com/boarlabsxyz/razom/pull/113))

## [1.3.0] - 2025-02-15

### Added

- the visual diagram illustrating the workflow for Project Initialization and Development Cycle in Wiki ([#64](https://github.com/boarlabsxyz/razom/issues/64))
- keystone schemas(models) for entities and keystone access file for setting roles and their permissions([#90](https://github.com/boarlabsxyz/razom/pull/90))
- Hero section to the Home page ([#112](https://github.com/boarlabsxyz/razom/pull/112))
- Map section to the Home page ([#115](https://github.com/boarlabsxyz/razom/pull/115))

## [1.1.0] - 2025-01-15

### Added

- deploy to Vercel with relevant schema.prisma from Github Action ([#65](https://github.com/boarlabsxyz/razom/pull/65))
- implementation of fetching data from the database after deploying to Vercel ([#66](https://github.com/boarlabsxyz/razom/pull/66))
- github workflows for testing and deployment to vercel ([#67](https://github.com/boarlabsxyz/razom/pull/67))
- the amount of cases for playwright tests ([#69](https://github.com/boarlabsxyz/razom/pull/69))
- navigation styles for tablet/mobile devices ([#73](https://github.com/boarlabsxyz/razom/pull/73))
- html/css markup for footer [#75](https://github.com/boarlabsxyz/razom/pull/75)
- seed file with data for local usage ([#74](https://github.com/boarlabsxyz/razom/pull/74))
- favicon to the web application ([#79](https://github.com/boarlabsxyz/razom/pull/79))
- E2E tests for front-end snapshots in Razom ([#83](https://github.com/boarlabsxyz/razom/pull/83))
- opportunity to update screenshots in playwright e2e tests ([#87](https://github.com/boarlabsxyz/razom/pull/87))
- spinner as a reusable component ([#89](https://github.com/boarlabsxyz/razom/pull/89))

## [1.0.0] - 2024-12-23

### Added

- implementation of work with the database for storing and displaying data on Vercel ([#54](https://github.com/boarlabsxyz/razom/pull/54))
- html/css markup for header ([#53](https://github.com/boarlabsxyz/razom/pull/53))
- global CSS stylesheet for consistent styling across the application ([#48](https://github.com/boarlabsxyz/razom/pull/48))
- table with user roles and permissions into [Requirements](https://github.com/boarlabsxyz/razom/wiki/Requirements)

### Changed

- NextJS version to 15.0.3 ([#45](https://github.com/boarlabsxyz/razom/pull/45))
