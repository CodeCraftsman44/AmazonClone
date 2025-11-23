import { Box, Collapse, Typography } from '@mui/material';
import { width } from '@mui/system';
import { DataGrid, GridRow } from '@mui/x-data-grid';
import { GridToolbar } from '@mui/x-data-grid/internals';
import { Add, Delete, Edit } from '@mui/icons-material';
import { IconButton } from '@mui/material';


const ExpendableRow = ({ row, props, onEditClick, onDeleteClick }) => {
    let columns = [];
    if (row.children && row.children.length > 0) {
        columns = Object.keys(row.children[0]).map((key) => {
            return { field: key, headerName: key.charAt(0).toUpperCase() + key.slice(1).replaceAll("_", " "), width: 150 }
        }).filter((item) => item.field !== 'children')

        columns = [{
            field: 'Action', headerName: 'Action', width: 180, sortable: false, renderCell: (params) => {
                return (
                    <Box>
                       
                        <IconButton onClick={() => onEditClick(params)}><Edit color='primary' /></IconButton>
                        <IconButton onClick={() => onDeleteClick(params)}><Delete color='secondary' /></IconButton>
                    </Box>
                );

            }
        }, ...columns]
    }

    return <>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <GridRow {...props} />
            <Collapse in={row?.open ? row.open : false} timeout={"auto"} unmountOnExit>
                <Box margin={1}>
                    {row.children && row.children.length > 0 ?
                        <DataGrid
                            rows={row.children}
                            columns={columns}
                            hideFooter
                            rowHeight={75}
                            autoHeight
                            rowSelection={false}
                            slots={{ toolbar: GridToolbar }}

                        />
                        : (
                            <Typography variant="body2" align='center' textAlign={'center'} >No Children Items</Typography>
                        )
                    }
                </Box>
            </Collapse>
        </Box>
    </>

}
export default ExpendableRow;