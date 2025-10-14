"use client"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Room as RoomType } from "@/types/room"
import { useRouter } from "next/navigation"


export const Room = ({ room, onUpdateRoom }: { room: RoomType, onUpdateRoom: (id: string, occupied: boolean) => void }) => 
{
    const router = useRouter()

    const handleUpdateRoom = async () => {
        await fetch(`/api/room/${room.id}`, {
            method: "PUT",
            body: JSON.stringify({ occupied: !room.occupied })
        })
        onUpdateRoom(room.id!, !room.occupied)
    }

    const handleViewDetails = () => {
        router.push(`/room/${room.id}`)
    }

    return <Card className="w-1/4 cursor-pointer hover:shadow-lg transition-shadow">
        <div onClick={handleViewDetails}>
            <CardHeader>
                <CardTitle>{room.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Kapazität: {room.capacity}</p>
                <p>Status: {room.occupied ? "Besetzt" : "Frei"}</p>
            </CardContent>
        </div>
        <CardFooter className="flex gap-2">
            <Button 
                onClick={(e) => {
                    e.stopPropagation()
                    handleUpdateRoom()
                }} 
                className="flex-1"
            >
                {room.occupied ? "Raum freigeben" : "Raum reservieren"}
            </Button>
            <Button 
                onClick={(e) => {
                    e.stopPropagation()
                    handleViewDetails()
                }} 
                variant="outline"
                className="flex-1"
            >
                Details
            </Button>
        </CardFooter>
    </Card>
}
