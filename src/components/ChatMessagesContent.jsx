import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useMsal } from '@azure/msal-react';

import { loginRequest } from '../authConfig';
import { getChatMessages } from '../graph';
import { ChatMessagesData } from '../dataview';

export const ChatMessagesContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestData(formData) {
        const selected_chats_ids = Array.from(document.querySelectorAll("input[name='chat_id']:checked"), e => e.value);

        if (selected_chats_ids.length < 1) {
            setGraphData(null);
        } else {
            instance
                .acquireTokenSilent({
                    ...loginRequest,
                    account: accounts[0],
                })
                .then((response) => {
                    getChatMessages(response.accessToken, selected_chats_ids)
                      .then((response) => setGraphData(response));
                });
        }
    }

    return (
        <>
            <h5 className="email">Chat Messages</h5>
            <Button variant="secondary" onClick={RequestData}>
                Get Chat Messages
            </Button>
            {graphData ? (
                <ChatMessagesData graphData={graphData} />
            ) : (
                <br/>
            )}
        </>
    );
};
