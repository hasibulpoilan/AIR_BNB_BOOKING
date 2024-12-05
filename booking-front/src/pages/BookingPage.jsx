import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BookingPage = () => {
  const { id } = useParams(); 
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:4000/bookings/${id}`)
      .then(response => {
        setBooking(response.data); 
      })
      .catch(error => {
        console.error('Error fetching booking details:', error);
      });
  }, [id]); 

  return (
    <div className="booking-page-container">
      {booking ? (
        <div className="booking-details-card">
          <h1 className="booking-title">Booking Details</h1>
          <div className="booking-detail">
            <h3>Place:</h3>
            <p>{booking.title}</p>
          </div>
          <div className="booking-detail">
            <h3>Dates:</h3>
            <p>{booking.checkin} <b> &rarr; </b> {booking.checkout}</p>
          </div>
          <div className="booking-detail">
            <h3>Guests:</h3>
            <p>{booking.numberofguest}</p>
          </div>
          <div className="booking-detail">
            <h3>Name:</h3>
            <p>{booking.name}</p>
          </div>
          <div className="booking-detail">
            <h3>Phone:</h3>
            <p>{booking.phone}</p>
          </div>
          <div className="booking-detail">
            <h3>Price:</h3>
            <p>${booking.price}</p>
          </div>
        </div>
      ) : (
        <p>Loading booking details...</p>
      )}
    </div>
  );
};

export default BookingPage;
