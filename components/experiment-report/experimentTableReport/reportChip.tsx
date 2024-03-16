import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { Assay, AssayResult } from "@prisma/client";
import { AssayTypeInfo } from "@/lib/controllers/types";

interface ReportChipProps {
    assay: Assay;
    assayType : AssayTypeInfo;
    assayResult?: AssayResult;
}

const ReportChip: React.FC<ReportChipProps> = (props: ReportChipProps) => {
    const units: string = props.assayType.assayType.units ? props.assayType.assayType.units : "";
    const resultText: string =
        props.assayResult && props.assayResult.result
            ? `${props.assayResult.result}${
                  units.startsWith("%") ? units : ` ${units}`
              }`
            : "N/A";
    const commentText: string = props.assayResult?.comment || "N/A";
    const missingResult = resultText === "N/A";
    const missingComment = commentText === "N/A";

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
                    {props.assayType.assayType.name}
                </Typography>
                <Typography
                    sx={{
                        fontSize: 10,
                        fontWeight: "bold",
                        color: missingResult ? "red" : "inherit",
                    }}
                >
                    {resultText}
                </Typography>
                <Typography
                    sx={{
                        fontSize: 8,
                    }}
                >
                    Author: {props.assayResult?.author || "N/A"}
                </Typography>
                <Typography
                    sx={{
                        fontSize: 8,
                        color: missingComment ? "red" : "inherit",
                    }}
                >
                    Comment: {commentText}
                </Typography>
            </Stack>
        </Box>
    );
};

export default ReportChip;
