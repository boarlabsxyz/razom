# Razom - portal for helping veterans get reintegrated into society

## KeynoteJS

This project uses [KeynoteJS](https://keynotejs.com/), a powerful, open-source presentation framework built with JavaScript.

For more information and useful resources, refer to the following links:

- [KeynoteJS Documentation](https://docs.keynotejs.com/)
- [KeynoteJS GitHub Repository](https://github.com/keynotejs/keynote)
- [KeynoteJS Tutorials](https://keynotejs.com/docs/tutorials/getting-started/)

## Get started

Follow these steps to get the project up and running using Docker Compose:

### Prerequisites

Before you begin, ensure you have met the following requirements:

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/).
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) installed on your local machine.
- [Node.js](https://nodejs.org/) installed on your local machine.

### Steps

1. **Clone the repository:**

   ```sh
   git clone https://github.com/boarlabsxyz/razom.git
   cd razom
   ```

2. **Set up environment variables:**
   Create a `.env` file in the veterans directory and add the necessary environment variables. Refer to `.env.example` for the required variables.

3. **Build and start the containers:**

   ```sh
   docker compose up --build --watch
   ```

4. **Open the project CMS in your browser:**
   Navigate to `http://localhost:3000` to see the project in action.

5. **Open the project page in your browser:**
   Navigate to `http://localhost:8000` to see the project in action.

6. **Run tests:**
   ```sh
   docker compose run app npm test
   ```

## Development process

### Development Flow

1. **Take an issue from GitHub:**

   - Browse the issues on the [Current Sprint Board](https://github.com/orgs/boarlabsxyz/projects/1) in the "To Do" column and select one to work on.
   - Assign the issue to yourself to avoid duplication of work.

2. **Create a new branch:**

   ```sh
   git checkout -b <issue-number>-<short-description>
   ```

3. **Implement the changes:**

   - Implement issue.
   - Keep PR as small as possible.
   - Create several PRs if issue requires significant changes.
   - Ensure your code adheres to the project's coding standards and guidelines.

4. **Create a Pull Request (PR):**

   - Push your branch to the remote repository:
     ```sh
     git push origin <issue-number>-<short-description>
     ```
   - Open a PR against the `main` branch.
   - Provide a clear and concise description of the changes made.

5. **Pass Continuous Integration (CI):**

   - Ensure that all CI checks pass successfully.
   - Fix any issues reported by the CI pipeline.

6. **Get approval and merge the code:**
   - Request a review from the project maintainers.
   - Address any feedback or requested changes.
   - Once approved, merge the PR into the `main` branch.

## Changelog

We use Semantic Versioning (SemVer) and track all changes in the [`CHANGELOG.md`](/CHANGELOG.md) file. Please refer to it for details about updates, new features, bug fixes, and other modifications.

## Semantic Versioning (SemVer)

Format: MAJOR.MINOR.PATCH

- MAJOR: incremented for significant changes that are not backward compatible.
- MINOR: incremented when new functionality is added that is backward compatible.
- PATCH: incremented for bug fixes or minor changes.

Example: 1.2.3 — the third patch of the second minor update of the first major version.

The SemVer is updated in the `version` field of the `veterans/package.json` file.
