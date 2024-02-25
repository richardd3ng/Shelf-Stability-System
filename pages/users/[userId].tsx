import Layout from "@/components/shared/layout";
import { UserForm } from "@/components/users/userForm";
import { requiresAdminProps } from "@/lib/serverProps";
import { Button, Stack } from "@mui/material";
import { useRouter } from "next/router";

export default function EditUser() {
    const router = useRouter();
    const userId = router.query.userId;

    return (
        <Layout>
            <Stack spacing={3} style={{ margin: 20 }}>
                <span>
                    <Button variant="outlined" color="primary" href="/users">Back to Users</Button>
                </span>
                <UserForm newUser={false} userId={userId !== undefined ? Number(userId as string) : undefined} />
            </Stack>
        </Layout>
    )
}

export const getServerSideProps = requiresAdminProps;
