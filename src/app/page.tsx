"use client"
import CreateRoom from "@/components/CreateRoom";
import { Room } from "@/components/Room";
import { Room as RoomType } from "@/types/room";
import { useEffect, useState } from "react";

export default function Home() {

  const [rooms, setRooms] = useState<RoomType[]>([])

  useEffect(() => {
    fetch("/api/room")
      .then(res => res.json())
      .then(data => setRooms(data))
  }, [])


  const dummy = () => {
    asdöfljasdf;:
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Conference Room Booking</h2>
      <div className="w-1/4 flex justify-center mb-4">
        <CreateRoom onCreateRoom={(room, capacity) => {setRooms([...rooms, {name: room, capacity: capacity, occupied: false}])}} />
      </div>

      <div className="flex flex-wrap gap-4">
        {rooms.map((room) => (
          <Room key={room.name} room={room} onUpdateRoom={(id, occupied) => {setRooms(rooms.map(room => room.id === id ? {...room, occupied} : room))}} />
        ))}
      </div>
    </div>
  );
}
