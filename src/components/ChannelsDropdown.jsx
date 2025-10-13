import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import { loginRequest } from '../authConfig';
import { getTeamList, getGraphResponse } from '../graph';
import { ChannelsDropdownData } from '../dataview';

export const ChannelsDropdown = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestData() {
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                const token = response.accessToken;
                getTeamList(token)
                    .then(async (teams) => {
                        let teams_channels = teams.value.map((d) => {
                            const url = "https://graph.microsoft.com/v1.0/teams/" + d.id + "/channels";
                            return getGraphResponse(token, url)
                                .then((response) => {
                                    if (typeof response.value !== 'undefined') {
                                        return response.value.map(v => ({
                                            ...v,
                                            team_id: d.id,
                                            team_name: d.displayName,
                                            team_desc: d.description
                                        }));
                                    } else {
                                        return null;
                                    }
                                });
                        });
                        teams_channels = await Promise.all(teams_channels);
                        setGraphData(teams_channels);
                    });
            });
    }

    if (graphData === null) RequestData();

    return (
        <div name = 'channels_select'>
            <InputGroup className='container-md justify-content-center'>
                <Form.Select
                    aria-label = "Select Team Channel"
                    style = {{ maxWidth: '400px' }}
                    name = "channel"
                >
                    <option>Select Team Channel</option>
                    {graphData &&
                        <ChannelsDropdownData graphData={graphData} />
                    }
                </Form.Select>
            </InputGroup>
        </div>
    );
};
