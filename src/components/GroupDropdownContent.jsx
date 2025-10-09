import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useMsal } from '@azure/msal-react';

import { loginRequest } from '../authConfig';
import { getGraphResponse } from '../graph';
import { GroupDropdownData } from '../dataview';

export const GroupDropdownContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    const path_placeholder = "path to folder, e.g. '/RMI/CIP Docs/Reali'";

    function RequestData() {
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                const api_url = "https://graph.microsoft.com/v1.0/groups";
                getGraphResponse(response.accessToken, api_url)
                    .then((response) => {
                        response = response.value.filter(e => e.creationOptions.includes("Team") );
                        setGraphData(response);
                    });
            });
    }

    if (graphData === null) RequestData();

    return (
        <div
            name = 'group_files_select'
            style = {{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Form.Select
                aria-label = "Select Group/Team"
                style = {{ maxWidth: '250px' }}
                name = "group"
            >
                <option>Select Group/Team</option>
                {graphData &&
                    <GroupDropdownData graphData={graphData} />
                }
            </Form.Select>
            <Form.Control
                type = "text"
                placeholder = {path_placeholder}
                style = {{ maxWidth: '300px' }}
                name = "path"
            />
        </div>
    );
};
