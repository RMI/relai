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
        const selected_channels = document.querySelector('input[name="teamchannel_id"]:checked');

        if (selected_channels === null) {
            setGraphData(null);
        } else {
            const team_id = selected_channels.dataset.team_id;
            const channel_id = selected_channels.dataset.channel_id;

            instance
                .acquireTokenSilent({
                    ...loginRequest,
                    account: accounts[0],
                })
                .then((response) => {
                    getChannelMessageList(response.accessToken, team_id, channel_id)
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
