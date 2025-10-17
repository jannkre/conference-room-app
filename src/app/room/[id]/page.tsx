"use client"
import { useEffect, useState } from "react"
import { Timetable } from "@/components/Timetable"
import { Room, Booking } from "@/types/room"
import { useParams } from "next/navigation"

export default function RoomDetailsPage() {
    const params = useParams()
    const roomId = params.id as string
    const [room, setRoom] = useState<Room | null>(null)
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                setLoading(true)
                const response = await fetch(`/api/room/${roomId}`)
                if (!response.ok) {
                    throw new Error('Room not found')
                }
                const data = await response.json()
                setRoom(data)
                
                // Fetch bookings for the room
                // For now, use mock bookings - in a real app, this would fetch from API
                setBookings([
                    {
                        id: '1',
                        roomId: roomId,
                        title: 'Team Meeting',
                        startTime: new Date(new Date().setHours(10, 0, 0, 0)),
                        endTime: new Date(new Date().setHours(11, 0, 0, 0)),
                    },
                    {
                        id: '2',
                        roomId: roomId,
                        title: 'Client Presentation',
                        startTime: new Date(new Date().setHours(14, 0, 0, 0)),
                        endTime: new Date(new Date().setHours(16, 0, 0, 0)),
                    }
                ])
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load room')
                // Even on error, set some mock data so the UI can be demonstrated
                setRoom({
                    id: roomId,
                    name: 'Demo Conference Room',
                    capacity: 10,
                    occupied: false
                })
                setBookings([
                    {
                        id: '1',
                        roomId: roomId,
                        title: 'Team Meeting',
                        startTime: new Date(new Date().setHours(10, 0, 0, 0)),
                        endTime: new Date(new Date().setHours(11, 0, 0, 0)),
                    },
                    {
                        id: '2',
                        roomId: roomId,
                        title: 'Client Presentation',
                        startTime: new Date(new Date().setHours(14, 0, 0, 0)),
                        endTime: new Date(new Date().setHours(16, 0, 0, 0)),
                    }
                ])
            } finally {
                setLoading(false)
            }
        }

        if (roomId) {
            fetchRoom()
        }
    }, [roomId])

    const handleCreateBooking = (booking: Omit<Booking, 'id' | 'createdAt'>) => {
        // In a real app, this would POST to an API endpoint
        const newBooking: Booking = {
            ...booking,
            id: Date.now().toString(),
            createdAt: new Date()
        }
        setBookings([...bookings, newBooking])
    }

    if (loading) {
        return (
            <div className="p-4">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    if (!room) {
        return (
            <div className="p-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
                    <p className="text-red-600">{error || 'Room not found'}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 max-w-6xl mx-auto">
            {error && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800">
                        <strong>Note:</strong> Using demo data. {error}
                    </p>
                </div>
            )}
            
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{room.name}</h1>
                <div className="flex gap-4 text-gray-600">
                    <span>Capacity: {room.capacity} people</span>
                    <span className={`font-semibold ${room.occupied ? 'text-red-600' : 'text-green-600'}`}>
                        Status: {room.occupied ? 'Occupied' : 'Available'}
                    </span>
                </div>
            </div>
            
            <Timetable
                roomId={roomId}
                roomName={room.name}
                bookings={bookings}
                onCreateBooking={handleCreateBooking}
            />
        </div>
    )
}
