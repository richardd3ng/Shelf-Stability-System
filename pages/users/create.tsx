import Layout from "@/components/shared/layout";
import { UserForm } from "@/components/users/userForm";
import { Stack, Typography } from "@mui/material";

export default function CreateUser() {

    return (
        <Layout>
            <Stack spacing={3} style={{margin: 20}}>
                <Typography variant="h4" >Create User Account</Typography>
                <UserForm newUser={true}/>
            </Stack>
        </Layout>
    )
}