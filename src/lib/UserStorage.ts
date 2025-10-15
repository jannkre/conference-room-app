import { User, UserResponse } from '../types/user';

// In-memory storage with pre-seeded test users
const users: User[] = [
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
];

export const registerUser = (email: string, password: string): UserResponse | null => {
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return null;
    }

    const newUser: User = {
        id: crypto.randomUUID(),
        email,
        password
    };
    
    users.push(newUser);
    
    // Return user without password
    const { password: _, ...userResponse } = newUser;
    return userResponse;
};

export const loginUser = (email: string, password: string): UserResponse | null => {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return null;
    }
    
    // Return user without password
    const { password: _, ...userResponse } = user;
    return userResponse;
};

