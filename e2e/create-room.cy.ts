/// <reference types="cypress" />

describe('Create Room Flow', () => {
  beforeEach(() => {
    // Stub the GET /api/room endpoint to return initial rooms
    cy.intercept('GET', '/api/room', {
      statusCode: 200,
      body: [
        { id: '1', name: 'Meeting Room A', capacity: 10, occupied: false },
        { id: '2', name: 'Conference Hall', capacity: 50, occupied: true }
      ]
    }).as('getRooms')

    cy.visit('/')
    cy.wait('@getRooms')
  })

  it('should display the create room form', () => {
    cy.get('[data-testid="create-room-form"]').should('be.visible')
    cy.get('[data-testid="room-name-input"]').should('be.visible')
    cy.get('[data-testid="room-capacity-input"]').should('be.visible')
    cy.get('[data-testid="create-room-button"]').should('be.visible')
    cy.get('[data-testid="clear-button"]').should('be.visible')
  })

  it('should successfully create a new room', () => {
    // Stub the POST /api/room endpoint
    cy.intercept('POST', '/api/room', {
      statusCode: 200,
      body: {
        id: '3',
        name: 'New Room',
        capacity: 20,
        occupied: false
      }
    }).as('createRoom')

    // Fill in the form
    cy.get('[data-testid="room-name-input"]').type('New Room')
    cy.get('[data-testid="room-capacity-input"]').type('20')

    // Create room button should be enabled
    cy.get('[data-testid="create-room-button"]').should('not.have.css', 'opacity', '0.5')
    cy.get('[data-testid="create-room-button"]').click()

    // Wait for API call
    cy.wait('@createRoom').its('request.body').should('deep.equal', {
      name: 'New Room',
      capacity: 20,
      occupied: false
    })

    // Verify success message
    cy.get('[data-testid="success-message"]').should('contain', 'Raum erfolgreich erstellt!')

    // Verify form is cleared after success
    cy.get('[data-testid="room-name-input"]').should('have.value', '')
    cy.get('[data-testid="room-capacity-input"]').should('have.value', '')
  })

  it('should show character counter for room name', () => {
    cy.get('[data-testid="room-name-input"]').type('Test Room')
    cy.get('[data-testid="room-name-length"]').should('contain', '9/50 Zeichen')
  })

  it('should validate room name is not empty', () => {
    cy.get('[data-testid="room-capacity-input"]').type('10')
    cy.get('[data-testid="create-room-button"]').click()

    cy.get('[data-testid="room-name-error"]').should('contain', 'Raumname darf nicht leer sein')
  })

  it('should validate room name length', () => {
    // Type a very long room name (>50 characters)
    const longName = 'A'.repeat(51)
    cy.get('[data-testid="room-name-input"]').type(longName)
    
    // Input should only accept up to 50 characters
    cy.get('[data-testid="room-name-input"]').should('have.value', 'A'.repeat(50))
  })

  it('should validate capacity is not empty', () => {
    cy.get('[data-testid="room-name-input"]').type('Test Room')
    cy.get('[data-testid="create-room-button"]').click()

    cy.get('[data-testid="room-capacity-error"]').should('contain', 'Kapazität muss angegeben werden')
  })

  it('should validate capacity minimum value', () => {
    cy.get('[data-testid="room-name-input"]').type('Test Room')
    cy.get('[data-testid="room-capacity-input"]').type('0')

    cy.get('[data-testid="room-capacity-error"]').should('contain', 'Kapazität muss mindestens 1 sein')
  })

  it('should validate capacity maximum value', () => {
    cy.get('[data-testid="room-name-input"]').type('Test Room')
    cy.get('[data-testid="room-capacity-input"]').type('101')

    cy.get('[data-testid="room-capacity-error"]').should('contain', 'Kapazität darf maximal 100 sein')
  })

  it('should clear form when clear button is clicked', () => {
    // Fill in the form
    cy.get('[data-testid="room-name-input"]').type('Test Room')
    cy.get('[data-testid="room-capacity-input"]').type('25')

    // Click clear button
    cy.get('[data-testid="clear-button"]').click()

    // Verify form is cleared
    cy.get('[data-testid="room-name-input"]').should('have.value', '')
    cy.get('[data-testid="room-capacity-input"]').should('have.value', '')
  })

  it('should disable buttons while creating room', () => {
    // Stub with delay to see loading state
    cy.intercept('POST', '/api/room', (req) => {
      req.reply({
        delay: 1000,
        statusCode: 200,
        body: {
          id: '3',
          name: 'New Room',
          capacity: 20,
          occupied: false
        }
      })
    }).as('createRoom')

    cy.get('[data-testid="room-name-input"]').type('New Room')
    cy.get('[data-testid="room-capacity-input"]').type('20')
    cy.get('[data-testid="create-room-button"]').click()

    // Verify loading state
    cy.get('[data-testid="create-room-button"]').should('contain', 'Erstelle...')
    cy.get('[data-testid="create-room-button"]').should('be.disabled')
    cy.get('[data-testid="clear-button"]').should('be.disabled')
    cy.get('[data-testid="room-name-input"]').should('be.disabled')
    cy.get('[data-testid="room-capacity-input"]').should('be.disabled')

    cy.wait('@createRoom')
  })

  it('should show error message when room creation fails', () => {
    // Stub the POST /api/room endpoint to fail
    cy.intercept('POST', '/api/room', {
      statusCode: 500,
      body: {
        error: 'Internal server error'
      }
    }).as('createRoom')

    cy.get('[data-testid="room-name-input"]').type('New Room')
    cy.get('[data-testid="room-capacity-input"]').type('20')
    cy.get('[data-testid="create-room-button"]').click()

    cy.wait('@createRoom')

    // Verify error message
    cy.get('[data-testid="error-message"]').should('contain', 'Fehler beim Erstellen des Raums')
  })

  it('should accept valid capacity values', () => {
    cy.get('[data-testid="room-name-input"]').type('Test Room')
    
    // Test minimum valid capacity
    cy.get('[data-testid="room-capacity-input"]').type('1')
    cy.get('[data-testid="room-capacity-error"]').should('not.exist')
    
    // Test maximum valid capacity
    cy.get('[data-testid="room-capacity-input"]').clear().type('100')
    cy.get('[data-testid="room-capacity-error"]').should('not.exist')
    
    // Test middle range capacity
    cy.get('[data-testid="room-capacity-input"]').clear().type('50')
    cy.get('[data-testid="room-capacity-error"]').should('not.exist')
  })

  it('should clear validation errors when user corrects input', () => {
    // Trigger room name error
    cy.get('[data-testid="room-capacity-input"]').type('10')
    cy.get('[data-testid="create-room-button"]').click()
    cy.get('[data-testid="room-name-error"]').should('be.visible')
    
    // Fix the error
    cy.get('[data-testid="room-name-input"]').type('Valid Room')
    cy.get('[data-testid="room-name-error"]').should('not.exist')
    
    // Trigger capacity error
    cy.get('[data-testid="room-capacity-input"]').clear().type('0')
    cy.get('[data-testid="room-capacity-error"]').should('be.visible')
    
    // Fix the error
    cy.get('[data-testid="room-capacity-input"]').clear().type('20')
    cy.get('[data-testid="room-capacity-error"]').should('not.exist')
  })

  it('should display existing rooms from API', () => {
    // Verify that the rooms from the initial API call are displayed
    cy.contains('Meeting Room A').should('be.visible')
    cy.contains('Conference Hall').should('be.visible')
  })

  it('should create a room and see it appear in the room list', () => {
    // Stub the POST /api/room endpoint
    cy.intercept('POST', '/api/room', {
      statusCode: 200,
      body: {
        id: '3',
        name: 'Innovation Lab',
        capacity: 15,
        occupied: false
      }
    }).as('createRoom')

    // Verify initial rooms are displayed
    cy.contains('Meeting Room A').should('be.visible')
    cy.contains('Conference Hall').should('be.visible')

    // Fill in the create room form
    cy.get('[data-testid="room-name-input"]').type('Innovation Lab')
    cy.get('[data-testid="room-capacity-input"]').type('15')
    cy.get('[data-testid="create-room-button"]').click()

    // Wait for the room creation API call
    cy.wait('@createRoom')

    // Verify success message appears
    cy.get('[data-testid="success-message"]').should('contain', 'Raum erfolgreich erstellt!')

    // Verify the new room appears in the room list
    cy.contains('Innovation Lab').should('be.visible')
    
    // Verify all rooms are still visible (old + new)
    cy.contains('Meeting Room A').should('be.visible')
    cy.contains('Conference Hall').should('be.visible')
    cy.contains('Innovation Lab').should('be.visible')
  })

  // ============================================
  // FAILING TEST EXAMPLES (for demonstration)
  // ============================================
  // These tests are intentionally written to fail
  // to demonstrate common failure scenarios
  // Remove .skip to see them fail
  // ============================================

  it.skip('FAIL: should expect wrong success message text', () => {
    cy.intercept('POST', '/api/room', {
      statusCode: 200,
      body: { id: '3', name: 'Test Room', capacity: 10, occupied: false }
    }).as('createRoom')

    cy.get('[data-testid="room-name-input"]').type('Test Room')
    cy.get('[data-testid="room-capacity-input"]').type('10')
    cy.get('[data-testid="create-room-button"]').click()

    cy.wait('@createRoom')

    // This will FAIL - expecting wrong text
    cy.get('[data-testid="success-message"]').should('contain', 'Room created successfully!')
    // Actual text is: "Raum erfolgreich erstellt!"
  })

  it.skip('FAIL: should expect element that does not exist', () => {
    cy.get('[data-testid="room-name-input"]').type('Test Room')
    cy.get('[data-testid="room-capacity-input"]').type('10')

    // This will FAIL - element with this testid doesn't exist
    cy.get('[data-testid="submit-room-button"]').should('be.visible')
    // Correct testid is: "create-room-button"
  })

  it.skip('FAIL: should expect incorrect API request body', () => {
    cy.intercept('POST', '/api/room', {
      statusCode: 200,
      body: { id: '3', name: 'Test Room', capacity: 10, occupied: false }
    }).as('createRoom')

    cy.get('[data-testid="room-name-input"]').type('Test Room')
    cy.get('[data-testid="room-capacity-input"]').type('10')
    cy.get('[data-testid="create-room-button"]').click()

    // This will FAIL - expecting wrong field name
    cy.wait('@createRoom').its('request.body').should('deep.equal', {
      roomName: 'Test Room',  // Actual field is 'name', not 'roomName'
      capacity: 10,
      occupied: false
    })
  })
  
})

