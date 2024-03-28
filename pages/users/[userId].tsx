import Layout from "@/components/shared/layout";
import { UserForm } from "@/components/users/userForm";
import { requiresAdminProps } from "@/lib/serverProps";
import { Stack } from "@mui/material";
import BackButton from "@/components/shared/backButton";
import { useRouter } from "next/router";

export default function EditUser() {
    const router = useRouter();
    const userId = router.query.userId;

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
                <UserForm
                    newUser={false}
                    userId={
                        userId !== undefined
                            ? Number(userId as string)
                            : undefined
                    }
                />
            </Stack>
        </Layout>
    );
}

export const getServerSideProps = requiresAdminProps;
