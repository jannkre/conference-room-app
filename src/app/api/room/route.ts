import { NextResponse } from 'next/server';
import { getAllRooms, createRoom } from '@/lib/RoomStorage';
import { CreateRoomRequest } from '@/types/room';

export async function GET() {
    const rooms = await getAllRooms();
    return NextResponse.json(rooms);
}

export async function POST(request: Request) {
    try {
        const body: CreateRoomRequest = await request.json();
        
        // Validate required fields
        if (!body.name || typeof body.capacity !== 'number') {
            return NextResponse.json(
                { error: 'Name and capacity are required fields' },
                { status: 400 }
            );
        }

        const newRoom = await createRoom({
            name: body.name,
            capacity: body.capacity,
            occupied: body.occupied ?? false
        });

        return NextResponse.json(newRoom, { status: 201 });

    } catch (error) {
        console.error('Error creating room:', error);
        return NextResponse.json(
            { error: 'Invalid request body' },
            { status: 400 }
        );
    }
}
