/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

import { useIsAuthenticated } from '@azure/msal-react';
import { SignInButton } from './SignInButton';
import { SignOutButton } from './SignOutButton';

/**
 * Renders the navbar component with a sign-in or sign-out button depending on whether or not a user is authenticated
 * @param props
 */
export const PageLayout = (props) => {
    const isAuthenticated = useIsAuthenticated();

    return (
        <>
            <Navbar className="navbarStyle mb-4 sticky-top">
                <Container>
                    <a className="navbar-brand" href="/" style={{ color: 'var(--color-energy)', fontWeight: 600 }}>
                        Relai Suggestions
                    </a>
                    <div className="d-flex justify-content-end">
                        {isAuthenticated ? <SignOutButton /> : <SignInButton />}
                    </div>
                </Container>
            </Navbar>
            <div className="title mb-4">
                Welcome to RELAI Project Status Summarization
            </div>
            <Container>
                {props.children}
            </Container>
        </>
    );
};
