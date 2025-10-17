import { NextResponse, type NextRequest } from 'next/server';
import { getRoomById, updateRoom } from '@/lib/RoomStorage';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const room = await getRoomById(id);

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
    
    const updatedRoom = await updateRoom(id, { occupied: body.occupied });
    
    if (!updatedRoom) {
        return NextResponse.json(
            { error: 'Room not found' },
            { status: 404 }
        );
    }
    
    return NextResponse.json(updatedRoom);
}
