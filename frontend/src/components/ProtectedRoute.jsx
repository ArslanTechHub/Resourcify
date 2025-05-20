import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ isAuthenticated, children, redirect }) => {
    return isAuthenticated ? children : <Navigate to={redirect} />;
};

export default ProtectedRoute;