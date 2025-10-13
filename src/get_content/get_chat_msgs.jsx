import { getChatMessages } from '../graph';

export async function get_chat_msgs(token) {
  const chat_selectors = [...document.querySelectorAll("select[name='chat']")];
  let selected_chats_ids = chat_selectors.map(e => e.querySelector(':checked').dataset.id);
  let selected_chats_topics = chat_selectors.map(e => e.querySelector(':checked').dataset.chat_topic);
  let selected_chats_members = chat_selectors.map(e => e.querySelector(':checked').dataset.chat_members);

  let chat_msgs = Promise.resolve([]);

  if (selected_chats_ids && selected_chats_ids.length >= 1) {
    chat_msgs = await getChatMessages(token, selected_chats_ids);

    chat_msgs = chat_msgs.map(e => ({
      id: e.id,
      type: "chat message",
      source: selected_chats_topics[selected_chats_ids.indexOf(e.chatId)] + ': (' + selected_chats_members[selected_chats_ids.indexOf(e.chatId)] + ')',
      date_time: e.lastModifiedDateTime,
      author: e.from?.user?.displayName || "",
      content: new DOMParser().parseFromString(e.body.content || "", 'text/html').body.textContent,
      subject: e.subject || ""
    }));
  }

  return chat_msgs;
}
