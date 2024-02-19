import { useAlert } from "@/lib/context/alert-context";
import { createUser, fetchUser, updateUser } from "@/lib/controllers/userController";
import { Button, Checkbox, FormControlLabel, Stack, TextField, Typography } from "@mui/material";
import { User } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LoadingCircle } from "../shared/loading";

export interface UserFormProps {
    newUser: boolean;
    userId?: number;
};

export function UserForm(props: UserFormProps) {
    const [username, setUsername] = useState<string>("");
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(!props.newUser);
    const alert = useAlert();
    const router = useRouter();

    useEffect(() => {
        if (!props.newUser && props.userId !== undefined) {
            fetchUser(props.userId!).then((user) => {
                if (user instanceof ApiError) {
                    alert.showAlert("error", user.message);
                    return;
                }

                setUsername(user.username);
                setIsAdmin(user.is_admin ?? false);
                setLoading(false);
            });
        }
    }, [props.newUser, props.userId]);

    const passwordMismatch = password !== confirmPassword;

    async function submitForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Blank passwords should be prevented by the "required" field, but it doesn't hurt to check
        if (passwordMismatch || (props.newUser && password === "")) return;

        var result: Omit<User, 'password'> | ApiError | undefined = undefined;
        if (props.newUser) {
            result = await createUser(username, password, isAdmin);
        } else {
            result = await updateUser(props.userId!, password, isAdmin);
        }

        if (result instanceof ApiError) {
            alert.showAlert("error", result.message);
        } else {
            if (props.newUser) {
                router.push(`/users/${result.id}`);
            } else {
                alert.showAlert("success", "User updated");
            }
        }
    }

    if (loading) {
        return (
            <LoadingCircle />
        );
    }

    return (
        <form onSubmit={submitForm}>
            <Stack spacing={2} maxWidth={300}>
                {props.newUser
                    ? <TextField
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    : <Typography variant="h5">{username}</Typography>}
                <FormControlLabel control={
                    <Checkbox checked={isAdmin} onChange={(_, val) => setIsAdmin(val)} />
                } label="Admin" />
                <TextField
                    label={props.newUser ? "Password" : "Change Password"}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={props.newUser || confirmPassword.length > 0}
                />
                <TextField
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={passwordMismatch}
                    helperText={passwordMismatch ? "Passwords do not match" : ""}
                    required={props.newUser || password.length > 0}
                />
                <Button type="submit" variant="contained" color="primary">{props.newUser ? "Submit" : "Update"}</Button>
            </Stack>
        </form>
    );
};