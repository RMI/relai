/**
 * Attaches a given access token to a MS Graph API call. Returns information about the user
 * @param accessToken
 */
export async function getGraphResponse(accessToken, url) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    return fetch(url, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export async function getProfile(accessToken) {
    return getGraphResponse(accessToken, "https://graph.microsoft.com/v1.0/me")
}

export async function getEmail(accessToken) {
    return getGraphResponse(accessToken, "https://graph.microsoft.com/v1.0/me/messages")
}

export async function getChannelList(accessToken, team_id) {
    return getGraphResponse(accessToken, "https://graph.microsoft.com/v1.0/teams/" + team_id + "/channels")
}

export async function getChannelMessageList(accessToken, team_id, channel_id) {
    return getGraphResponse(accessToken, "https://graph.microsoft.com/v1.0/teams/" + team_id + "/channels/" + channel_id + "/messages")
}

export async function getChatList(accessToken) {
    return getGraphResponse(accessToken, "https://graph.microsoft.com/v1.0/me/chats")
}

export async function getChatMembers(accessToken, chat_id) {
    return getGraphResponse(accessToken, "https://graph.microsoft.com/v1.0/me/chats/" + chat_id + "/members")
        .then(response => response.value.map((e) => e.displayName))
        .catch(error => console.log(error));
}

export async function getChatMessages(accessToken, chat_id) {
    return getGraphResponse(accessToken, "https://graph.microsoft.com/v1.0/me/chats/" + chat_id + "/messages")
}

export async function getFileList(accessToken) {
    return getGraphResponse(accessToken, "https://graph.microsoft.com/v1.0/me/chats")
}

export async function getTeamList(accessToken) {
    return getGraphResponse(accessToken, "https://graph.microsoft.com/v1.0/teams")
}
