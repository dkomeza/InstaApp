import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SignInForm() {
  const { signIn } = useAuth();

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!usernameRef.current || !passwordRef.current) {
      return;
    }

    try {
      await signIn(usernameRef.current.value, passwordRef.current.value);
      navigate("/");
    } catch (error: any) {
      setError(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="error">{error}</div>
      <div className="form__group">
        <label htmlFor="username">username or email</label>
        <input type="text" id="username" ref={usernameRef} />
      </div>
      <div className="form__group">
        <label htmlFor="password">password</label>
        <input type="password" id="password" ref={passwordRef} />
      </div>
      <div className="form__group">
        <button type="submit">sign in</button>
      </div>
    </form>
  );
}

export default SignInForm;
