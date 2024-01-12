import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Message from "../components/Message";
import PageNav from "../components/PageNav";
import { useFakeAuth } from "../context/FakeAuthContext";
import styles from "./Login.module.css";
import Button from "../components/Button";

export default function Login() {
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");
  const emailRef = useRef();

  const { login, isAuthenticated, err } = useFakeAuth();
  const navigateFn = useNavigate();

  useEffect(() => {
    // use replace in 2 places : 1. second option of navigateFn() and 2. on <Route path="app/cities" replace />
    if (isAuthenticated) navigateFn("/app", { replace: true }); // replace current login page by app/cities page. (no add login page into history of browser)
  }, [isAuthenticated, navigateFn]);

  function handleClickLogin(e) {
    e.preventDefault();
    if (email && password) login(email, password);
  }
  useEffect(() => {
    if (err) {
      setEmail("");
      setPassword("");
      emailRef.current.focus();
    }
  }, [err]);

  return (
    <main className={styles.login}>
      <PageNav />
      {err && <Message message={err} />}
      <form className={styles.form} onSubmit={handleClickLogin}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input type="email" id="email" ref={emailRef} onChange={(e) => setEmail(e.target.value)} value={email} />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} value={password} />
        </div>

        <div>
          <Button typeClass="primary">Login</Button>
        </div>
      </form>
    </main>
  );
}
