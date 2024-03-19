import React, { useState } from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function ProjectRen() {
    const location = useLocation();
    const navigate = useNavigate();
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [projectId, setProjectId] = useState('');
    const [projectjoinId, setProjectjoinId] = useState('');
    const [projectMessage, setProjectMessage] = useState('');

    const handleSetProjectName = (event) => {
        setProjectName(event.target.value);
    };

    const handleSetDescription = (event) => {
        setDescription(event.target.value);
    };

    const handleSetProjectId = (event) => {
        setProjectId(event.target.value);
    };

    const handleSetProjectjoinId = (event) => {
        setProjectjoinId(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = { projectName, description, projectId };
        const response = await fetch('/create_project', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (response.ok) {
            setProjectMessage("Project created successfully!");
            navigate('/resources', { state: { projectName: projectName } });
        } else {
            setProjectMessage("Error creating project: " + responseData.error);
        }
    };

    const handleJoinProject = async(event) => {
        event.preventDefault();
        const data = { projectId: projectjoinId };
        const response = await fetch('/join_project', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (response.ok) {
            setProjectMessage("Project joined successfully!");
            navigate('/resources', { state: { projectName: projectName } });
        }else{
            setProjectMessage("Error joining project: " + responseData.error);
        }
    };

    return (
        <div>
            <h1>{location.state.valid ? "Welcome " + location.state.username : "Please Log In"}</h1>
            <h3>Create project</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Project Name:
                    <input type="text" value={projectName} onChange={handleSetProjectName} placeholder="project name" required />
                </label>
                <br /><br />
                <label>
                    Description:
                    <input type="text" value={description} onChange={handleSetDescription} placeholder="description" required />
                </label>
                <br /><br />
                <label>
                    Project ID
                    <input type="text" value={projectId} onChange={handleSetProjectId} placeholder="project id" required />
                </label>
                <br /><br />
                <button type="submit">Create Project</button>
            </form>
            {projectMessage && <p>{projectMessage}</p>}
            <br />
            <h3>Join Project</h3>
            <form onSubmit={handleJoinProject}>
                <label>
                    Project ID:
                    <input type="text" value={projectjoinId} onChange={handleSetProjectjoinId} placeholder="project id" required />
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
