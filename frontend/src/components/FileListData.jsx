import React from "react";

/**
 * Renders information about the user obtained from MS Graph
 * @param props
 */
export const FileListData = (props) => {
    return (
        <div id="filelist-div">
            <table>
                <thead><tr>
                    <td style={{borderWidth: 0.5}}>Filename</td>
                    <td style={{borderWidth: 0.5}}>Last Modified Date</td>
                    <td style={{borderWidth: 0.5}}>Type</td>
                    <td style={{borderWidth: 0.5}}>ID</td>
                </tr></thead>
                <tbody>
                    {props.graphData.value.map((data, index) => (
                        <tr key={index}>
                            <td style={{borderWidth: 0.5}}>{data.name}</td>
                            <td style={{borderWidth: 0.5}}>{data.lastModifiedDateTime}</td>
                            <td style={{borderWidth: 0.5}}>{data.file.mimeType}</td>
                            <td style={{borderWidth: 0.5}}>{data.id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
