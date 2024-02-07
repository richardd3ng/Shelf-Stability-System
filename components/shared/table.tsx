import * as React from "react";
import { Box, IconButton, Typography } from "@mui/material";
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
    footer?: React.JSXElementConstructor<any>;
    onDeleteRows?: (rows: GridRowSelectionModel) => void;
}

const Table: React.FC<TableProps & DataGridProps> = (props: TableProps & DataGridProps) => {
    const [selectedRows, setSelectedRows] =
        React.useState<GridRowSelectionModel>([]);

    const handleDeleteRows = () => {
        if (props.onDeleteRows !== undefined) {
            props.onDeleteRows(selectedRows);
        }
        setSelectedRows([]);
    };

    const DeleteButton: React.FC = () => (
        <IconButton
            disabled={selectedRows.length === 0}
            onClick={handleDeleteRows}
        >
            <DeleteIcon />
        </IconButton>
    );

    const FooterComponent: React.FC = () => {
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
                                {DeleteButton({})}
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
                pageSizeOptions={[10, 15]}
                checkboxSelection
                disableRowSelectionOnClick
                slots={{ footer: FooterComponent }}
                onRowSelectionModelChange={(
                    newSelectedRows: GridRowSelectionModel
                ) => {
                    setSelectedRows(newSelectedRows);
                }}
                {...props}
            />
        </Box>
    );
};

export default Table;
