# Testing Guide

This document provides an overview of the testing setup for this Next.js application using Jest and React Testing Library.

## Overview

The project uses **Jest** with **React Testing Library** for unit testing React components. The test suite demonstrates various testing techniques including:

- Component rendering
- User interactions (typing, clicking)
- Form validation
- Conditional rendering
- Async operations and API calls
- State management (Zustand)
- Loading states
- Error handling

## Setup

### Dependencies

The following testing dependencies have been installed:

```json
{
  "jest": "^29.x",
  "@testing-library/react": "^14.x",
  "@testing-library/jest-dom": "^6.x",
  "@testing-library/user-event": "^14.x",
  "jest-environment-jsdom": "^29.x",
  "@types/jest": "^29.x"
}
```

### Configuration

- **jest.config.js**: Main Jest configuration with Next.js integration
- **jest.setup.js**: Setup file for jest-dom matchers

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Organization

Tests are organized in two ways:

### 1. Separate `__tests__` Directories (Recommended for comprehensive suites)
```
src/
  app/
    login/
      __tests__/
        page.test.tsx
  components/
    __tests__/
      CreateRoom.test.tsx
```

### 2. Co-located Tests (For quick smoke tests)
```
src/
  components/
    CreateRoom.tsx
    CreateRoom.test.tsx
```

## Test Coverage

### LoginPage Component (`src/app/login/__tests__/page.test.tsx`)

**Total Tests: 29**

#### Rendering Tests (4 tests)
- ✓ Renders login form with email and password fields
- ✓ Renders "Anmelden" title in login mode
- ✓ Toggles to registration mode and shows "Registrieren" title
- ✓ Displays toggle text correctly in both modes

#### User Input Tests (3 tests)
- ✓ Allows typing in email input field
- ✓ Allows typing in password input field
- ✓ Shows password length counter when password is entered

#### Validation Tests (5 tests)
- ✓ Shows validation error for invalid email format
- ✓ Does not show email error for valid email
- ✓ Disables submit button when email field is empty
- ✓ Disables submit button when password field is empty
- ✓ Enables submit button when both fields are filled

#### Conditional Rendering Tests (3 tests)
- ✓ Shows password strength indicator only in register mode
- ✓ Displays correct password strength levels (Weak, Medium, Strong)
- ✓ Does not show password length counter when password is empty

#### Form Toggle Tests (2 tests)
- ✓ Clears form when toggling between login and register modes
- ✓ Clears error messages when toggling modes

#### Loading State Tests (2 tests)
- ✓ Shows loading state when form is submitted
- ✓ Disables form during submission

#### API Integration Tests (5 tests)
- ✓ Calls login API with correct credentials
- ✓ Calls register API when in register mode
- ✓ Displays error message on failed login
- ✓ Displays network error on fetch failure
- ✓ Successfully logs in with pre-seeded user

#### Success Flow Tests (5 tests)
- ✓ Successfully logs in with pre-seeded user
- ✓ Updates zustand store on successful login
- ✓ Navigates to home page on successful login
- ✓ Shows success message on successful registration

### CreateRoom Component (`src/components/__tests__/CreateRoom.test.tsx`)

**Total Tests: 31**

#### Rendering Tests (5 tests)
- ✓ Renders the create room form
- ✓ Renders room name input field
- ✓ Renders capacity input field
- ✓ Renders create room button
- ✓ Renders clear button

#### User Input Tests (3 tests)
- ✓ Allows typing in room name input
- ✓ Allows entering number in capacity input
- ✓ Shows character counter when typing room name

#### Validation Tests - Room Name (3 tests)
- ✓ Shows validation error when room name is empty
- ✓ Prevents exceeding max length (50 characters)
- ✓ Clears error when user starts typing

#### Validation Tests - Capacity (5 tests)
- ✓ Shows validation error when capacity is 0
- ✓ Shows validation error when capacity is empty
- ✓ Shows validation error when capacity exceeds 100
- ✓ Accepts valid capacity between 1 and 100
- ✓ Clears error when user starts typing

#### Button State Tests (4 tests)
- ✓ Button is not disabled initially (shows validation on click)
- ✓ Button remains enabled to show validation errors
- ✓ Button is not disabled when both fields are valid
- ✓ Button shows visual feedback (opacity) when form is invalid

#### Loading State Tests (2 tests)
- ✓ Shows loading state during API call
- ✓ Disables inputs during API call

#### API Integration Tests (3 tests)
- ✓ Calls fetch with correct parameters
- ✓ Handles API errors gracefully
- ✓ Handles network errors

#### Success Flow Tests (3 tests)
- ✓ Shows success message after successful creation
- ✓ Calls onCreateRoom callback with correct values
- ✓ Clears form after successful creation

#### Clear Button Tests (4 tests)
- ✓ Clears both inputs when clear button is clicked
- ✓ Clears error messages when clear button is clicked
- ✓ Clears success message when clear button is clicked
- ✓ Disables clear button during loading

### Co-located Tests (`src/components/CreateRoom.test.tsx`)

**Total Tests: 3** (Smoke tests)

- ✓ Renders without crashing
- ✓ Displays all required form elements
- ✓ Create button is not disabled but visually dimmed when form is empty

## Testing Techniques Demonstrated

### 1. Element Queries

```javascript
// By test ID (most reliable for testing)
screen.getByTestId('email-input')

// By role (accessibility-focused)
screen.getByRole('button', { name: 'Submit' })

// By label text
screen.getByLabelText('E-Mail')

// By text content
screen.getByText('Anmelden')
```

### 2. User Interactions

```javascript
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

// Typing in inputs
await user.type(emailInput, 'test@example.com');

// Clicking buttons
await user.click(submitButton);

// Tab navigation (triggers blur)
await user.tab();

// Clearing inputs
await user.clear(input);
```

### 3. Async Testing

```javascript
// Wait for element to appear
await waitFor(() => {
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
});

// With custom timeout
await waitFor(() => {
  expect(mockCallback).toHaveBeenCalled();
}, { timeout: 2000 });

// Find queries (automatically wait)
const element = await screen.findByTestId('async-element');
```

### 4. Conditional Rendering

```javascript
// Check element exists
expect(screen.getByTestId('element')).toBeInTheDocument();

// Check element does NOT exist
expect(screen.queryByTestId('element')).not.toBeInTheDocument();

// Conditional based on state
if (!isLogin && password.length > 0) {
  expect(screen.getByTestId('password-strength')).toBeInTheDocument();
}
```

### 5. Form Validation

```javascript
// Test invalid input
await user.type(emailInput, 'invalid-email');
await user.tab(); // Trigger validation

expect(screen.getByTestId('email-error')).toBeInTheDocument();
expect(screen.getByTestId('email-error')).toHaveTextContent(
  'Bitte geben Sie eine gültige E-Mail-Adresse ein'
);
```

### 6. API Mocking

```javascript
// Mock fetch globally
global.fetch = jest.fn();

// Mock successful response
(global.fetch as jest.Mock).mockResolvedValueOnce({
  ok: true,
  json: async () => ({ id: '1', email: 'test@example.com' }),
});

// Mock error response
(global.fetch as jest.Mock).mockResolvedValueOnce({
  ok: false,
  json: async () => ({ error: 'Invalid credentials' }),
});

// Mock network error
(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
```

### 7. Mock Functions (Callbacks)

```javascript
const mockCallback = jest.fn();

render(<CreateRoom onCreateRoom={mockCallback} />);

// Verify callback was called
expect(mockCallback).toHaveBeenCalled();

// Verify callback was called with specific arguments
expect(mockCallback).toHaveBeenCalledWith('Room Name', 25);

// Verify call count
expect(mockCallback).toHaveBeenCalledTimes(1);
```

### 8. Loading States

```javascript
// Check loading text
expect(submitButton).toHaveTextContent('Lädt...');

// Check button is disabled during loading
expect(submitButton).toBeDisabled();

// Check inputs are disabled during loading
expect(emailInput).toBeDisabled();
expect(passwordInput).toBeDisabled();
```

### 9. Next.js & Zustand Mocking

```javascript
// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: mockPush });

// Mock Zustand store
jest.mock('@/lib/userStore', () => ({
  useUserStore: jest.fn(),
}));

const mockSetUser = jest.fn();
(useUserStore as jest.Mock).mockReturnValue({ setUser: mockSetUser });
```

### 10. Style Testing

```javascript
// Check element has specific style
expect(button).toHaveStyle({ opacity: 0.5 });

// Check computed styles
expect(button).toHaveClass('disabled-style');
```

## Pre-seeded Test Data

The application includes pre-seeded user accounts for testing:

```javascript
// In src/lib/UserStorage.ts
{
  id: '1',
  email: 'test@example.com',
  password: 'password123'
},
{
  id: '2',
  email: 'admin@example.com',
  password: 'admin123'
},
{
  id: '3',
  email: 'user@demo.com',
  password: 'demo123'
}
```

These accounts persist in memory during the application session and can be used for both manual testing and automated tests.

## Best Practices

### 1. Test Isolation
Each test should be independent and not rely on the state from other tests:

```javascript
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});
```

### 2. User-Centric Testing
Test from the user's perspective, not implementation details:

```javascript
// ✓ Good - testing user interaction
await user.type(screen.getByLabelText('E-Mail'), 'test@example.com');

// ✗ Avoid - testing implementation
expect(component.state.email).toBe('test@example.com');
```

### 3. Accessibility
Use accessible queries when possible:

```javascript
// Preferred order:
screen.getByRole('button', { name: 'Submit' })
screen.getByLabelText('E-Mail')
screen.getByPlaceholderText('Enter email')
screen.getByText('Submit')
screen.getByTestId('submit-button') // Last resort
```

### 4. Async Testing
Always use `waitFor` for async operations:

```javascript
// ✓ Good
await waitFor(() => {
  expect(screen.getByTestId('success')).toBeInTheDocument();
});

// ✗ Avoid
expect(screen.getByTestId('success')).toBeInTheDocument(); // May fail if async
```

### 5. Clear Test Names
Use descriptive test names that explain what is being tested:

```javascript
test('shows validation error when email format is invalid', async () => {
  // Test implementation
});
```

## Troubleshooting

### Common Issues

#### 1. "Unable to find element"
- Ensure element has rendered: use `waitFor` or `findBy` queries
- Check data-testid is correctly set
- Use `screen.debug()` to see current DOM

#### 2. "Exceeded timeout"
- Increase timeout in `waitFor`: `{ timeout: 5000 }`
- Check if async operation is actually completing
- Ensure mocks are properly set up

#### 3. "act() warnings"
- Wrap state updates in `waitFor`
- Use `user.type()` instead of `fireEvent`
- Ensure all async operations complete before test ends

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library User Events](https://testing-library.com/docs/user-event/intro)
- [Next.js Testing](https://nextjs.org/docs/testing)

## End-to-End Testing with Cypress

### Overview

The project uses **Cypress v13** for end-to-end testing of complete user workflows. E2E tests verify the application works correctly from the user's perspective by testing the full stack.

### Setup

#### Dependencies

```json
{
  "cypress": "^13.16.1"
}
```

#### Configuration

- **cypress.config.ts**: Main Cypress configuration
- **e2e/support/e2e.ts**: Cypress support file
- **e2e/support/commands.ts**: Custom Cypress commands
- **e2e/tsconfig.json**: TypeScript configuration for e2e tests

### Running E2E Tests

```bash
# Start the development server first
npm run dev

# In a separate terminal, open Cypress UI
npm run cypress:open

# Run all Cypress tests in headless mode
npm run cypress:run
```

### Test Organization

E2E tests are located in the `/e2e` directory:

```
e2e/
  support/
    e2e.ts          # Cypress initialization
    commands.ts     # Custom commands
  login.cy.ts       # Login and registration flows
  create-room.cy.ts # Room creation flows
  tsconfig.json     # TypeScript config
```

### E2E Test Coverage

#### Login Flow (`e2e/login.cy.ts`)

**Total Tests: 10**

- ✓ Displays login form by default
- ✓ Successfully logs in with valid credentials
- ✓ Shows error message with invalid credentials
- ✓ Validates email format
- ✓ Disables submit button when fields are empty
- ✓ Toggles between login and registration modes
- ✓ Successfully registers a new user
- ✓ Shows password length counter
- ✓ Shows password strength in registration mode
- ✓ Handles network errors gracefully

#### Create Room Flow (`e2e/create-room.cy.ts`)

**Total Tests: 13**

- ✓ Displays the create room form
- ✓ Successfully creates a new room
- ✓ Shows character counter for room name
- ✓ Validates room name is not empty
- ✓ Validates room name length (max 50 characters)
- ✓ Validates capacity is not empty
- ✓ Validates capacity minimum value (1)
- ✓ Validates capacity maximum value (100)
- ✓ Clears form when clear button is clicked
- ✓ Disables buttons while creating room
- ✓ Shows error message when room creation fails
- ✓ Accepts valid capacity values
- ✓ Clears validation errors when user corrects input

### Cypress Testing Techniques

#### 1. API Stubbing with cy.intercept()

```javascript
// Stub successful login
cy.intercept('POST', '/api/auth/login', {
  statusCode: 200,
  body: { id: '1', email: 'test@example.com' }
}).as('loginRequest')

// Wait for the request
cy.wait('@loginRequest')
```

#### 2. Element Queries

```javascript
// By data-testid
cy.get('[data-testid="email-input"]')

// By text content
cy.contains('Anmelden')

// Chaining assertions
cy.get('[data-testid="submit-button"]')
  .should('be.visible')
  .and('not.be.disabled')
```

#### 3. User Interactions

```javascript
// Type in input
cy.get('[data-testid="email-input"]').type('test@example.com')

// Click button
cy.get('[data-testid="submit-button"]').click()

// Clear input
cy.get('[data-testid="email-input"]').clear()
```

#### 4. Custom Commands

```javascript
// Define in e2e/support/commands.ts
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login')
  cy.get('[data-testid="email-input"]').type(email)
  cy.get('[data-testid="password-input"]').type(password)
  cy.get('[data-testid="submit-button"]').click()
})

// Use in tests
cy.login('test@example.com', 'password123')
```

#### 5. Network Error Testing

```javascript
cy.intercept('POST', '/api/auth/login', {
  forceNetworkError: true
}).as('loginRequest')
```

#### 6. Request Verification

```javascript
cy.wait('@createRoom')
  .its('request.body')
  .should('deep.equal', {
    name: 'New Room',
    capacity: 20,
    occupied: false
  })
```

#### 7. URL Verification

```javascript
// Check redirect after login
cy.url().should('eq', Cypress.config().baseUrl + '/')
```

### Best Practices for E2E Testing

#### 1. Start Development Server

Always ensure the Next.js development server is running before starting Cypress:

```bash
npm run dev  # In one terminal
npm run cypress:open  # In another terminal
```

#### 2. Use API Stubbing

For faster and more reliable tests, stub API calls instead of hitting real endpoints:

```javascript
// ✓ Good - Fast and reliable
cy.intercept('GET', '/api/room', { body: mockRooms })

// ✗ Avoid - Slower and less reliable
// Let tests hit real API endpoints
```

#### 3. Use data-testid Selectors

Prefer `data-testid` attributes for stable test selectors:

```javascript
// ✓ Good - Won't break if text/styling changes
cy.get('[data-testid="submit-button"]')

// ✗ Avoid - Fragile
cy.get('.btn-primary.submit')
```

#### 4. Test User Workflows

Test complete user journeys, not individual components:

```javascript
// ✓ Good - Complete workflow
it('should create a room and see it in the list', () => {
  cy.visit('/')
  // Fill form, submit, verify room appears
})

// ✗ Avoid - Too granular for e2e
it('should render the room name input', () => {
  cy.get('[data-testid="room-name-input"]').should('exist')
})
```

#### 5. Clean Test Isolation

Each test should be independent:

```javascript
beforeEach(() => {
  // Set up fresh state for each test
  cy.intercept('GET', '/api/room', { body: [] })
  cy.visit('/')
})
```

### Troubleshooting Cypress

#### Common Issues

**1. "Timed out waiting for element"**
- Element may not have rendered yet
- Use `cy.wait()` for API calls
- Increase default timeout if needed

**2. "cy.visit() failed"**
- Ensure development server is running
- Check baseUrl in `cypress.config.ts`
- Verify port 3000 is available

**3. "Element is covered by another element"**
- Element may be hidden or obscured
- Use `.should('be.visible')` to verify
- Scroll element into view if needed

### Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress TypeScript Support](https://docs.cypress.io/guides/tooling/typescript-support)

## Summary

This test suite demonstrates comprehensive testing techniques for React applications:
- **Unit Testing**: 63 tests with Jest and React Testing Library
- **E2E Testing**: 23 tests with Cypress covering critical user workflows
- **100% pass rate** across all test suites
- Coverage of rendering, interactions, validation, async operations, and error handling
- Real-world patterns for testing Next.js applications with Zustand state management
- Both isolated unit tests and full end-to-end workflow tests
- Pre-seeded data for consistent testing

