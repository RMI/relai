import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useMsal } from '@azure/msal-react';

import { loginRequest } from '../authConfig';
import { getGroupList } from '../graph';
import { GroupListData } from '../dataview';

export const GroupsList = () => {
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

    if (graphData === null) RequestData();

    return (
        <>
            <h5 className="groupslist">Groups List</h5>
            {graphData ? (
                <GroupListData graphData={graphData} />
            ) : (
                <Button variant="secondary" onClick={RequestData}>
                    Request Groups List
                </Button>
            )}
        </>
    );
};
