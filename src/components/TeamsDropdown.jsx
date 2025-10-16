import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import { loginRequest } from '../authConfig';
import { getGroupList } from '../graph';
import { TeamsDropdownData } from '../dataview';

export const TeamsDropdown = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    const path_placeholder = "path to folder, e.g. '/budget/updates'";

    function RequestData() {
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                getGroupList(response.accessToken)
                    .then((response) => {
                        setGraphData(response.value);
                    });
            });
    }

    if (graphData === null) RequestData();

    return (
        <div name = 'teams_files_select'>
            <InputGroup className='container-md justify-content-center'>
                <Form.Select
                    aria-label = "Select Team"
                    style = {{ maxWidth: '250px' }}
                    name = "team"
                >
                    {graphData &&
                        <>
                            <option>Select Team</option>
                            <TeamsDropdownData graphData={graphData} />
                        < />
                    }
                </Form.Select>
                <Form.Control
                    type = "text"
                    placeholder = {path_placeholder}
                    style = {{ maxWidth: '400px' }}
                    name = "team_path"
                />
            </InputGroup>
        </div>
    );
};
