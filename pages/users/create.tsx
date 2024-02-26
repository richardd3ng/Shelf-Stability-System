import Layout from "@/components/shared/layout";
import { UserForm } from "@/components/users/userForm";
import { requiresAdminProps } from "@/lib/serverProps";
import { Button, Stack, Typography } from "@mui/material";

export default function CreateUser() {
    return (
        <Layout>
            <Stack spacing={3} style={{margin: 20}}>
                <span>
                    <Button variant="outlined" color="primary" href="/users">Back to Users</Button>
                </span>
                <Typography variant="h4" >Create User Account</Typography>
                <UserForm newUser={true}/>
            </Stack>
        </Layout>
    )
}

export const getServerSideProps = requiresAdminProps;
