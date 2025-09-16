import React from "react";

/**
 * Renders information about the user obtained from MS Graph
 * @param props
 */
export const APIData = (props) => {
    return (
        <div id="api-div">
            <pre style={{textAlign: "left"}}>
                {JSON.stringify(props.graphData, null, 2) }
            </pre>
        </div>
    );
};
