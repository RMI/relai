import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useMsal } from '@azure/msal-react';

import { loginRequest } from '../authConfig';
import { getEmail } from '../graph';
import { EmailData } from '../dataview';

export const EmailContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestData() {
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                getEmail(response.accessToken)
                  .then((response) => setGraphData(response));
            });
    }

    return (
        <>
            <h5 className="email">Email</h5>
            <Button variant="secondary" onClick={RequestData}>
                Get Email
            </Button>
            {graphData ? (
                <EmailData graphData={graphData} />
            ) : (
                <br/>
            )}
        </>
    );
};
