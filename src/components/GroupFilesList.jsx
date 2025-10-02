import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useMsal } from '@azure/msal-react';

import { loginRequest } from '../authConfig';
import { getGroupFileListFromMultiplePaths } from '../graph';
import { GroupFilesListData } from '../dataview';

export const GroupFilesList = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestData(formData) {
        const group_id = document.getElementById("groupfileslist_group_id").value;
        const file_paths = Array.from(document.querySelectorAll("#groupfileslist_file_path"), e => e.value);

        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                const token = response.accessToken;
                getGroupFileListFromMultiplePaths(token, group_id, file_paths)
                    .then((result) => {
                        setGraphData(result);
                    })
            });
    }

    return (
        <>
            <h5 className="api">Group Files List</h5>
            <Button variant="secondary" onClick={RequestData}>
                Get Group Files List
            </Button>
            <br />
            <label>
                Group ID: <input id="groupfileslist_group_id" />
            </label>
            <br />
            <label>
                File Path: <input id="groupfileslist_file_path" />
            </label>
            <br />
            <label>
                File Path: <input id="groupfileslist_file_path" />
            </label>
            <br />
            <label>
                File Path: <input id="groupfileslist_file_path" />
            </label>
            <br />
            <label>
                File Path: <input id="groupfileslist_file_path" />
            </label>
            <br />
            <label>
                File Path: <input id="groupfileslist_file_path" />
            </label>
            {graphData ? (
                <GroupFilesListData graphData={graphData} />
            ) : (
                <br />
            )}
        </>
    );
};
