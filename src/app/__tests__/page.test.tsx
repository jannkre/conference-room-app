import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../page';
import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/lib/themeStore';
import { useUserStore } from '@/lib/userStore';
import { Room as RoomType } from '@/types/room';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock zustand stores
jest.mock('@/lib/themeStore', () => ({
  useThemeStore: jest.fn(),
}));

jest.mock('@/lib/userStore', () => ({
  useUserStore: jest.fn(),
}));

// Mock child components
jest.mock('@/components/CreateRoom', () => {
  return function MockCreateRoom({ onCreateRoom }: { onCreateRoom: (name: string, capacity: number) => void }) {
    return (
      <div data-testid="create-room-component">
        <button 
          data-testid="mock-create-room-button"
          onClick={() => onCreateRoom('Test Room', 10)}
        >
          Create Room
        </button>
      </div>
    );
  };
});

jest.mock('@/components/Room', () => ({
  Room: function MockRoom({ room, onUpdateRoom }: { room: RoomType, onUpdateRoom: (id: string, occupied: boolean) => void }) {
    return (
      <div data-testid={`room-${room.name}`}>
        <span data-testid={`room-name-${room.name}`}>{room.name}</span>
        <span data-testid={`room-capacity-${room.name}`}>{room.capacity}</span>
        <span data-testid={`room-status-${room.name}`}>{room.occupied ? 'Besetzt' : 'Frei'}</span>
        <button 
          data-testid={`room-toggle-${room.name}`}
          onClick={() => onUpdateRoom(room.id!, !room.occupied)}
        >
          Toggle
        </button>
      </div>
    );
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Moon: () => <div data-testid="moon-icon">Moon</div>,
  Sun: () => <div data-testid="sun-icon">Sun</div>,
  User: () => <div data-testid="user-icon">User</div>,
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('Home Page Component', () => {
  const mockPush = jest.fn();
  const mockToggleTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useThemeStore as unknown as jest.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      user: null,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Data Loading Tests', () => {
    test('fetches rooms data on component mount', async () => {
      const mockRooms: RoomType[] = [
        { id: '1', name: 'Room A', capacity: 10, occupied: false },
        { id: '2', name: 'Room B', capacity: 20, occupied: true },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms,
      });

      render(<Home />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/room');
      });
    });

    test('updates rooms state after successful fetch', async () => {
      const mockRooms: RoomType[] = [
        { id: '1', name: 'Room A', capacity: 10, occupied: false },
        { id: '2', name: 'Room B', capacity: 20, occupied: true },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms,
      });

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByTestId('room-Room A')).toBeInTheDocument();
        expect(screen.getByTestId('room-Room B')).toBeInTheDocument();
      });
    });

    test('handles empty rooms array from API', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      render(<Home />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/room');
      });

      // Should not display any rooms
      expect(screen.queryByTestId(/^room-/)).not.toBeInTheDocument();
    });

    test('displays initial empty state before data loads', () => {
      (global.fetch as jest.Mock).mockImplementation(() => 
        new Promise((resolve) => setTimeout(() => resolve({
          ok: true,
          json: async () => [],
        }), 100))
      );

      render(<Home />);

      // Should render without rooms initially
      expect(screen.queryByTestId(/^room-/)).not.toBeInTheDocument();
    });
  });

  describe('Room Display Tests', () => {
    test('displays single room with correct data', async () => {
      const mockRooms: RoomType[] = [
        { id: '1', name: 'Conference Room A', capacity: 15, occupied: false },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms,
      });

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByTestId('room-Conference Room A')).toBeInTheDocument();
      });

      expect(screen.getByTestId('room-name-Conference Room A')).toHaveTextContent('Conference Room A');
      expect(screen.getByTestId('room-capacity-Conference Room A')).toHaveTextContent('15');
      expect(screen.getByTestId('room-status-Conference Room A')).toHaveTextContent('Frei');
    });

    test('displays multiple rooms correctly', async () => {
      const mockRooms: RoomType[] = [
        { id: '1', name: 'Room Alpha', capacity: 10, occupied: false },
        { id: '2', name: 'Room Beta', capacity: 20, occupied: true },
        { id: '3', name: 'Room Gamma', capacity: 30, occupied: false },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms,
      });

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByTestId('room-Room Alpha')).toBeInTheDocument();
        expect(screen.getByTestId('room-Room Beta')).toBeInTheDocument();
        expect(screen.getByTestId('room-Room Gamma')).toBeInTheDocument();
      });

      // Check all room details
      expect(screen.getByTestId('room-name-Room Alpha')).toHaveTextContent('Room Alpha');
      expect(screen.getByTestId('room-capacity-Room Alpha')).toHaveTextContent('10');
      expect(screen.getByTestId('room-status-Room Alpha')).toHaveTextContent('Frei');

      expect(screen.getByTestId('room-name-Room Beta')).toHaveTextContent('Room Beta');
      expect(screen.getByTestId('room-capacity-Room Beta')).toHaveTextContent('20');
      expect(screen.getByTestId('room-status-Room Beta')).toHaveTextContent('Besetzt');

      expect(screen.getByTestId('room-name-Room Gamma')).toHaveTextContent('Room Gamma');
      expect(screen.getByTestId('room-capacity-Room Gamma')).toHaveTextContent('30');
      expect(screen.getByTestId('room-status-Room Gamma')).toHaveTextContent('Frei');
    });

    test('displays occupied status correctly', async () => {
      const mockRooms: RoomType[] = [
        { id: '1', name: 'Free Room', capacity: 10, occupied: false },
        { id: '2', name: 'Occupied Room', capacity: 10, occupied: true },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms,
      });

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByTestId('room-status-Free Room')).toHaveTextContent('Frei');
        expect(screen.getByTestId('room-status-Occupied Room')).toHaveTextContent('Besetzt');
      });
    });

    test('displays rooms with different capacities', async () => {
      const mockRooms: RoomType[] = [
        { id: '1', name: 'Small Room', capacity: 5, occupied: false },
        { id: '2', name: 'Medium Room', capacity: 15, occupied: false },
        { id: '3', name: 'Large Room', capacity: 50, occupied: false },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms,
      });

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByTestId('room-capacity-Small Room')).toHaveTextContent('5');
        expect(screen.getByTestId('room-capacity-Medium Room')).toHaveTextContent('15');
        expect(screen.getByTestId('room-capacity-Large Room')).toHaveTextContent('50');
      });
    });
  });

  describe('Room Update Tests', () => {
    test('updates room status when toggled', async () => {
      const user = userEvent.setup();
      const mockRooms: RoomType[] = [
        { id: '1', name: 'Room A', capacity: 10, occupied: false },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms,
      });

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByTestId('room-Room A')).toBeInTheDocument();
      });

      // Initial status should be 'Frei'
      expect(screen.getByTestId('room-status-Room A')).toHaveTextContent('Frei');

      // Toggle the room
      await user.click(screen.getByTestId('room-toggle-Room A'));

      await waitFor(() => {
        expect(screen.getByTestId('room-status-Room A')).toHaveTextContent('Besetzt');
      });
    });

    test('updates only the toggled room, not others', async () => {
      const user = userEvent.setup();
      const mockRooms: RoomType[] = [
        { id: '1', name: 'Room A', capacity: 10, occupied: false },
        { id: '2', name: 'Room B', capacity: 20, occupied: false },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms,
      });

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByTestId('room-Room A')).toBeInTheDocument();
        expect(screen.getByTestId('room-Room B')).toBeInTheDocument();
      });

      // Toggle Room A
      await user.click(screen.getByTestId('room-toggle-Room A'));

      await waitFor(() => {
        expect(screen.getByTestId('room-status-Room A')).toHaveTextContent('Besetzt');
      });

      // Room B should remain unchanged
      expect(screen.getByTestId('room-status-Room B')).toHaveTextContent('Frei');
    });
  });

  describe('Create Room Tests', () => {
    test('adds new room to the list when created', async () => {
      const user = userEvent.setup();
      const mockRooms: RoomType[] = [
        { id: '1', name: 'Existing Room', capacity: 10, occupied: false },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms,
      });

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByTestId('room-Existing Room')).toBeInTheDocument();
      });

      // Create a new room
      await user.click(screen.getByTestId('mock-create-room-button'));

      await waitFor(() => {
        expect(screen.getByTestId('room-Test Room')).toBeInTheDocument();
      });

      // Check new room details
      expect(screen.getByTestId('room-name-Test Room')).toHaveTextContent('Test Room');
      expect(screen.getByTestId('room-capacity-Test Room')).toHaveTextContent('10');
      expect(screen.getByTestId('room-status-Test Room')).toHaveTextContent('Frei');

      // Existing room should still be there
      expect(screen.getByTestId('room-Existing Room')).toBeInTheDocument();
    });

    test('displays CreateRoom component', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByTestId('create-room-component')).toBeInTheDocument();
      });
    });
  });

  describe('Data Format Tests', () => {
    test('handles rooms with all required fields', async () => {
      const mockRooms: RoomType[] = [
        { id: '123', name: 'Complete Room', capacity: 25, occupied: true },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms,
      });

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByTestId('room-Complete Room')).toBeInTheDocument();
      });

      expect(screen.getByTestId('room-name-Complete Room')).toHaveTextContent('Complete Room');
      expect(screen.getByTestId('room-capacity-Complete Room')).toHaveTextContent('25');
      expect(screen.getByTestId('room-status-Complete Room')).toHaveTextContent('Besetzt');
    });

    test('handles rooms with special characters in name', async () => {
      const mockRooms: RoomType[] = [
        { id: '1', name: 'Room A-1 (Main)', capacity: 10, occupied: false },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms,
      });

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByTestId('room-name-Room A-1 (Main)')).toHaveTextContent('Room A-1 (Main)');
      });
    });

    test('handles large number of rooms', async () => {
      const mockRooms: RoomType[] = Array.from({ length: 20 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Room ${i + 1}`,
        capacity: (i + 1) * 5,
        occupied: i % 2 === 0,
      }));

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms,
      });

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByTestId('room-Room 1')).toBeInTheDocument();
        expect(screen.getByTestId('room-Room 20')).toBeInTheDocument();
      });

      // Check a few random rooms
      expect(screen.getByTestId('room-capacity-Room 5')).toHaveTextContent('25');
      expect(screen.getByTestId('room-capacity-Room 10')).toHaveTextContent('50');
      expect(screen.getByTestId('room-status-Room 1')).toHaveTextContent('Besetzt'); // index 0, i % 2 === 0
      expect(screen.getByTestId('room-status-Room 2')).toHaveTextContent('Frei'); // index 1, i % 2 !== 0
    });
  });

  describe('Rendering Tests', () => {
    test('renders page title', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      render(<Home />);

      expect(screen.getByText('Conference Room Booking')).toBeInTheDocument();
    });

    test('renders without errors when no rooms available', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      render(<Home />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/room');
      });

      expect(screen.getByText('Conference Room Booking')).toBeInTheDocument();
      expect(screen.getByTestId('create-room-component')).toBeInTheDocument();
    });
  });
});

