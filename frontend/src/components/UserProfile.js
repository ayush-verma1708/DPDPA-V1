import React from 'react';
import useCurrentUser from '../hooks/useCurrentUser';

const UserProfile = () => {
  const token = localStorage.getItem('token'); // Adjust as needed
  const { user, loading, error } = useCurrentUser(token);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>User Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      {/* Display other user details */}
    </div>
  );
};

export default UserProfile;
