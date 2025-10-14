import { NextResponse } from 'next/server';
import { loginUser } from '@/lib/UserStorage';
import { LoginRequest } from '@/types/user';

export async function POST(request: Request) {
    try {
        const body: LoginRequest = await request.json();
        
        // Validate required fields
        if (!body.email || !body.password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const user = loginUser(body.email, body.password);

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        return NextResponse.json(user, { status: 200 });

    } catch (error) {
        console.error('Error logging in:', error);
        return NextResponse.json(
            { error: 'Invalid request body' },
            { status: 400 }
        );
    }
}

