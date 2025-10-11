import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useMsal } from '@azure/msal-react';

import { loginRequest } from '../authConfig';
import { getGraphResponse } from '../graph';
import { SharePointDropdownData } from '../dataview';

export const SharePointDropdown = () => {
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
            name = 'sharepoint_files_select'
            style = {{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Form.Select
                aria-label = "Select SharePoint Site"
                style = {{ maxWidth: '250px' }}
                name = "sharepoint"
            >
                <option>Select SharePoint Site</option>
                {graphData &&
                    <SharePointDropdownData graphData={graphData} />
                }
            </Form.Select>
            <Form.Control
                type = "text"
                placeholder = {path_placeholder}
                style = {{ maxWidth: '400px' }}
                name = "sharepoint_path"
            />
        </div>
    );
};
