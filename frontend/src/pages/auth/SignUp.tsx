import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "@features/auth/context/AuthContext";

import { SignUpForm, SideImage } from "@/features/auth/components";

import "@assets/styles/pages/auth/main.scss";

function SignUp() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <main className="signup">
      <section className="form">
        <SignUpForm />
        <div className="redirect-link">
          Already have an account? <Link to="/signin">Sign in</Link>
        </div>
      </section>
      <section className="image">
        <SideImage />
      </section>
    </main>
  );
}

export default SignUp;
