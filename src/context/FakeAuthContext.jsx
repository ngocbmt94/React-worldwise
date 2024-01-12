import { createContext, useContext, useReducer } from "react";

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const AuthContext = createContext();
const initState = {
  user: null,
  isAuthenticated: false,
  err: "",
};

function reducer(curState, action) {
  switch (action.type) {
    case "login":
      return { ...curState, user: action.payload, isAuthenticated: true };

    case "logout":
      return initState;

    case "err":
      console.error("errrr");
      return { ...curState, err: action.payload };
    default:
      throw new Error("ACTION UNKNOWN");
  }
}
function FakeAuthProvider({ children }) {
  const [{ user, isAuthenticated, err }, dispatch] = useReducer(reducer, initState);

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) dispatch({ type: "login", payload: FAKE_USER });
    else dispatch({ type: "err", payload: "Your email or password is not correct. Please try again!" });
  }

  function logout() {
    dispatch({ type: "logout" });
  }
  return <AuthContext.Provider value={{ user, isAuthenticated, err, login, logout }}>{children}</AuthContext.Provider>;
}

function useFakeAuth() {
  const value = useContext(AuthContext);
  if (value === undefined) throw new Error("Authen context was used out side Auth Provider");

  return value;
}
export { FakeAuthProvider, useFakeAuth };
