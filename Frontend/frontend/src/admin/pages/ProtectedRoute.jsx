import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/admin/check-auth', {
      withCredentials: true
    }).then(res => {
      if (res.data.authenticated) {
        setAuth(true);
      } else {
        setAuth(false);
      }
    }).catch(() => setAuth(false));
  }, []);

  if (auth === null) return <div>Loading...</div>;
  return auth ? children : <Navigate to="/admin-login" />;
};

export default ProtectedRoute;
