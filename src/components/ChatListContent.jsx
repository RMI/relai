import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useMsal } from '@azure/msal-react';

import { loginRequest } from '../authConfig';
import { getChatList, getChatMembers } from '../graph';
import { ChatListData } from '../dataview';

export const ChatListContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestData() {
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                const token = response.accessToken;
                getChatList(token)
                    .then((response) => {
                        const membersPromises = response.value.map((e) => {
                            return getChatMembers(token, e.id);
                        });

                        Promise.all(membersPromises)
                            .then((members) => {
                                const result = response.value.map((e,i) => ({
                                    ...e,
                                    members: members[i]
                                }));
                                setGraphData(result);
                            })
                    })
            });
    }

    if (graphData === null) RequestData();

    return (
        <>
            <h5 className="chatList">Chat List</h5>
            {graphData ? (
                <ChatListData graphData={graphData} />
            ) : (
                <Button variant="secondary" onClick={RequestData}>
                    Request Chat List
                </Button>
            )}
        </>
    );
};
