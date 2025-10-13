import React from "react";
import Table from 'react-bootstrap/Table';

/**
 * @param props
 */
export const ChannelsDropdownData = (props) => {
    const data = props.graphData.flat().filter(n => n);

    return (
        <>
            {data.map(e => (
                <option
                    value = {e.id}
                    data-channel_id = {e.id}
                    data-channel_name = {e.displayName}
                    data-team_id = {e.team_id}
                    data-team_name = {e.team_name}
                >
                    {e.team_name + ' > ' + e.displayName}
                </option>
            ))}
        </ >
    );
};
