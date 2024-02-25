import { Box, Stack, Typography } from "@mui/material";
import { getAssayTypeUnits } from "@/lib/controllers/assayTypeController";
import React from "react";
import { Assay, AssayResult } from "@prisma/client";
import { assayTypeIdToName } from "@/lib/controllers/assayTypeController";

interface ReportChipProps {
    assay: Assay;
    assayResult?: AssayResult;
}

const ReportChip: React.FC<ReportChipProps> = (props: ReportChipProps) => {
    const units: string = getAssayTypeUnits(props.assay.type);
    const resultText: string =
        props.assayResult && props.assayResult.result
            ? `${props.assayResult.result}${
                  units.startsWith("%") ? units : ` ${units}`
              }`
            : "N/A";

    return (
        <Box
            sx={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "4px",
                display: "inline-block",
                textAlign: "center",
            }}
        >
            <Stack sx={{ margin: -0.25 }}>
                <Typography sx={{ fontSize: 12 }}>
                    {assayTypeIdToName(props.assay.type)}
                </Typography>
                <Typography sx={{ fontSize: 10 }}>{resultText}</Typography>
                <Typography sx={{ fontSize: 8 }}>
                    Author: {props.assayResult?.last_editor || "N/A"}
                </Typography>
                <Typography sx={{ fontSize: 8 }}>
                    Comment: {props.assayResult?.comment || "N/A"}
                </Typography>
            </Stack>
        </Box>
    );
};

export default ReportChip;
