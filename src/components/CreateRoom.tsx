"use client"

import { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"



const CreateRoom = ({ onCreateRoom }: {onCreateRoom: (room: string, capacity: number) => void}) => 
{
    const [room, setRoom] = useState("")
    const [capacity, setCapacity] = useState(0)


    const handleCreateRoom = async () => {
        if (room === "" || capacity === 0) {
            return
        }

        await fetch("/api/room", {
            method: "POST",
            body: JSON.stringify({ name: room, capacity: capacity, occupied: false })
        })
        setRoom("")
        setCapacity(0)
        onCreateRoom(room, capacity)
    }

    return <div>
        <Input type="text" className="mb-2" placeholder="Name" value={room} onChange={(e) => setRoom(e.target.value)} /> 
        <Input type="number" className="mb-2" placeholder="Kapazität" value={capacity} onChange={(e) => setCapacity(parseInt(e.target.value))} />
        <Button onClick={handleCreateRoom}>Create Room</Button>
    </div>
}

export default CreateRoom