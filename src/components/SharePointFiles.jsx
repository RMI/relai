import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';

import { SharePointDropdown } from './SharePointDropdown';

export function SharePointFiles() {
    const [dropdowns, setDropdowns] = useState([<SharePointDropdown key={0} />]);

    let handleAddDropdown = (e) => {
        e.preventDefault();
        setDropdowns([...dropdowns, <SharePointDropdown key={dropdowns.length} />]);
    }

    return (
        <>
            <h5 className="sharepoint_files">SharePoint Files</h5>
            <form id='SharePointFiles'>
                {dropdowns}
                <Button variant='secondary' onClick={handleAddDropdown}>
                    <i class="bi bi-plus" />
                </Button>
            </form>
        </>
    )
}
