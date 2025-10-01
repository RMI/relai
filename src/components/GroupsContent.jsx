import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useMsal } from '@azure/msal-react';

import { loginRequest } from '../authConfig';
import { getGroupList } from '../graph';
import { GroupData } from '../dataview';

export const GroupsContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestData() {
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                getGroupList(response.accessToken)
                    .then((result) => setGraphData(result));
            });
    }

    return (
        <>
            <h5 className="groups">Groups</h5>
            <Button variant="secondary" onClick={RequestData}>
                Get groups
            </Button>
            {graphData ? (
                <GroupData graphData={graphData} />
            ) : (
                <br/>
            )}
        </>
    );
};
