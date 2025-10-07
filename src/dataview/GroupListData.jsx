import React from "react";
import Table from 'react-bootstrap/Table';

/**
 * @param props
 */
export const GroupListData = (props) => {
    const data = props.graphData.value;

    return (
        <div id="grouplist-div">
            <Table striped bordered hover size="sm">
                <thead><tr>
                    <th>select</th>
                    <th>Group Name</th>
                    <th>Group ID</th>
                </tr></thead>
                <tbody>
                    {data.map((data, index) => (
                        <tr key={index}>
                            <td>
                                <input type="radio" name="group_select" data-group_id={data.id} />
                            </td>
                            <td>{data.displayName}</td>
                            <td>{data.id}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};
