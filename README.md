# Code And Pepper - Recruitment Task

## Testing Strategy

### What's Tested

- Business logic and data transformations
- GraphQL query execution and response formatting
- Integration between resolvers and data sources

### What's Not Tested

- Validation error messages from class-validator
- GraphQL schema validation errors
- HTTP status codes for validation failures

### Reasoning

In modern web applications, validation primarily happens on the client-side for immediate user feedback. Backend validation serves as a safety net, not the primary validation mechanism. Testing validation libraries (class-validator, GraphQL validation) would mean testing well-established, third-party code rather than our business logic.

The focus is on testing what we build, not what we use.
