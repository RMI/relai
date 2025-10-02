import { daysBefore_global } from './values';

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

export async function getChannelMessageList(accessToken, team_ids, channel_ids, daysBefore = daysBefore_global) {
    const msgs_promises = channel_ids.map((channel_id, i) => {
        return getGraphResponse(
            accessToken,
            "https://graph.microsoft.com/v1.0/teams/" +
                team_ids[i] +
                "/channels/" +
                channel_id +
                "/messages/delta?$filter=lastModifiedDateTime gt " +
                getStartFromDateStr(daysBefore) +
                "T00:00:00.000Z"
            // must filter from append delta endpoint
            // must filter by lastModifiedDateTime, not createdDateTime
            // must filter with gt, not ge
            // time format must be like 2025-08-10T00:00:00.000Z
            // get replies too: ?&$expand=replies
        );
    });

    const messages = await Promise.all(msgs_promises);
    return messages.map(e => e.value).flat();
}

export async function getChatList(accessToken) {
    return getGraphResponse(accessToken, "https://graph.microsoft.com/v1.0/me/chats")
}

export async function getChatMembers(accessToken, chat_id) {
    return getGraphResponse(accessToken, "https://graph.microsoft.com/v1.0/me/chats/" + chat_id + "/members")
        .then(response => response.value.map((e) => e.displayName))
        .catch(error => console.log(error));
}

export async function getChatMessages(accessToken, chats_ids, daysBefore = daysBefore_global) {
    const msgs_promises = chats_ids.map(chat_id => {
        return getGraphResponse(
            accessToken,
            "https://graph.microsoft.com/v1.0/me/chats/" +
                chat_id +
                "/messages?$filter=lastModifiedDateTime gt " +
                getStartFromDateStr(daysBefore) +
                "T00:00:00.000Z"
            // must filter by lastModifiedDateTime, not createdDateTime
            // must filter with gt, not ge
            // time format must be like 2025-08-10T00:00:00.000Z
        );
    });

    const messages = await Promise.all(msgs_promises);
    return messages.map(e => e.value).flat();
}

export async function getFileList(accessToken, file_path, daysBefore = daysBefore_global) {
    const api_url =
        "https://graph.microsoft.com/v1.0/me/drive/root:/" +
        file_path +
        ":/children";
    const dir_list = await getGraphResponse(accessToken, api_url);

    const recent_dir_list = dir_list.value
        .filter(e => e.lastModifiedDateTime > getStartFromDateStr(daysBefore));
    const file_list = recent_dir_list.filter(e => e.file);
    const subfolder_list = recent_dir_list.filter(e => e.folder);

    return file_list;
}

export async function getFileListFromMultiplePaths(accessToken, file_paths, daysBefore = daysBefore_global) {
  file_paths = file_paths.filter(e => e); // remove null, undefined, and ""

  const file_paths_uniq = [...new Set(file_paths)];

  const filelists_promise = file_paths_uniq
  .map(file_path => getFileList(accessToken, file_path, daysBefore));

  let filelists = await Promise.all(filelists_promise);
  filelists = filelists.flat();

  return filelists;
}

export async function getFileContent(file_url) {
    const config = {
        newlineDelimiter: " ",
        ignoreNotes: true
    };
    const response = await fetch(file_url);
    const arrayBuffer = await response.arrayBuffer();
    const result = await officeParser.parseOfficeAsync(arrayBuffer, config);
    return result;
}

export async function getFilesContent(accessToken, file_paths, daysBefore = daysBefore_global) {
    let file_list = await getFileListFromMultiplePaths(accessToken, file_paths, daysBefore);

    // filter to files that officeParser can parse
    // https://github.com/harshankur/officeParser?tab=readme-ov-file#supported-file-types
    // https://learn.microsoft.com/en-us/azure/communication-services/concepts/email/email-attachment-allowed-mime-types#attachment-types
    const mimeTypes = new Set([
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/pdf"
    ]);
    file_list = file_list.filter(e => mimeTypes.has(e.file.mimeType));

    const urls = file_list.map(d => d["@microsoft.graph.downloadUrl"]);

    const result = await Promise.all(urls.map(a => getFileContent(a)))
        .then((text) => {
            return file_list.map((e, i) => ({
                ...e,
                text: text[i]
            }));
        });

    return result;
}

export async function getGroupFileList(accessToken, group_id, file_path, daysBefore = daysBefore_global) {
    const api_url =
        "https://graph.microsoft.com/v1.0/groups/" +
        group_id +
        "/drive/root:/" +
        file_path +
        ":/children";
    const dir_list = await getGraphResponse(accessToken, api_url);
    const recent_dir_list = dir_list.value
        .filter(e => e.lastModifiedDateTime > getStartFromDateStr(daysBefore));
    const file_list = recent_dir_list.filter(e => e.file);
    const subfolder_list = recent_dir_list.filter(e => e.folder);
    return file_list;
}

export async function getGroupFileListFromMultiplePaths(accessToken, group_id, file_paths, daysBefore = daysBefore_global) {
  file_paths = file_paths.filter(e => e); // remove null, undefined, and ""

  const file_paths_uniq = [...new Set(file_paths)];

  const filelists_promise = file_paths_uniq
  .map(file_path => getGroupFileList(accessToken, group_id, file_path, daysBefore));

  let filelists = await Promise.all(filelists_promise);
  filelists = filelists.flat();

  return filelists;
}

export async function getGroupFilesContent(accessToken, group_id, file_paths, daysBefore = daysBefore_global) {
    let file_list = await getGroupFileListFromMultiplePaths(accessToken, group_id, file_paths);

    // filter to files that officeParser can parse
    // https://github.com/harshankur/officeParser?tab=readme-ov-file#supported-file-types
    // https://learn.microsoft.com/en-us/azure/communication-services/concepts/email/email-attachment-allowed-mime-types#attachment-types
    const mimeTypes = new Set([
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/pdf"
    ]);
    file_list = file_list.filter(e => mimeTypes.has(e.file.mimeType));

    const urls = file_list.map(d => d["@microsoft.graph.downloadUrl"]);

    const result = await Promise.all(urls.map(a => getFileContent(a)))
        .then((text) => {
            return file_list.map((e, i) => ({
                ...e,
                text: text[i]
            }));
        });

    return result;
}

export async function getTeamList(accessToken) {
    return getGraphResponse(accessToken, "https://graph.microsoft.com/v1.0/me/joinedTeams")
}

export async function getGroupList(accessToken) {
    const profile_data = await getProfile(accessToken);
    const api_url =
        "https://graph.microsoft.com/v1.0/users/" +
        profile_data.id +
        "/teamwork/associatedTeams";
    return getGraphResponse(accessToken, api_url);
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
