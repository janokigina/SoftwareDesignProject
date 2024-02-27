import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CreateUser from "./CreateUser";
import MyForm from "./MyForm";
import './MyForm.css';

React-Router 
function Welcome() {
  return (
    <Router>
        <div>
        <center>
       <h1>Welcome to Group1 Project</h1>
            <p>
                <Link to="/create">Sign Up </Link>
            </p>
            <p>
                <Link to="/signin">Log in</Link>
            </p>
            <Routes>
            <Route path="/create" element={<CreateUser/>}></Route>
            <Route path="/signin" element={ <MyForm/>}></Route>
            </Routes>
            </center>
        </div>
    </Router>
  );
}

export default Welcome;