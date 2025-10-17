

export interface Booking {
    id?: string
    roomId: string
    title: string
    startTime: Date
    endTime: Date
    createdAt?: Date
}

export interface Room {
    id?: string
    name: string
    capacity: number,
    occupied: boolean
}

export interface CreateRoomRequest {
    name: string
    capacity: number
    occupied: boolean
}