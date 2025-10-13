import { getGroupFilesContent } from '../graph';

export async function get_team_files(token) {
  const team_selectors = [...document.querySelectorAll("select[name='team']")];
  let selected_team_ids = team_selectors.map(e => e.querySelector(':checked').dataset.id);
  let selected_team_names = team_selectors.map(e => e.querySelector(':checked').dataset.name);

  const team_path_elems = document.querySelectorAll("input[name='team_path']");
  let selected_team_paths = [...team_path_elems].map(e => e.value);

  const non_empty_team_idxs = selected_team_ids.reduce((a, v, i) => { if (v && v !== '') { a.push(i) } return a }, []);
  selected_team_ids = non_empty_team_idxs.map(i => selected_team_ids[i]);
  selected_team_names = non_empty_team_idxs.map(i => selected_team_names[i]);
  selected_team_paths = non_empty_team_idxs.map(i => selected_team_paths[i]);

  let team_files_content = Promise.resolve([]);

  if (selected_team_ids && selected_team_ids.length > 0) {
    team_files_content = selected_team_ids.map((e, i) => {
      return getGroupFilesContent(token, selected_team_ids[i], [selected_team_paths[i]]);
    });

    team_files_content = (await Promise.all(team_files_content));

    team_files_content = team_files_content.map((team_files, i) => {
      return team_files.map(e => { e.teamId = selected_team_ids[i]; return e;});
    })

    team_files_content = team_files_content.flat();

    team_files_content = team_files_content.map(e => ({
      id: e.id,
      type: "team file",
      source: selected_team_names[selected_team_ids.indexOf(e.teamId)] + ': ' + e.parentReference.path.replace('/drive/root:', '') + '/' + e.name,
      date_time: e.lastModifiedDateTime,
      author: e.lastModifiedBy.user.displayName,
      content: e.text,
      subject: e.name
    }));
  }

  return team_files_content;
}
