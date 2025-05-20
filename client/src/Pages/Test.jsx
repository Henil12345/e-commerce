import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TestFetch = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('https://e-commerce-production-21b3.up.railway.app/api/test', {
      withCredentials: true, // only if your backend sets cookies
    })
    .then((res) => {
      setMessage(res.data.message || 'Success');
    })
    .catch((err) => {
      console.error('Error fetching data:', err);
      setError('Failed to fetch from Railway backend');
    });
  }, []);

  return (
    <div className="p-4 text-center h-screen bg-red-700">
      <h2 className="text-xl font-bold mb-2">Railway Backend Test</h2>
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default TestFetch;
