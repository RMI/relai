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
                {dropdowns}
                <Button variant='secondary' onClick={handleAddDropdown}>
                    <i class="bi bi-plus" />
                </Button>
            </form>
        </>
    )
}
