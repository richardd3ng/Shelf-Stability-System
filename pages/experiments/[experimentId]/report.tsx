import { ExperimentInfo } from "@/lib/controllers/types";
import ExperimentTable from "@/components/experiment-detail/experimentTable/experimentTable";
// import { AssaysGroupedByType } from "@/components/experiment-detail/assaysGroupedByType";
import AssayEditingContext from "@/lib/context/shared/assayEditingContext";
import { useState } from "react";
import { AssayEditorModal } from "@/components/experiment-detail/modifications/editorModals/assayEditorModal";
import { ExperimentHeader } from "@/components/experiment-detail/summary/experimentHeader";
import { Container, Typography } from "@mui/material";

export default function ExperimentPage() {
    return (
        <Container>
            <ExperimentHeader />
            <Container
                style={{
                    border: "2px solid black",
                    marginTop: 16,
                    marginBottom: 16,
                }}
            >
                <Typography
                    variant="h4"
                    align="center"
                    style={{ marginBottom: 8, marginTop: 24 }}
                >
                    All Assays
                </Typography>
            </Container>
        </Container>
    );
}
