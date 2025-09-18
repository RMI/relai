import React from "react";

/**
 * Renders information about the user obtained from MS Graph
 * @param props
 */
export const EmailData = (props) => {
    const data = props.graphData.value;
    // filter date
    const result = data.map(e => ({
        id: e.id,
        type: "email",
        date_time: e.receivedDateTime,
        author: e.from.emailAddress.address,
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
