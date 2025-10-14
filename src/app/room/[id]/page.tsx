"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Room as RoomType } from "@/types/room"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface RoomPageProps {
    params: Promise<{ id: string }>
}

export default function RoomPage({ params }: RoomPageProps) {
    const [room, setRoom] = useState<RoomType | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [roomId, setRoomId] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        params.then(({ id }) => {
            setRoomId(id)
        })
    }, [params])

    useEffect(() => {
        if (!roomId) return

        fetch(`/api/room/${roomId}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Raum nicht gefunden')
                }
                return res.json()
            })
            .then(data => {
                setRoom(data)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [roomId])

    const handleToggleOccupancy = async () => {
        if (!room || !roomId) return

        try {
            const response = await fetch(`/api/room/${roomId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ occupied: !room.occupied })
            })

            if (!response.ok) {
                throw new Error('Fehler beim Aktualisieren des Raums')
            }

            const updatedRoom = await response.json()
            setRoom(updatedRoom)
        } catch (err) {
            alert('Fehler beim Aktualisieren des Raums')
        }
    }

    const handleDeleteRoom = async () => {
        if (!room || !roomId) return

        if (!confirm(`Sind Sie sicher, dass Sie "${room.name}" löschen möchten?`)) {
            return
        }

        try {
            const response = await fetch(`/api/room/${roomId}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('Fehler beim Löschen des Raums')
            }

            router.push('/')
        } catch (err) {
            alert('Fehler beim Löschen des Raums')
        }
    }

    if (loading) {
        return (
            <div className="p-4">
                <div className="mb-4">
                    <Button onClick={() => router.push('/')} variant="outline">
                        ← Zurück zu allen Räumen
                    </Button>
                </div>
                <p>Lädt...</p>
            </div>
        )
    }

    if (error || !room) {
        return (
            <div className="p-4">
                <div className="mb-4">
                    <Button onClick={() => router.push('/')} variant="outline">
                        ← Zurück zu allen Räumen
                    </Button>
                </div>
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Fehler</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-red-500">{error || 'Raum nicht gefunden'}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-4">
            <div className="mb-4">
                <Button onClick={() => router.push('/')} variant="outline">
                    ← Zurück zu allen Räumen
                </Button>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-3xl">{room.name}</CardTitle>
                    <CardDescription>Raumdetails</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Rauminformationen</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Raum-ID:</span>
                                <span className="font-mono text-sm">{room.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Raumname:</span>
                                <span className="font-semibold">{room.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Kapazität:</span>
                                <span className="font-semibold">{room.capacity} Personen</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Status:</span>
                                <span className={`font-semibold px-3 py-1 rounded-full ${
                                    room.occupied 
                                        ? 'bg-red-100 text-red-700' 
                                        : 'bg-green-100 text-green-700'
                                }`}>
                                    {room.occupied ? 'Belegt' : 'Verfügbar'}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                    <Button 
                        onClick={handleToggleOccupancy}
                        className="flex-1"
                    >
                        {room.occupied ? 'Als verfügbar markieren' : 'Als belegt markieren'}
                    </Button>
                    <Button 
                        onClick={handleDeleteRoom}
                        variant="destructive"
                        className="flex-1"
                    >
                        Raum löschen
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

