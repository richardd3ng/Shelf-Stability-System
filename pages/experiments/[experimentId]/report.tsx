import { ExperimentInfo } from "@/lib/controllers/types";
import ExperimentTable from "@/components/experiment-detail/experimentTable/experimentTable";
// import { AssaysGroupedByType } from "@/components/experiment-detail/assaysGroupedByType";
import { AssayEditingContext } from "@/lib/context/experimentDetailPage/assayEditingContext";
import { useState } from "react";
import { AssayEditorModal } from "@/components/experiment-detail/modifications/editorModals/assayEditorModal";
import { ExperimentHeader } from "@/components/experiment-detail/summary/experimentHeader";
import { Container, Typography } from "@mui/material";
import { useExperimentId } from "@/lib/hooks/experimentDetailPage/useExperimentId";
import { useExperimentInfo } from "@/lib/hooks/experimentDetailPage/experimentDetailHooks";

export default function ExperimentPage() {
    const [isEditingAssay, setIsEditingAssay] = useState<boolean>(false);
    const [assayIdBeingEdited, setAssayIdBeingEdited] = useState<number>(0);
    const experimentId = useExperimentId();
    const { data } = useExperimentInfo(experimentId);
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
                <ExperimentTable
                    assayFilter={(experiment: ExperimentInfo) =>
                        experiment.assays
                    }
                    componentForAssay={AssayButtonInCell}
                />
            </Container>
            {data
                ? data.assayTypes.map((type) => {
                      return (
                          <Container
                              key={type.id}
                              style={{
                                  marginBottom: 24,
                                  marginTop: 64,
                                  border: "2px solid black",
                              }}
                          >
                              <Typography
                                  variant="h5"
                                  align="center"
                                  style={{ marginTop: 8, marginBottom: 8 }}
                              >
                                  Assays Results for Type {type.name}
                              </Typography>
                              <ExperimentTable
                                  assayFilter={(
                                      experimentInfo: ExperimentInfo
                                  ) =>
                                      experimentInfo.assays.filter(
                                          (assay) => assay.typeId === type.id
                                      )
                                  }
                                  componentForAssay={AssayResultInCell}
                              />
                          </Container>
                      );
                  })
                : null}
        </Container>
    );
}
