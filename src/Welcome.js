import React, { useState , useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CreateUser from "./CreateUser";
import MyForm from "./MyForm";
import ProjectRen from "./Project";
import ResourceManagement from "./Resource";
import logo from './orange-logo.png';
import './Welcome.css';

//React-Router 
function Welcome() {
  const [loggedIn, setLoggedIn] = useState(false);


  const handleLogout = () => {
    // Implement your logout logic here
    setLoggedIn(false);
    localStorage.removeItem('userId');
  };

  useEffect(() => {
    if (!loggedIn && window.location.pathname !== "/signin") {
      window.location.href = "/signin"; // Redirect to login page if not logged in
    }
  }, [loggedIn]);

  return (
    <Router>
      <div className="top-bar">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Welcome to Group1 Project</h1>
        <div>
          {loggedIn ? (
            <Link to="/signin" onClick={handleLogout}>Log Out</Link>
          ) : (
            <>
              <Link to="/create">Sign Up</Link>
              <Link to="/signin">Log In</Link>
            </>
          )}
        </div>
      </div>
      <div className="content-area">
        <Routes>
          <Route path="/create" element={<CreateUser setLoggedIn={setLoggedIn} />} />
          <Route path="/signin" element={<MyForm setLoggedIn={setLoggedIn} />}></Route>
          <Route path="/projects" element={<ProjectRen/>}></Route>
          <Route path="/resources" element={<ResourceManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Welcome;