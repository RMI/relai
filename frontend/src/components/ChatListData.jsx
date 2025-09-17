import React from "react";

/**
 * Renders information about the user obtained from MS Graph
 * @param props
 */
export const ChatListData = (props) => {
    return (
        <div id="chatslist-div">
            <table>
                <thead><tr>
                    <td style={{borderWidth: 0.5}}>Topic</td>
                    <td style={{borderWidth: 0.5}}>ID</td>
                    <td style={{borderWidth: 0.5}}>Web URL</td>
                </tr></thead>
                <tbody>
                    {props.graphData.value.map((data, index) => (
                        <tr key={index}>
                            <td style={{borderWidth: 0.5}}>{data.topic}</td>
                            <td style={{borderWidth: 0.5}}>{data.id}</td>
                            <td style={{borderWidth: 0.5}}>{data.webUrl}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
