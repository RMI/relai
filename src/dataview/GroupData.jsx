import React from "react";

/**
 * @param props
 */
export const GroupData = (props) => {
    const data = props.graphData.value;

    return (
        <div id="api-div">
            <pre style={{textAlign: "left"}}>
                {JSON.stringify(data, null, 2) }
            </pre>
        </div>
    );
};
