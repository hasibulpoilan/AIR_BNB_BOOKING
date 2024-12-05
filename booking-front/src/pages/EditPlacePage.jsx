import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditPlacePage() {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [place, setPlace] = useState({
    title: '',
    address: '',
    addedPhotos: [], 
    description: '',
    perks: '',
    extraInfo: '',
    checkIn: '',
    checkOut: '',
    maxGuests: 0,
    price:100,
  });

  useEffect(() => {
    axios.get(`http://localhost:4000/places/${id}`)
      .then((response) => {
        setPlace(response.data);
      })
      .catch((error) => {
        console.error('Error fetching place data:', error);
      });
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:4000/places/${place.id}`, {
        ...place, 
      });

      console.log('Place updated:', response.data);
      navigate(`/account/places/${place.id}`);
    } catch (error) {
      console.error('Error updating place:', error);
    }
  }

  const handleChange = (e) => {
    setPlace({
      ...place,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h1>Edit Place</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={place.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={place.address}
            onChange={handleChange}
          />
        </div>
        {Array.isArray(place.addedPhotos) && place.addedPhotos.length > 0 ? (
            <img
              src={place.addedPhotos[0]}
              alt="Place"
              style={{ width: '100%', height: 'auto' }}
            />
          ) : (
            <p>No photo available</p>
          )}
     <div>
  <label>Added Photos :</label>
  <input
    type="text"
    name="addedPhotos"
    value={(place.addedPhotos || []).join(', ')} 
    onChange={(e) =>
      setPlace({
        ...place,
        addedPhotos: e.target.value.split(',').map((photo) => photo.trim()), 
      })
    }
  />
</div>

        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={place.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Perks:</label>
          <textarea
            name="perks"
            value={place.perks}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Extra Info:</label>
          <textarea
            name="extraInfo"
            value={place.extraInfo}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Check-in Time:</label>
          <input
            type="time"
            name="checkIn"
            value={place.checkIn}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Check-out Time:</label>
          <input
            type="time"
            name="checkOut"
            value={place.checkOut}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Max Guests:</label>
          <input
            type="number"
            name="maxGuests"
            value={place.maxGuests}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>price :</label>
          <input
            type="number"
            name="price"
            value={place.price}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditPlacePage;
