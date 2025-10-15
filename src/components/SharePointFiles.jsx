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
                <div className="mb-3">
                    {dropdowns.map((dropdown, index) => (
                        <div key={index} className="mb-2">
                            {dropdown}
                        </div>
                    ))}
                </div>
                <Button variant='secondary' onClick={handleAddDropdown} className="d-flex align-items-center">
                    <i className="bi bi-plus me-2"></i> Add SharePoint Files
                </Button>
            </form>
        </>
    )
}
