"use client"
import CreateRoom from "@/components/CreateRoom";
import { Room } from "@/components/Room";
import { Room as RoomType } from "@/types/room";
import { useEffect, useState } from "react";
import { useThemeStore } from "@/lib/themeStore";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {

  const [rooms, setRooms] = useState<RoomType[]>([])
  const { theme, toggleTheme } = useThemeStore()

  useEffect(() => {
    fetch("/api/room")
      .then(res => res.json())
      .then(data => setRooms(data))
  }, [])


  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Conference Room Booking</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleTheme}
          className="flex items-center gap-2"
        >
          {theme === 'light' ? (
            <>
              <Moon className="h-4 w-4" />
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <Sun className="h-4 w-4" />
              <span>Light Mode</span>
            </>
          )}
        </Button>
      </div>
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
