import React, { useState , useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import ProjectRen from "./Project";
import ResourceManagement from "./Resource";
import logo from './orange-logo.png';
import './Welcome.css';

//React-Router 
function Welcome() {
  const [loggedIn, setLoggedIn] = useState(false);


  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('userId');
  };

  useEffect(() => {
    if (!loggedIn && window.location.pathname !== "/login") {
      window.location.href = "/login"; // Redirect to login page if not logged in
    }
  }, [loggedIn]);

  return (
    <Router>
      <div className="top-bar">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Welcome to Group1 Project</h1>
        <div>
          {loggedIn ? (
            <Link to="/login" onClick={handleLogout}>Log Out</Link>
          ) : (
            <>
              <Link to="/signup">Sign Up</Link>
              <Link to="/login">Log In</Link>
            </>
          )}
        </div>
      </div>
      <div className="content-area">
        <Routes>
          <Route path="/signup" element={<SignUp setLoggedIn={setLoggedIn} />} />
          <Route path="/login" element={<LogIn setLoggedIn={setLoggedIn} />}></Route>
          <Route path="/projects" element={<ProjectRen/>}></Route>
          <Route path="/resources" element={<ResourceManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Welcome;