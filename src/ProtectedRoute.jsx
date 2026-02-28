import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(undefined); // undefined = still checking

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // ⏳ Still checking session
  if (session === undefined) {
    return null; // or loading spinner
  }

  // ❌ No session → go to login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Session exists → allow access
  return children;
};

export default ProtectedRoute;