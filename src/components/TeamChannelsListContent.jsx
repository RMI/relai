import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useMsal } from '@azure/msal-react';

import { loginRequest } from '../authConfig';
import { getTeamList, getGraphResponse } from '../graph';
import { TeamChannelsListData } from '../dataview';

export const TeamChannelsListContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestData() {
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                getTeamList(response.accessToken)
                    .then((response) => {
                        let teams = response.value;
                        instance
                            .acquireTokenSilent({
                                ...loginRequest,
                                account: accounts[0],
                            })
                            .then(async (response) => {
                                let teams_channels = teams.map((d) => {
                                    const url = "https://graph.microsoft.com/v1.0/teams/" + d.id + "/channels";
                                    return getGraphResponse(response.accessToken, url)
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
            });
    }

    if (graphData === null) RequestData();

    return (
        <>
            <h5 className="teamChannelsList">Team Channels List</h5>
            {graphData ? (
                <TeamChannelsListData graphData={graphData} />
            ) : (
                <Button variant="secondary" onClick={RequestData}>
                    Request Team Channels List
                </Button>
            )}
        </>
    );
};
