import React, { useState } from 'react';

import { PageLayout } from './components/PageLayout';
import { loginRequest } from './authConfig';

import { getGraphResponse, getProfile, getChannelMessageList, getChatList, getChatMembers, getChatMessages, getEmail, getTeamList, getStartFromDateStr, daysBefore } from './graph';
import { ProfileData } from './components/ProfileData';
import { ChannelMessageData } from './components/ChannelMessageData';
import { ChatListData } from './components/ChatListData';
import { ChatMessagesData } from './components/ChatMessagesData';
import { EmailData } from './components/EmailData';
import { FilesData } from './components/FilesData';
import { TeamChannelsListData } from './components/TeamChannelsListData';
import { APIData } from './components/APIData';
import { ChatCompletionData } from './components/ChatCompletionData';

import { AzureOpenAI } from 'openai';
import { systemPrompt, userPrompt } from './components/Prompts';

import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import './App.css';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */

const ProfileContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestProfileData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                getProfile(response.accessToken).then((response) => setGraphData(response));
            });
    }

    return (
        <>
            <h5 className="profileContent">Welcome {accounts[0].name}</h5>
            {graphData ? (
                <ProfileData graphData={graphData} />
            ) : (
                <Button variant="secondary" onClick={RequestProfileData}>
                    Request Profile
                </Button>
            )}
        </>
    );
};

const ChatCompletion = () => {
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

                    const file_list_url = "https://graph.microsoft.com/v1.0/me/drive/root:/" + file_path + ":/children";

                    const email = getEmail(token);

                    const file_content = getGraphResponse(token, file_list_url)
                        .then((response) => {
                            const dir_list = response.value
                                .filter(e => e.lastModifiedDateTime > getStartFromDateStr(daysBefore));
                            const file_list = dir_list.filter(e => !e.folder);
                            const subfolder_list = dir_list.filter(e => e.folder);

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
            {graphData ? (
                <ChatCompletionData graphData={graphData} />
            ) : (
                <Button variant="secondary" onClick={RequestChatCompletion}>
                    Request RELAI Summary
                </Button>
            )}
        </>
    );
};

const ChatListContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                const token = response.accessToken;
                getChatList(token)
                    .then((response) => {
                        const membersPromises = response.value.map((e) => {
                            return getChatMembers(token, e.id);
                        });

                        Promise.all(membersPromises)
                            .then((members) => {
                                const result = response.value.map((e,i) => ({
                                    ...e,
                                    members: members[i]
                                }));
                                setGraphData(result);
                            })
                    })
            });
    }

    return (
        <>
            <h5 className="chatList">Chat List</h5>
            {graphData ? (
                <ChatListData graphData={graphData} />
            ) : (
                <Button variant="secondary" onClick={RequestData}>
                    Request Chat List
                </Button>
            )}
        </>
    );
};

const TeamChannelsListContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                getTeamList(response.accessToken)
                    .then((response) => {
                        let teams = response.value;
                        instance
                            .acquireTokenSilent({
                                ...loginRequest,
                                account: accounts[0],
                            })
                            .then(async (response) => {
                                let teams_channels = teams.map((d) => {
                                    const url = "https://graph.microsoft.com/v1.0/teams/" + d.id + "/channels";
                                    return getGraphResponse(response.accessToken, url)
                                        .then((response) => {
                                            if (typeof response.value !== 'undefined') {
                                                return response.value.map(v => ({
                                                    ...v,
                                                    team_id: d.id,
                                                    team_name: d.displayName,
                                                    team_desc: d.description
                                                }));
                                            } else {
                                                return null;
                                            }
                                        });
                                });
                                teams_channels = await Promise.all(teams_channels);
                                setGraphData(teams_channels);
                            });
                    });
            });
    }

    return (
        <>
            <h5 className="teamChannelsList">Team Channels List</h5>
            {graphData ? (
                <TeamChannelsListData graphData={graphData} />
            ) : (
                <Button variant="secondary" onClick={RequestData}>
                    Request Team Channels List
                </Button>
            )}
        </>
    );
};

const ChannelMessageListContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestData(formData) {
        const selected_channels = document.querySelector('input[name="teamchannel_id"]:checked');

        if (selected_channels === null) {
            setGraphData(null);
        } else {
            const team_id = selected_channels.dataset.team_id;
            const channel_id = selected_channels.dataset.channel_id;

            instance
                .acquireTokenSilent({
                    ...loginRequest,
                    account: accounts[0],
                })
                .then((response) => {
                    getChannelMessageList(response.accessToken, team_id, channel_id)
                        .then((response) => setGraphData(response));
                });
        }
    }

    return (
        <>
            <h5 className="api">Channel Messages</h5>
            <Button variant="secondary" onClick={RequestData}>
                Get Channel Messages
            </Button>
            {graphData ? (
                <ChannelMessageData graphData={graphData} />
            ) : (
                <br/>
            )}
        </>
    );
};

const FilesContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestData(formData) {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        const file_path = formData.get("file_path");
        const url = "https://graph.microsoft.com/v1.0/me/drive/root:/" + file_path + ":/children";
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                getGraphResponse(response.accessToken, url)
                    .then((response) => {
                        const dir_list = response.value
                            .filter(e => e.lastModifiedDateTime > getStartFromDateStr(daysBefore));
                        const file_list = dir_list.filter(e => !e.folder);
                        const subfolder_list = dir_list.filter(e => e.folder);

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

                        Promise.all(urls.map(a => get_content(a)))
                            .then((text) => {
                                const result = file_list.map((e,i) => ({
                                    ...e,
                                    text: text[i]
                                }));
                                setGraphData(result);
                            })
                    });
            });
    }

    return (
        <>
            <h5 className="api">Files</h5>
            {graphData ? (
                <FilesData graphData={graphData} />
            ) : (
                <form action={RequestData}>
                    <label>
                        File Path: <input name="file_path" />
                    </label>
                    <button variant="secondary" type="submit">
                        Get Files
                    </button>
                </form>
            )}
        </>
    );
};

const APIContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestData(formData) {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        const url = formData.get("api_url");
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                getGraphResponse(response.accessToken, url).then((response) => setGraphData(response));
            });
    }

    return (
        <>
            <h5 className="api">API</h5>
            <form action={RequestData}>
                <label>
                    API URL: <input name="api_url" />
                </label>
                <button variant="secondary" type="submit">
                    Request API call
                </button>
            </form>
            {graphData ? (
                <APIData graphData={graphData} />
            ) : (
                <br />
            )}
        </>
    );
};

const EmailContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                getEmail(response.accessToken).then((response) => setGraphData(response));
            });
    }

    return (
        <>
            <h5 className="email">Email</h5>
            {graphData ? (
                <EmailData graphData={graphData} />
            ) : (
                <Button variant="secondary" onClick={RequestData}>
                    Get Email
                </Button>
            )}
        </>
    );
};

const ChatMessagesContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestData(formData) {
        const selected_chats = document.querySelector('input[name="chat_id"]:checked');

        if (selected_chats === null) {
            setGraphData(null);
        } else {
            const chat_id = selected_chats.id;

            instance
                .acquireTokenSilent({
                    ...loginRequest,
                    account: accounts[0],
                })
                .then((response) => {
                    getChatMessages(response.accessToken, chat_id).then((response) => setGraphData(response));
                });
        }
    }

    return (
        <>
            <h5 className="email">Chat Messages</h5>
            <Button variant="secondary" onClick={RequestData}>
                Get Chat Messages
            </Button>
            {graphData ? (
                <ChatMessagesData graphData={graphData} />
            ) : (
                <br/>
            )}
        </>
    );
};

/**
 * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
 */
const MainContent = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="App">
            <AuthenticatedTemplate>
                <ChatCompletion />
                <br />
                <label>
                    File Path: <input id="file_path" defaultValue="test_folder" />
                </label>
                <ChatListContent />
                <TeamChannelsListContent />
                <hr />
                <Button variant="secondary" onClick={() => setOpen(!open)} aria-controls="utilities-collapse-text" aria-expanded={open}>
                    toggle utilities
                </Button>
                <Collapse in={open}>
                    <div id="utilities-collapse-text">
                        <ProfileContent />
                        <APIContent />
                        <EmailContent />
                        <ChatMessagesContent />
                        <ChannelMessageListContent />
                        <FilesContent />
                    </div>
                </Collapse>
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <h5 className="card-title">Please sign-in to see your profile information.</h5>
            </UnauthenticatedTemplate>
        </div>
    );
};

export default function App() {
    return (
        <PageLayout>
            <MainContent />
        </PageLayout>
    );
}
