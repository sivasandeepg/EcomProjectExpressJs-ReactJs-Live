import React, { useEffect, useState } from 'react';
import AuthServices from '../../../services/customer/AuthServices'; // Adjust path if necessary
 
const UserProfile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await AuthServices.getProfile();
        setProfile(data.user);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {profile.name}</h1>
      <p>Email: {profile.email}</p>
    </div>
  );
};

export default UserProfile;
