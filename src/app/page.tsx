"use client"
import CreateRoom from "@/components/CreateRoom";
import { Room } from "@/components/Room";
import { Room as RoomType } from "@/types/room";
import Image from "next/image";
import { useState } from "react";

export default function Home() {

  const [rooms, setRooms] = useState<RoomType[]>([])


  const handleCreateRoom = (room: string, capacity: number) => {
    setRooms([...rooms, {name: room, capacity: capacity, occupied: false}])
  }

  return (
    <div>
      <h1>Conference Room Booking</h1>
      <CreateRoom onCreateRoom={handleCreateRoom} />


      {rooms.map((room) => (
        <Room key={room.name} room={room} />
      ))}
    </div>
  );
}
