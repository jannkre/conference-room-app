import { collection, getDocs, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Room, CreateRoomRequest } from '../types/room';

const ROOMS_COLLECTION = 'rooms';

export const getAllRooms = async (): Promise<Room[]> => 
{
    const roomsCollection = collection(db, ROOMS_COLLECTION);
    const roomsSnapshot = await getDocs(roomsCollection);
    const rooms: Room[] = [];
    
    roomsSnapshot.forEach((doc) => {
        rooms.push({
            id: doc.id,
            ...doc.data()
        } as Room);
    });
    
    return rooms;
};

export const createRoom = async (roomData: CreateRoomRequest): Promise<Room> => 
{
    const roomsCollection = collection(db, ROOMS_COLLECTION);
    const docRef = await addDoc(roomsCollection, {
        name: roomData.name,
        capacity: roomData.capacity,
        occupied: roomData.occupied
    });
    
    return {
        id: docRef.id,
        ...roomData
    };
};


export const getRoomById = async (id: string): Promise<Room | null> => 
{
    const roomDoc = doc(db, ROOMS_COLLECTION, id);
    const roomSnapshot = await getDoc(roomDoc);
    
    if (!roomSnapshot.exists()) {
        return null;
    }
    
    return {
        id: roomSnapshot.id,
        ...roomSnapshot.data()
    } as Room;
};


export const updateRoom = async (id: string, data: Partial<Room>): Promise<Room | null> => 
{
    const roomDoc = doc(db, ROOMS_COLLECTION, id);
    
    // Check if room exists
    const roomSnapshot = await getDoc(roomDoc);
    if (!roomSnapshot.exists()) {
        return null;
    }
    
    // Update the room
    await updateDoc(roomDoc, data);
    
    // Return updated room
    return {
        id: roomSnapshot.id,
        ...roomSnapshot.data(),
        ...data
    } as Room;
};
