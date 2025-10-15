import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';

import { ChatsDropdown } from './ChatsDropdown';

export function Chats() {
    const [dropdowns, setDropdowns] = useState([<ChatsDropdown key={0} />]);

    let handleAddDropdown = (e) => {
        e.preventDefault();
        setDropdowns([...dropdowns, <ChatsDropdown key={dropdowns.length} />]);
    }

    return (
        <>
            <h5 className="chats">Chats</h5>
            <form id='Chats'>
                <div className="mb-3">
                    {dropdowns.map((dropdown, index) => (
                        <div key={index} className="mb-2">
                            {dropdown}
                        </div>
                    ))}
                </div>
                <Button variant='secondary' onClick={handleAddDropdown} className="d-flex align-items-center">
                    <i className="bi bi-plus me-2"></i> Add Chat
                </Button>
            </form>
        </>
    )
}
