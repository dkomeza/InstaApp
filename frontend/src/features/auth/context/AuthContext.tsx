import React, { ReactNode, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
}

interface AuthProvider {
  user: User | null;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (
    name: string,
    surname: string,
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  getToken: () => string;
}

export const AuthContext = React.createContext({} as AuthProvider);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserFromLocalStorage() {
      const user = localStorage.getItem("user");
      if (!user) {
        setLoading(false);
        return;
      }
      const token = JSON.parse(user);
      try {
        setUser(await authenticate(token));
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
    loadUserFromLocalStorage();
  }, []);

  const value = {
    user,
    signIn,
    signUp,
    getToken,
  };

  async function authenticate(token: string) {
    const response = await fetch("/api/users/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    if (response.ok) {
      const data = await response.json();
      return data.user;
    }
    throw new Error("Authentication failed");
  }

  async function signIn(username: string, password: string) {
    const response = await fetch("/api/users/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data.token));
      setUser(await authenticate(data.token));
      return;
    }
    throw new Error("Authentication failed");
  }

  async function signUp(
    name: string,
    surname: string,
    username: string,
    email: string,
    password: string
  ) {
    const response = await fetch("/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, surname, username, email, password }),
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data.token));
      setUser(await authenticate(data.token));
      return;
    }
    const data = await response.json();
    throw new Error("Authentication failed: " + data.status);
  }

  function getToken() {
    const user = localStorage.getItem("user");
    if (!user) {
      return null;
    }
    return JSON.parse(user);
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
