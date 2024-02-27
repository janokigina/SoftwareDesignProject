import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CreateUser from "./CreateUser";
import MyForm from "./MyForm";
import logo from './orange-logo.png';
import './Welcome.css';

//React-Router 
function Welcome() {
  return (
    <Router>
      <div className="top-bar">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Welcome to Group1 Project</h1>
        <div>
          <Link to="/create">Sign Up</Link>
          <Link to="/signin">Log In</Link>
        </div>
      </div>
      <div className="content-area">
        <Routes>
          <Route path="/create" element={<CreateUser/>}></Route>
          <Route path="/signin" element={<MyForm/>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default Welcome;