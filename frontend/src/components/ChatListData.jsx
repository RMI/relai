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
                    <td style={{borderWidth: 0.5}}>select</td>
                    <td style={{borderWidth: 0.5}}>Topic</td>
                    <td style={{borderWidth: 0.5}}>Members</td>
                    <td style={{borderWidth: 0.5}}>ID</td>
                    <td style={{borderWidth: 0.5}}>Web URL</td>
                </tr></thead>
                <tbody>
                    {props.graphData.map((data, index) => (
                        <tr key={index}>
                            <td style={{borderWidth: 0.5}}>
                                <input type="radio" id={data.id} name="chat_id" value={data.id} />
                            </td>
                            <td style={{borderWidth: 0.5}}>{data.topic}</td>
                            <td style={{borderWidth: 0.5}}>{data.members.join(", ")}</td>
                            <td style={{borderWidth: 0.5}}>
                                {data.id}&nbsp;
                                <button type="button" class="btn btn-primary" onClick={()=>navigator.clipboard.writeText(data.id)}>
                                  <i class="bi bi-clipboard"></i>
                                </button>
                            </td>
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
