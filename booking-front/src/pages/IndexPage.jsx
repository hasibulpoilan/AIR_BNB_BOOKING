import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function IndexPage() {
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        axios
            .get('http://localhost:4000/places')
            .then((response) => {
                console.log('Fetched Places:', response.data);
                setPlaces(response.data);
            })
            .catch((error) => {
                console.error('Error fetching places:', error);
            });
    }, []);
  
    

    const defaultImage = 'http://localhost:4000/uploads/default.jpg';

    return (
        <div className="container">
            <h1 className="page-title">Explore Amazing Places</h1>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {places.map((place) => (
                    <Link
                        to={`/places/${place.id}`}
                        key={place.id}
                        className="card hover:shadow-xl transition-all duration-300"
                    >
                        <img
                            src={`http://localhost:4000/uploads/${
                                place.addedphotos?.[0] || defaultImage
                            }`}
                            alt={place.title || 'Place Image'}
                            className="w-full h-40 object-cover rounded-t-md"
                        />
                        <div className="card-info p-4">
                            <h3 className="card-title text-lg font-bold text-gray-800 truncate">
                                {place.title || 'Untitled Place'}
                            </h3>
                            <p className="card-price text-red-600 font-semibold">
                                ${place.price !== undefined ? place.price : 'N/A'}
                            </p>
                            <p className="card-description text-gray-600 truncate">
                                {place.address || 'Address not available'}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
