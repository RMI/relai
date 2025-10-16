import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';

import { TeamsDropdown } from './TeamsDropdown';

export function TeamsFiles() {
    const [dropdowns, setDropdowns] = useState([<TeamsDropdown key={0} />]);

    let handleAddDropdown = (e) => {
        e.preventDefault();
        setDropdowns([...dropdowns, <TeamsDropdown key={dropdowns.length} />]);
    }

    return (
        <>
            <h5 className="teams_files">Teams Files</h5>
            <form id='TeamsFiles'>
                <div className="mb-3">
                    {dropdowns.map((dropdown, index) => (
                        <div key={index} className="mb-2">
                            {dropdown}
                        </div>
                    ))}
                </div>
                <Button variant='secondary' onClick={handleAddDropdown} className="d-flex align-items-center">
                    <i className="bi bi-plus me-2"></i> Add Team Files
                </Button>
            </form>
        </>
    )
}
