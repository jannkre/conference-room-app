import { User, UserResponse } from '../types/user';

// In-memory storage
const users: User[] = [];

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

