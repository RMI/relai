import React from 'react';

/**
 * @param props
 */
export const GroupFilesContentData = (props) => {
    const data = props.graphData;
    const result = data.map(e => ({
        id: e.id,
        type: "group file",
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
