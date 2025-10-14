"use client"

import { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"



const CreateRoom = ({ onCreateRoom }: {onCreateRoom: (room: string, capacity: number) => void}) => 
{
    const [room, setRoom] = useState("")
    const [capacity, setCapacity] = useState("")

    
    const handleCreateRoom = () => {
        console.log(room, capacity)
    }

    return <div>
        <Input type="text" placeholder="Name" value={room} onChange={(e) => setRoom(e.target.value)} /> 
        <Input type="text" placeholder="Kapazität" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
        <Button onClick={handleCreateRoom}>Create Room</Button>
    </div>
}

export default CreateRoom