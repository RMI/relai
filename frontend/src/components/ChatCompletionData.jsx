import React from "react";

/**
 * Renders AI summary of content
 * @param props
 */
export const ChatCompletionData = (props) => {
    const result = props.graphData.content;

    return (
        <div id="api-div">
            <pre style={{textAlign: "left", whiteSpace: "pre-wrap"}}>
                { result }
            </pre>
        </div>
    );
};
