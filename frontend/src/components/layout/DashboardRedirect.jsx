import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DashboardRedirect = () => {
  const user = useSelector((state) => state.auth.user);

  if (!user) return <Navigate to="/auth/login" />;
  if(user.role === "doctor"){
    console.log(user.role);
  }
  return user.role === "doctor"
    ? <Navigate to="/dashboard/doctor" />
    : <Navigate to="/dashboard/patient" />;
};

export default DashboardRedirect;
