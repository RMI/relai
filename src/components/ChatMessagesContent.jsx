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
        const selected_chats = document.querySelector('input[name="chat_id"]:checked');

        if (selected_chats === null) {
            setGraphData(null);
        } else {
            const chat_id = selected_chats.id;

            instance
                .acquireTokenSilent({
                    ...loginRequest,
                    account: accounts[0],
                })
                .then((response) => {
                    getChatMessages(response.accessToken, chat_id)
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
