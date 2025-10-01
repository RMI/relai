import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useMsal } from '@azure/msal-react';

import { loginRequest } from '../authConfig';
import { getGroupFileList } from '../graph';
import { GroupFilesListData } from '../dataview';

export const GroupFilesList = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestData(formData) {
        const group_id = document.getElementById("groupfileslist_group_id").value;
        const file_path = document.getElementById("groupfileslist_file_path").value;

        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                const token = response.accessToken;
                getGroupFileList(token, group_id, file_path)
                    .then((result) => {
                        setGraphData(result);
                    })
            });
    }

    return (
        <>
            <h5 className="api">Group Files List</h5>
            <label>
                Group ID: <input id="groupfileslist_group_id" />
            </label>
            <label>
                File Path: <input id="groupfileslist_file_path" />
            </label>
            <Button variant="secondary" onClick={RequestData}>
                Get Group Files List
            </Button>
            {graphData ? (
                <GroupFilesListData graphData={graphData} />
            ) : (
                <br />
            )}
        </>
    );
};
