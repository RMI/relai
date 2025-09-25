import React from 'react';

/**
 * Renders information about the user obtained from MS Graph
 * @param props
 */
export const FilesContentData = (props) => {
    const data = props.graphData;
    const result = data.map(e => ({
        id: e.id,
        type: "onedrive file",
        date_time: e.lastModifiedDateTime,
        author: e.lastModifiedBy.user.displayName,
        content: e.text,
        subject: e.name
    }));

    return (
        <div id="files-div">
            <pre style={{textAlign: "left"}}>
                { JSON.stringify(result, null, 2) }
            </pre>
        </div>
    );
};
