"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"


export const Room = ({ room }: { room: { name: string, capacity: number } }) => {

    return <Card>
        <CardHeader>
            <CardTitle>{room.name}</CardTitle>
        </CardHeader>
        <CardContent>
            <CardDescription>Kapazität{room.capacity}</CardDescription>
            <p>{room.capacity}</p>
        </CardContent>
    </Card>
}
