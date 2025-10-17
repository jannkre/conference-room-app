"use client"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Room as RoomType } from "@/types/room"
import Link from "next/link"


export const Room = ({ room, onUpdateRoom }: { room: RoomType, onUpdateRoom: (id: string, occupied: boolean) => void }) => {

    const handleUpdateRoom = async () => {
        await fetch(`/api/room/${room.id}`, {
            method: "PUT",
            body: JSON.stringify({ occupied: !room.occupied })
        })
        onUpdateRoom(room.id!, !room.occupied)
    }

    return <Card className="w-1/4">
        <CardHeader>
            <CardTitle>{room.name}</CardTitle>
        </CardHeader>
        <CardContent>
            <p>Kapazität: {room.capacity}</p>
            <p>Status: {room.occupied ? "Besetzt" : "Frei"}</p>
        </CardContent>
        <CardFooter className="flex gap-2">
            <Button onClick={handleUpdateRoom}>{room.occupied ? "Raum freigeben" : "Raum reservieren"}</Button>
            {room.id && (
                <Link href={`/room/${room.id}`}>
                    <Button variant="outline">View Schedule</Button>
                </Link>
            )}
        </CardFooter>
    </Card>
}
