import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useMsal } from '@azure/msal-react';

import { loginRequest } from '../authConfig';
import { getFileList } from '../graph';
import { FilesListData } from '../dataview';

export const FilesList = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestData(formData) {
        const file_path = document.getElementById("fileslist_file_path").value;

        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                const token = response.accessToken;
                getFileList(token, file_path)
                    .then((result) => {
                        setGraphData(result);
                    })
            });
    }

    return (
        <>
            <h5 className="api">Files List</h5>
            <label>
                File Path: <input id="fileslist_file_path" />
            </label>
            <Button variant="secondary" onClick={RequestData}>
                Get Files List
            </Button>
            {graphData ? (
                <FilesListData graphData={graphData} />
            ) : (
                <br/>
            )}
        </>
    );
};
