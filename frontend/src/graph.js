export const daysBefore_global = 14;

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

export async function getEmail(accessToken, daysBefore = daysBefore_global) {
    return getGraphResponse(accessToken, "https://graph.microsoft.com/v1.0/me/messages?$filter=receivedDateTime gt " + getStartFromDateStr(daysBefore))
}

export async function getChannelList(accessToken, team_id) {
    return getGraphResponse(accessToken, "https://graph.microsoft.com/v1.0/teams/" + team_id + "/channels")
}

export async function getChannelMessageList(accessToken, team_id, channel_id, daysBefore = daysBefore_global) {
    return getGraphResponse(accessToken, "https://graph.microsoft.com/v1.0/teams/" + team_id + "/channels/" + channel_id + "/messages/delta?$filter=lastModifiedDateTime gt " + getStartFromDateStr(daysBefore) + "T00:00:00.000Z")
    // must filter from append delta endpoint
    // must filter by lastModifiedDateTime, not createdDateTime
    // must filter with gt, not ge
    // time format must be like 2025-08-10T00:00:00.000Z
    // get replies too: ?&$expand=replies
}

export async function getChatList(accessToken) {
    return getGraphResponse(accessToken, "https://graph.microsoft.com/v1.0/me/chats")
}

export async function getChatMembers(accessToken, chat_id) {
    return getGraphResponse(accessToken, "https://graph.microsoft.com/v1.0/me/chats/" + chat_id + "/members")
        .then(response => response.value.map((e) => e.displayName))
        .catch(error => console.log(error));
}

export async function getChatMessages(accessToken, chat_id, daysBefore = daysBefore_global) {
    return getGraphResponse(accessToken, "https://graph.microsoft.com/v1.0/me/chats/" + chat_id + "/messages?$filter=lastModifiedDateTime gt " + getStartFromDateStr(daysBefore) + "T00:00:00.000Z")
    // must filter by lastModifiedDateTime, not createdDateTime
    // must filter with gt, not ge
    // time format must be like 2025-08-10T00:00:00.000Z
}

export async function getFileList(accessToken) {
    return getGraphResponse(accessToken, "https://graph.microsoft.com/v1.0/me/chats")
}

export async function getTeamList(accessToken) {
    return getGraphResponse(accessToken, "https://graph.microsoft.com/v1.0/teams")
}

export function getStartFromDateStr(daysBefore = daysBefore_global) {
    var incrementDate = function (date, amount) {
        var tmpDate = new Date(date);
        tmpDate.setDate(tmpDate.getDate() + amount)
        return tmpDate;
    };

    let padToTwo = number => number <= 99 ? `0${number}`.slice(-2) : number;

    var currentDate = new Date();
    var startFromDate = incrementDate(currentDate, -daysBefore);
    var startFromDateStr = startFromDate.getFullYear() + "-" + padToTwo(startFromDate.getMonth()+1) + "-" + startFromDate.getDate();

    return startFromDateStr;
}
