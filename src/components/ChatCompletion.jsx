import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useMsal } from '@azure/msal-react';
import { AzureOpenAI } from 'openai';

import { loginRequest } from '../authConfig';
import { getEmail, getFilesContent, getChatMessages, getChannelMessageList, getGroupFilesContent } from '../graph';
import { ChatCompletionData } from '../dataview';
import { systemPrompt, createUserPrompt } from '../values';

export const ChatCompletion = () => {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);

  function RequestChatCompletion() {
    const endpoint = import.meta.env.VITE_AZURE_FOUNDRY_ENDPOINT;
    const apiKey = import.meta.env.VITE_AZURE_FOUNDRY_KEY;
    const apiVersion = import.meta.env.VITE_AZURE_FOUNDRY_API_VERSION;
    const deployment = import.meta.env.VITE_AZURE_FOUNDRY_MODEL;

    const temperature = 0.2;
    const max_tokens = 800;

    async function main(content) {
      const client = new AzureOpenAI({
        endpoint,
        apiKey,
        apiVersion,
        deployment,
        dangerouslyAllowBrowser: true
      });
      const result = await client.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: createUserPrompt(document.getElementById('project_name').value) },
          { role: "user", content: JSON.stringify(content) },
        ],
        model: "",
        temperature: temperature,
        max_tokens: max_tokens
      });

      return (result.choices[0].message);
    }

    async function getToken() {
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        })
        .then((response) => {
          const token = response.accessToken;

          const file_paths = Array.from(document.querySelectorAll("#file_path"), e => e.value);
          const selected_chats_ids = Array.from(document.querySelectorAll("input[name='chat_id']:checked"), e => e.value);
          const selected_channels = document.querySelector('input[name="teamchannel_id"]:checked');
          const selected_group = document.querySelector('input[name="group_select"]:checked');
          const group_file_paths = Array.from(document.querySelectorAll("#group_file_path"), e => e.value);

          const email = getEmail(token);

          let file_content = Promise.resolve([]);
          if (file_path !== null && file_path != "") {
            file_content = getFilesContent(token, file_paths);
          }

          let chat_msgs = Promise.resolve([]);
          if (selected_chats_ids.length >= 1) {
            chat_msgs = getChatMessages(token, selected_chats_ids);
          }

          let channel_msgs = Promise.resolve([]);
          if (selected_channels !== null && selected_channels.length >= 1) {
            const selected_team_ids = [...selected_channels].map(e => e.dataset.team_id);
            const selected_channels_ids = [...selected_channels].map(e => e.dataset.channel_id);
            channel_msgs = getChannelMessageList(token, selected_team_ids, selected_channels_ids);
          }

          let group_file_content = Promise.resolve([]);
          if (selected_group !== null) {
            const group_id = selected_group.dataset.group_id;
            group_file_content = getGroupFilesContent(token, group_id, group_file_paths);
          }

          Promise.all([email, file_content, chat_msgs, channel_msgs, group_file_content])
            .then(([email, file_content, chat_msgs, channel_msgs, group_file_content]) => {
              const email_result = email.value.map(e => ({
                id: e.id,
                type: "email",
                date_time: e.receivedDateTime,
                author: e.from?.emailAddress?.address || "",
                content: new DOMParser().parseFromString(e.body.content || "", 'text/html').body.textContent,
                subject: e.subject || ""
              }));

              const file_content_result = file_content.map(e => ({
                id: e.id,
                type: "onedrive file",
                date_time: e.lastModifiedDateTime,
                author: e.lastModifiedBy?.user?.displayName || "",
                content: e.text || "",
                subject: e.name || ""
              }));

              const chat_msgs_result = chat_msgs.map(e => ({
                id: e.id,
                type: "chat message",
                date_time: e.lastModifiedDateTime,
                author: e.from?.user?.displayName || "",
                content: new DOMParser().parseFromString(e.body.content || "", 'text/html').body.textContent,
                subject: e.subject || ""
              }));

              const channel_msgs_result = channel_msgs.map(e => ({
                id: e.id,
                type: "channel message",
                date_time: e.lastModifiedDateTime,
                author: e.from?.user?.displayName || "",
                content: new DOMParser().parseFromString(e.body.content || "", 'text/html').body.textContent,
                subject: e.subject || ""
              }));

              const group_file_content_result = group_file_content.map(e => ({
                id: e.id,
                type: "group file",
                date_time: e.lastModifiedDateTime,
                author: e.lastModifiedBy?.user?.displayName || "",
                content: e.text || "",
                subject: e.name || ""
              }));

              const content = email_result.concat(file_content_result, chat_msgs_result, channel_msgs_result, group_file_content_result);

              main(content)
                .then((result) => {
                  setGraphData(result);
                })
                .catch((err) => {
                  console.error("The sample encountered an error:", err);
                });
            })
        });
    }

    getToken();
  }

  return (
    <>
      <h5 className="chatCompletion">RELAI Summary</h5>
      <Button variant="secondary" onClick={RequestChatCompletion}>
        Request RELAI Summary
      </Button>
      <br />
      {graphData ? (
        <ChatCompletionData graphData={graphData} />
      ) : (
        <br />
      )}
      <h5 className="project_name_section">Project Name</h5>
      <input id="project_name" />
      <br />
      <br />
      <h5 className="filepath_head">File Paths</h5>
      <input id="file_path" />
      <br />
      <input id="file_path" />
      <br />
      <br />
    </>
  );
};
