"use client"

import { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

const MAX_ROOM_NAME_LENGTH = 50;
const MIN_CAPACITY = 1;
const MAX_CAPACITY = 100;

const CreateRoom = ({ onCreateRoom }: {onCreateRoom: (room: string, capacity: number) => void}) => 
{
    const [room, setRoom] = useState("")
    const [capacity, setCapacity] = useState<number | ''>('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [validationErrors, setValidationErrors] = useState({
        room: '',
        capacity: ''
    })

    // Validation logic
    const validateForm = () => {
        const errors = { room: '', capacity: '' };
        let isValid = true;

        // Room name validation
        if (!room.trim()) {
            errors.room = 'Raumname darf nicht leer sein';
            isValid = false;
        } else if (room.length > MAX_ROOM_NAME_LENGTH) {
            errors.room = `Raumname darf maximal ${MAX_ROOM_NAME_LENGTH} Zeichen lang sein`;
            isValid = false;
        }

        // Capacity validation
        const capacityNum = typeof capacity === 'number' ? capacity : 0;
        if (capacity === '' || capacityNum === 0) {
            errors.capacity = 'Kapazität muss angegeben werden';
            isValid = false;
        } else if (capacityNum < MIN_CAPACITY) {
            errors.capacity = `Kapazität muss mindestens ${MIN_CAPACITY} sein`;
            isValid = false;
        } else if (capacityNum > MAX_CAPACITY) {
            errors.capacity = `Kapazität darf maximal ${MAX_CAPACITY} sein`;
            isValid = false;
        }

        setValidationErrors(errors);
        return isValid;
    };

    const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= MAX_ROOM_NAME_LENGTH) {
            setRoom(value);
            setValidationErrors(prev => ({ ...prev, room: '' }));
            setError('');
        }
    };

    const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setCapacity('');
        } else {
            const numValue = parseInt(value);
            if (!isNaN(numValue)) {
                setCapacity(numValue);
                // Real-time validation for capacity
                if (numValue > MAX_CAPACITY) {
                    setValidationErrors(prev => ({ 
                        ...prev, 
                        capacity: `Kapazität darf maximal ${MAX_CAPACITY} sein` 
                    }));
                } else if (numValue < MIN_CAPACITY) {
                    setValidationErrors(prev => ({ 
                        ...prev, 
                        capacity: `Kapazität muss mindestens ${MIN_CAPACITY} sein` 
                    }));
                } else {
                    setValidationErrors(prev => ({ ...prev, capacity: '' }));
                }
            }
        }
        setError('');
    };

    const handleCreateRoom = async () => {
        setError('');
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/room", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    name: room, 
                    capacity: capacity, 
                    occupied: false 
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create room');
            }

            // Success
            setSuccess('Raum erfolgreich erstellt!');
            const roomName = room;
            const roomCapacity = typeof capacity === 'number' ? capacity : 0;
            
            setRoom("");
            setCapacity('');
            
            // Call callback after a brief moment
            setTimeout(() => {
                onCreateRoom(roomName, roomCapacity);
                setSuccess('');
            }, 1000);

        } catch (err) {
            setError('Fehler beim Erstellen des Raums. Bitte versuchen Sie es erneut.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setRoom('');
        setCapacity('');
        setError('');
        setSuccess('');
        setValidationErrors({ room: '', capacity: '' });
    };

    const isFormValid = room.trim() !== '' && capacity !== '' && capacity !== 0 && 
                        !validationErrors.room && !validationErrors.capacity;

    return (
        <div data-testid="create-room-form">
            <div className="space-y-2 mb-2">
                <Input 
                    type="text" 
                    placeholder="Name" 
                    value={room} 
                    onChange={handleRoomChange}
                    disabled={isLoading}
                    data-testid="room-name-input"
                    aria-label="Raumname"
                /> 
                {validationErrors.room && (
                    <div className="text-sm text-red-600" data-testid="room-name-error">
                        {validationErrors.room}
                    </div>
                )}
                {room.length > 0 && (
                    <div className="text-xs text-gray-500" data-testid="room-name-length">
                        {room.length}/{MAX_ROOM_NAME_LENGTH} Zeichen
                    </div>
                )}
            </div>

            <div className="space-y-2 mb-2">
                <Input 
                    type="number" 
                    placeholder="Kapazität" 
                    value={capacity === '' ? '' : capacity} 
                    onChange={handleCapacityChange}
                    disabled={isLoading}
                    data-testid="room-capacity-input"
                    aria-label="Raumkapazität"
                    min={MIN_CAPACITY}
                    max={MAX_CAPACITY}
                />
                {validationErrors.capacity && (
                    <div className="text-sm text-red-600" data-testid="room-capacity-error">
                        {validationErrors.capacity}
                    </div>
                )}
            </div>

            {error && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded mb-2" data-testid="error-message">
                    {error}
                </div>
            )}

            {success && (
                <div className="text-sm text-green-600 bg-green-50 p-2 rounded mb-2" data-testid="success-message">
                    {success}
                </div>
            )}

            <div className="flex gap-2">
                <Button 
                    onClick={handleCreateRoom}
                    disabled={isLoading}
                    data-testid="create-room-button"
                    className="flex-1"
                    style={{ opacity: (!isFormValid && !isLoading) ? 0.5 : 1 }}
                >
                    {isLoading ? 'Erstelle...' : 'Create Room'}
                </Button>
                
                <Button 
                    onClick={handleClear}
                    disabled={isLoading}
                    variant="outline"
                    data-testid="clear-button"
                >
                    Löschen
                </Button>
            </div>
        </div>
    );
}

export default CreateRoom