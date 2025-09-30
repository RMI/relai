import React from "react";

/**
 * @param props
 */
export const GroupData = (props) => {
    const data = props.graphData.value;
    const result = data.map(e => ({
        id: e.id,
        tenantId: e.tenantId,
        displayName: e.displayName,
    }));
    return (
        <div id="api-div">
            <pre style={{textAlign: "left"}}>
                {JSON.stringify(result, null, 2) }
            </pre>
        </div>
    );
};
