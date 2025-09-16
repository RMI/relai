import React from "react";

/**
 * Renders information about the user obtained from MS Graph
 * @param props
 */
export const EmailData = (props) => {
    return (
        <div id="email-div">
            <table>
                <thead><tr>
                    <td style={{borderWidth: 0.5}}>Subject</td>
                    <td style={{borderWidth: 0.5}}>Date</td>
                </tr></thead>
                <tbody>
                    {props.graphData.value.map((data, index) => (
                        <tr key={index}>
                            <td style={{borderWidth: 0.5}}>{data.subject}</td>
                            <td style={{borderWidth: 0.5}}>{data.receivedDateTime}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
