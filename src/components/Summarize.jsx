import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useMsal } from '@azure/msal-react';

import { loginRequest } from '../authConfig';
import { get_channel_msgs } from '../get_content';
import { get_chat_msgs } from '../get_content';
import { get_email } from '../get_content';
import { get_onedrive_files } from '../get_content';
import { get_team_files } from '../get_content';
import { get_site_files } from '../get_content';
import { systemPrompt, createUserPrompt } from '../values';

export const Summarize = () => {
  const [data, setData] = useState('');
  const { instance, accounts } = useMsal();

  async function foundry_call(content) {
    const projectName = document.getElementById('project_name').value;

    const { text } = await (await fetch(`/api/foundry`, {
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

  async function main() {
    const login = await instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
    const token = login.accessToken;

    const email = await get_email(token);
    const onedrive_files = await get_onedrive_files(token);
    const team_files = await get_team_files(token);
    const channel_msgs = await get_channel_msgs(token);
    const chat_msgs = await get_chat_msgs(token);
    const site_files = await get_site_files(token);

    const content = [].concat(
      email,
      onedrive_files,
      team_files,
      channel_msgs,
      chat_msgs,
      site_files
    );

    console.log("content: ", content); window.content = content;

    foundry_call(content);
  }

  return (
    <>
      <Button variant="primary" onClick={main} className="mb-4 d-flex align-items-center">
        <i className="bi bi-lightning me-2"></i> Generate Summary
      </Button>
      {data ? (
        <div id="api-call" className="mt-3 p-4 bg-light rounded border">
          <pre className="text-start" style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "0.95rem", lineHeight: "1.6" }}>
            {data}
          </pre>
        </div>
      ) : (
        <div className="text-muted mt-3">
          Click the button above to generate a summary of your project content
        </div>
      )}
    </>
  );
};
