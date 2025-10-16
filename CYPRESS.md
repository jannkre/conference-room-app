# Cypress E2E Testing Quick Start

This project includes a minimal Cypress setup for end-to-end testing of critical user workflows.

## Installation

First, install dependencies:

```bash
npm install
```

This will install Cypress v13 and all required dependencies.

## Running Tests

### Interactive Mode (Recommended for Development)

1. Start the development server:
```bash
npm run dev
```

2. In a separate terminal, open Cypress:
```bash
npm run cypress:open
```

3. Select "E2E Testing" in the Cypress UI
4. Choose a browser
5. Click on a test file to run it

### Headless Mode (CI/CD)

Run all tests in headless mode:

```bash
# Ensure dev server is running first
npm run dev

# In another terminal
npm run cypress:run
```

## Test Files

All e2e tests are located in the `/e2e` directory:

- **`e2e/login.cy.ts`** - Login and registration flows (10 tests)
- **`e2e/create-room.cy.ts`** - Room creation and validation (13 tests)

## Test Coverage

### Login Flow
- ✓ Form display and validation
- ✓ Successful login/registration
- ✓ Error handling (invalid credentials, network errors)
- ✓ Email validation
- ✓ Password strength indicators
- ✓ Mode toggling

### Create Room Flow
- ✓ Form display and validation
- ✓ Successful room creation
- ✓ Input validation (name length, capacity limits)
- ✓ Loading states
- ✓ Error handling
- ✓ Form clearing

## Key Features

### API Stubbing
All tests use `cy.intercept()` to stub API calls, making tests:
- Fast (no real network calls)
- Reliable (controlled responses)
- Isolated (no database dependencies)

Example:
```javascript
cy.intercept('POST', '/api/auth/login', {
  statusCode: 200,
  body: { id: '1', email: 'test@example.com' }
}).as('loginRequest')
```

### Custom Commands
Reusable commands are defined in `e2e/support/commands.ts`:

```javascript
// Use the login command
cy.login('test@example.com', 'password123')
```

### TypeScript Support
Full TypeScript support with proper type definitions for Cypress commands.

## File Structure

```
/e2e
  /support
    e2e.ts         # Cypress initialization
    commands.ts    # Custom commands
  login.cy.ts      # Login tests
  create-room.cy.ts # Room creation tests
  tsconfig.json    # TypeScript config

cypress.config.ts  # Main Cypress config
```

## Configuration

The Cypress configuration (`cypress.config.ts`) includes:

- **baseUrl**: `http://localhost:3000`
- **Spec pattern**: `e2e/**/*.cy.{js,jsx,ts,tsx}`
- **Support file**: `e2e/support/e2e.ts`
- **Viewport**: 1280x720
- **Video**: Disabled (can be enabled for CI)
- **Screenshots**: Enabled on failure

## Writing New Tests

Create a new test file in the `/e2e` directory:

```typescript
/// <reference types="cypress" />

describe('My New Feature', () => {
  beforeEach(() => {
    // Stub API calls
    cy.intercept('GET', '/api/endpoint', { body: mockData })
    cy.visit('/page')
  })

  it('should do something', () => {
    cy.get('[data-testid="element"]').click()
    cy.get('[data-testid="result"]').should('contain', 'Expected text')
  })
})
```

## Best Practices

1. **Always stub API calls** - Use `cy.intercept()` for fast, reliable tests
2. **Use data-testid** - Prefer `[data-testid="name"]` selectors
3. **Test user workflows** - Test complete journeys, not individual elements
4. **Keep tests isolated** - Each test should be independent
5. **Run dev server** - Cypress needs the app running on localhost:3000

## Troubleshooting

### Tests timeout or fail
- Ensure the development server is running (`npm run dev`)
- Check that port 3000 is available
- Verify API stubs are correctly configured

### Element not found
- Use `cy.wait('@aliasName')` to wait for API calls
- Check that data-testid attributes match
- Use `cy.get(...).should('be.visible')` for visibility checks

### TypeScript errors
- Run `npm install` to ensure all dependencies are installed
- Check that `e2e/tsconfig.json` is properly configured

## Resources

- [Full Testing Documentation](./TESTING.md) - Comprehensive testing guide
- [Cypress Docs](https://docs.cypress.io/) - Official documentation
- [Best Practices](https://docs.cypress.io/guides/references/best-practices) - Cypress best practices

## Summary

- ✅ 23 end-to-end tests covering critical workflows
- ✅ Fast execution with API stubbing
- ✅ TypeScript support
- ✅ Custom commands for reusability
- ✅ Comprehensive documentation

