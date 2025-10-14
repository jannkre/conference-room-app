"use client"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Room as RoomType } from "@/types/room"


export const Room = ({ room, onUpdateRoom }: { room: RoomType, onUpdateRoom: (id: string, occupied: boolean) => void }) => {

    return <Card className="w-1/4">
        <CardHeader>
            <CardTitle>{room.name}</CardTitle>
        </CardHeader>
        <CardContent>
            {/* <CardDescription>Kapazität{room.capacity}</CardDescription> */}
            <p>{room.capacity}</p>
            <p>{room.occupied ? "Besetzt" : "Frei"}</p>
        </CardContent>
        <CardFooter>
            <Button onClick={() => onUpdateRoom(room.id!, !room.occupied)}>{room.occupied ? "Raum reservieren" : "Raum freigeben"}</Button>
        </CardFooter>
    </Card>
}
