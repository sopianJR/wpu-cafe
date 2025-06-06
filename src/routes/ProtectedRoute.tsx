import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface PropTypes {
    children: ReactNode;
}

const ProtectedRoute = (props: PropTypes) => {
    const { children } = props;
    const auth = localStorage.getItem('auth');

    const currentRoute = useLocation().pathname;

    if (!auth && currentRoute !== '/login') {
        return <Navigate to='/login' replace/>;
    }

    if (auth && currentRoute === '/login') {
        return <Navigate to="/oreders" />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;