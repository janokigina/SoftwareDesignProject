import React, { useState, useEffect } from 'react';
import {useLocation} from 'react-router-dom';
import './Project.css';
import { useNavigate } from "react-router-dom";

function ProjectRen() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: '', id: '', valid: false });
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [projectId, setProjectId] = useState('');
    const [projectMessage, setProjectMessage] = useState('');
    const [joinMessage, setJoinMessage] = useState('');
    const [joinProjectId, setJoinProjectId] = useState('');
    const [userProjects, setUserProjects] = useState([]);

    const handleSetProjectName = (event) => {
            setProjectName(event.target.value);
        }

    const handleSetDescription = (event) => {
            setDescription(event.target.value);
        }
    
    const handleSetProjectId = (event) => {
         setProjectId(event.target.value);
     }

    const handleSetjoinMessage = (event) => {
        setJoinMessage(event.target.value);
    }

    const handleSetJoinProjectId = (event) => { 
        setJoinProjectId(event.target.value);
    }

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            navigate("/login");
        } else {
            fetchUserProjects();
        }

    }, [navigate]);
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const userId = localStorage.getItem("userId");
        const data = { projectName, description, projectId, userId };
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

    const handleSubmit2 = async (event) => {
        event.preventDefault();
        const data = { 'projectId': joinProjectId, 'userId': localStorage.getItem("userId") };
        const response = await fetch('/join_project', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const responseData = await response.json();
    
        if (response.ok) {  
            setJoinMessage("Project joined successfully!");
    
            // Fetch project details after successfully joining the project
            const projectResponse = await fetch(`/get_user_projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'userId': localStorage.getItem("userId") }),
            });
            const projectData = await projectResponse.json();
    
            // Find the joined project in the user's projects list
            const joinedProject = projectData.find(project => project.projectId === joinProjectId);
            if (joinedProject) {
                // Set projectName based on the fetched project details
                setProjectName(joinedProject.projectName);
    
                // Navigate to the resources page with the updated projectName state
                navigate('/resources', { state: { projectName: joinedProject.projectName } });
            } else {
                // Handle error if the joined project is not found
                setJoinMessage("Error: Joined project details not found");
            }
        } else {
            // Handle error if joining project fails
            setJoinMessage("Error joining project: " + responseData.error);
        }
    };

    const fetchUserProjects = async () => {
        const userId = localStorage.getItem("userId");
        const response = await fetch('/get_user_projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'userId': userId }),
        });
        const responseData = await response.json();

        if (response.ok) {
            setUserProjects(responseData);
        } else {
            console.error("Error fetching user projects:", responseData.error);
        }
    };

    const handleProjectClick = (projectName) => {
        navigate('/resources', { state: { projectName: projectName } });
    };

    const removeUserFromProject = async (projectId) => {
        const userId = localStorage.getItem("userId");
        await fetch('/remove_user_from_project', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, projectId }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchUserProjects();
            } else {
                console.error('Error removing user from project:', data.message);
            }
        })
        .catch(error => {
            console.error('Error removing user from project:', error);
        });
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
            <form onSubmit = {handleSubmit2}>
                <label>
                    Project ID
                    <input
                        type="text"
                        value = {joinProjectId}
                        onChange={handleSetJoinProjectId}
                        placeholder="project id"
                        required
                    />
                </label>
                <br /><br />
                <button type="submit">Join Project</button>
                {joinMessage && <p>{joinMessage}</p>}
            </form>
            <h3>User Projects</h3>
            <ul className="project-list">
                {userProjects.map(project => (
                    <li key={project.projectId} style={{ cursor: 'pointer' }}>
                        <span onClick={() => handleProjectClick(project.projectName)}>
                            {project.projectName} - {project.projectId}
                        </span>
                        <span 
                            className="leave-project-icon" 
                            onClick={(event) => removeUserFromProject(project.projectId, event)} 
                            style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }}>
                            🗑️
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProjectRen;