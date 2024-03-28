import Layout from "@/components/shared/layout";
import { UserForm } from "@/components/users/userForm";
import { requiresAdminProps } from "@/lib/serverProps";
import { Stack, Typography } from "@mui/material";
import BackButton from "@/components/shared/backButton";
import { useRouter } from "next/router";

export default function CreateUser() {
    const router = useRouter();
    return (
        <Layout>
            <Stack
                spacing={3}
                sx={{ marginTop: -1, marginBottom: 2, marginX: 2 }}
            >
                <BackButton
                    text="Back to Users"
                    onClick={() => router.push("/users")}
                />
                <Typography variant="h4">Create User Account</Typography>
                <UserForm newUser={true} />
            </Stack>
        </Layout>
    );
}

export const getServerSideProps = requiresAdminProps;
