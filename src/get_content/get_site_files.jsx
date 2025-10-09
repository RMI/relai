import { getGroupFileList } from '../graph';
import { getGroupFilesContent } from '../graph';

export async function get_site_files(token) {
  const site_selectors = [...document.querySelectorAll("select[name='group']")];
  let selected_site_ids = site_selectors.map(e => e.querySelector(':checked').dataset.id);
  let selected_site_names = site_selectors.map(e => e.querySelector(':checked').dataset.name);

  const site_path_elems = document.querySelectorAll("input[name='path']");
  let selected_site_paths = [...site_path_elems].map(e => e.value);

  const non_empty_site_idxs = selected_site_ids.reduce((a, v, i) => { if (v && v !== '') { a.push(i) } return a }, []);
  selected_site_ids = non_empty_site_idxs.map(i => selected_site_ids[i]);
  selected_site_names = non_empty_site_idxs.map(i => selected_site_names[i]);
  selected_site_paths = non_empty_site_idxs.map(i => selected_site_paths[i]);

  let site_files_content = Promise.resolve([]);

  if (selected_site_ids && selected_site_ids.length > 0) {
    site_files_content = selected_site_ids.map((e, i) => {
      return getGroupFilesContent(token, selected_site_ids[i], [selected_site_paths[i]]);
    });

    site_files_content = (await Promise.all(site_files_content));

    site_files_content = site_files_content.map((group_files, i) => {
      return group_files.map(e => { e.groupId = selected_site_ids[i]; return e;});
    })

    site_files_content = site_files_content.flat();

    site_files_content = site_files_content.map(e => ({
      id: e.id,
      type: "site file",
      source: selected_site_names[selected_site_ids.indexOf(e.groupId)] + ': ' + e.parentReference.path.replace('/drive/root:', '') + '/' + e.name,
      date_time: e.lastModifiedDateTime,
      author: e.lastModifiedBy.user.displayName,
      content: e.text,
      subject: e.name
    }));
  }

  return site_files_content;
}
