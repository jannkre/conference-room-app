export interface User {
    id: string;
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export type UserResponse = Omit<User, 'password'>;

