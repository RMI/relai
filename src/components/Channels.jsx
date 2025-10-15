import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';

import { ChannelsDropdown } from './ChannelsDropdown';

export function Channels() {
    const [dropdowns, setDropdowns] = useState([<ChannelsDropdown key={0} />]);

    let handleAddDropdown = (e) => {
        e.preventDefault();
        setDropdowns([...dropdowns, <ChannelsDropdown key={dropdowns.length} />]);
    }

    return (
        <>
            <h5 className="channels">Team Channels</h5>
            <form id='Channels'>
                <div className="mb-3">
                    {dropdowns.map((dropdown, index) => (
                        <div key={index} className="mb-2">
                            {dropdown}
                        </div>
                    ))}
                </div>
                <Button variant='secondary' onClick={handleAddDropdown} className="d-flex align-items-center">
                    <i className="bi bi-plus me-2"></i> Add Channel
                </Button>
            </form>
        </>
    )
}
