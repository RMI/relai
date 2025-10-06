import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useMsal } from '@azure/msal-react';

import { loginRequest } from '../authConfig';
import { getEmail } from '../graph';
import { getGroupFilesContent } from '../graph';
import { systemPrompt, createUserPrompt } from '../values';

export const HelloWorld = () => {
  const [data, setData] = useState('');
  const { instance, accounts } = useMsal();

  async function foundry_call(content) {
    const projectName = document.getElementById('project_name').value;

    const { text } = await( await fetch(`/api/foundry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName: projectName,
          systemPrompt: systemPrompt,
          userPrompt: createUserPrompt(projectName),
          content: JSON.stringify(content)
        })
      })).json();

    setData(text);
  }

  async function get_email(token) {
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

  async function get_group_files(token) {
    const selected_group = document.querySelector('input[name="group_select"]:checked');
    const group_file_paths = Array.from(document.querySelectorAll("#group_file_path"), e => e.value);

    let group_file_content = Promise.resolve([]);
    if (selected_group !== null) {
      const group_id = selected_group.dataset.group_id;
      group_file_content = await getGroupFilesContent(token, group_id, group_file_paths);
    }

    return group_file_content.map(e => ({
        id: e.id,
        type: "group file",
        date_time: e.lastModifiedDateTime,
        author: e.lastModifiedBy.user.displayName,
        content: e.text,
        subject: e.name
    }));
  }

  async function main() {
      const login = await instance
        .acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
        })
      const token = login.accessToken;

      const email = await get_email(token);
      const group_files = await get_group_files(token);

      const content = email.concat(group_files);

      foundry_call(content);
  }

  return (
        <>
            <Button variant="secondary" onClick={main}>
                call API
            </Button>
            {data ? (
                <div id="api-call" style={{width: "800px", margin: "auto"}}>
                    <pre style={{textAlign: "left", whiteSpace: "pre-wrap"}}>
                        {data}
                    </pre>
                </div>
            ) : (
                <br/>
            )}
        </>
    );
};
