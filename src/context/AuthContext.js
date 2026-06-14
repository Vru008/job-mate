import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { loginApi, registerApi, updateMeApi } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("jm_token") || "");
  const [ready, setReady] = useState(false);

  // On load, restore session from localStorage and set the axios auth header.
  useEffect(() => {
    const savedToken = localStorage.getItem("jm_token");
    const savedUser = localStorage.getItem("jm_user");
    if (savedToken && savedUser) {
      axios.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setReady(true);
  }, []);

  // If any request comes back 401 while we think we're logged in, the token
  // expired or the account was removed — clear the session and send to login.
  useEffect(() => {
    const id = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401 && localStorage.getItem("jm_token")) {
          localStorage.removeItem("jm_token");
          localStorage.removeItem("jm_user");
          delete axios.defaults.headers.common.Authorization;
          setToken("");
          setUser(null);
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(id);
  }, []);

  const persist = (data) => {
    localStorage.setItem("jm_token", data.token);
    localStorage.setItem("jm_user", JSON.stringify(data.user));
    axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;
    setToken(data.token);
    setUser(data.user);
  };

  const login = async (creds) => {
    const data = await loginApi(creds);
    persist(data);
    return data.user;
  };

  const register = async (info) => {
    const data = await registerApi(info);
    persist(data);
    return data.user;
  };

  // Update the logged-in user's profile and keep stored state in sync.
  const updateUser = async (data) => {
    const res = await updateMeApi(data);
    localStorage.setItem("jm_user", JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem("jm_token");
    localStorage.removeItem("jm_user");
    delete axios.defaults.headers.common.Authorization;
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, ready, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
