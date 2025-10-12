import React, { useState } from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

import './App.css';
import * as component from './components';

const MainContent = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="App">
            <AuthenticatedTemplate>
                <h5>RELAI Summary</h5>
                <component.Summarize />
                <br />
                <h5 className="project_name_section">Project Name</h5>
                <input id="project_name" />
                <br />
                <br />
                <component.Chats />
                <component.TeamChannelsListContent />
                <component.GroupsList />
                <component.GroupFilePath />
                <br />
                <h5 className="group_files">SharePoint Files</h5>
                <component.GroupDropdownContent />
                <component.GroupDropdownContent />
                <component.GroupDropdownContent />
                <hr />
                <Button variant="secondary" onClick={() => setOpen(!open)} aria-controls="utilities-collapse-text" aria-expanded={open}>
                    toggle utilities
                </Button>
                <Collapse in={open}>
                    <div id="utilities-collapse-text">
                        <br/>
                        <component.ProfileContent />
                        <component.APIContent />
                        <component.EmailContent />
                        <component.ChatMessagesContent />
                        <component.ChannelMessageListContent />
                        <component.FilesList />
                        <component.FilesContent />
                        <component.GroupsContent />
                        <component.GroupFilesList />
                        <component.GroupFilesContent />
                    </div>
                </Collapse>
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <h5 className="card-title">Please sign-in to see your profile information.</h5>
            </UnauthenticatedTemplate>
        </div>
    );
};

export default function App() {
    return (
        <component.PageLayout>
            <MainContent />
        </component.PageLayout>
    );
}
