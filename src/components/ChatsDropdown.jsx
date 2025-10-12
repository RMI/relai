import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import { loginRequest } from '../authConfig';
import { getChatList, getChatMembers } from '../graph';
import { ChatsDropdownData } from '../dataview';

export const ChatsDropdown = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    const path_placeholder = "path to folder, e.g. '/RMI/CIP Docs/RELAI'";

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
                            });
                    });
            });
    }

    if (graphData === null) RequestData();

    return (
        <div name = 'chats_select'>
            <InputGroup className='container-md justify-content-center'>
                <Form.Select
                    aria-label = "Select Chat"
                    style = {{ maxWidth: '250px' }}
                    name = "chat"
                >
                    <option>Select Chat</option>
                    {graphData &&
                        <ChatsDropdownData graphData={graphData} />
                    }
                </Form.Select>
            </InputGroup>
        </div>
    );
};
