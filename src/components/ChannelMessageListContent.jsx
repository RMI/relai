import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useMsal } from '@azure/msal-react';

import { loginRequest } from '../authConfig';
import { getChannelMessageList } from '../graph';
import { ChannelMessageData } from '../dataview';

export const ChannelMessageListContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestData(formData) {
        const selected_channels = document.querySelectorAll('input[name="teamchannel_id"]:checked');

        if (selected_channels === null) {
            setGraphData(null);
        } else {
            const selected_team_ids = [...selected_channels].map(e => e.dataset.team_id);
            const selected_channels_ids = [...selected_channels].map(e => e.dataset.channel_id);

            instance
                .acquireTokenSilent({
                    ...loginRequest,
                    account: accounts[0],
                })
                .then((response) => {
                    getChannelMessageList(response.accessToken, selected_team_ids, selected_channels_ids)
                        .then((response) => setGraphData(response));
                });
        }
    }

    return (
        <>
            <h5 className="api">Channel Messages</h5>
            <Button variant="secondary" onClick={RequestData}>
                Get Channel Messages
            </Button>
            {graphData ? (
                <ChannelMessageData graphData={graphData} />
            ) : (
                <br/>
            )}
        </>
    );
};
