import React from "react";
import Table from 'react-bootstrap/Table';

/**
 * Renders information about the user obtained from MS Graph
 * @param props
 */
export const TeamChannelsListData = (props) => {
    const data = props.graphData.flat().filter(n => n);

    return (
        <div id="chatslist-div">
            <Table striped bordered hover size="sm">
                <thead><tr>
                    <th>select</th>
                    <th>Channel Name</th>
                    <th>Team</th>
                    <th>Team Description</th>
                    <th>link</th>
                </tr></thead>
                <tbody>
                    {data.map((data, index) => (
                        <tr key={index}>
                            <td>
                                <input type="radio" id={data.id} name="teamchannel_id" data-channel_id={data.id} data-team_id={data.id} />
                            </td>
                            <td>{data.displayName}</td>
                            <td>{data.team_name}</td>
                            <td>{data.team_desc}</td>
                            <td>
                                <a href={data.webUrl} target="blank">link</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};
