import { getChatMessages } from '../graph';

export async function get_chat_msgs(token) {
  const selected_chat_elems = document.querySelectorAll("input[name='chat_id']:checked");

  const selected_chats_ids = Array.from(selected_chat_elems, e => e.dataset.id);
  const selected_chat_topics = Array.from(selected_chat_elems, e => e.dataset.chat_topic);
  const selected_chat_members = Array.from(selected_chat_elems, e => e.dataset.chat_members);

  let chat_msgs = Promise.resolve([]);

  if (selected_chats_ids && selected_chats_ids.length >= 1) {
    chat_msgs = await getChatMessages(token, selected_chats_ids);

    chat_msgs = chat_msgs.map(e => ({
      id: e.id,
      type: "chat message",
      source: selected_chat_topics[selected_chats_ids.indexOf(e.chatId)] + ': (' + selected_chat_members[selected_chats_ids.indexOf(e.chatId)] + ')',
      date_time: e.lastModifiedDateTime,
      author: e.from?.user?.displayName || "",
      content: new DOMParser().parseFromString(e.body.content || "", 'text/html').body.textContent,
      subject: e.subject || ""
    }));
  }

  return chat_msgs;
}
