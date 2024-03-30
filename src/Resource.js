import React, { useState } from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import './Resource.css';


function ResourceManagement() {
    const location = useLocation();
    const projectName = location.state?.projectName || 'ProjectName';
    const [hwSet1, setHwSet1] = useState({ capacity: 100, availability: 10 });
    const [hwSet2, setHwSet2] = useState({ capacity: 100, availability: 20 });
    const [requestSet1, setRequestSet1] = useState('');
    const [requestSet2, setRequestSet2] = useState('');

    const handleCheckIn = (set, updateSet, request) => {
        const requestNumber = parseInt(request, 10);
        if (!isNaN(requestNumber) && requestNumber > 0) {
            updateSet((prevSet) => ({
                ...prevSet,
                availability: Math.min(prevSet.capacity, prevSet.availability + requestNumber),
            }));
        } else {
            alert('Please enter a valid positive number');
        }
    };

    const handleCheckOut = (set, updateSet, request) => {
        const requestNumber = parseInt(request, 10);
        if (!isNaN(requestNumber) && requestNumber > 0) {
            updateSet((prevSet) => ({
                ...prevSet,
                availability: Math.max(0, prevSet.availability - requestNumber),
            }));
        } else {
            alert('Please enter a valid positive number');
        }
    };

    return (
        <div className="resource-container">
            <h1>{projectName}</h1>
            <div className="resource-section">
                <h2>HWSet1</h2>
                <div className="resource-info">
                    <p>Capacity: {hwSet1.capacity}</p>
                    <p>Availability: {hwSet1.availability}</p>
                </div>
                <div className="resource-actions">
                    <input
                        className="resource-input"
                        type="number"
                        value={requestSet1}
                        onChange={(e) => setRequestSet1(e.target.value)}
                        placeholder="request"
                    />
                    <button className="resource-button" onClick={() => handleCheckIn(hwSet1, setHwSet1, requestSet1)}>Check In</button>
                    <button className="resource-button" onClick={() => handleCheckOut(hwSet1, setHwSet1, requestSet1)}>Check Out</button>
                </div>
            </div>
            <div className="resource-section">
                <h2>HWSet2</h2>
                <div className="resource-info">
                    <p>Capacity: {hwSet2.capacity}</p>
                    <p>Availability: {hwSet2.availability}</p>
                </div>
                <div className="resource-actions">
                    <input
                        className="resource-input"
                        type="number"
                        value={requestSet2}
                        onChange={(e) => setRequestSet2(e.target.value)}
                        placeholder="request"
                    />
                    <button className="resource-button" onClick={() => handleCheckIn(hwSet2, setHwSet2, requestSet2)}>Check In</button>
                    <button className="resource-button" onClick={() => handleCheckOut(hwSet2, setHwSet2, requestSet2)}>Check Out</button>
                </div>
            </div>
        </div>
    );
}

export default ResourceManagement;
