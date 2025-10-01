import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useMsal } from '@azure/msal-react';

import { loginRequest } from '../authConfig';
import { getGraphResponse } from '../graph';
import { APIData } from '../dataview';

export const APIContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestData(formData) {
        const url = document.getElementById("api_url").value;

        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                getGraphResponse(response.accessToken, url)
                  .then((response) => setGraphData(response));
            });
    }

    return (
        <>
            <h5 className="api">API</h5>
            <label>
                API URL: <input id="api_url" />
            </label>
            <Button variant="secondary" onClick={RequestData}>
                Request API call
            </Button>
            {graphData ? (
                <APIData graphData={graphData} />
            ) : (
                <br />
            )}
        </>
    );
};
