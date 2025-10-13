import React from "react";

export const SharePointDropdownData = (props) => {
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
