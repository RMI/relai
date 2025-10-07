import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useMsal } from '@azure/msal-react';

import { loginRequest } from '../authConfig';
import { getFileListFromMultiplePaths } from '../graph';
import { FilesListData } from '../dataview';

export const FilesList = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestData(formData) {
        const file_paths = Array.from(document.querySelectorAll("#fileslist_file_path"), e => e.value);

        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                const token = response.accessToken;
                getFileListFromMultiplePaths(token, file_paths)
                    .then((result) => {
                        setGraphData(result);
                    })
            });
    }

    return (
        <>
            <h5 className="api">Files List</h5>
            <Button variant="secondary" onClick={RequestData}>
                Get Files List
            </Button>
            <br />
            <label>
                File Path: <input id="fileslist_file_path" />
            </label>
            <br />
            <label>
                File Path: <input id="fileslist_file_path" />
            </label>
            {graphData ? (
                <FilesListData graphData={graphData} />
            ) : (
                <br/>
            )}
        </>
    );
};
