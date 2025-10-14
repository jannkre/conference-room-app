import { NextResponse, type NextRequest } from 'next/server';
import { getAllRooms, saveRooms } from '@/lib/RoomStorage';

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


export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const body: { occupied: boolean } = await request.json();
    const rooms = getAllRooms();
    const roomIndex = rooms.findIndex(r => r.id === id);
    
    if (roomIndex === -1) {
        return NextResponse.json(
            { error: 'Room not found' },
            { status: 404 }
        );
    }
    
    const updatedRoom = { ...rooms[roomIndex], occupied: body.occupied };
    rooms[roomIndex] = updatedRoom;
    
    saveRooms(rooms);
    return NextResponse.json(updatedRoom);
}
