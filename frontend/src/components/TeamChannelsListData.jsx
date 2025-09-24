import React from "react";
import Table from 'react-bootstrap/Table';

/**
 * Renders information about the user obtained from MS Graph
 * @param props
 */
export const TeamChannelsListData = (props) => {
    return (
        <div id="chatslist-div">
            <Table striped bordered hover size="sm">
                <thead><tr>
                    <th>select</th>
                    <th>Channel Name</th>
                    <th>Channel ID</th>
                    <th>Team</th>
                    <th>Team Description</th>
                    <th>Team ID</th>
                    <th>Web URL</th>
                </tr></thead>
                <tbody>
                    {props.graphData.filter(n => n).map((data, index) => (
                        <tr key={index}>
                            <td>
                                <input type="radio" id={data.id} name="teamchannel_id" value={data.id} />
                            </td>
                            <td>{data[0].displayName}</td>
                            <td>
                                {data[0].id}&nbsp;
                                <button type="button" class="btn btn-primary" onClick={()=>navigator.clipboard.writeText(data[0].id)}>
                                  <i class="bi bi-clipboard"></i>
                                </button>
                            </td>
                            <td>{data[0].team_name}</td>
                            <td>{data[0].team_desc}</td>
                            <td>
                                {data[0].team_id}&nbsp;
                                <button type="button" class="btn btn-primary" onClick={()=>navigator.clipboard.writeText(data[0].team_id)}>
                                  <i class="bi bi-clipboard"></i>
                                </button>
                            </td>
                            <td>
                                <a href={data[0].webUrl} target="blank">web URL</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};
