import { ExperimentInfo } from "@/lib/controllers/types";
import React from "react";
import {
    GridColDef,
    GridRenderCellParams,
    GridSortItem,
    GridTreeNodeWithRender,
} from "@mui/x-data-grid";
import { Assay, AssayResult, Condition } from "@prisma/client";
import { Box, Stack, Typography } from "@mui/material";
import Table from "@/components/shared/table";
import ReportChip from "./reportChip";
import { WeekRow } from "@/components/experiment-detail/experiment/experimentTable";
import {
    getAssayResultForAssay,
    getAssaysForWeekAndCondition,
} from "@/components/experiment-detail/experiment/experimentTable";
import { parseExperimentWeeks } from "@/lib/api/apiHelpers";

interface ReportTableProps {
    experimentInfo: ExperimentInfo;
    assayFilter: (experimentInfo: ExperimentInfo) => Assay[];
}

const ReportTable: React.FC<ReportTableProps> = (props: ReportTableProps) => {
    const WEEK_COL_WIDTH = 50;
    const CONDITION_COL_WIDTH = 100;

    const weekRows: WeekRow[] = [];
    const assays: Assay[] = props.assayFilter(props.experimentInfo);
    parseExperimentWeeks(props.experimentInfo.experiment).forEach(
        (week: number, index: number) => {
            weekRows.push({
                id: index,
                week: week,
            });
        }
    );

    const columnHeader = (condition: Condition): React.JSX.Element => {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    ></Box>
                </Box>
                <Typography
                    variant="subtitle2"
                    sx={{
                        flex: 1,
                        textAlign: "center",
                    }}
                >
                    {`${condition.name}${condition.isControl ? " [Ctrl]" : ""}`}
                </Typography>
            </Box>
        );
    };

    const tableCell = (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>,
        condition: Condition
    ): React.JSX.Element => {
        return (
            <Stack
                sx={{
                    minWidth: CONDITION_COL_WIDTH,
                    height: "100%",
                    border: "1px solid #ccc",
                }}
            >
                {getAssaysForWeekAndCondition(
                    assays,
                    params.row.week,
                    condition.id
                ).map((assay: Assay) => {
                    const assayResult: AssayResult | undefined =
                        getAssayResultForAssay(
                            props.experimentInfo.assayResults,
                            assay
                        ) ?? undefined;
                    const assayType = props.experimentInfo.assayTypes.find(
                        (type) => type.id === assay.assayTypeId
                    );
                    if (!assayType) {
                        return null;
                    }
                    return (
                        <ReportChip
                            key={assay.assayTypeId}
                            assay={assay}
                            assayResult={assayResult}
                            assayType={assayType}
                        ></ReportChip>
                    );
                })}
            </Stack>
        );
    };

    const createTableColumns = (): GridColDef[] => {
        const weekColumn: GridColDef = {
            field: "week",
            headerName: "Wk",
            type: "number",
            width: WEEK_COL_WIDTH,
            align: "center",
            headerAlign: "center",
            disableColumnMenu: true,
            editable: false,
            sortable: false,
        };
        const conditionCols: GridColDef[] = props.experimentInfo.conditions.map(
            (condition: Condition) => ({
                field: condition.name,
                headerName: condition.name,
                align: "center",
                headerAlign: "center",
                width: CONDITION_COL_WIDTH,
                disableColumnMenu: true,
                editable: false,
                sortable: false,
                renderHeader: () => columnHeader(condition),
                renderCell: (params) => tableCell(params, condition),
            })
        );
        return [weekColumn, ...conditionCols];
    };

    return (
        <Table
            columns={createTableColumns()}
            rows={weekRows}
            hideFooterContainer
            sortModel={[
                {
                    field: "week",
                    sort: "asc",
                } as GridSortItem,
            ]}
        />
    );
};

export default ReportTable;
