import { useAlert } from "@/lib/context/shared/alertContext";
import { createUser, deleteUser, fetchUser, updateUser } from "@/lib/controllers/userController";
import { Button, Checkbox, FormControlLabel, Stack, TextField, Typography } from "@mui/material";
import { User } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { DeleteUserDialog } from "./deleteUserDialog";
import { fetchAssociatedExperiments } from "@/lib/controllers/experimentController";
import { CurrentUserContext } from "@/lib/context/users/currentUserContext";
import { useLoading } from "@/lib/context/shared/loadingContext";

export interface UserFormProps {
    newUser: boolean;
    userId?: number;
};

export function UserForm(props: UserFormProps) {
    const [username, setUsername] = useState<string>("");
    const [displayName, setDisplayName] = useState<string>("");
    const [email, setEmail] = useState<string | null>("");
    const [isSSO, setIsSSO] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const { showLoading, hideLoading } = useLoading();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [ownedExperiments, setOwnedExperiments] = useState<string[]>([]);

    const alert = useAlert();
    const router = useRouter();
    const { user } = useContext(CurrentUserContext);

    const majorEditsAllowed = user !== undefined && !isSuperAdmin && user.id !== props.userId;

    useEffect(() => {
        if (!props.newUser && props.userId !== undefined) {
            showLoading("Loading user...");
            fetchUser(props.userId).then((user) => {
                if (user instanceof ApiError) {
                    alert.showAlert("error", user.message);
                    return;
                }

                setUsername(user.username);
                setDisplayName(user.displayName);
                setEmail(user.email);
                setIsSSO(user.isSSO);
                setIsAdmin(user.isAdmin ?? false);
                setIsSuperAdmin(user.isSuperAdmin ?? false);
                hideLoading();
            });
            setOwnedExperiments([]);
            fetchAssociatedExperiments(props.userId!).then((experiments) => {
                if (experiments instanceof ApiError) {
                    alert.showAlert("error", experiments.message);
                    return;
                }

                setOwnedExperiments(experiments.map(exp => `${exp.id} - ${exp.title}`));
            });
        }
    }, [props.newUser, props.userId]);

    const passwordMismatch = password !== confirmPassword;
    const usernameInvalid = !username.match(/^[a-z0-9]*$/i);
    const usernameErrorMessage = usernameInvalid ? "Username must be alphanumeric" : "";

    async function submitForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Blank passwords should be prevented by the "required" field, but it doesn't hurt to check
        if (passwordMismatch || usernameInvalid || (props.newUser && password === "")) return;

        var result: Omit<User, 'password'> | ApiError | undefined = undefined;
        if (props.newUser) {
            showLoading("Creating user...");
            result = await createUser(username, displayName, email, password, isAdmin);
        } else {
            showLoading("Updating user...");
            result = await updateUser(props.userId!, isSSO ? undefined : displayName, isSSO ? undefined : (email ?? ""), password, isAdmin);
        }

        if (result instanceof ApiError) {
            alert.showAlert("error", result.message);
            hideLoading();
        } else {
            if (props.newUser) {
                router.push(`/users/${result.id}`);
            } else {
                alert.showAlert("success", "User updated");
                hideLoading();
            }
        }
    }

    async function handleDelete() {
        showLoading("Deleting user...");

        const error = await deleteUser(props.userId!);

        if (error instanceof ApiError) {
            alert.showAlert("error", error.message);
            hideLoading();
        } else {
            alert.showAlert("success", "User deleted");
            router.push("/users");
        }
    }

    var biographicalInfo;

    const localEditable = (<>
        <TextField
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
        />
        <TextField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
    </>);

    if (props.newUser) {
        biographicalInfo = (<>
            <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={usernameInvalid}
                helperText={usernameErrorMessage}
                inputProps={{ maxLength: 32 }} // No server side validation for this because I don't really care
                required
            />
            {localEditable}
        </>);
    } else if (isSSO) {
        biographicalInfo = (<>
            <Typography variant="h5">{displayName} ({username})</Typography>
            {email && <Typography variant="h6">{email}</Typography>}
        </>);
    } else {
        biographicalInfo = (<>
            <Typography variant="h5">{username}</Typography>
            {localEditable}
        </>);
    }

    return (
        <form onSubmit={submitForm}>
            <Stack spacing={2} maxWidth={300}>
                {biographicalInfo}
                <FormControlLabel control={
                    <Checkbox
                        checked={isAdmin}
                        onChange={(_, val) => setIsAdmin(val)}
                        disabled={!majorEditsAllowed}
                    />
                } label="Admin" />
                {!isSSO &&
                    <>
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
                    </>}
                <Button type="submit" variant="contained" color="primary">{props.newUser ? "Submit" : "Update"}</Button>
                {(majorEditsAllowed && !isSSO && !props.newUser) && <Button variant="contained" color="error" onClick={() => setDeleteDialogOpen(true)}>Delete</Button>}
            </Stack>
            <DeleteUserDialog
                open={deleteDialogOpen}
                ownedExperiments={ownedExperiments}
                onClose={() => setDeleteDialogOpen(false)}
                onDelete={handleDelete}
            />
        </form>
    );
};