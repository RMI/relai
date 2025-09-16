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
                </tr></thead>
                <tbody>
                    {props.graphData.value.map((data, index) => (
                        <tr key={index}>
                            <td style={{borderWidth: 0.5}}>{data.topic}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
