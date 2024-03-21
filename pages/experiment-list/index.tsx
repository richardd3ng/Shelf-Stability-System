import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
} from "@mui/material";
import { GridColDef, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import React, { useContext, useEffect, useState } from "react";
import ExperimentCreationDialog from "@/components/experiment-list/experimentCreationDialog";
import Layout from "../../components/shared/layout";
import SearchBar from "../../components/shared/searchBar";
import Table from "../../components/shared/table";
import {
    deleteExperiment,
    fetchExperimentList,
    hasRecordedAssayResults,
} from "@/lib/controllers/experimentController";
import { fetchOwners } from "@/lib/controllers/userController";
import ExperimentDeletionDialog from "@/components/shared/confirmationDialog";
import { useAlert } from "@/lib/context/shared/alertContext";
import { useLoading } from "@/lib/context/shared/loadingContext";
import {
    ServerPaginationArgs,
    useServerPagination,
} from "@/lib/hooks/useServerPagination";
import {
    ExperimentTable,
    ExperimentTableInfo,
    UserInfo,
} from "@/lib/controllers/types";
import { useRouter } from "next/router";
import { getErrorMessage } from "@/lib/api/apiHelpers";
import GeneratePrintableReportButton from "@/components/shared/generateReportIconButton";
import IconButtonWithTooltip from "@/components/shared/iconButtonWithTooltip";
import Delete from "@mui/icons-material/Delete";
import { CurrentUserContext } from "@/lib/context/users/currentUserContext";

interface QueryParams {
    search: string;
    owner: string;
}

const getQueryParamsFromURL = (): QueryParams => {
    const params: URLSearchParams = new URLSearchParams(window.location.search);
    return {
        search: params.get("search") ?? "",
        owner: params.get("owner") ?? "",
    };
};

const ExperimentList: React.FC = () => {
    const [experimentData, setExperimentData] = useState<ExperimentTableInfo[]>(
        []
    );
    const [showCreationDialog, setShowCreationDialog] =
        useState<boolean>(false);
    const [showDeletionDialog, setShowDeletionDialog] =
        useState<boolean>(false);
    const [selectedExperimentIds, setSelectedExperimentIds] =
        useState<GridRowSelectionModel>([]);
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();
    const router = useRouter();
    const [queryParams, setQueryParams] = useState<QueryParams>({
        search: "",
        owner: "",
    });
    const [initialized, setInitialized] = useState<boolean>(false); // hacky way to make reload() run once on first render
    // TODO: this is still fetching the data twice, so it's not a perfect solution

    const [ownerList, setOwnerList] = useState<UserInfo[] | null>(null);
    const { user } = useContext(CurrentUserContext);
    const isAdmin: boolean = user?.isAdmin ?? false;

    const reloadExperimentData = async (
        paging: ServerPaginationArgs
    ): Promise<ExperimentTable> => {
        showLoading("Loading experiments...");
        const fetchedData = await getExperiments(paging);
        setExperimentData(fetchedData.rows);
        hideLoading();
        return fetchedData;
    };

    const [paginationProps, reload] = useServerPagination(
        reloadExperimentData,
        [],
        {
            pageSize: 10,
            page: 0,
        }
    );

    useEffect(() => {
        const fetchOwnerData = async () => {
            setOwnerList(await fetchOwners());
            setQueryParams(getQueryParamsFromURL());
            setInitialized(true);
        };
        fetchOwnerData();
    }, []);

    useEffect(() => {
        if (initialized) {
            reload();
        }
    }, [queryParams]);

    const colDefs: GridColDef[] = [
        {
            field: "id",
            headerName: "ID",
            type: "number",
            flex: 1.5,
            valueFormatter: (params: any) => String(params.value),
        },
        {
            field: "title",
            headerName: "Title",
            type: "string",
            flex: 4,
        },
        {
            field: "owner",
            headerName: "Owner",
            type: "string",
            flex: 2,
        },
        {
            field: "startDate",
            headerName: "Start Date",
            type: "string",
            valueGetter: (params) => params.row.startDate.toString(),
            flex: 2,
        },
        {
            field: "week",
            headerName: "Week",
            type: "number",
            flex: 1,
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 2,
            align: "center",
            headerAlign: "center",
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: "flex" }}>
                    <GeneratePrintableReportButton
                        experimentId={params.row.id}
                    />
                    {isAdmin && (
                        <IconButtonWithTooltip
                            text="Delete"
                            icon={Delete}
                            onClick={() => prepareForDeletion([params.row.id])}
                        ></IconButtonWithTooltip>
                    )}
                </Box>
            ),
        },
    ];

    const getExperiments = async (
        paging: ServerPaginationArgs
    ): Promise<ExperimentTable> => {
        try {
            return await fetchExperimentList(
                queryParams.search,
                queryParams.owner,
                paging
            );
        } catch (error) {
            showAlert("error", getErrorMessage(error));
            return { rows: [], rowCount: 0 };
        }
    };

    const prepareForDeletion = (selectedRows: GridRowSelectionModel) => {
        setSelectedExperimentIds(selectedRows);
        setShowDeletionDialog(true);
    };

    const handleSearch = (query: string, owner: string) => {
        const queryParams = new URLSearchParams();
        queryParams.set("search", query);
        queryParams.set("owner", owner);
        if (!query && !owner) {
            router.push("/experiment-list");
        } else {
            router.push(
                {
                    pathname: router.pathname,
                    search: queryParams.toString(),
                },
                undefined,
                { shallow: true }
            );
        }
    };

    const handleDeleteExperiments = async () => {
        let deletedIds: number[] = [];
        let cannotDeleteIds: number[] = [];
        try {
            const deletePromises = selectedExperimentIds.map(
                async (experimentId: GridRowId) => {
                    experimentId = experimentId as number;
                    try {
                        const resultFound: Boolean =
                            await hasRecordedAssayResults(experimentId);
                        if (resultFound) {
                            cannotDeleteIds.push(experimentId);
                        } else {
                            await deleteExperiment(experimentId);
                            deletedIds.push(experimentId);
                        }
                    } catch (error) {
                        showAlert("error", getErrorMessage(error));
                    }
                }
            );
            await Promise.all(deletePromises);
            reload();
            if (deletedIds.length > 0) {
                showAlert(
                    "success",
                    `The following experiments were successfully deleted: ${deletedIds.join(
                        ", "
                    )}`
                );
            }
            if (cannotDeleteIds.length > 0) {
                showAlert(
                    "warning",
                    `The following experiments contained recorded assay results and could not be deleted: ${cannotDeleteIds.join(
                        ", "
                    )}`
                );
            }
        } catch (error) {
            showAlert("error", getErrorMessage(error));
        }
    };

    return (
        <Layout>
            <Stack spacing={2}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        paddingX: 3,
                        justifyContent: "space-between",
                    }}
                >
                    <Box sx={{ flex: 2 }}>
                        <SearchBar
                            placeholder="Enter Keyword"
                            value={queryParams.search}
                            onSearch={(query: string) => {
                                setQueryParams({
                                    search: query,
                                    owner: queryParams.owner,
                                });
                                handleSearch(query, queryParams.owner);
                            }}
                        />
                    </Box>
                    <Box sx={{ flex: 1, paddingX: 10 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="Owner Filter Label">
                                Owner Filter
                            </InputLabel>
                            <Select
                                id="Owner Filter Selection"
                                value={queryParams.owner}
                                label="Owner Filter"
                                onChange={(e) => {
                                    setQueryParams({
                                        search: queryParams.search,
                                        owner: e.target.value,
                                    });
                                    handleSearch(
                                        queryParams.search,
                                        e.target.value
                                    );
                                }}
                            >
                                <MenuItem key={0} value={""}>
                                    {"(None)"}
                                </MenuItem>
                                {(ownerList ?? []).map((owner: UserInfo) => (
                                    <MenuItem
                                        key={owner.id}
                                        value={owner.username}
                                    >
                                        {owner.username}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    {isAdmin && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setShowCreationDialog(true)}
                            sx={{ flex: 1, textTransform: "none" }}
                        >
                            Create Experiment
                        </Button>
                    )}
                </Box>

                <Table
                    columns={colDefs}
                    rows={experimentData}
                    pagination
                    onDeleteRows={prepareForDeletion}
                    onCellClick={(cell) => {
                        if (cell.field !== "actions") {
                            router.push(`/experiments/${cell.id}`);
                        }
                    }}
                    {...paginationProps}
                    rowClassName="experiment-row-clickable"
                />

                <ExperimentCreationDialog
                    open={showCreationDialog}
                    onClose={() => {
                        setShowCreationDialog(false);
                        reload();
                    }}
                />
                <ExperimentDeletionDialog
                    open={showDeletionDialog}
                    onClose={() => {
                        setShowDeletionDialog(false);
                    }}
                    onConfirm={handleDeleteExperiments}
                />
            </Stack>
        </Layout>
    );
};

ExperimentList.displayName = "ExperimentList";
export default ExperimentList;
