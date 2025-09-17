import React, { useState } from 'react';

import { PageLayout } from './components/PageLayout';
import { loginRequest } from './authConfig';
import { getGraphResponse, getProfile, getChannelList, getChannelMessageList, getChatList, getEmail, getTeamList } from './graph';
import { ProfileData } from './components/ProfileData';
import { ChannelListData } from './components/ChannelListData';
import { ChannelMessageListData } from './components/ChannelMessageListData';
import { ChatListData } from './components/ChatListData';
import { EmailData } from './components/EmailData';
import { FileListData } from './components/FileListData';
import { TeamListData } from './components/TeamListData';
import { APIData } from './components/APIData';

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

const TeamListContent = () => {
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
                getTeamList(response.accessToken).then((response) => setGraphData(response));
            });
    }

    return (
        <>
            <h5 className="teamList">Team List</h5>
            {graphData ? (
                <TeamListData graphData={graphData} />
            ) : (
                <Button variant="secondary" onClick={RequestData}>
                    Request Team List
                </Button>
            )}
        </>
    );
};

const ChannelListContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestData(formData) {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        const team_id = formData.get("team_id");
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                getChannelList(response.accessToken, team_id).then((response) => setGraphData(response));
            });
    }

    return (
        <>
            <h5 className="api">Channel List</h5>
            {graphData ? (
                <ChannelListData graphData={graphData} />
            ) : (
                <form action={RequestData}>
                    <label>
                        Team ID: <input name="team_id" />
                    </label>
                    <button variant="secondary" type="submit">
                        Request Channel List
                    </button>
                </form>
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
                <ChannelMessageListData graphData={graphData} />
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
                    Request Email
                </Button>
            )}
        </>
    );
};

const FileListContent = () => {
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
                getGraphResponse(response.accessToken, url).then((response) => setGraphData(response));
            });
    }

    return (
        <>
            <h5 className="api">File List</h5>
            {graphData ? (
                <FileListData graphData={graphData} />
            ) : (
                <form action={RequestData}>
                    <label>
                        File Path: <input name="file_path" />
                    </label>
                    <button variant="secondary" type="submit">
                        Request File List
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

/**
 * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
 */
const MainContent = () => {
    return (
        <div className="App">
            <AuthenticatedTemplate>
                <ProfileContent />
                <ChatListContent />
                <TeamListContent />
                <ChannelListContent />
                <ChannelMessageListContent />
                <EmailContent />
                <FileListContent />
                <APIContent />
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
