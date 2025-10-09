import { getFilesContent } from '../graph';

export async function get_onedrive_files(token) {
  const onedrive_file_paths = Array.from(document.querySelectorAll("#file_path"), e => e.value);

  let onedrive_files_content = Promise.resolve([]);

  if (onedrive_file_paths && onedrive_file_paths != "") {
    onedrive_files_content = await getFilesContent(token, onedrive_file_paths);

    onedrive_files_content = onedrive_files_content.map(e => ({
      id: e.id,
      type: "onedrive file",
      source: e.parentReference.path.replace('/drive/root:', '') + '/' + e.name,
      date_time: e.lastModifiedDateTime,
      author: e.lastModifiedBy.user.displayName,
      content: e.text,
      subject: e.name
    }));
  }

  return onedrive_files_content;
}
