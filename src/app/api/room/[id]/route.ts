import { NextResponse, type NextRequest } from 'next/server';
import { getAllRooms } from '@/lib/RoomStorage';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const rooms = getAllRooms();
    const room = rooms.find(r => r.id === id);

    if (!room) {
        return NextResponse.json(
            { error: 'Room not found' },
            { status: 404 }
        );




        
    }
    

    return NextResponse.json(room);
}


