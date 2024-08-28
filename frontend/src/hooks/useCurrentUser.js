import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchUser = (token) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (token) {
          const res = await axios.get('http://localhost:8021/api/users/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.data?.data) {
            setUser(res.data.data);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [token]);

  return { user, loading, error };
};

export default useFetchUser;
