import * as React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import {
    DataGrid,
    GridColDef,
    GridFooter,
    GridFooterContainer,
    GridRowSelectionModel,
} from "@mui/x-data-grid";

interface TableProps {
    columns: GridColDef[];
    rows: any[];
    pagination?: true;
    footer?: React.JSXElementConstructor<any>;
    onDeleteRows?: (rows: GridRowSelectionModel) => void;
    onSortModelChange?: (sortModel: any) => void;
}

const Table: React.FC<TableProps> = (props: TableProps) => {
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
                rows={props.rows}
                columns={props.columns}
                hideFooterPagination={!props.pagination}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
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
                onSortModelChange={props.onSortModelChange}
            />
        </Box>
    );
};

export default Table;
