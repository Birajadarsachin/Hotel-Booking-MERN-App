import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function IndexPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/places').then(response => {
      setData(response.data);
    }).catch(error => {
      console.error("Error fetching data:", error);
    });
  }, []);

  return (
    <div className='mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {data.length > 0 && data.map(place => (
        <Link className='transition-transform transform hover:scale-105 bg-gray-100 rounded-xl p-3' to={'/place/' + place._id} key={place._id}>
          <div className='bg-gray-500 cursor-pointer mb-2 rounded-2xl flex items-center justify-center overflow-hidden h-48 w-full'>
            {place.photos?.[0] && (
              <img
                className='object-cover w-full h-full'
                src={`http://localhost:4000/uploads/${place.photos[0]}`}
                alt={place.title}
              />
            )}
          </div>
          <h3 className='font-bold'>{place.address}</h3>
          <h2 className='text-sm text-gray-500'>{place.title}</h2>
          <div className='mt-1'>
            <span className='font-bold'>{place.currency}{place.cost}</span> per trip
          </div>
        </Link>
      ))}
    </div>
  );
}

export default IndexPage;
