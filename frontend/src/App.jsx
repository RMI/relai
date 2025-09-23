import React, { useState } from 'react';

import { PageLayout } from './components/PageLayout';
import { loginRequest } from './authConfig';
import { getGraphResponse, getProfile, getChannelMessageList, getChatList, getChatMessages, getEmail, getTeamList } from './graph';

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
                    const chat_id = document.getElementById("chat_id").value;
                    const team_id = document.getElementById("team_id").value;
                    const channel_id = document.getElementById("channel_id").value;

                    const file_list_url = "https://graph.microsoft.com/v1.0/me/drive/root:/" + file_path + ":/children";

                    const email = getEmail(token);
                    const file_list = getGraphResponse(token, file_list_url);
                    const chat_msgs = getChatMessages(token, chat_id);
                    const channel_msgs = getChannelMessageList(token, team_id, channel_id);

                    Promise.all([email, file_list, chat_msgs, channel_msgs])
                        .then(([email, file_list, chat_msgs, channel_msgs]) => {
                            const email_result = email.value.map(e => ({
                                id: e.id,
                                type: "email",
                                date_time: e.receivedDateTime,
                                author: e.from.emailAddress.address,
                                content: new DOMParser().parseFromString(e.body.content, 'text/html').body.textContent || "",
                                subject: e.subject
                            }));

                            const chat_msgs_result = chat_msgs.value.map(e => ({
                                id: e.id,
                                type: "chat message",
                                date_time: e.lastModifiedDateTime,
                                author: e.from.user.displayName,
                                content: new DOMParser().parseFromString(e.body.content, 'text/html').body.textContent || "",
                                subject: e.subject
                            }));

                            const channel_msgs_result = channel_msgs.value.map(e => ({
                                id: e.id,
                                type: "channel message",
                                date_time: e.lastModifiedDateTime,
                                author: (e.from !== null) ? e.from.user.displayName : "",
                                content: new DOMParser().parseFromString(e.body.content, 'text/html').body.textContent || "",
                                subject: e.subject
                            }));

                            const content = email_result.concat(chat_msgs_result, channel_msgs_result);

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
                getChatList(response.accessToken).then((response) => setGraphData(response));
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
        // Silently acquires an access token which is then attached to a request for MS Graph data
        const team_id = formData.get("team_id");
        const channel_id = formData.get("channel_id");
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                getChannelMessageList(response.accessToken, team_id, channel_id).then((response) => setGraphData(response));
            });
    }

    return (
        <>
            <h5 className="api">Channel Message List</h5>
            {graphData ? (
                <ChannelMessageData graphData={graphData} />
            ) : (
                <form action={RequestData}>
                    <label>
                        Team ID: <input name="team_id" />
                    </label>
                    <label>
                        Channel ID: <input name="channel_id" />
                    </label>
                    <button variant="secondary" type="submit">
                        Request Channel Message List
                    </button>
                </form>
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
                        const urls = response.value.map(d => d["@microsoft.graph.downloadUrl"]);

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
                                const result = response.value.map((e,i) => ({
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
            {graphData ? (
                <APIData graphData={graphData} />
            ) : (
                <form action={RequestData}>
                    <label>
                        API URL: <input name="api_url" />
                    </label>
                    <button variant="secondary" type="submit">
                        Request API call
                    </button>
                </form>
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
        // Silently acquires an access token which is then attached to a request for MS Graph data
        const chat_id = formData.get("chat_id");
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                getChatMessages(response.accessToken, chat_id).then((response) => setGraphData(response));
            });
    }

    return (
        <>
            <h5 className="email">Chat Messages</h5>
            {graphData ? (
                <ChatMessagesData graphData={graphData} />
            ) : (
                <form action={RequestData}>
                    <label>
                        Chat ID: <input name="chat_id" />
                    </label>
                    <button variant="secondary" type="submit">
                        Get Chat Messages
                    </button>
                </form>
            )}
        </>
    );
};

/**
 * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
 */
const MainContent = () => {
    return (
        <div className="App">
            <AuthenticatedTemplate>
                <ChatCompletion />
                <br />
                <label>
                    File Path: <input id="file_path" defaultValue="test_folder" />
                </label>
                <br />
                <label>
                    Chat ID: <input id="chat_id" defaultValue="19:94911207bd8e4da590b77fb2b85afa20@thread.v2" />
                </label>
                <br />
                <label>
                    Team ID: <input id="team_id" defaultValue="fc761c82-e3fd-4c75-9171-3760e7f07c67" />
                </label>
                <br />
                <label>
                    Channel ID: <input id="channel_id" defaultValue="19:8cfpaKEr2j5_-rx8_RVfDUR6MBOV-WPGo7vpVmZ20KE1@thread.tacv2" />
                </label>
                <hr />
                <ProfileContent />
                <ChatListContent />
                <TeamChannelsListContent />
                <APIContent />
                <hr />
                <EmailContent />
                <ChatMessagesContent />
                <ChannelMessageListContent />
                <FilesContent />
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
