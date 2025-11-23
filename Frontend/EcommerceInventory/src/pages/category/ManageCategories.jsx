import { useState, useEffect } from 'react';
import { useApi } from '../../hooks/APIHandler';
import { Box, Breadcrumbs, IconButton, LinearProgress, TextField, Toolbar, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { isValidUrl } from '../../utils/Helper';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import { ExpandLess, ExpandLessRounded } from '@mui/icons-material';
import { ExpandMoreRounded } from '@mui/icons-material';
import { set } from 'react-hook-form';
import ExpendableRow from './ExpendableRow';

const ManageCategories = () => {

    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
    const [totalItems, setTotalItems] = useState(0);
    const { error, loading, callApi } = useApi();
    const [searchQuery, setSearchQuery] = useState('');
    const [debounceSearch, setDebounceSearch] = useState('');
    const navigate = useNavigate();
    const [ordering, setOrdering] = useState([{ field: 'id', sort: 'desc' }]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceSearch(searchQuery);
        }, 1000);
        return () => clearTimeout(timer);
    }, [searchQuery]);


    const getCategories = async () => {
        let order = '-id';
        if (ordering.length > 0) {
            order = ordering[0].sort === 'asc' ? ordering[0].field : '-' + ordering[0].field;
        }
        const result = await callApi({
            url: 'products/categories/',
            method: 'GET',
            params: {
                page: paginationModel.page + 1,
                pageSize: paginationModel.pageSize,
                search: debounceSearch,
                ordering: order
            }
        })

        if (result) {

            setData(result.data.data.data);
            setTotalItems(result.data.data.totalItems);
            generateColumns(result.data.data.data);
        }
    }

    const onDeleteClick = (params) => {
        console.log('Delete clicked for', params.row);
    }
    const onEditClick = (params) => {
        navigate(`/categories/edit/${params.row.id}`);
    }
    const onAddClick = (params) => {
        navigate(`/categories/add?parent=${params.row.id}`);
    }

    const generateColumns = (data) => {
        if (data.length > 0) {
            const columns = [, {
                field: 'Expand', headerName: 'Expand', width: 100, sortable: false, renderCell: (params) => {
                    return (<IconButton onClick={() => {
                        const updatedRows = data.map((row) => {
                            if (row.id === params.row.id) {
                                if (row?.open) {
                                    row.open = false
                                } else {
                                    row.open = true
                                }
                            }
                            return { ...row, open: !row.open };
                        });
                        setData([...updatedRows]);
                    }}>
                        {params.row?.open ? <ExpandLessRounded /> : <ExpandMoreRounded />}
                    </IconButton>);
                }
            }]
            for (const key in data[0]) {
                if (key === 'children') {
                    columns.push({
                        field: key,
                        headerName: key.charAt(0).toUpperCase() + key.slice(1).replaceAll('_', ' '), width: 150, sortable: false, renderCell: (params) => {
                            return <Typography variant="body2" pt={3} pb={3}>{params.row.children?.length}</Typography>;
                        }
                    });

                } else if (key === 'image') {
                    columns.push({
                        field: key,
                        headerName: key.charAt(0).toUpperCase() + key.slice(1).replaceAll('_', ' '),
                        width: 150,
                        sortable: false,
                        renderCell: (params) => {
                            const val = params.value;
                            const src =
                                typeof val === 'string' ? val :
                                    (val?.url ?? null);
                            return (src && isValidUrl(src))
                                ? <img src={src} alt={params.row?.name || 'image'} style={{ width: 70, height: 70, padding: '5px', objectFit: 'cover' }} />
                                : <Typography variant="body2" pt={3} pb={3}>No Image</Typography>;
                        }
                    });
                } else {
                    columns.push({ field: key, headerName: key.charAt(0).toUpperCase() + key.slice(1).replaceAll('_', ' '), width: 150 });
                }
            }
            setColumns(columns);
        }
    }

    const handleSorting = (newModel) => {
        setOrdering(newModel);
    }

    useEffect(() => {
        getCategories();
    }, [paginationModel, debounceSearch, ordering]);
    return (
        <Box component={"div"} sx={{ width: '100%' }}>
            <Breadcrumbs>
                <Typography variant="body2" onClick={() => navigate("/")}>Home</Typography>
                <Typography variant="body2" onClick={() => navigate("/manage/category")}>Manage Category</Typography>
            </Breadcrumbs>
            <TextField label="Search" variant="outlined" fullWidth onChange={(e) => setSearchQuery(e.target.value)} margin="normal" />

            <DataGrid
                rows={data}
                columns={columns}
                rowHeight={75}
                sortingOrder={['asc', 'desc']}
                sortModel={ordering}
                onSortModelChange={handleSorting}
                initialState={{
                    ...data.initialState,
                    pagination: { paginationModel },
                }}
                pageSizeOptions={[5, 10, 20]}
                paginationMode="server"   // <-- add
                sortingMode="server"
                pagination
                rowCount={totalItems}
                loading={loading}
                rowSelection={false}
                onPaginationModelChange={(pagedetails) => {
                    setPaginationModel({
                        page: pagedetails.page,
                        pageSize: pagedetails.pageSize
                    })
                }}
                components={{ Toolbar: GridToolbar }}
                slots={{
                    loadingOverlay: LinearProgress,
                    toolbar: GridToolbar,
                    row: (props) => {
                        return <ExpendableRow row={props.row} props={props} onEditClick={onEditClick} onDeleteClick={onDeleteClick} />
                    }
                }}
                slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 500 } } }}
            />
        </Box>
    );
}

export default ManageCategories;