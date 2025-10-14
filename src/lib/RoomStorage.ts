import { Room, CreateRoomRequest } from '../types/room';
// In-memory storage
const rooms: Room[] = [];

export const getAllRooms = (): Room[] => {
    return [...rooms];
};

export const createRoom = (roomData: CreateRoomRequest): Room => {
    const newRoom: Room = {
        ...roomData,
        id: crypto.randomUUID()
    };
    rooms.push(newRoom);
    return newRoom;
};
