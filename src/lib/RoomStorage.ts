import { Room, CreateRoomRequest } from '../types/room';
import fs from 'fs';
import path from 'path';

// File path for persistent storage
const DATA_DIR = path.join(process.cwd(), 'data');
const ROOMS_FILE = path.join(DATA_DIR, 'rooms.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load rooms from file
const loadRoomsFromFile = (): Room[] => {
    try {
        if (fs.existsSync(ROOMS_FILE)) {
            const data = fs.readFileSync(ROOMS_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading rooms from file:', error);
    }
    return [];
};

// Save rooms to file
const saveRoomsToFile = (rooms: Room[]): void => {
    try {
        fs.writeFileSync(ROOMS_FILE, JSON.stringify(rooms, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error saving rooms to file:', error);
    }
};

// Initialize rooms from file
let rooms: Room[] = loadRoomsFromFile();

export const getAllRooms = (): Room[] => {
    return [...rooms];
};

export const createRoom = (roomData: CreateRoomRequest): Room => {
    const newRoom: Room = {
        ...roomData,
        id: crypto.randomUUID()
    };
    rooms.push(newRoom);
    saveRoomsToFile(rooms);
    return newRoom;
};

export const saveRooms = (updatedRooms: Room[]): void => {
    rooms = updatedRooms;
    saveRoomsToFile(rooms);
};
