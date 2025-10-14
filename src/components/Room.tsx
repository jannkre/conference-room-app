"use client"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Room as RoomType } from "@/types/room"


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
            <p>{room.capacity}</p>
            <p>{room.occupied ? "Besetzt" : "Frei"}</p>
        </CardContent>
        <CardFooter>
            <Button onClick={handleUpdateRoom}>{room.occupied ? "Raum freigeben" : "Raum reservieren"}</Button>
        </CardFooter>
    </Card>
}
