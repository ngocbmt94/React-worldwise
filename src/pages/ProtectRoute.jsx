import { useEffect } from "react";
import { useFakeAuth } from "../context/FakeAuthContext";
import { useNavigate } from "react-router-dom";

function ProtectRoute({ children }) {
  const { isAuthenticated } = useFakeAuth();
  const navigateFn = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigateFn("/");
  }, [isAuthenticated, navigateFn]);

  if (!isAuthenticated) return null;
  return children;
}

export default ProtectRoute;
