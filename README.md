# Code And Pepper - Recruitment Task

## Overview

This is a recruitment task for Code And Pepper company, developed by Adrian Larysz. It's a GraphQL API designed to manage Star Wars characters and their associated episodes. The application provides a complete CRUD interface for character management with proper validation, error handling, and pagination support.

## Deployed Application

You can see the deployed application here: https://code-and-pepper-sw-dev.magicfe.net/graphql

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

3. **Environment Variables**:
    - `PORT` (required) - Server port under which the application is accessible
    - `SERVICE_ENV` (required) - Service environment (e.g., prod, dev, local) used for service discovery, secrets retrieval, and database access
    - `SERVICE_NAME` (required) - Service name (e.g., starwars-api) used for service discovery, secrets retrieval, and database access
    - `SERVICE_VERSION` (required) - Service version for tracking deployed versions
    - `SERVICE_DESCRIPTION` (required) - Brief description of the service

### Local Scripts

```bash
# Copy environment configuration
cp .env.example .env

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

## Architectural Decisions

### Separate Resolvers Pattern

I implemented separate resolvers for each operation ([CharacterResolver](src/star-wars/character.resolver.ts), [CharactersResolver](src/star-wars/characters.resolver.ts), [CreateCharacterResolver](src/star-wars/createCharacter.resolver.ts), [UpdateCharacterResolver](src/star-wars/updateCharacter.resolver.ts), [DeleteCharacterResolver](src/star-wars/updateCharacter.resolver.ts)) instead of a single large resolver class.

**Why this approach?** Keeping classes and files as small as possible helps with:

- **Navigation**: Easier to find specific functionality
- **Maintainability**: Changes are isolated to specific files
- **Readability**: Each resolver has a single responsibility
- **Testing**: Smaller units are easier to test and mock
- **Team Development**: Multiple developers can work on different resolvers without conflicts

### GraphQL Union Error Handling

I implemented a specific error handling pattern using GraphQL unions instead of throwing traditional errors.

**Why this approach?** Instead of throwing `new Error('character already exists')` which would appear in the GraphQL `errors: []` array, I return specific error types like `CharacterAlreadyExistsError` with structured data.

**Benefits:**

- **Client-Friendly**: Clients can easily check for specific error types and handle them appropriately
- **Structured Data**: Error responses include specific fields (currently `code`, but extensible for future metadata)
- **Type Safety**: GraphQL schema provides type-safe error handling
- **Better UX**: Clients can show user-friendly messages based on error types
- **Extensibility**: Easy to add more error metadata (timestamps, suggestions, etc.) in the future

**Example:**

```graphql
# Instead of generic error in errors array
{
  "errors": [{"message": "character already exists"}]
}

# Client gets structured, typed error response
{
  "data": {
    "createCharacter": {
      "__typename": "CharacterAlreadyExistsError",
      "code": "CHARACTER_ALREADY_EXISTS"
    }
  }
}
```

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

**Mocking utility** - [mockObject](test/helpers/mockObject.ts) is an existing mocking utility copied from another project. I decided to use it for easier mocking.

### E2E Tests

End-to-end tests are not yet implemented but can be added in the future to test the complete system with real data sources and external dependencies.

## Deployment Strategy

### Deployment Strategy

I used a deployment strategy that I created for one of my other projects ([ElysiaJS template](https://github.com/Fairy-io/bun-elysia-template?tab=readme-ov-file#deploying-application)). The application is deployed as [Google Cloud Run](https://cloud.google.com/run).

### CI/CD

I used [Google Cloud Build](https://cloud.google.com/build) for pipeline execution and [Depot](https://depot.dev) service for image build time reduction. The CI/CD configuration can be found [here](cloudbuild-depot.yaml).

It is possible to switch to another CI/CD provider:

- Delete `cloudbuild-depot.yaml` and replace it with another configuration
- It may be required to modify the [Dockerfile](Dockerfile)

### Reasoning

**Why I chose this strategy?** It was working for me before and it follows [GitOps principles](https://about.gitlab.com/topics/gitops/). The deploy script can be found [here](scripts/deploy/index.ts).

**Why I chose Cloud Run?** It is a serverless solution, ideal for small applications. It uses Docker containers, so in the future it is possible to switch to something more advanced, for example Kubernetes (GKE) or Docker Swarm deployed on VM (Google Compute Engine - GCE).

## System Architecture and Design Decisions

### Minimal Configuration Approach

The system is designed with just **5 environment variables** to maintain simplicity while providing all necessary functionality for a production-ready application.

### Firestore Database Strategy

I implemented a **single Firestore instance** approach using the `default` database. This is a cost-efficient solution designed for simple systems or systems in the MVP stage.

Instead of multiple databases, I follow a **naming convention pattern** for collections:

```typescript
const name = 'my-collection';
const collectionName = `${process.env.SERVICE_NAME}-${process.env.SERVICE_ENV}-${name}`;
```

**Examples:**

- `starwars-api` service deployed in `dev` environment: `starwars-api-dev-characters`
- `starwars-api` service deployed in `prod` environment: `starwars-api-prod-characters`

This approach provides **environment isolation** while maintaining cost efficiency.

### Service Discovery Pattern

For inter-service communication, I utilize the `SERVICE_NAME` and `SERVICE_ENV` variables to construct service URLs dynamically:

```typescript
import ky from 'ky';

const suffix =
    process.env.SERVICE_ENV === 'prod'
        ? ''
        : `-${process.env.SERVICE_ENV}`;
const otherMicroserviceName = 'other-microservice';

await ky.get(
    `https://${otherMicroserviceName}${suffix}.mydomain.com/something`,
);
```

**Examples:**

- `dev` environment: `https://other-microservice-dev.mydomain.com/something`
- `prod` environment: `https://other-microservice.mydomain.com/something`

This pattern ensures **consistent service discovery** across environments.

### Secrets Management Strategy

For additional secrets (e.g., PostgreSQL connection strings), I would use [Google Secret Manager](https://cloud.google.com/security/products/secret-manager) with the following pattern:

```typescript
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const name = process.env.SERVICE_NAME;
const env = process.env.SERVICE_ENV;
const secret = 'postgres-url';
const secretName = `${name}-${env}-${secret}`;

const client = new SecretManagerServiceClient();

const getSecret = async (
    key: string,
    projectId: string,
) => {
    const [version] = await client.accessSecretVersion({
        name: `projects/${projectId}/secrets/${key}/version/latest`,
    });

    const payload = version.payload?.data?.toString();
    if (!payload)
        throw new Error(
            `Secret ${key} is empty or missing`,
        );

    return payload;
};

const postgresUrl = await getSecret(secretName, '123');
```

**Examples:**

- `starwars-api` in `dev`: fetches `starwars-api-dev-postgres-url`
- `starwars-api` in `prod`: fetches `starwars-api-prod-postgres-url`

This approach provides **environment-specific secret management** with consistent naming conventions.

## Potential Improvements

### Infrastructure Enhancements

- **Add logging** for production monitoring and debugging
- **Add e2e tests** for comprehensive system validation

### Database Architecture Evolution

**Switch to multi-database approach or different database technology**

Currently, I use a single default Firestore instance as the data source for cost efficiency and rapid development. However, for a production microservices architecture, this approach has limitations:

- **Fault Tolerance**: Single database creates a single point of failure
- **Scalability**: Shared database can become a bottleneck
- **Data Isolation**: Different services should have isolated data stores

**Recommended approach:**

- **Per-service databases**: Each microservice should have its own database
- **Technology selection**: PostgreSQL might be more suitable for larger applications with complex relationships
- **Data consistency**: Implement eventual consistency patterns for cross-service data

### Data Model Enhancements

**Create separated collection for episodes with API support**

Currently, episodes are stored as strings within the character model. For future scalability, consider:

- **Episode entity**: Separate `Episode` model with properties like title, release date, director, etc.
- **Data loaders**: Implement GraphQL data loaders to efficiently fetch related data
- **New APIs**: Add episode-specific endpoints for managing episode metadata
- **Enhanced features**: Support for episode ratings, reviews, and analytics

**Benefits:**

- **Data integrity**: Proper relationships between characters and episodes
- **Performance**: Efficient querying with data loaders
- **Extensibility**: Easy to add episode-specific features
- **Scalability**: Better data organization for growing applications
