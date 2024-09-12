"use client";

import { useAuth } from "@crossmint/client-sdk-react-ui";
import Button from "./Button";

export default function SignInButton() {
    const { login } = useAuth();
    return (
        <Button onClick={login}>
            Sign In
        </Button>
    );
}