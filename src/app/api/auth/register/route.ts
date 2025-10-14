import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/UserStorage';
import { RegisterRequest } from '@/types/user';

export async function POST(request: Request) {
    try {
        const body: RegisterRequest = await request.json();
        
        // Validate required fields
        if (!body.email || !body.password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        const newUser = registerUser(body.email, body.password);

        if (!newUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            );
        }

        return NextResponse.json(newUser, { status: 201 });

    } catch (error) {
        console.error('Error registering user:', error);
        return NextResponse.json(
            { error: 'Invalid request body' },
            { status: 400 }
        );
    }
}

