import React from "react";

/**
 * Renders information about the user obtained from MS Graph
 * @param props
 */
export const TeamChannelsListData = (props) => {
    return (
        <div id="chatslist-div">
            <table>
                <thead><tr>
                    <td style={{borderWidth: 0.5}}>select</td>
                    <td style={{borderWidth: 0.5}}>Channel Name</td>
                    <td style={{borderWidth: 0.5}}>Channel ID</td>
                    <td style={{borderWidth: 0.5}}>Team</td>
                    <td style={{borderWidth: 0.5}}>Team Description</td>
                    <td style={{borderWidth: 0.5}}>Team ID</td>
                    <td style={{borderWidth: 0.5}}>Web URL</td>
                </tr></thead>
                <tbody>
                    {props.graphData.filter(n => n).map((data, index) => (
                        <tr key={index}>
                            <td style={{borderWidth: 0.5}}>
                                <input type="radio" id={data.id} name="teamchannel_id" value={data.id} />
                            </td>
                            <td style={{borderWidth: 0.5}}>{data[0].displayName}</td>
                            <td style={{borderWidth: 0.5}}>
                                {data[0].id}&nbsp;
                                <button type="button" class="btn btn-primary" onClick={()=>navigator.clipboard.writeText(data[0].id)}>
                                  <i class="bi bi-clipboard"></i>
                                </button>
                            </td>
                            <td style={{borderWidth: 0.5}}>{data[0].team_name}</td>
                            <td style={{borderWidth: 0.5}}>{data[0].team_desc}</td>
                            <td style={{borderWidth: 0.5}}>
                                {data[0].team_id}&nbsp;
                                <button type="button" class="btn btn-primary" onClick={()=>navigator.clipboard.writeText(data[0].team_id)}>
                                  <i class="bi bi-clipboard"></i>
                                </button>
                            </td>
                            <td style={{borderWidth: 0.5}}>
                                <a href={data[0].webUrl} target="blank">web URL</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
