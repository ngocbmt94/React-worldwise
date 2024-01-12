import { useNavigate } from "react-router-dom";
import { useFakeAuth } from "../context/FakeAuthContext";
import styles from "./User.module.css";

function User() {
  const { user, logout } = useFakeAuth();
  const navigateFn = useNavigate();

  function handleClick() {
    logout();

    navigateFn("/");
  }

  return (
    <div className={styles.user}>
      <img src={user.avatar} alt={user.name} />
      <span>Welcome, {user.name}</span>
      <button onClick={handleClick}>Logout</button>
    </div>
  );
}

export default User;
