import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Perks from "../Perks";
import PhotosUploader from "../PhotosUploader";
import axios from 'axios';

export default function PlacesPage() {
    const { action } = useParams();
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [price, setPrice] = useState(100);
    const [redirectToPlacesList, setRedirectToPlacesList] = useState(false);
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/places/${id}`).then(response => {
            console.log("Fetched place data:", response.data);
            const { data } = response;
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.photos);
            console.log(data.addedphotos);

            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setPrice(data.price);
        })
    }, [id]);

    useEffect(() => {
        axios.get('/user-places').then(({ data }) => setPlaces(data));
    }, []);

    function inputHeader(text) {
        return <h2 className="text-2xl mt-4">{text}</h2>;
    }

    function inputDescription(text) {
        return <p className="text-gray-500 text-sm">{text}</p>;
    }

    function preInput(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        );
    }

    function handleDelete(placeId) {
        if (window.confirm("Are you sure you want to delete this place?")) {
            axios.delete(`http://localhost:4000/places/${placeId}`)
                .then(() => {
                    setPlaces((prevPlaces) => prevPlaces.filter(place => place.id !== placeId));
                    alert("Place deleted successfully.");
                })
                .catch(err => {
                    console.error("Error deleting place:", err);
                    alert("Failed to delete the place. Please try again.");
                });
        }
    }
    
    

    async function addNewPlace(ev) {
        ev.preventDefault();
        try {
            await axios.post('http://localhost:4000/places', {
                title, address, addedPhotos,
                description, perks, extraInfo,
                checkIn, checkOut, maxGuests, price,
            });
            setRedirectToPlacesList(true);
        } catch (err) {
            console.error("Error adding place:", err);
        }
    }

    if (redirectToPlacesList) {
        return <Navigate to="/account/places" />;
    }

    return (
        <div>
            {action !== 'new' && (
                <div>
                    <div className="text-center">
                        <Link
                            className="gap-1 inline-flex bg-primary text-white py-2 px-6 rounded-full"
                            to="/account/places/new"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4.5v15m7.5-7.5h-15"
                                />
                            </svg>
                            Add new places
                        </Link>
                    </div>
                    <div className="mt-4">
                        {places.length > 0 ? (
                            places.map((place) => (
                                <Link to={`/account/places/${place.id}`}  className="cursor-pointer flex items-start border p-4 rounded-lg mb-4"> {console.log(place.addedphotos)}
                                   
                                    {place.addedphotos && place.addedphotos.length > 0 ? (
                                        <img
                                            src={`http://localhost:4000/uploads/${place.addedphotos[0]}`}
                                            alt={place.title}
                                            
                                            className="w-34 h-40 object-cover rounded-md mr-4"
                                        />
                                    ) : (
                                        <div className="w-34 h-40 bg-gray-200 rounded-md mr-4 flex items-center justify-center">
                                            <span className="text-gray-500 text-sm">No Photo</span>
                                        </div>
                                    )}


                                    
                                    <div>
                                        <h2 className="text-xl font-semibold">{place.title}</h2>
                                        <p className="text-gray-700">{place.address}</p>
                                        <p className="text-sm mt-2">{place.description}</p>

                                        <p className="text-sm mt-4">
                                            <strong>Check-In:</strong> {place.checkin || "Not specified"}
                                        </p>
                                        <p className="text-sm">
                                            <strong>Check-Out:</strong> {place.checkout || "Not specified"}
                                        </p>
                                        <p className="text-sm">
                                            <strong>Max Guests:</strong> {place.maxguests || "Not specified"}
                                        </p>
                                        <p className="text-sm">
                                            <strong>Perks:</strong> {place.perks || "Not specified"}
                                        </p>
                                        <p className="text-sm">
                                            <strong>Price:</strong> {place.price || "Not specified"}
                                        </p>

                                      
                                        
                                      
                                        <button
                                            onClick={() => handleDelete(place.id)}
                                            className="text-red-500 mt-2 inline-block ml-4"
                                        >
                                            Delete
                                        </button>

                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p>No places added yet.</p>
                        )}
                    </div>


                </div>
            )}
            {action === 'new' && (
                <div>
                    <form onSubmit={addNewPlace}>
                        {preInput(
                            'Title',
                            'Title for your place. Should be short and catchy as an advertisement.'
                        )}
                        <input
                            type="text"
                            value={title}
                            onChange={(ev) => setTitle(ev.target.value)}
                            placeholder="e.g., My Lovely Apartment"
                        />
                        {preInput('Address', 'Address to this place')}
                        <input
                            type="text"
                            value={address}
                            onChange={(ev) => setAddress(ev.target.value)}
                            placeholder="Address"
                        />
                        {preInput('Photos', 'More = better')}
                        <PhotosUploader
                            addedPhotos={addedPhotos}
                            onChange={setAddedPhotos}
                        />
                        {preInput('Description', 'Description of the place')}
                        <textarea
                            value={description}
                            onChange={(ev) => setDescription(ev.target.value)}
                        />
                        {preInput('Perks', 'Select all the perks of your place')}
                        <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mt-2">
                            <Perks selected={perks} onChange={setPerks} />
                        </div>
                        {preInput('Extra Info', 'House rules, etc.')}
                        <textarea
                            value={extraInfo}
                            onChange={(ev) => setExtraInfo(ev.target.value)}
                        />
                        {preInput(
                            'Check-in & out times',
                            'Add check-in and out times. Remember to have some cleaning time between guests.'
                        )}
                        <div className="grid gap-2 sm:grid-cols-3">
                            <div>
                                <h3 className="mt-2 -mb-1">Check-in time</h3>
                                <input
                                    type="text"
                                    placeholder="14:00"
                                    value={checkIn}
                                    onChange={(ev) =>
                                        setCheckIn(ev.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">Check-out time</h3>
                                <input
                                    type="text"
                                    placeholder="11:00"
                                    value={checkOut}
                                    onChange={(ev) =>
                                        setCheckOut(ev.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <h3 className="mt-2 -mb-1">
                                Max number of guests
                            </h3>
                            <input
                                type="number"
                                value={maxGuests}
                                onChange={(ev) =>
                                    setMaxGuests(ev.target.value)
                                }
                            />
                        </div>
                        <div>
                            <h3 className="mt-2 -mb-1">
                                Price per night
                            </h3>
                            <input
                                type="number"
                                value={price}
                                onChange={(ev) =>
                                    setPrice(ev.target.value)
                                }
                            />
                        </div>
                        <div>
                            <button className="primary my-4">Save</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
