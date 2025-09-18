import React from "react";

/**
 * Renders information about the user obtained from MS Graph
 * @param props
 */
export const ChannelMessageData = (props) => {
    const data = props.graphData.value;
    const result = data.map(e => ({
        id: e.id,
        type: "channel message",
        date_time: e.lastModifiedDateTime,
        author: (e.from !== null) ? e.from.user.displayName : "",
        content: new DOMParser().parseFromString(e.body.content, 'text/html').body.textContent || "",
        subject: e.subject
    }));
    return (
        <div id="api-div">
            <pre style={{textAlign: "left"}}>
                {JSON.stringify(result, null, 2) }
            </pre>
        </div>
    );
};
