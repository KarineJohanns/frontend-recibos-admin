import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const userSession = localStorage.getItem('userSession');

  return userSession ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
