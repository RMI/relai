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
                {dropdowns}
                <Button variant='secondary' onClick={handleAddDropdown}>
                    <i class="bi bi-plus" />
                </Button>
            </form>
        </>
    )
}
