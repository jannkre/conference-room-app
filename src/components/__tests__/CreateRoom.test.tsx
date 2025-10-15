import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateRoom from '../CreateRoom';

// Mock fetch globally
global.fetch = jest.fn();

describe('CreateRoom Component', () => {
  const mockOnCreateRoom = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering Tests', () => {
    test('renders the create room form', () => {
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      expect(screen.getByTestId('create-room-form')).toBeInTheDocument();
    });

    test('renders room name input field', () => {
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const roomNameInput = screen.getByTestId('room-name-input');
      expect(roomNameInput).toBeInTheDocument();
      expect(roomNameInput).toHaveAttribute('placeholder', 'Name');
    });

    test('renders capacity input field', () => {
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const capacityInput = screen.getByTestId('room-capacity-input');
      expect(capacityInput).toBeInTheDocument();
      expect(capacityInput).toHaveAttribute('placeholder', 'Kapazität');
      expect(capacityInput).toHaveAttribute('type', 'number');
    });

    test('renders create room button', () => {
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const createButton = screen.getByTestId('create-room-button');
      expect(createButton).toBeInTheDocument();
      expect(createButton).toHaveTextContent('Create Room');
    });

    test('renders clear button', () => {
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const clearButton = screen.getByTestId('clear-button');
      expect(clearButton).toBeInTheDocument();
      expect(clearButton).toHaveTextContent('Löschen');
    });
  });

  describe('User Input Tests', () => {
    test('allows typing in room name input', async () => {
      const user = userEvent.setup();
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const roomNameInput = screen.getByTestId('room-name-input') as HTMLInputElement;
      await user.type(roomNameInput, 'Conference Room A');
      
      expect(roomNameInput.value).toBe('Conference Room A');
    });

    test('allows entering number in capacity input', async () => {
      const user = userEvent.setup();
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const capacityInput = screen.getByTestId('room-capacity-input') as HTMLInputElement;
      await user.type(capacityInput, '25');
      
      expect(capacityInput.value).toBe('25');
    });

    test('shows character counter when typing room name', async () => {
      const user = userEvent.setup();
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const roomNameInput = screen.getByTestId('room-name-input');
      await user.type(roomNameInput, 'Test Room');
      
      expect(screen.getByTestId('room-name-length')).toBeInTheDocument();
      expect(screen.getByTestId('room-name-length')).toHaveTextContent('9/50 Zeichen');
    });

    test('does not show character counter when room name is empty', () => {
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      expect(screen.queryByTestId('room-name-length')).not.toBeInTheDocument();
    });
  });

  describe('Validation Tests - Room Name', () => {
    test('shows validation error when room name is empty and create is clicked', async () => {
      const user = userEvent.setup();
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const capacityInput = screen.getByTestId('room-capacity-input');
      await user.type(capacityInput, '10');
      
      const createButton = screen.getByTestId('create-room-button');
      await user.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('room-name-error')).toBeInTheDocument();
        expect(screen.getByTestId('room-name-error')).toHaveTextContent(
          'Raumname darf nicht leer sein'
        );
      });
    });

    test('shows validation error when room name exceeds max length', async () => {
      const user = userEvent.setup();
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const roomNameInput = screen.getByTestId('room-name-input') as HTMLInputElement;
      const longName = 'a'.repeat(51);
      
      // Try to type more than 50 characters
      await user.type(roomNameInput, longName);
      
      // Should only have 50 characters
      expect(roomNameInput.value).toHaveLength(50);
    });

    test('clears room name error when user starts typing', async () => {
      const user = userEvent.setup();
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const capacityInput = screen.getByTestId('room-capacity-input');
      await user.type(capacityInput, '10');
      
      // Trigger validation error
      const createButton = screen.getByTestId('create-room-button');
      await user.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('room-name-error')).toBeInTheDocument();
      });
      
      // Start typing in room name
      const roomNameInput = screen.getByTestId('room-name-input');
      await user.type(roomNameInput, 'Test');
      
      // Error should be cleared
      expect(screen.queryByTestId('room-name-error')).not.toBeInTheDocument();
    });
  });

  describe('Validation Tests - Capacity', () => {
    test('shows validation error when capacity is 0', async () => {
      const user = userEvent.setup();
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const roomNameInput = screen.getByTestId('room-name-input');
      await user.type(roomNameInput, 'Test Room');
      
      const createButton = screen.getByTestId('create-room-button');
      await user.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('room-capacity-error')).toBeInTheDocument();
        expect(screen.getByTestId('room-capacity-error')).toHaveTextContent(
          'Kapazität muss angegeben werden'
        );
      });
    });

    test('shows validation error when capacity is empty', async () => {
      const user = userEvent.setup();
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const roomNameInput = screen.getByTestId('room-name-input');
      await user.type(roomNameInput, 'Test Room');
      
      const createButton = screen.getByTestId('create-room-button');
      await user.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('room-capacity-error')).toBeInTheDocument();
      });
    });

    test('shows validation error when capacity exceeds 100', async () => {
      const user = userEvent.setup();
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const roomNameInput = screen.getByTestId('room-name-input');
      const capacityInput = screen.getByTestId('room-capacity-input');
      
      await user.type(roomNameInput, 'Large Room');
      await user.type(capacityInput, '150');
      
      const createButton = screen.getByTestId('create-room-button');
      await user.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('room-capacity-error')).toBeInTheDocument();
        expect(screen.getByTestId('room-capacity-error')).toHaveTextContent(
          'Kapazität darf maximal 100 sein'
        );
      });
    });

    test('accepts valid capacity between 1 and 100', async () => {
      const user = userEvent.setup();
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const roomNameInput = screen.getByTestId('room-name-input');
      const capacityInput = screen.getByTestId('room-capacity-input');
      
      await user.type(roomNameInput, 'Valid Room');
      await user.type(capacityInput, '50');
      
      const createButton = screen.getByTestId('create-room-button');
      await user.click(createButton);
      
      // Should not show capacity error
      await waitFor(() => {
        expect(screen.queryByTestId('room-capacity-error')).not.toBeInTheDocument();
      });
    });

    test('clears capacity error when user starts typing', async () => {
      const user = userEvent.setup();
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const roomNameInput = screen.getByTestId('room-name-input');
      await user.type(roomNameInput, 'Test Room');
      
      // Trigger validation error
      const createButton = screen.getByTestId('create-room-button');
      await user.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('room-capacity-error')).toBeInTheDocument();
      });
      
      // Start typing in capacity
      const capacityInput = screen.getByTestId('room-capacity-input');
      await user.type(capacityInput, '10');
      
      // Error should be cleared
      expect(screen.queryByTestId('room-capacity-error')).not.toBeInTheDocument();
    });
  });

  describe('Button State Tests', () => {
    test('create button is not disabled initially (shows validation on click)', () => {
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const createButton = screen.getByTestId('create-room-button') as HTMLButtonElement;
      expect(createButton).not.toBeDisabled();
    });

    test('create button remains enabled to show validation errors', async () => {
      const user = userEvent.setup();
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const roomNameInput = screen.getByTestId('room-name-input');
      await user.type(roomNameInput, 'Test Room');
      
      const createButton = screen.getByTestId('create-room-button') as HTMLButtonElement;
      expect(createButton).not.toBeDisabled();
    });

    test('button is not disabled when both fields are valid', async () => {
      const user = userEvent.setup();
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const roomNameInput = screen.getByTestId('room-name-input');
      const capacityInput = screen.getByTestId('room-capacity-input');
      
      await user.type(roomNameInput, 'Valid Room');
      await user.type(capacityInput, '25');
      
      const createButton = screen.getByTestId('create-room-button') as HTMLButtonElement;
      expect(createButton).not.toBeDisabled();
    });

    test('button shows visual feedback when form is invalid', async () => {
      const user = userEvent.setup();
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const roomNameInput = screen.getByTestId('room-name-input');
      const capacityInput = screen.getByTestId('room-capacity-input');
      
      await user.type(roomNameInput, 'Test Room');
      await user.type(capacityInput, '150'); // Invalid capacity
      
      const createButton = screen.getByTestId('create-room-button');
      
      // Button should have reduced opacity when form is invalid
      expect(createButton).toHaveStyle({ opacity: 0.5 });
    });
  });

  describe('Loading State Tests', () => {
    test('shows loading state during API call', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({
          ok: true,
          json: async () => ({}),
        }), 100))
      );
      
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const roomNameInput = screen.getByTestId('room-name-input');
      const capacityInput = screen.getByTestId('room-capacity-input');
      
      await user.type(roomNameInput, 'Test Room');
      await user.type(capacityInput, '10');
      
      const createButton = screen.getByTestId('create-room-button');
      await user.click(createButton);
      
      // Should show loading text
      expect(createButton).toHaveTextContent('Erstelle...');
      expect(createButton).toBeDisabled();
    });

    test('disables inputs during API call', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({
          ok: true,
          json: async () => ({}),
        }), 100))
      );
      
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const roomNameInput = screen.getByTestId('room-name-input') as HTMLInputElement;
      const capacityInput = screen.getByTestId('room-capacity-input') as HTMLInputElement;
      
      await user.type(roomNameInput, 'Test Room');
      await user.type(capacityInput, '10');
      
      const createButton = screen.getByTestId('create-room-button');
      await user.click(createButton);
      
      // Inputs should be disabled during loading
      expect(roomNameInput).toBeDisabled();
      expect(capacityInput).toBeDisabled();
    });
  });

  describe('API Integration Tests', () => {
    test('calls fetch with correct parameters', async () => {
      const user = userEvent.setup();
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const roomNameInput = screen.getByTestId('room-name-input');
      const capacityInput = screen.getByTestId('room-capacity-input');
      
      await user.type(roomNameInput, 'Conference Room');
      await user.type(capacityInput, '20');
      
      const createButton = screen.getByTestId('create-room-button');
      await user.click(createButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/room', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Conference Room',
            capacity: 20,
            occupied: false,
          }),
        });
      });
    });

    test('handles API errors gracefully', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });
      
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const roomNameInput = screen.getByTestId('room-name-input');
      const capacityInput = screen.getByTestId('room-capacity-input');
      
      await user.type(roomNameInput, 'Test Room');
      await user.type(capacityInput, '10');
      
      const createButton = screen.getByTestId('create-room-button');
      await user.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
        expect(screen.getByTestId('error-message')).toHaveTextContent(
          'Fehler beim Erstellen des Raums. Bitte versuchen Sie es erneut.'
        );
      });
    });

    test('handles network errors', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
      
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const roomNameInput = screen.getByTestId('room-name-input');
      const capacityInput = screen.getByTestId('room-capacity-input');
      
      await user.type(roomNameInput, 'Test Room');
      await user.type(capacityInput, '10');
      
      const createButton = screen.getByTestId('create-room-button');
      await user.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
      });
    });
  });

  describe('Success Flow Tests', () => {
    test('shows success message after successful creation', async () => {
      const user = userEvent.setup();
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const roomNameInput = screen.getByTestId('room-name-input');
      const capacityInput = screen.getByTestId('room-capacity-input');
      
      await user.type(roomNameInput, 'Success Room');
      await user.type(capacityInput, '15');
      
      const createButton = screen.getByTestId('create-room-button');
      await user.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
        expect(screen.getByTestId('success-message')).toHaveTextContent(
          'Raum erfolgreich erstellt!'
        );
      });
    });

    test('calls onCreateRoom callback with correct values', async () => {
      const user = userEvent.setup();
      
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const roomNameInput = screen.getByTestId('room-name-input');
      const capacityInput = screen.getByTestId('room-capacity-input');
      
      await user.type(roomNameInput, 'Callback Room');
      await user.type(capacityInput, '30');
      
      const createButton = screen.getByTestId('create-room-button');
      await user.click(createButton);
      
      // Wait for success message
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
      });
      
      // Wait for the callback to be called (after setTimeout)
      await waitFor(() => {
        expect(mockOnCreateRoom).toHaveBeenCalledWith('Callback Room', 30);
      }, { timeout: 2000 });
    });

    test('clears form after successful creation', async () => {
      const user = userEvent.setup();
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const roomNameInput = screen.getByTestId('room-name-input') as HTMLInputElement;
      const capacityInput = screen.getByTestId('room-capacity-input') as HTMLInputElement;
      
      await user.type(roomNameInput, 'Clear Room');
      await user.type(capacityInput, '12');
      
      const createButton = screen.getByTestId('create-room-button');
      await user.click(createButton);
      
      // Wait for form to be cleared
      await waitFor(() => {
        expect(roomNameInput.value).toBe('');
        expect(capacityInput.value).toBe('');
      }, { timeout: 2000 });
    });
  });

  describe('Clear Button Tests', () => {
    test('clears both inputs when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const roomNameInput = screen.getByTestId('room-name-input') as HTMLInputElement;
      const capacityInput = screen.getByTestId('room-capacity-input') as HTMLInputElement;
      
      await user.type(roomNameInput, 'Test Room');
      await user.type(capacityInput, '20');
      
      const clearButton = screen.getByTestId('clear-button');
      await user.click(clearButton);
      
      await waitFor(() => {
        expect(roomNameInput.value).toBe('');
        expect(capacityInput.value).toBe('');
      });
    });

    test('clears error messages when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const roomNameInput = screen.getByTestId('room-name-input');
      await user.type(roomNameInput, 'Test');
      
      // Trigger validation error
      const createButton = screen.getByTestId('create-room-button');
      await user.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('room-capacity-error')).toBeInTheDocument();
      });
      
      // Click clear
      const clearButton = screen.getByTestId('clear-button');
      await user.click(clearButton);
      
      await waitFor(() => {
        // Errors should be cleared
        expect(screen.queryByTestId('room-capacity-error')).not.toBeInTheDocument();
      });
    });

    test('clears success message when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const roomNameInput = screen.getByTestId('room-name-input');
      const capacityInput = screen.getByTestId('room-capacity-input');
      
      await user.type(roomNameInput, 'Success Room');
      await user.type(capacityInput, '15');
      
      const createButton = screen.getByTestId('create-room-button');
      await user.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
      }, { timeout: 2000 });
      
      // Click clear
      const clearButton = screen.getByTestId('clear-button');
      await user.click(clearButton);
      
      await waitFor(() => {
        // Success message should be cleared
        expect(screen.queryByTestId('success-message')).not.toBeInTheDocument();
      });
    });

    test('disables clear button during loading', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({
          ok: true,
          json: async () => ({}),
        }), 100))
      );
      
      render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
      
      const roomNameInput = screen.getByTestId('room-name-input');
      const capacityInput = screen.getByTestId('room-capacity-input');
      
      await user.type(roomNameInput, 'Test Room');
      await user.type(capacityInput, '10');
      
      const createButton = screen.getByTestId('create-room-button');
      await user.click(createButton);
      
      await waitFor(() => {
        const clearButton = screen.getByTestId('clear-button') as HTMLButtonElement;
        expect(clearButton).toBeDisabled();
      });
    });
  });
});

