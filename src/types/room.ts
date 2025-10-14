

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