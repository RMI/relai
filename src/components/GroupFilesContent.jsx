import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useMsal } from '@azure/msal-react';

import { loginRequest } from '../authConfig';
import { getGroupFilesContent } from '../graph';
import { GroupFilesContentData } from '../dataview';

export const GroupFilesContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestData(formData) {
        const group_id = document.getElementById("groupfilescontent_group_id").value;
        const file_path = document.getElementById("groupfilescontent_file_path").value;

        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                const token = response.accessToken;
                getGroupFilesContent(token, group_id, file_path)
                    .then((result) => {
                        setGraphData(result);
                    })
            });
    }

    return (
        <>
            <h5 className="api">Group Files Content</h5>
            <label>
                Group ID: <input id="groupfilescontent_group_id" />
            </label>
            <label>
                File Path: <input id="groupfilescontent_file_path" />
            </label>
            <Button variant="secondary" onClick={RequestData}>
                Get Group Files Content
            </Button>
            {graphData ? (
                <GroupFilesContentData graphData={graphData} />
            ) : (
                <br />
            )}
        </>
    );
};
