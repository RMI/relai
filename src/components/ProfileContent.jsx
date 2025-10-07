import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useMsal } from '@azure/msal-react';

import { loginRequest } from '../authConfig';
import { getProfile } from '../graph';
import { ProfileData } from '../dataview';

export const ProfileContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestProfileData() {
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                getProfile(response.accessToken)
                  .then((response) => setGraphData(response));
            });
    }

    return (
        <>
            <Button variant="secondary" onClick={RequestProfileData}>
                Request Profile
            </Button>
            {graphData ? (
                <ProfileData graphData={graphData} />
            ) : (
                <br/>
            )}
        </>
    );
};
