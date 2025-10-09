import { getEmail } from '../graph';

export async function get_email(token) {
  return getEmail(token)
    .then((response) => {
      return response.value.map(e => ({
        id: e.id,
        type: "email",
        date_time: e.receivedDateTime,
        author: e.from.emailAddress.address,
        content: new DOMParser().parseFromString(e.body.content, 'text/html').body.textContent || "",
        subject: e.subject
      }));
    });
}
