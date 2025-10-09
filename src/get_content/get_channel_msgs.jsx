import { getChannelMessageList } from '../graph';

export async function get_channel_msgs(token) {
  const selected_channels = document.querySelectorAll('input[name="teamchannel_id"]:checked');

  let channel_msgs = Promise.resolve([]);

  if (selected_channels && selected_channels.length >= 1) {
    const selected_team_ids = [...selected_channels].map(e => e.dataset.team_id);
    const selected_team_names = [...selected_channels].map(e => e.dataset.team_name);
    const selected_channel_ids = [...selected_channels].map(e => e.dataset.channel_id);
    const selected_channel_names = [...selected_channels].map(e => e.dataset.channel_name);

    channel_msgs = await getChannelMessageList(token, selected_team_ids, selected_channel_ids);

    channel_msgs = channel_msgs.map(e => ({
      id: e.id,
      type: "channel message",
      source: selected_team_names[selected_team_ids.indexOf(e.channelIdentity.teamId)] + ' > ' + selected_channel_names[selected_channel_ids.indexOf(e.channelIdentity.channelId)],
      date_time: e.lastModifiedDateTime,
      author: e.from?.user?.displayName || "",
      content: new DOMParser().parseFromString(e.body.content || "", 'text/html').body.textContent,
      subject: e.subject || ""
    }));
  }

  return channel_msgs;
}
