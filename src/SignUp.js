/**
 * A React component that renders a form with input fields for the user to 
 * enter their name, password, and id.
 * @component
 */
import React, { useState } from 'react';
import './SignUp.css';
import { useNavigate } from "react-router-dom";

function SignUp({ setLoggedIn }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setconfirmPassword] = useState('');
    const [id, setId] = useState('');
    const [error, setError] = useState('false');
    const [createMessage, setCreateMessage] = useState('');

    /**
     * Event handler for username input change.
     * Updates the username state with the new value entered by the user.
     * @param {object} event - The event object.
     */
    const handleInputChangeUsername = (event) => {
        setUsername(event.target.value);
    }

    /**
     * Event handler for password input change.
     * Updates the password state with the new value entered by the user.
     * @param {object} event - The event object.
     */
    const handleInputChangePassword = (event) => {
        setPassword(event.target.value);
    }

    /**
     * Event handler for confirm password input change.
     * Updates the confirm password state with the new value entered by the user.
     * @param {object} event - The event object.
     */
    const handleInputChangeConfirmPassword = (event) => {
        setconfirmPassword(event.target.value);
    }
    
    /**
     * Event handler for id input change.
     * Updates the id state with the new value entered by the user.
     * @param {object} event - The event object.
     */
    const handleInputChangeId = (event) => {
        setId(event.target.value);
        localStorage.setItem('userId', event.target.value);
    }

    /**
     * Event handler for form submission.
     * Prevents the default form submission behavior and logs the form data.
     * @param {object} event - The event object.
     */

    const handleSubmit = (event) => {
        event.preventDefault();
        if (password !== confirmpassword) {
            setCreateMessage("Passwords do not match.");
            return;
        }
    
        const data = { username, id, password };
        fetch('/process_signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error);
                  });
            }
            return response.json();
        })
        .then(data => {
            if (data.code === 200) {
                setCreateMessage("Created account for user: " + data.username);
                setError(false);
                setLoggedIn(true);
                localStorage.setItem('userId', data.id);
                navigate("/projects", { state: { username: data.username, id: data.id, valid: true } });
            } else {
                setCreateMessage("Response code: " + data.code + " Response message: " + data.error);
                setError(true);
                setLoggedIn(false);
            }
        })
        .catch(error => {
            setCreateMessage("Failed to create account: " + error.message);
            setError(true);
        });
    }
    

    return (
    <>
        <h1 className='createuser'>Create New User</h1>
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input
                    type="text"
                    value={username}
                    onChange={handleInputChangeUsername}
                    placeholder="username"
                    required
                />
            </label>
            <br /><br/>
            <label>
                ID:
                <input
                    type="text"
                    value={id}
                    onChange={handleInputChangeId}
                    placeholder="id"
                    required
                />
            </label>
            <br /><br />
            <label>
                Password:
                <input
                    type="password"
                    value={password}
                    onChange={handleInputChangePassword}
                    placeholder="password"
                    required
                />
            </label>
            <br /><br />
            <label>
                Confirm Password:
                <input
                    type="password"
                    value={confirmpassword}
                    onChange={handleInputChangeConfirmPassword}
                    placeholder="confirm password"
                    required
                />
            </label>
            <br /><br />
            <button type="submit">create</button>
            <br/><br/>
            <p>{createMessage}</p>
        </form>
    </> 
    )
}

export default SignUp;