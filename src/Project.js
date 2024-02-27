import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import { useNavigate } from "react-router-dom";
function ProjectRen() {
    const location = useLocation();
    const navigate = useNavigate();
    
    if(location.state === null){
        return navigate("/signin");
    }
    return (
        <div>
            <h1>{location.state.valid ? "Welcome " + location.state.username : "Please Log In"}</h1>
            <p>{""}</p>
        </div>
    );
}

const Project = () => {
    return (
      <>
          <ProjectRen username="User" message="ok" />
      </>
    );
  };
export default ProjectRen;
  