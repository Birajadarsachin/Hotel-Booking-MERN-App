import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AccountPageCard from '../components/AccountPageCard';
import axios from 'axios';

function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const { data } = await axios.get('/userplaces');
        setPlaces(data);
      } catch (err) {
        console.error(err); 
        setError('Failed to fetch places.');
      }
    };

    fetchPlaces();
  }, []);

  return (
    <>
      <AccountPageCard />
      <div className="text-center">
        <Link
          className="hover:bg-gray-800 transition hover:scale-105 hover:delay-50 inline-flex bg-black text-white rounded-2xl p-2 w-full max-w-sm mt-2 gap-2"
          to={'/account/places/new'}
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
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          Add new Place
        </Link>
      </div>
      <div className="mt-4 px-8">
        {error && <p className="text-red-500">{error}</p>}
        {places.length > 0 &&
          places.map((place) => (
            <Link
              to={'/account/places/' + place._id}
              key={place._id}
              className="transition hover:scale-105 hover:delay-50 bg-gray-200 cursor-pointer p-4 rounded-2xl my-4 flex flex-col items-start "
            >
              <div className="w-full h-48 overflow-hidden rounded-lg mb-2">
                {place.photos.length > 0 && (
                  <img
                    className="w-full h-full object-cover"
                    src={`http://localhost:4000/uploads/${place.photos[0]}`}
                    alt={place.title}
                  />
                )}
              </div>
              <h3 className="text-lg font-semibold">{place.title}</h3>
              <p className="text-gray-700 mt-2">{place.description}</p>
            </Link>
          ))}
      </div>
    </>
  );
}

export default PlacesPage;