import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../page';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/userStore';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock zustand store
jest.mock('@/lib/userStore', () => ({
  useUserStore: jest.fn(),
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('LoginPage Component', () => {
  const mockPush = jest.fn();
  const mockSetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      setUser: mockSetUser,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering Tests', () => {
    test('renders login form with email and password fields', () => {
      render(<LoginPage />);
      
      expect(screen.getByTestId('login-card')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });

    test('renders "Anmelden" title in login mode', () => {
      render(<LoginPage />);
      
      const title = screen.getByTestId('form-title');
      expect(title).toHaveTextContent('Anmelden');
    });

    test('toggles to registration mode and shows "Registrieren" title', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const toggleButton = screen.getByTestId('toggle-mode-button');
      await user.click(toggleButton);
      
      const title = screen.getByTestId('form-title');
      expect(title).toHaveTextContent('Registrieren');
    });

    test('displays toggle text correctly in both modes', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      // In login mode
      expect(screen.getByText(/Haben Sie noch kein Konto\? Registrieren/i)).toBeInTheDocument();
      
      // Switch to register mode
      await user.click(screen.getByTestId('toggle-mode-button'));
      
      // In register mode
      expect(screen.getByText(/Haben Sie bereits ein Konto\? Anmelden/i)).toBeInTheDocument();
    });
  });

  describe('User Input Tests', () => {
    test('allows typing in email input field', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const emailInput = screen.getByTestId('email-input') as HTMLInputElement;
      await user.type(emailInput, 'test@example.com');
      
      expect(emailInput.value).toBe('test@example.com');
    });

    test('allows typing in password input field', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;
      await user.type(passwordInput, 'password123');
      
      expect(passwordInput.value).toBe('password123');
    });

    test('shows password length counter when password is entered', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const passwordInput = screen.getByTestId('password-input');
      await user.type(passwordInput, 'test12');
      
      expect(screen.getByTestId('password-length')).toBeInTheDocument();
      expect(screen.getByTestId('password-length')).toHaveTextContent('Länge: 6 Zeichen');
    });
  });

  describe('Validation Tests', () => {
    test('shows validation error for invalid email format', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const emailInput = screen.getByTestId('email-input');
      await user.type(emailInput, 'invalidemail');
      await user.tab(); // Trigger blur event
      
      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toBeInTheDocument();
        expect(screen.getByTestId('email-error')).toHaveTextContent(
          'Bitte geben Sie eine gültige E-Mail-Adresse ein'
        );
      });
    });

    test('does not show email error for valid email', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const emailInput = screen.getByTestId('email-input');
      await user.type(emailInput, 'test@example.com');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();
      });
    });

    test('disables submit button when email field is empty', () => {
      render(<LoginPage />);
      
      const submitButton = screen.getByTestId('submit-button') as HTMLButtonElement;
      expect(submitButton).toBeDisabled();
    });

    test('disables submit button when password field is empty', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const emailInput = screen.getByTestId('email-input');
      await user.type(emailInput, 'test@example.com');
      
      const submitButton = screen.getByTestId('submit-button') as HTMLButtonElement;
      expect(submitButton).toBeDisabled();
    });

    test('enables submit button when both fields are filled', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByTestId('submit-button') as HTMLButtonElement;
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Conditional Rendering Tests', () => {
    test('shows password strength indicator only in register mode', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const passwordInput = screen.getByTestId('password-input');
      await user.type(passwordInput, 'test123');
      
      // Should not show in login mode
      expect(screen.queryByTestId('password-strength')).not.toBeInTheDocument();
      
      // Switch to register mode
      await user.click(screen.getByTestId('toggle-mode-button'));
      
      // Type password again after switching modes (fields are cleared on toggle)
      await user.type(passwordInput, 'test123');
      
      // Should show in register mode now
      expect(screen.getByTestId('password-strength')).toBeInTheDocument();
    });

    test('displays correct password strength levels', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      // Switch to register mode
      await user.click(screen.getByTestId('toggle-mode-button'));
      
      const passwordInput = screen.getByTestId('password-input');
      
      // Weak password (< 6 chars)
      await user.type(passwordInput, 'test1');
      expect(screen.getByTestId('password-strength')).toHaveTextContent('Schwach');
      
      // Medium password (6-9 chars)
      await user.clear(passwordInput);
      await user.type(passwordInput, 'test1234');
      expect(screen.getByTestId('password-strength')).toHaveTextContent('Mittel');
      
      // Strong password (10+ chars)
      await user.clear(passwordInput);
      await user.type(passwordInput, 'test12345678');
      expect(screen.getByTestId('password-strength')).toHaveTextContent('Stark');
    });

    test('does not show password length counter when password is empty', () => {
      render(<LoginPage />);
      
      expect(screen.queryByTestId('password-length')).not.toBeInTheDocument();
    });
  });

  describe('Form Toggle Tests', () => {
    test('clears form when toggling between login and register modes', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      // Fill in fields
      const emailInput = screen.getByTestId('email-input') as HTMLInputElement;
      const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      // Toggle mode
      await user.click(screen.getByTestId('toggle-mode-button'));
      
      // Fields should be cleared
      expect(emailInput.value).toBe('');
      expect(passwordInput.value).toBe('');
    });

    test('clears error messages when toggling modes', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      // Create an email error
      const emailInput = screen.getByTestId('email-input');
      await user.type(emailInput, 'invalid');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toBeInTheDocument();
      });
      
      // Toggle mode
      await user.click(screen.getByTestId('toggle-mode-button'));
      
      // Error should be cleared
      expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();
    });
  });

  describe('Loading State Tests', () => {
    test('shows loading state when form is submitted', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockImplementation(() =>
        new Promise((resolve) => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ id: '1', email: 'test@example.com' }),
        }), 100))
      );
      
      render(<LoginPage />);
      
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      // Should show loading text
      expect(submitButton).toHaveTextContent('Lädt...');
      expect(submitButton).toBeDisabled();
    });

    test('disables form during submission', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockImplementation(() =>
        new Promise((resolve) => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ id: '1', email: 'test@example.com' }),
        }), 100))
      );
      
      render(<LoginPage />);
      
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      expect(submitButton).toBeDisabled();
    });
  });

  describe('API Integration Tests', () => {
    test('calls login API with correct credentials', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '1', email: 'test@example.com' }),
      });
      
      render(<LoginPage />);
      
      await user.type(screen.getByTestId('email-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'password123');
      await user.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
        });
      });
    });

    test('calls register API when in register mode', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '1', email: 'newuser@example.com' }),
      });
      
      render(<LoginPage />);
      
      // Switch to register mode
      await user.click(screen.getByTestId('toggle-mode-button'));
      
      await user.type(screen.getByTestId('email-input'), 'newuser@example.com');
      await user.type(screen.getByTestId('password-input'), 'password123');
      await user.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: 'newuser@example.com', password: 'password123' }),
        });
      });
    });

    test('displays error message on failed login', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Ungültige Anmeldedaten' }),
      });
      
      render(<LoginPage />);
      
      await user.type(screen.getByTestId('email-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'wrongpassword');
      await user.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
        expect(screen.getByTestId('error-message')).toHaveTextContent('Ungültige Anmeldedaten');
      });
    });

    test('displays network error on fetch failure', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
      
      render(<LoginPage />);
      
      await user.type(screen.getByTestId('email-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'password123');
      await user.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
        expect(screen.getByTestId('error-message')).toHaveTextContent(
          'Netzwerkfehler. Bitte versuchen Sie es erneut.'
        );
      });
    });
  });

  describe('Success Flow Tests', () => {
    test('successfully logs in with pre-seeded user', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '1', email: 'test@example.com' }),
      });
      
      render(<LoginPage />);
      
      await user.type(screen.getByTestId('email-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'password123');
      await user.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
        expect(screen.getByTestId('success-message')).toHaveTextContent('Erfolgreich angemeldet!');
      });
    });

    test('updates zustand store on successful login', async () => {
      const user = userEvent.setup();
      const mockUserData = { id: '1', email: 'test@example.com' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserData,
      });
      
      render(<LoginPage />);
      
      await user.type(screen.getByTestId('email-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'password123');
      await user.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(mockSetUser).toHaveBeenCalledWith(mockUserData);
      });
    });

    test('navigates to home page on successful login', async () => {
      const user = userEvent.setup();
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '1', email: 'test@example.com' }),
      });
      
      render(<LoginPage />);
      
      await user.type(screen.getByTestId('email-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'password123');
      await user.click(screen.getByTestId('submit-button'));
      
      // Wait for navigation to be called
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      }, { timeout: 2000 });
    });

    test('shows success message on successful registration', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '4', email: 'newuser@example.com' }),
      });
      
      render(<LoginPage />);
      
      // Switch to register mode
      await user.click(screen.getByTestId('toggle-mode-button'));
      
      await user.type(screen.getByTestId('email-input'), 'newuser@example.com');
      await user.type(screen.getByTestId('password-input'), 'password123');
      await user.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
        expect(screen.getByTestId('success-message')).toHaveTextContent('Erfolgreich registriert!');
      }, { timeout: 2000 });
    });
  });
});

