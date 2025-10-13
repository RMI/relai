import { getChannelMessageList } from '../graph';

export async function get_channel_msgs(token) {
  let selected_channels = [...document.querySelectorAll("select[name='channel'] > :checked")];
  selected_channels = selected_channels.filter(d => d.value != 'Select Team Channel');

  const selected_channels_ids = selected_channels.map(e => e.dataset.channel_id);
  const selected_channels_names = selected_channels.map(e => e.dataset.channel_name);
  const selected_teams_ids = selected_channels.map(e => e.dataset.team_id);
  const selected_teams_names = selected_channels.map(e => e.dataset.team_name);

  let channel_msgs = Promise.resolve([]);

  if (selected_channels_ids && selected_channels_ids.length >= 1) {
    channel_msgs = await getChannelMessageList(token, selected_teams_ids, selected_channels_ids);

    channel_msgs = channel_msgs.map(e => ({
      id: e.id,
      type: "channel message",
      source: selected_teams_names[selected_teams_ids.indexOf(e.channelIdentity.teamId)] + ' > ' + selected_channels_names[selected_channels_ids.indexOf(e.channelIdentity.channelId)],
      date_time: e.lastModifiedDateTime,
      author: e.from?.user?.displayName || "",
      content: new DOMParser().parseFromString(e.body.content || "", 'text/html').body.textContent,
      subject: e.subject || ""
    }));
  }

  return channel_msgs;
}
