import React from "react";

/**
 * Renders information about the user obtained from MS Graph
 * @param props
 */
export const ChannelMessageListData = (props) => {
    return (
        <div id="chatslist-div">
            <table>
                <thead><tr>
                    <td style={{borderWidth: 0.5}}>Subject</td>
                    <td style={{borderWidth: 0.5}}>Content</td>
                    <td style={{borderWidth: 0.5}}>Date</td>
                    <td style={{borderWidth: 0.5}}>Team</td>
                    <td style={{borderWidth: 0.5}}>Channel</td>
                    <td style={{borderWidth: 0.5}}>Type</td>
                    <td style={{borderWidth: 0.5}}>ID</td>
                </tr></thead>
                <tbody>
                    {props.graphData.value.map((data, index) => (
                        <tr key={index}>
                            <td style={{borderWidth: 0.5}}>{data.subject}</td>
                            <td style={{borderWidth: 0.5}}>{data.body.content}</td>
                            <td style={{borderWidth: 0.5}}>{data.createdDateTime}</td>
                            <td style={{borderWidth: 0.5}}>{data.channelIdentity.teamId}</td>
                            <td style={{borderWidth: 0.5}}>{data.channelIdentity.channelId}</td>
                            <td style={{borderWidth: 0.5}}>{data.messageType}</td>
                            <td style={{borderWidth: 0.5}}>{data.id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
