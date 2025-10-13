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
                {dropdowns}
                <Button variant='secondary' onClick={handleAddDropdown}>
                    <i class="bi bi-plus" />
                </Button>
            </form>
        </>
    )
}
