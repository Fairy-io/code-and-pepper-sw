# Code And Pepper - Recruitment Task

## Overview

This is a recruitment task for Code And Pepper company, developed by Adrian Larysz. It's a GraphQL API designed to manage Star Wars characters and their associated episodes. The application provides a complete CRUD interface for character management with proper validation, error handling, and pagination support.

## Deployed Application

You can see the deployed application here: [Application Link - Coming Soon]

## Technology Choices

### Why Bun?

I chose Bun over npm or yarn for several reasons:

- **Performance**: Bun is significantly faster for package installation and script execution
- **Modern Tooling**: Built-in test runner, bundler, and other utilities
- **Developer Experience**: Faster feedback loops during development
- **Future-Proof**: Bun represents the next generation of JavaScript tooling

## Running Application Locally

### Prerequisites

1. **Bun Runtime**: Version 1.2.3 or higher

    ```bash
    curl -fsSL https://bun.sh/install | bash
    ```

2. **Google Cloud Console Setup (Firestore only)**:
    - Firestore should be configured correctly
    - `GOOGLE_APPLICATION_CREDENTIALS` environment variable pointing to your service account JSON file
    - Service account must have Firestore read/write permissions

### Local Scripts

```bash
# Install dependencies
bun install

# Start application in development mode
bun dev

# Run tests in watch mode
bun tests:watch

# Run end-to-end tests in watch mode
bun e2e:watch
```

## Database and Repository Pattern

### Firestore Choice

I chose Firestore as the database because:

- I have prior experience with it
- Already configured and available in my environment
- Excellent for rapid prototyping and development

### Repository Pattern Implementation

The application uses the Repository pattern to abstract data access. You can find the implementation at [`src/star-wars/repositories/character.repository.ts`](src/star-wars/repositories/character.repository.ts).

### Data Flow and Validation

The repository pattern follows this validation flow:

1. **Input Validation**: class-validator or GraphQL parser validates the payload
2. **Resolver Layer**: Transfers validated payload to the service
3. **Service Layer**: Transfers validated payload to the repository
4. **Repository Layer**: Transfers validated payload to the data source (Firestore, external API, PostgreSQL, etc.) and returns unvalidated response
5. **Service Layer**: Validates the response and returns it to the resolver
6. **Resolver Layer**: Returns validated response to the parser
7. **Output**: Parser returns validated response to the user

**Why "any" types in repository?** The repository is not responsible for data validation. It accepts any data and sends it to the underlying data source. Validation happens at the service layer, ensuring clean separation of concerns.

### Switching Data Sources

To switch to a different data source:

1. Remove the `@google-cloud/firestore` package
2. Install the package supporting your new data source (e.g., `mongoose` for MongoDB)
3. Update or remove the [src/common](src/common) package if needed
4. Update [src/star-wars/repositories/character.repository.ts](src/star-wars/repositories/character.repository.ts) to use the new data source

The repository pattern ensures that changing the data source doesn't affect the business logic in services or resolvers.

## Testing Patterns

### What I Test

- **Positive responses** and possible error scenarios
- **Pagination logic** and edge cases
- **Integration** between data sources, services, and resolvers
- **API contract validation** ensuring responses match expected schemas

### What I Don't Test

- **Bad Request response formats**: I don't test validation error message formats from class-validator or GraphQL validators
- **Repository layer**: Repositories are not unit tested because they directly interact with data sources and should be part of e2e tests

### Testing Strategy Reasoning

**Why no validation error format tests?** In modern web applications, validation primarily happens on the client-side for immediate user feedback. Backend validation serves as a safety net. Testing validation libraries would mean testing well-established, third-party code rather than my business logic.

**Why no repository tests?** Repositories directly touch data sources and should be tested in e2e scenarios with real databases. Unit testing repositories with mocks doesn't provide meaningful value.

**Why split unit and e2e tests?** This separation provides fine-grained control over test execution:

- **Development**: Fast unit tests for rapid feedback loops during development
- **Production**: Comprehensive e2e tests ensure the entire system works correctly

This approach prevents e2e tests from slowing down the development process while ensuring production deployments are thoroughly validated.

**Mocking utility** - [mockObject](test/helpers/mockObject.ts) is existing mocking utility copied from another project. I decided to use it for easier mocking.

### E2E Tests

End-to-end tests are not yet implemented but can be added in the future to test the complete system with real data sources and external dependencies.

## Deployment Strategy

### Deployment Strategy

I used a deployment strategy that I created for one of my other projects ([ElysiaJS template](https://github.com/Fairy-io/bun-elysia-template?tab=readme-ov-file#deploying-application)). The application is deployed as [Google Cloud Run](https://cloud.google.com/run).

### CI/CD

I used [Google Cloud Build](https://cloud.google.com/build) for pipeline execution and [Depot](https://depot.dev) service for image build time reduction. And CI/CD config can be found [here](cloudbuild-depot.yaml).

It is possible to switch into another CI/CD provider:

- delete `cloudbuild-depot.yaml` and replace with with other config
- it may be required to modify [Dockerfile](Dockerfile)

### Reasoning

**Why I chose this strategy?** It was working for me before and it follows [GitOps principles](https://about.gitlab.com/topics/gitops/). Deploy script can be found [here](scripts/deploy/index.ts).

**Why I chose Cloud Run?** It is a serverless solution, ideal for small applications. It uses Docker containers, so in the future it is possible to switch to something more advanced, for example Kubernetes (GKE) or Docker Swarm deployed on VM (Google Compute Engine - GCE).
