import { getGroupFilesContent } from '../graph';

export async function get_team_files(token) {
  const selected_team = document.querySelector('input[name="group_select"]:checked');
  const team_file_paths = Array.from(document.querySelectorAll("#group_file_path"), e => e.value);

  let team_file_content = Promise.resolve([]);

  if (selected_team) {
    const team_id = selected_team.dataset.group_id;
    team_file_content = await getGroupFilesContent(token, team_id, team_file_paths);

    team_file_content = team_file_content.map(e => ({
      id: e.id,
      type: "team file",
      source: selected_team.dataset.group_name + ': ' + e.parentReference.path.replace('/drive/root:', '') + '/' + e.name,
      date_time: e.lastModifiedDateTime,
      author: e.lastModifiedBy.user.displayName,
      content: e.text,
      subject: e.name
    }));
  }

  return team_file_content;
}
