import React from "react";

export const TeamsDropdownData = (props) => {
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
