import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useMsal } from '@azure/msal-react';
import { AzureOpenAI } from 'openai';

import { loginRequest } from '../authConfig';
import { getEmail, getFileList, getChatMessages, getChannelMessageList } from '../graph';
import { ChatCompletionData } from '../dataview';
import { systemPrompt, userPrompt } from '../values';

export const ChatCompletion = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestChatCompletion() {
        const endpoint = import.meta.env.VITE_AZURE_FOUNDRY_ENDPOINT;
        const apiKey = import.meta.env.VITE_AZURE_FOUNDRY_KEY;
        const apiVersion = import.meta.env.VITE_AZURE_FOUNDRY_API_VERSION;
        const deployment = import.meta.env.VITE_AZURE_FOUNDRY_MODEL;

        const temperature = 0.2;
        const max_tokens = 800;

        async function main(content) {
            const client = new AzureOpenAI({
                endpoint,
                apiKey,
                apiVersion,
                deployment,
                dangerouslyAllowBrowser: true
            });
            const result = await client.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt },
                    { role: "user", content: JSON.stringify(content) },
                ],
                model: "",
                temperature: temperature,
                max_tokens: max_tokens
            });

            return(result.choices[0].message);
        }

        async function getToken() {
            instance
                .acquireTokenSilent({
                    ...loginRequest,
                    account: accounts[0],
                })
                .then((response) => {
                    const token = response.accessToken;

                    const file_path = document.getElementById("file_path").value;
                    const selected_chats = document.querySelector('input[name="chat_id"]:checked');
                    const selected_channels = document.querySelector('input[name="teamchannel_id"]:checked');

                    const email = getEmail(token);

                    const file_content = getFileList(token, file_path)
                        .then((file_list) => {
                            const urls = file_list.map(d => d["@microsoft.graph.downloadUrl"]);

                            async function get_content(url, callback) {
                               const config = {
                                    newlineDelimiter: " ",
                                    ignoreNotes: true
                                }
                                const response = await fetch(url);
                                const arrayBuffer = await response.arrayBuffer();
                                const result = await officeParser.parseOfficeAsync(arrayBuffer, config);
                                return(result);
                            }

                            return Promise.all(urls.map(a => get_content(a)))
                                .then((text) => {
                                    const result = file_list.map((e,i) => ({
                                        ...e,
                                        text: text[i]
                                    }));
                                    return(result);
                                })
                        });

                    let chat_msgs = Promise.resolve({value:[]});
                    if (selected_chats !== null) {
                        const chat_id = selected_chats.id;
                        chat_msgs = getChatMessages(token, chat_id);
                    }

                    let channel_msgs = Promise.resolve({value:[]});
                    if (selected_channels !== null) {
                        const team_id = selected_channels.dataset.team_id;
                        const channel_id = selected_channels.dataset.channel_id;
                        channel_msgs = getChannelMessageList(token, team_id, channel_id);
                    }

                    Promise.all([email, file_content, chat_msgs, channel_msgs])
                        .then(([email, file_content, chat_msgs, channel_msgs]) => {
                            const email_result = email.value.map(e => ({
                                id: e.id,
                                type: "email",
                                date_time: e.receivedDateTime,
                                author: e.from?.emailAddress?.address || "",
                                content: new DOMParser().parseFromString(e.body.content || "", 'text/html').body.textContent,
                                subject: e.subject || ""
                            }));

                            const file_content_result = file_content.map(e => ({
                                id: e.id,
                                type: "onedrive file",
                                date_time: e.lastModifiedDateTime,
                                author: e.lastModifiedBy?.user?.displayName || "",
                                content: e.text || "",
                                subject: e.name || ""
                            }));

                            const chat_msgs_result = chat_msgs.value.map(e => ({
                                id: e.id,
                                type: "chat message",
                                date_time: e.lastModifiedDateTime,
                                author: e.from?.user?.displayName || "",
                                content: new DOMParser().parseFromString(e.body.content || "", 'text/html').body.textContent,
                                subject: e.subject || ""
                            }));

                            const channel_msgs_result = channel_msgs.value.map(e => ({
                                id: e.id,
                                type: "channel message",
                                date_time: e.lastModifiedDateTime,
                                author: e.from?.user?.displayName || "",
                                content: new DOMParser().parseFromString(e.body.content || "", 'text/html').body.textContent,
                                subject: e.subject || ""
                            }));

                            const content = email_result.concat(file_content_result, chat_msgs_result, channel_msgs_result);

                            main(content)
                                .then((result) => {
                                    setGraphData(result);
                                })
                                .catch((err) => {
                                    console.error("The sample encountered an error:", err);
                                });
                        })
                });
        }

        getToken();
    }

    return (
        <>
            <h5 className="chatCompletion">RELAI Summary</h5>
            <Button variant="secondary" onClick={RequestChatCompletion}>
                Request RELAI Summary
            </Button>
            <br/>
            {graphData ? (
                <ChatCompletionData graphData={graphData} />
            ) : (
                <br/>
            )}
            <h5 className="filepath_head">File Path</h5>
            <input id="file_path" defaultValue="test_folder" />
            <br/>
            <br/>
        </>
    );
};
