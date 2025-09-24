import React from "react";
import Table from 'react-bootstrap/Table';

/**
 * Renders information about the user obtained from MS Graph
 * @param props
 */
export const ChatListData = (props) => {
    return (
        <div id="chatslist-div">
            <Table striped bordered hover size="sm">
                <thead><tr>
                    <th>select</th>
                    <th>Topic</th>
                    <th>Members</th>
                    <th>link</th>
                </tr></thead>
                <tbody>
                    {props.graphData.map((data, index) => (
                        <tr key={index}>
                            <td>
                                <input type="radio" id={data.id} name="chat_id" value={data.id} />
                            </td>
                            <td>{data.topic}</td>
                            <td>{data.members.join(", ")}</td>
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
