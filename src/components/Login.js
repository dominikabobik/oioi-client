import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import styles from "./Login.module.css";

const Login = () => {
  const router = useRouter();
  const [dbError, setDbError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();

  const onEmailChangeHandler = useCallback((event) => {
    setEmail(event.target.value);
  }, []);

  const onPasswordChangeHandler = useCallback(
    (event) => {
      setPassword(event.target.value);
    },
    [setPassword]
  );

  const onLoginHandler = useCallback(async () => {
    console.log("Login ", email, password);
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setLoading(false);
      setDbError(error.message);
      return;
    }
    if (data.session) {
      router.push("/");
    }
  }, [email, password, router]);

  useEffect(() => {
    const enterHandler = async (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        onLoginHandler();
      }
    };
    document.addEventListener("keydown", enterHandler);
    return () => {
      document.removeEventListener("keydown", enterHandler);
    };
  }, [email, onLoginHandler, password]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.logoContainer}>
        <a href={"/about"} className={styles.linkToAbout}>
          <img src="logo.png" className={styles.logo} alt="logo" />
          <h1 className={styles.title}>Modeler</h1>
        </a>
      </div>
      <div className={styles.content}>
        <input
          className={styles.inputBox}
          placeholder="Email"
          onChange={onEmailChangeHandler}
          value={email}
          type="email"
        />
        <input
          className={styles.inputBox}
          placeholder="Password"
          onChange={onPasswordChangeHandler}
          value={password}
          type="password"
        />
        <div className={styles.errorText}>{dbError}</div>
        {loading && <Loading type="gradient" color="success" />}
        <button className={styles.button} onClick={onLoginHandler}>
          Login
        </button>
        <button
          className={styles.buttonSignup}
          onClick={() => {
            router.push("/signup");
          }}
        >
          Or signup
        </button>
      </div>
    </div>
  );
};

export default Login;
