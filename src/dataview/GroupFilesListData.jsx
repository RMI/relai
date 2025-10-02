import React from 'react';

/**
 * @param props
 */
export const GroupFilesListData = (props) => {
    const data = props.graphData;
    const result = data.map(e => ({
        id: e.id,
        type: "group file",
        lastModifiedDateTime: e.lastModifiedDateTime,
        "lastModifiedBy.user.displayName": e.lastModifiedBy.user.displayName,
        name: e.name,
        "file.mimeType": e.file.mimeType,
        webUrl: e.webUrl,
        "parentReference.path": e.parentReference.path
    }));

    return (
        <div id="groupfiles-div">
            <pre style={{textAlign: "left"}}>
                { JSON.stringify(result, null, 2) }
            </pre>
        </div>
    );
};
