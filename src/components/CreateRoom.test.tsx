import { render, screen } from '@testing-library/react';
import CreateRoom from './CreateRoom';

/**
 * Co-located Test Example
 * 
 * This is a simple example of a test file placed alongside the component it tests.
 * Co-located tests are useful for:
 * - Quick smoke tests
 * - Component-specific integration tests
 * - When you want tests right next to the implementation
 * 
 * For comprehensive test suites, see __tests__/CreateRoom.test.tsx
 */

describe('CreateRoom - Co-located Smoke Tests', () => {
  const mockOnCreateRoom = jest.fn();

  test('renders without crashing', () => {
    render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
    expect(screen.getByTestId('create-room-form')).toBeInTheDocument();
  });

  test('displays all required form elements', () => {
    render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
    
    // Check all essential elements are present
    expect(screen.getByTestId('room-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('room-capacity-input')).toBeInTheDocument();
    expect(screen.getByTestId('create-room-button')).toBeInTheDocument();
    expect(screen.getByTestId('clear-button')).toBeInTheDocument();
  });

  test('create button is not disabled but visually dimmed when form is empty', () => {
    render(<CreateRoom onCreateRoom={mockOnCreateRoom} />);
    
    const createButton = screen.getByTestId('create-room-button');
    // Button is not disabled (to allow validation on click)
    expect(createButton).not.toBeDisabled();
    // But it has reduced opacity
    expect(createButton).toHaveStyle({ opacity: 0.5 });
  });
});

