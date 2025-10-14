"use client"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Room as RoomType } from "@/types/room"
import { useThemeStore } from "@/lib/themeStore"


export const Room = ({ room, onUpdateRoom }: { room: RoomType, onUpdateRoom: (id: string, occupied: boolean) => void }) => {
    const { theme } = useThemeStore()

    const handleUpdateRoom = async () => {
        await fetch(`/api/room/${room.id}`, {
            method: "PUT",
            body: JSON.stringify({ occupied: !room.occupied })
        })
        onUpdateRoom(room.id!, !room.occupied)
    }

    // Theme-based styling
    const themeClasses = theme === 'dark' 
        ? "bg-gray-800 text-white border-gray-700" 
        : "bg-white text-gray-900 border-gray-200"
    
    const statusColor = room.occupied 
        ? (theme === 'dark' ? "text-red-400" : "text-red-600")
        : (theme === 'dark' ? "text-green-400" : "text-green-600")


    return <Card className={`w-1/4 transition-all duration-300 ${themeClasses}`}>
        <CardHeader>
            <CardTitle className={theme === 'dark' ? "text-white" : "text-gray-900"}>
                {room.name}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className={theme === 'dark' ? "text-gray-300" : "text-gray-700"}>
                Kapazität: {room.capacity}
            </p>
            <p className={`font-semibold ${statusColor}`}>
                Status: {room.occupied ? "Besetzt" : "Frei"}
            </p>
        </CardContent>
        <CardFooter>
            <Button 
                onClick={handleUpdateRoom}
                className={theme === 'dark' 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "bg-blue-500 hover:bg-blue-600"
                }
            >
                {room.occupied ? "Raum freigeben" : "Raum reservieren"}
            </Button>
        </CardFooter>
    </Card>
}
