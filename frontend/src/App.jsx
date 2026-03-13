import React from "react";
import Home from "./pages/Home";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/Login";
import  { Toaster } from 'react-hot-toast';
import Signup from "./components/Signup";
import MyResultPage from "./pages/MyResultPage";


//private protected route
function RequireAuth({children}){
  const isLoggodIn = Boolean(localStorage.getItem("authToken"));
  const location = useLocation();

  if(!isLoggodIn){
    return <Navigate to="/login" state={{from:location}} replace />;
  }
  return children;
}

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/result" element={
          <RequireAuth>
            <MyResultPage/>
          </RequireAuth>
          }/>
      </Routes>
      <Toaster
  position="top-right"
  reverseOrder={false}
  toastOptions={{
    duration: 3000,
    style: {
      borderRadius: "12px",
      background: "#F0EAE9", // light background
      color: "#1f2937",       // dark text for readability
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)", // subtle shadow
      fontWeight: 500,
      padding: "12px 18px",
    },
    success: {
      iconTheme: {
        primary: "#22c55e", // green
        secondary: "#f0f4f8",
      },
    },
    error: {
      iconTheme: {
        primary: "#ef4444", // red
        secondary: "#f0f4f8",
      },
    },
    // Optional: info or custom
  }}
/>
    </div>
  );
};

export default App;
