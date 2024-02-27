import Layout from "@/components/shared/layout";
import AssaysGroupedByType from "@/components/experiment-detail/assaysGroupedByType";
import { ExperimentHeader } from "@/components/experiment-detail/header/experimentHeader";
import { Box } from "@mui/material";
import DeleteExperimentButton from "@/components/experiment-detail/deleteExperimentButton";
import { CurrentUserContext } from "@/lib/context/users/currentUserContext";
import { useContext } from "react";

const ExperimentPage = () => {
    const { user } = useContext(CurrentUserContext);
    const isAdmin: boolean = user?.is_admin ?? false;
    return (
        <Layout>
            <ExperimentHeader />
            <AssaysGroupedByType />
            {
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        paddingY: 2,
                        visibility: isAdmin ? "visible" : "hidden",
                    }}
                >
                    <DeleteExperimentButton />
                </Box>
            }
        </Layout>
    );
};

export default ExperimentPage;
