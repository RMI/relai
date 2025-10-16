import React, { useState } from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './App.css';
import * as component from './components';

const MainContent = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="App">
            <AuthenticatedTemplate>
                <div className="content-card">
                    <h5>RELAI Summary</h5>
                    <component.Summarize />
                </div>

                <div className="content-card">
                    <h5 className="project_name_section">Project Name</h5>
                    <input id="project_name" placeholder="Enter project name..." />
                </div>

                <Row className="mt-4">
                    <Col md={6}>
                        <div className="content-card">
                            <component.Chats />
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="content-card">
                            <component.Channels />
                        </div>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col md={6}>
                        <div className="content-card">
                            <component.TeamsFiles />
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="content-card">
                            <component.SharePointFiles />
                        </div>
                    </Col>
                </Row>

                <div className="text-center mt-4 mb-3">
                    <Button
                        variant="secondary"
                        onClick={() => setOpen(!open)}
                        aria-controls="utilities-collapse-text"
                        aria-expanded={open}
                        className="px-4"
                    >
                        {open ? 'Hide Utilities' : 'Show Utilities'}
                    </Button>
                </div>

                <Collapse in={open}>
                    <div id="utilities-collapse-text">
                        <Row className="mt-3">
                            <Col md={6}>
                                <div className="content-card">
                                    <component.ProfileContent />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="content-card">
                                    <component.APIContent />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Collapse>
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <div className="content-card text-center py-5">
                    <h5 className="card-title mb-4">Please sign-in to see your profile information.</h5>
                    <component.SignInButton />
                </div>
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
