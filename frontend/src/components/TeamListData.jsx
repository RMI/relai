import React from "react";

/**
 * Renders information about the user obtained from MS Graph
 * @param props
 */
export const TeamListData = (props) => {
    return (
        <div id="chatslist-div">
            <table>
                <thead><tr>
                    <td style={{borderWidth: 0.5}}>Name</td>
                    <td style={{borderWidth: 0.5}}>ID</td>
                </tr></thead>
                <tbody>
                    {props.graphData.value.map((data, index) => (
                        <tr key={index}>
                            <td style={{borderWidth: 0.5}}>{data.displayName}</td>
                            <td style={{borderWidth: 0.5}}>{data.id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
