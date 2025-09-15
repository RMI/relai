import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import Button from 'react-bootstrap/Button';

/**
 * Renders a button for logging in with a redirect
 */
export const SignInButton = () => {
    const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginRedirect(loginRequest).catch(e => {
            console.log(e);
        });
    }
    return (
        <Button variant="secondary" onClick={() => handleLogin()}>
            Sign In
        </Button>
    )
}

