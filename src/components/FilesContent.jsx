import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useMsal } from '@azure/msal-react';

import { loginRequest } from '../authConfig';
import { getFilesContent } from '../graph';
import { FilesContentData } from '../dataview';

export const FilesContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestData(formData) {
        const file_paths = Array.from(document.querySelectorAll("#filescontent_file_path"), e => e.value);
        const url = "https://graph.microsoft.com/v1.0/me/drive/root:/" + file_path + ":/children";

        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                const token = response.accessToken;
                getFilesContent(token, file_paths)
                    .then(result => setGraphData(result));
            });
    }

    return (
        <>
            <h5 className="api">Files Content</h5>
            <Button variant="secondary"  onClick={RequestData}>
                Get Files Content
            </Button>
            <br />
            <label>
                File Path: <input id="filescontent_file_path" />
            </label>
            <br />
            <label>
                File Path: <input id="filescontent_file_path" />
            </label>
            {graphData ? (
                <FilesContentData graphData={graphData} />
            ) : (
                <br/>
            )}
        </>
    );
};
