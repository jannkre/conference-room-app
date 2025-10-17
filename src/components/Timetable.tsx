"use client"
import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Booking } from "@/types/room"

interface TimetableProps {
    roomId: string
    roomName: string
    bookings: Booking[]
    onCreateBooking?: (booking: Omit<Booking, 'id' | 'createdAt'>) => void
}

export const Timetable = ({ roomId, roomName, bookings, onCreateBooking }: TimetableProps) => {
    const [selectedDate, setSelectedDate] = useState(new Date())

    // Generate time slots from 8:00 to 20:00 (8 AM to 8 PM)
    const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8)

    // Get bookings for the selected date
    const getBookingsForDate = (date: Date) => {
        return bookings.filter(booking => {
            const bookingDate = new Date(booking.startTime)
            return (
                bookingDate.getDate() === date.getDate() &&
                bookingDate.getMonth() === date.getMonth() &&
                bookingDate.getFullYear() === date.getFullYear()
            )
        })
    }

    const dayBookings = getBookingsForDate(selectedDate)

    // Check if a time slot has a booking
    const getBookingForSlot = (hour: number) => {
        return dayBookings.find(booking => {
            const start = new Date(booking.startTime)
            const end = new Date(booking.endTime)
            const slotStart = new Date(selectedDate)
            slotStart.setHours(hour, 0, 0, 0)
            const slotEnd = new Date(selectedDate)
            slotEnd.setHours(hour + 1, 0, 0, 0)

            return (
                (start <= slotStart && end > slotStart) ||
                (start >= slotStart && start < slotEnd)
            )
        })
    }

    // Check if current time is in this slot (for highlighting)
    const isCurrentTimeSlot = (hour: number) => {
        const now = new Date()
        if (
            now.getDate() !== selectedDate.getDate() ||
            now.getMonth() !== selectedDate.getMonth() ||
            now.getFullYear() !== selectedDate.getFullYear()
        ) {
            return false
        }
        return now.getHours() === hour
    }

    // Navigate to previous day
    const goToPreviousDay = () => {
        const newDate = new Date(selectedDate)
        newDate.setDate(newDate.getDate() - 1)
        setSelectedDate(newDate)
    }

    // Navigate to next day
    const goToNextDay = () => {
        const newDate = new Date(selectedDate)
        newDate.setDate(newDate.getDate() + 1)
        setSelectedDate(newDate)
    }

    // Go to today
    const goToToday = () => {
        setSelectedDate(new Date())
    }

    // Format date for display
    const formatDate = (date: Date) => {
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        ) {
            return "Today"
        } else if (
            date.getDate() === tomorrow.getDate() &&
            date.getMonth() === tomorrow.getMonth() &&
            date.getFullYear() === tomorrow.getFullYear()
        ) {
            return "Tomorrow"
        } else if (
            date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear()
        ) {
            return "Yesterday"
        }

        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        })
    }

    // Handle slot click for creating a booking
    const handleSlotClick = (hour: number) => {
        if (!onCreateBooking) return
        
        const booking = getBookingForSlot(hour)
        if (booking) return // Don't allow booking if slot is occupied

        const startTime = new Date(selectedDate)
        startTime.setHours(hour, 0, 0, 0)
        const endTime = new Date(selectedDate)
        endTime.setHours(hour + 1, 0, 0, 0)

        const title = prompt('Enter booking title:')
        if (!title) return

        onCreateBooking({
            roomId,
            title,
            startTime,
            endTime
        })
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{roomName} - Schedule</CardTitle>
                <div className="flex gap-2 items-center mt-4 flex-wrap">
                    <Button onClick={goToPreviousDay} variant="outline" size="sm">
                        ← Previous
                    </Button>
                    <Button onClick={goToToday} variant="outline" size="sm">
                        Today
                    </Button>
                    <Button onClick={goToNextDay} variant="outline" size="sm">
                        Next →
                    </Button>
                    <span className="ml-2 font-semibold">{formatDate(selectedDate)}</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {timeSlots.map(hour => {
                        const booking = getBookingForSlot(hour)
                        const isCurrent = isCurrentTimeSlot(hour)
                        
                        return (
                            <div
                                key={hour}
                                className={`
                                    flex items-center gap-4 p-3 rounded-lg border transition-colors
                                    ${isCurrent ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' : 'border-gray-200'}
                                    ${booking ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200 hover:bg-green-100 cursor-pointer'}
                                `}
                                onClick={() => !booking && handleSlotClick(hour)}
                            >
                                <div className="w-24 font-semibold">
                                    {hour.toString().padStart(2, '0')}:00
                                </div>
                                <div className="flex-1">
                                    {isCurrent && (
                                        <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded mr-2">
                                            Current Time
                                        </span>
                                    )}
                                    {booking ? (
                                        <div>
                                            <div className="font-semibold text-red-700">{booking.title}</div>
                                            <div className="text-sm text-gray-600">
                                                {new Date(booking.startTime).toLocaleTimeString('en-US', { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })} - {new Date(booking.endTime).toLocaleTimeString('en-US', { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-green-700 font-medium">
                                            Available
                                            {onCreateBooking && (
                                                <span className="text-sm text-gray-500 ml-2">(click to book)</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className={`w-20 text-right font-semibold ${booking ? 'text-red-600' : 'text-green-600'}`}>
                                    {booking ? 'Booked' : 'Free'}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
