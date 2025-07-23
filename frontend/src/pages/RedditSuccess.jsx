import { useEffect, useState } from 'react';
import axios from 'axios';

const RedditSuccess = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/api/reddit/me', { withCredentials: true })
      .then(res => {
        console.log('Reddit user data:', res.data);
        setUser(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch Reddit user:', err);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-white">
      <h1 className="text-2xl mb-4">Reddit Login Successful</h1>
      {user ? (
        <div className="bg-cyan-900 p-6 rounded-xl">
          <p className="text-lg">👤 Reddit Username: {user.profile.name}</p>
        </div>
      ) : (
        <p>Loading Reddit user info...</p>
      )}
    </div>
  );
};

export default RedditSuccess;
