import React from "react";

/**
 * Renders information about the user obtained from MS Graph
 * @param props
 */
export const TeamChannelsListData = (props) => {
    const data = props.graphData.flat().filter(n => n);

    return (
        <div id="chatslist-div">
            <table>
                <thead><tr>
                    <td style={{borderWidth: 0.5}}>select</td>
                    <td style={{borderWidth: 0.5}}>Channel Name</td>
                    <td style={{borderWidth: 0.5}}>Team</td>
                    <td style={{borderWidth: 0.5}}>Team Description</td>
                    <td style={{borderWidth: 0.5}}>Web URL</td>
                </tr></thead>
                <tbody>
                    {data.map((data, index) => (
                        <tr key={index}>
                            <td style={{borderWidth: 0.5}}>
                                <input type="radio" name="teamchannel_id" data-team_id={data.team_id} data-channel_id={data.id} />
                            </td>
                            <td style={{borderWidth: 0.5}}>{data.displayName}</td>
                            <td style={{borderWidth: 0.5}}>{data.team_name}</td>
                            <td style={{borderWidth: 0.5}}>{data.team_desc}</td>
                            <td style={{borderWidth: 0.5}}>
                                <a href={data.webUrl} target="blank">web URL</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
