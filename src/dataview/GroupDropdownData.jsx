import React from "react";
import Form from 'react-bootstrap/Form';

export const GroupDropdownData = (props) => {
    let data = props.graphData;

    return (
        <>
            {data.map(e => (
                <option
                    value = {e.id}
                    data-id = {e.id}
                    data-name = {e.displayName}
                >
                    {e.displayName}
                </option>
            ))}
        </>
    );

};
