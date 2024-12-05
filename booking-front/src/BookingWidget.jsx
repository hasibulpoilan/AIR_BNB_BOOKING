import { useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";

export default function BookingWidget({ place }) {
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [numberOfGuest, setNumberOfGuest] = useState(1);
    const [redirect, setRedirect] = useState("");

    let numberOfNights = 0;
    if (checkIn && checkOut) {
        numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    }

    async function bookThisPlace() {
        try {
            const response = await axios.post("/bookings", {
                checkIn,
                checkOut,
                numberOfGuest,
                name,
                phone,
                place: place.id,
                price: numberOfNights * place.price,
            });
            const bookingId = response.data.id;
            setRedirect(`/account/bookings/${bookingId}`);
        } catch (error) {
            console.error("Booking failed:", error);
            alert("Booking failed. Please try again.");
        }
    }

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div className="bg-white shadow p-4 rounded-2xl">
            <div className="text-2xl text-center">
                Price: ${place.price} / per night
            </div>
            <div className="border rounded-2xl mt-4">
                <div className="flex">
                    <div className="px-4 py-3">
                        <label>Check in: </label>
                        <input
                            type="date"
                            value={checkIn}
                            onChange={(ev) => setCheckIn(ev.target.value)}
                        />
                    </div>
                    <div className="px-4 py-3 border-l">
                        <label>Check out: </label>
                        <input
                            type="date"
                            value={checkOut}
                            onChange={(ev) => setCheckOut(ev.target.value)}
                        />
                    </div>
                </div>
                <div className="px-4 py-3 border-t">
                    <label>Number of guests: </label>
                    <input
                        type="number"
                        value={numberOfGuest}
                        onChange={(ev) => setNumberOfGuest(ev.target.value)}
                    />
                </div>
                {numberOfNights > 0 && (
                    <div className="px-4 py-3 border-t">
                        <label>Your full name: </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(ev) => setName(ev.target.value)}
                        />
                        <label>Phone number: </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(ev) => setPhone(ev.target.value)}
                        />
                    </div>
                )}
            </div>
            <button
                onClick={bookThisPlace}
                className="primary mt-4"
                disabled={!checkIn || !checkOut || !name || !phone || numberOfNights <= 0}
            >
                Book this place
                {numberOfNights > 0 && <span>${numberOfNights * place.price}</span>}
            </button>
        </div>
    );
}
