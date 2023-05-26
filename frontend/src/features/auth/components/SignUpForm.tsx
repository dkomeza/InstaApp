import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SignInForm() {
  const { signUp } = useAuth();

  const nameRef = useRef<HTMLInputElement>(null);
  const surnameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !usernameRef.current ||
      !passwordRef.current ||
      !emailRef.current ||
      !nameRef.current ||
      !surnameRef.current ||
      !passwordConfirmRef.current
    ) {
      return;
    }

    try {
      await signUp(
        nameRef.current.value,
        surnameRef.current.value,
        usernameRef.current.value,
        emailRef.current.value,
        passwordRef.current.value
      );
      navigate("/");
    } catch (error: any) {
      setError(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="error">{error}</div>
      <div className="form__group row">
        <div className="form__group">
          <label htmlFor="name">name</label>
          <input type="text" id="name" ref={nameRef} />
        </div>
        <div className="form__group">
          <label htmlFor="surname">surname</label>
          <input type="text" id="surname" ref={surnameRef} />
        </div>
      </div>
      <div className="form__group">
        <label htmlFor="username">username</label>
        <input type="text" id="username" ref={usernameRef} />
      </div>
      <div className="form__group">
        <label htmlFor="email">email</label>
        <input type="email" id="email" ref={emailRef} />
      </div>
      <div className="form__group">
        <label htmlFor="password">password</label>
        <input type="password" id="password" ref={passwordRef} />
      </div>
      <div className="form__group">
        <label htmlFor="password">confirm password</label>
        <input type="password_confirm" id="password" ref={passwordConfirmRef} />
      </div>
      <div className="form__group">
        <button type="submit">sign up</button>
      </div>
    </form>
  );
}

export default SignInForm;
