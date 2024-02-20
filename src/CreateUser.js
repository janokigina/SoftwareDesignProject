


/**
 * A React component that renders a form with input fields for the user to 
 * enter their name, password, and id.
 * @component
 */
import React, { useState } from 'react';
import './CreateUser.css';

function CreateUser() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setconfirmPassword] = useState('');
    const [id, setId] = useState('');
    const [submitted, setSubmitted] = useState('');

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
    }

    /**
     * Event handler for form submission.
     * Prevents the default form submission behavior and logs the form data.
     * @param {object} event - The event object.
     */
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = { username, id, password, confirmpassword};
        console.log(data);
        setSubmitted(`Username: ${username}, ID: ${id}, Password: ${password}, Confirm Password: ${confirmpassword}`)
    }
    return (
        <div>
            <center>
                <h1>Create New User</h1>
                <form onSubmit={handleSubmit}>
                    <label className="createuser">
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
                    <p>{submitted}</p>
                    <br/>
                </form>
            </center>
        </div>
    )
}

export default CreateUser;

  