import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/VendorAuthContext';
import Loader from '../components/shared/Loader';

const VendorPrivateRoute = ({ children }) => {
  const { vendor, loading } = useAuth();

  if (loading) return <Loader />;

  if (!vendor) return <Navigate to="/vendor/login" replace />;

  return children;
};

export default VendorPrivateRoute;
