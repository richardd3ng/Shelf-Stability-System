import React from "react";
import { Box, IconButton, Typography, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    DataGrid,
    DataGridProps,
    GridFooter,
    GridFooterContainer,
    GridRowSelectionModel,
} from "@mui/x-data-grid";

interface TableProps {
    sortModel?: any;
    checkboxSelection?: boolean;
    footer?: React.JSXElementConstructor<any>;
    hideFooterContainer?: boolean;
    onDeleteRows?: (rows: GridRowSelectionModel) => void;
    handleCellClick?: (params: any) => void;
}

const Table: React.FC<TableProps & DataGridProps> = (
    props: TableProps & DataGridProps
) => {
    const [selectedRows, setSelectedRows] =
        React.useState<GridRowSelectionModel>([]);

    const handleDeleteRows = () => {
        if (props.onDeleteRows !== undefined) {
            props.onDeleteRows(selectedRows);
        }
        setSelectedRows([]);
    };

    const FooterComponent: React.FC = () => {
        if (props.hideFooterContainer) {
            return <></>;
        }
        return (
            <GridFooterContainer>
                <Box
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingLeft: "10px",
                    }}
                >
                    <Box>
                        {selectedRows.length > 0 && (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography variant="body2" component="span">
                                    Delete {selectedRows.length} rows
                                </Typography>
                                <IconButton
                                    disabled={selectedRows.length === 0}
                                    onClick={handleDeleteRows}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                </Box>
                <GridFooter
                    sx={{
                        border: "none",
                    }}
                />
                {props.footer && <props.footer />}
            </GridFooterContainer>
        );
    };

    return (
        <Box sx={{ width: "100%" }}>
            <DataGrid
                hideFooterPagination={!props.pagination}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                    sorting: {
                        sortModel: props.sortModel,
                    },
                }}
                disableColumnMenu
                autoHeight
                getRowHeight={() => "auto"}
                pageSizeOptions={[
                    10,
                    25,
                    50,
                    100,
                    { value: 100, label: "All" },
                ]}
                checkboxSelection={props.checkboxSelection ?? false}
                disableRowSelectionOnClick
                slots={{ footer: FooterComponent }}
                onCellClick={props.handleCellClick}
                onRowSelectionModelChange={(
                    newSelectedRows: GridRowSelectionModel
                ) => {
                    setSelectedRows(newSelectedRows);
                }}
                {...props}
                sx={{
                    "@media print": { breakInside: "avoid" },
                }}
            />
        </Box>
    );
};

export default Table;
