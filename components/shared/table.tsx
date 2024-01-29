import * as React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";

interface TableProps {
    columns: GridColDef[];
    rows: any[];
    pagination?: boolean;
    footer?: React.JSXElementConstructor<any>;
    onDeleteRows: (rows: GridRowSelectionModel) => void;
}

const Table: React.FC<TableProps> = (props: TableProps) => {
    const [selectedRows, setSelectedRows] =
        React.useState<GridRowSelectionModel>([]);

    const handleDeleteRows = () => {
        props.onDeleteRows(selectedRows);
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

    const FooterComponent: React.FC = () => (
        <Box
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
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
            <Box>{props.footer && <props.footer />}</Box>
        </Box>
    );

    return (
        <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
                rows={props.rows}
                columns={props.columns}
                hideFooterPagination={!props.pagination}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                autoHeight
                getRowHeight={() => "auto"}
                pageSizeOptions={[10]}
                checkboxSelection
                disableRowSelectionOnClick
                slots={{ footer: FooterComponent }}
                onRowSelectionModelChange={(
                    newSelectedRows: GridRowSelectionModel
                ) => {
                    setSelectedRows(newSelectedRows);
                }}
            />
        </Box>
    );
};

export default Table;
