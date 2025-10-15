import { NextResponse, type NextRequest } from 'next/server';
import { getRoomById, updateRoom } from '@/lib/RoomStorage';
import db from "../../../../lib/db"
import { configDotenv } from 'dotenv';
configDotenv({
    path: './'
});

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const room = await getRoomById(id);

    const users = await db`
        select
        name,
        age
        from users
        where age > 12
    `
    // users = Result [{ name: "Walter", age: 80 }, { name: 'Murray', age: 68 }, ...]

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
