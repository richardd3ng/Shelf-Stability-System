import {
    Autocomplete,
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Tooltip,
    Typography,
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
import { fetchOwnersAndTechnicians } from "@/lib/controllers/userController";
import { useAlert } from "@/lib/context/shared/alertContext";
import { useLoading } from "@/lib/context/shared/loadingContext";
import {
    ServerPaginationArgs,
    useServerPagination,
} from "@/lib/hooks/useServerPagination";
import {
    ExperimentStatus,
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
import ConfirmationDialog from "@/components/shared/confirmationDialog";
import { useSearchParams } from "next/navigation";

interface QueryParams {
    search: string;
    user: string;
    status: ExperimentStatus;
}

const getQueryParamsFromURL = (params: URLSearchParams | null): QueryParams => {
    return {
        search: params?.get("search") ?? "",
        user: params?.get("user") ?? "",
        status: (params?.get("status") ?? "all") as ExperimentStatus,
    };
};

function queryParamEquals(
    oldParams: QueryParams,
    newParams: QueryParams
): boolean {
    return (
        oldParams.search === newParams.search &&
        oldParams.user === newParams.user &&
        oldParams.status === newParams.status
    );
}

const ExperimentList: React.FC = () => {
    const [rows, setRows] = useState<ExperimentTableInfo[]>([]);
    const [showCreationDialog, setShowCreationDialog] =
        useState<boolean>(false);
    const [showConfirmationDialog, setShowConfirmationDialog] =
        useState<boolean>(false);
    const [selectedExperimentIds, setSelectedExperimentIds] =
        useState<GridRowSelectionModel>([]);
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();
    const router = useRouter();
    const [queryParams, setQueryParams] = useState<QueryParams>({
        search: "",
        user: "",
        status: "all",
    });
    const [userFilterList, setUserFilterList] = useState<
        {
            label: string;
            value: string;
        }[]
    >([]);
    const { user } = useContext(CurrentUserContext);
    const isAdmin: boolean = user?.isAdmin ?? false;

    const reloadExperimentData = async (
        paging: ServerPaginationArgs
    ): Promise<ExperimentTable> => {
        showLoading("Loading experiments...");
        const fetchedData = await getExperiments(paging);
        const newParams = getQueryParamsFromURL(
            new URLSearchParams(router.asPath)
        );
        if (!queryParamEquals(queryParams, newParams)) {
            return { rows: [], rowCount: 0 };
        }
        setRows(fetchedData.rows);
        hideLoading();
        return fetchedData;
    };

    const [paginationProps, reload] = useServerPagination(
        reloadExperimentData,
        [],
        {
            pageSize: 15,
            page: 0,
        }
    );

    const searchParams = useSearchParams();

    useEffect(() => {
        setQueryParams(getQueryParamsFromURL(searchParams));
    }, [searchParams]);

    useEffect(() => {
        const fetchUserData = async () => {
            setUserFilterList(
                (await fetchOwnersAndTechnicians()).map((user: UserInfo) => ({
                    label: `${user.displayName} (${user.username})`,
                    value: user.username,
                }))
            );
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        reload();
    }, [queryParams]);

    const colDefs: GridColDef[] = [
        {
            field: "id",
            headerName: "ID",
            type: "number",
            flex: 1,
            valueFormatter: (params: any) => String(params.value),
        },
        {
            field: "title",
            headerName: "Title",
            type: "string",
            flex: 6,
            renderCell: (params) => {
                const title = params.row.title;
                const isTechnician = params.row.technicianIds.includes(
                    user?.id
                );
                return isTechnician ? (
                    <Tooltip
                        title={
                            <Typography fontSize={12}>
                                You are listed as a technician for this
                                experiment.
                            </Typography>
                        }
                        className="hover-underline"
                    >
                        <b>{title}</b>
                    </Tooltip>
                ) : params.row.ownerId == user?.id ? (
                    <b>{title}</b>
                ) : (
                    <span>{title}</span>
                );
            },
        },
        {
            field: "ownerDisplayName",
            headerName: "Owner",
            type: "string",
            flex: 3,
            renderCell: (params) => {
                const name = `${params.row.ownerDisplayName} (${params.row.owner})`;
                return params.row.ownerId === user?.id ? <b>{name}</b> : name;
            },
        },
        {
            field: "startDate",
            headerName: "Start Date",
            type: "string",
            valueGetter: (params) => params.row.startDate.toString(),
            flex: 1,
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
                queryParams.user,
                queryParams.status,
                paging
            );
        } catch (error) {
            showAlert("error", getErrorMessage(error));
            return { rows: [], rowCount: 0 };
        }
    };

    const prepareForDeletion = (selectedRows: GridRowSelectionModel) => {
        setSelectedExperimentIds(selectedRows);
        setShowConfirmationDialog(true);
    };

    const handleSearch = (
        query: string,
        user: string,
        status: ExperimentStatus
    ) => {
        const queryParams = new URLSearchParams();
        queryParams.set("search", query);
        queryParams.set("user", user);
        queryParams.set("status", status);
        if (!query && !user && status === "all") {
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
                                    user: queryParams.user,
                                    status: queryParams.status,
                                });
                                handleSearch(
                                    query,
                                    queryParams.user,
                                    queryParams.status
                                );
                            }}
                        />
                    </Box>
                    <Box sx={{ flex: 2, paddingLeft: 5 }}>
                        <Autocomplete
                            disablePortal
                            id="user-filter-selection"
                            size="small"
                            options={[
                                { label: "(None)", value: "" },
                                ...userFilterList,
                            ]}
                            value={{
                                label:
                                    userFilterList.find(
                                        (user) =>
                                            user.value === queryParams.user
                                    )?.label ?? "",
                                value: queryParams.user,
                            }}
                            isOptionEqualToValue={(option, value) =>
                                option.value === value.value
                            }
                            renderInput={(params) => (
                                <TextField {...params} label="User Filter" />
                            )}
                            onChange={(_event, selectedOption) => {
                                const selectedUser =
                                    selectedOption !== null
                                        ? selectedOption.value
                                        : "";
                                setQueryParams({
                                    search: queryParams.search,
                                    user: selectedUser,
                                    status: queryParams.status,
                                });
                                handleSearch(
                                    queryParams.search,
                                    selectedUser,
                                    queryParams.status
                                );
                            }}
                        />
                    </Box>
                    <Box sx={{ paddingX: 5 }}>
                        <FormControl component="fieldset">
                            <FormLabel
                                component="legend"
                                sx={{
                                    color: "text.primary",
                                    "&.Mui-focused": { color: "text.primary" },
                                }}
                            >
                                Status Filter
                            </FormLabel>
                            <RadioGroup
                                row
                                aria-label="status"
                                name="row-radio-buttons-group"
                                value={queryParams.status}
                                onChange={(e) => {
                                    setQueryParams({
                                        search: queryParams.search,
                                        user: queryParams.user,
                                        status: e.target
                                            .value as ExperimentStatus,
                                    });
                                    handleSearch(
                                        queryParams.search,
                                        queryParams.user,
                                        e.target.value as ExperimentStatus
                                    );
                                }}
                            >
                                <FormControlLabel
                                    value="all"
                                    control={<Radio />}
                                    label="All"
                                />
                                <FormControlLabel
                                    value="canceled"
                                    control={<Radio />}
                                    label="Canceled"
                                />
                                <FormControlLabel
                                    value="non-canceled"
                                    control={<Radio />}
                                    label="Non-Canceled"
                                />
                            </RadioGroup>
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
                    rows={rows}
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
                <ConfirmationDialog
                    open={showConfirmationDialog}
                    text="Are you sure you want to delete this experiment? This action cannot be undone."
                    onClose={() => {
                        setShowConfirmationDialog(false);
                    }}
                    onConfirm={handleDeleteExperiments}
                />
            </Stack>
        </Layout>
    );
};

ExperimentList.displayName = "ExperimentList";
export default ExperimentList;
