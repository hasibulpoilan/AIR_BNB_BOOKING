import { useState } from "react";
import axios from 'axios';

export default function photosUploader({ addedPhotos, onChange }) {

    const [photoLink, setPhotoLink] = useState('');


    const UPLOAD_BASE_URL = 'http://localhost:4000/uploads/';

    async function addPhotoByLink(ev) {
        ev.preventDefault();

        const { data: filename } = await axios.post('http://localhost:4000/upload-by-link', { link: photoLink });
        onChange(prev => {
            return [...prev, filename];
        })
        setPhotoLink('');
    }

    function uploadPhoto(ev) {
        const files = ev.target.files;
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i]);
        }
        axios.post('http://localhost:4000/upload', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(response => {
            const { data: filenames } = response;
            console.log("Received filenames from server:", filenames);
            onChange(prev => {
                return [...prev, ...filenames];
            });
        })
    }
    function removePhoto(ev,filename) {
        ev.preventDefault();
        onChange([...addedPhotos.filter(photo => photo !== filename)]);
    }
    function selectAsMainPhoto(ev,filename){
        ev.preventDefault();
        const addedPhotoWithoutSelected = addedPhotos.filter(photo => photo !== filename);
        const newAddedPhotos = [filename,...addedPhotoWithoutSelected];
        onChange(newAddedPhotos);
    }
    return (
        <>
            <div className="flex gap-2">
                {/* <input type="text" value={photoLink} onChange={ev => setPhotoLink(ev.target.value)} placeholder={'Add using a link .....jpg'} /> */}
                {/* <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">Add&nbsp;photo</button> */}
            </div>
            <div className="mt-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
    {addedPhotos.length > 0 && addedPhotos.map((link, index) => (
        <div className="relative h-32 flex justify-center items-center" key={index}>
            <img
                className="rounded-2xl w-full h-full object-cover"
                src={`${UPLOAD_BASE_URL}${link}`}
                alt="Uploaded place"
            />
            {/* Trash Button */}
            <button
                onClick={(ev) => removePhoto(ev, link)}
                className="absolute bottom-2 left-2 bg-white p-1 rounded-full shadow-md hover:bg-red-100"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 text-red-500"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9L14.4 18m-4.8 0L9.26 9m9.96-3.21c.34.05.68.11 1.02.17m-1.02-.17L18.16 19.67a2.25 2.25 0 0 1-2.24 2.08H8.08a2.25 2.25 0 0 1-2.24-2.08L4.77 5.79m14.46 0a48.11 48.11 0 0 0-3.48-.4m-12 .56c.34-.06.68-.11 1.02-.17m0 0a48.11 48.11 0 0 1 3.48-.4m7.5 0v-.92c0-1.18-.91-2.16-2.09-2.2a51.96 51.96 0 0 0-3.32 0c-1.18.04-2.09 1.02-2.09 2.2v.92m7.5 0a48.67 48.67 0 0 0-7.5 0"
                    />
                </svg>
            </button>

            <button
                onClick={(ev) => selectAsMainPhoto(ev, link)}
                className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-yellow-100"
            >
                {link === addedPhotos[0] ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-5 h-5 text-yellow-500"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z"
                            clipRule="evenodd"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5 text-gray-500"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.5a.562.562 0 0 1 1.04 0l2.125 5.11a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                        />
                    </svg>
                )}
            </button>
        </div>
    ))}
    <label className="h-32 cursor-pointer border-2 border-dashed border-gray-400 bg-transparent rounded-2xl p-8 text-2xl text-gray-600 flex justify-center items-center gap-1 hover:bg-gray-100 transition">
        <input type="file" multiple className="hidden" onChange={uploadPhoto} />
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-8 h-8"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
            />
        </svg>
        Upload
    </label>
</div>

            </>
    )
}