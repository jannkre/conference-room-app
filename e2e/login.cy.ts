/// <reference types="cypress" />

describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should display login form by default', () => {
    cy.get('[data-testid="login-card"]').should('be.visible')
    cy.get('[data-testid="form-title"]').should('contain', 'Anmelden')
    cy.get('[data-testid="email-input"]').should('be.visible')
    cy.get('[data-testid="password-input"]').should('be.visible')
    cy.get('[data-testid="submit-button"]').should('be.visible')
  })

  it('should successfully login with valid credentials', () => {
    // Stub the login API
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        id: '1',
        email: 'test@example.com'
      }
    }).as('loginRequest')

    // Fill in the form
    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('password123')
    
    // Submit button should be enabled
    cy.get('[data-testid="submit-button"]').should('not.be.disabled')
    cy.get('[data-testid="submit-button"]').click()

    // Wait for API call
    cy.wait('@loginRequest')

    // Verify success message
    cy.get('[data-testid="success-message"]').should('contain', 'Erfolgreich angemeldet!')

    // Verify redirect to home page
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should show error message with invalid credentials', () => {
    // Stub the login API to return error
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: {
        error: 'Ungültige Anmeldedaten'
      }
    }).as('loginRequest')

    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('wrongpassword')
    cy.get('[data-testid="submit-button"]').click()

    cy.wait('@loginRequest')

    // Verify error message
    cy.get('[data-testid="error-message"]').should('contain', 'Ungültige Anmeldedaten')
  })

  it('should validate email format', () => {
    // Type invalid email
    cy.get('[data-testid="email-input"]').type('invalid-email')
    cy.get('[data-testid="password-input"]').click() // Trigger blur

    // Check for email validation error
    cy.get('[data-testid="email-error"]').should('contain', 'gültige E-Mail-Adresse')
    
    // Submit button should be disabled
    cy.get('[data-testid="submit-button"]').should('be.disabled')
  })

  it('should disable submit button when fields are empty', () => {
    cy.get('[data-testid="submit-button"]').should('be.disabled')
    
    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="submit-button"]').should('be.disabled')
    
    cy.get('[data-testid="password-input"]').type('password')
    cy.get('[data-testid="submit-button"]').should('not.be.disabled')
  })

  it('should toggle between login and registration modes', () => {
    // Initially in login mode
    cy.get('[data-testid="form-title"]').should('contain', 'Anmelden')
    
    // Toggle to registration
    cy.get('[data-testid="toggle-mode-button"]').click()
    cy.get('[data-testid="form-title"]').should('contain', 'Registrieren')
    
    // Toggle back to login
    cy.get('[data-testid="toggle-mode-button"]').click()
    cy.get('[data-testid="form-title"]').should('contain', 'Anmelden')
  })

  it('should successfully register a new user', () => {
    // Toggle to registration mode
    cy.get('[data-testid="toggle-mode-button"]').click()
    
    // Stub the register API
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 200,
      body: {
        id: '2',
        email: 'newuser@example.com'
      }
    }).as('registerRequest')

    // Fill in the form
    cy.get('[data-testid="email-input"]').type('newuser@example.com')
    cy.get('[data-testid="password-input"]').type('strongpassword123')
    
    // Verify password strength indicator is shown
    cy.get('[data-testid="password-strength"]').should('be.visible')
    
    cy.get('[data-testid="submit-button"]').click()

    cy.wait('@registerRequest')

    // Verify success message
    cy.get('[data-testid="success-message"]').should('contain', 'Erfolgreich registriert!')

    // Verify redirect to home page
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should show password length counter', () => {
    cy.get('[data-testid="password-input"]').type('pass')
    cy.get('[data-testid="password-length"]').should('contain', 'Länge: 4 Zeichen')
    
    cy.get('[data-testid="password-input"]').type('word123')
    cy.get('[data-testid="password-length"]').should('contain', 'Länge: 11 Zeichen')
  })

  it('should show password strength in registration mode', () => {
    // Toggle to registration mode
    cy.get('[data-testid="toggle-mode-button"]').click()
    
    // Weak password
    cy.get('[data-testid="password-input"]').type('pass')
    cy.get('[data-testid="password-strength"]').should('contain', 'Schwach')
    
    // Medium password
    cy.get('[data-testid="password-input"]').clear().type('password')
    cy.get('[data-testid="password-strength"]').should('contain', 'Mittel')
    
    // Strong password
    cy.get('[data-testid="password-input"]').clear().type('strongpassword123')
    cy.get('[data-testid="password-strength"]').should('contain', 'Stark')
  })

  it('should handle network errors gracefully', () => {
    // Stub the login API to fail
    cy.intercept('POST', '/api/auth/login', {
      forceNetworkError: true
    }).as('loginRequest')

    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('password123')
    cy.get('[data-testid="submit-button"]').click()

    cy.wait('@loginRequest')

    // Verify network error message
    cy.get('[data-testid="error-message"]').should('contain', 'Netzwerkfehler')
  })
})

