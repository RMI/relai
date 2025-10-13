import React from "react";

export const ChatsDropdownData = (props) => {
    let data = props.graphData;

    return (
        <>
            {data.map(e => (
                <option
                    value = {e.id}
                    data-id = {e.id}
                    data-chat_topic = {e.topic}
                    data-chat_members = {e.members.join(", ")}
                >
                    {(e.topic ? e.topic + ' ' : '') + ' (' + e.members.join(", ") + ')'}
                </option>
            ))}
        </>
    );
};
