import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingWidget from "../BookingWidget";

export default function PlacePage() {
    const [place, setPlace] = useState(null);
    const { id } = useParams();
    const [showAllPhotos, setShowAllPhotos] = useState(false);

    useEffect(() => {
        if (!id) return;

        axios
            .get(`/places/${id}`)
            .then((response) => {
                setPlace(response.data);
            })
            .catch((error) => {
                console.error("Error fetching place:", error);
            });
    }, [id]);
    

    if (!place) {
        return <div className="text-center p-4">Loading...</div>;
    }

    if (showAllPhotos) {
        return (
            <div className="absolute inset-0 bg-black text-white min-w-full min-h-screen">
                <div className="p-8 gap-4 bg-black">
                    <div>
                        <h2 className="text-3xl mr-36">Photos of {place.title}</h2>
                        <button
                            onClick={() => setShowAllPhotos(false)}
                            className="flex gap-2 py-2 px-4 rounded-2xl fixed top-8 right-12 shadow shadow-black-500 bg-white text-black"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18 18 6M6 6l12 12"
                                />
                            </svg>
                            Close photos
                        </button>
                    </div>
                    {place?.addedphotos?.length > 0 ? (
                        place.addedphotos.map((photo, index) => (
                            <div key={index} className="my-4">
                                <img
                                    src={`http://localhost:4000/uploads/${photo}`}
                                    alt={`Photo ${index + 1}`}
                                    className="w-full object-cover"
                                />
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500">
                            No Photos Available
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mt-4 bg-gray-100 -mx-8 px-8">
                <h1 className="text-3xl text-center">{place.title}</h1>
                <a
                    className="my-3 block font-semibold underline gap-1 flex"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://maps.google.com/?q=${place.address}`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                        />
                    </svg>
                    {place.address}
                </a>
                <div className="relative">
                    <div className="relative grid gap-2 sm:grid-cols-1 lg:grid-cols-[2fr_1fr] rounded-2xl">
                        <div className="h-full">
                            {place.addedphotos?.[0] ? (
                                <img
                                    onClick={() => setShowAllPhotos(true)}
                                    src={`http://localhost:4000/uploads/${place.addedphotos[0]}`}
                                    alt={place.title}
                                    className="cursor-pointer w-full h-full object-cover rounded-md"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
                                    <span className="text-gray-500">No Image Available</span>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-rows-2 gap-2">
                            {place.addedphotos?.[1] ? (
                                <img
                                    onClick={() => setShowAllPhotos(true)}
                                    src={`http://localhost:4000/uploads/${place.addedphotos[1]}`}
                                    alt={place.title}
                                    className="cursor-pointer w-full h-full object-cover rounded-md"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
                                    <span className="text-gray-500">No Image Available</span>
                                </div>
                            )}

                            {place.addedphotos?.[2] ? (
                                <img
                                    onClick={() => setShowAllPhotos(true)}
                                    src={`http://localhost:4000/uploads/${place.addedphotos[2]}`}
                                    alt={place.title}
                                    className="cursor-pointer w-full h-full object-cover rounded-md"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
                                    <span className="text-gray-500">No Image Available</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => setShowAllPhotos(true)}
                        className="flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow-md shadow-gray-500"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                            />
                        </svg>
                        Show more Photos
                    </button>
                </div>
                <div className="mt-8 mb-8 gap-8 grid grid-cols-1 md:grid-cols-[2fr_1fr]">
                    <div>
                        <div className="my-4">{place.description}</div>
                        Check-in: {place.checkin}
                        <br />
                        Check-out: {place.checkout}
                        <br />
                        Max number of guest: {place.maxguests}
                    </div>
                    <BookingWidget place={place} />
                </div>
            </div>
            <div className="bg-white -mx-8 px-8 py-8 border-t">
                <div>
                    <h2 className="font-semibold text-2xl">Extra info</h2>
                </div>
                <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">
                    {place.extrainfo}
                </div>
            </div>
        </div>
    );
}
