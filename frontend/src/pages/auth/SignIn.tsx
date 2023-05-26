import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "@features/auth/context/AuthContext";
import { SignInForm, SideImage } from "@features/auth/components";

import "@assets/styles/pages/auth/main.scss";

function SignIn() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <main className="signin">
      <section className="form">
        <SignInForm />
        <div className="redirect-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </section>
      <section className="image">
        <SideImage />
      </section>
    </main>
  );
}

export default SignIn;
