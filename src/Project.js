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
            <h3>{"Create project"}</h3>
            <form>
                <label>
                    Project Name:
                    <input
                        type="text"
                        placeholder="project name"
                        required
                    />
                </label>
                <br /><br/>
                <label>
                    Description:
                    <input
                        type="text"
                        placeholder="description"
                        required
                    />
                </label>
                <br /><br />
                <label>
                    Project ID
                    <input
                        type="text"
                        placeholder="project id"
                        required
                    />
                </label>
                <br /><br />
                <button type="submit">Create Project</button>
            </form>
            <br/><br/>
            <h3>Join Project</h3>
            <form>
                <label>
                    Project ID
                    <input
                        type="text"
                        placeholder="project id"
                        required
                    />
                </label>
                <br /><br />
                <button type="submit">Join Project</button>
            </form>
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
  