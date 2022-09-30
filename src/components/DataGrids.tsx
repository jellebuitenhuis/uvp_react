import {Box, Button, capitalize, Select, SelectChangeEvent} from "@mui/material";
import {
    DataGrid, GridPreProcessEditCellProps, GridRenderEditCellParams, GridRowModel,
    GridToolbar, useGridApiContext
} from "@mui/x-data-grid";
import {dataGridEditStyle} from "../styles/dataGridStyles";
import AddIcon from '@mui/icons-material/Add';
import {CategoryType, GroupType, ParticipantType, StartGroupType} from "../types/JsonTypes";

export const displayParticipants = (participants: ParticipantType[], customToolbar: () => JSX.Element, setParticipants: (participants: ParticipantType[]) => void) => {

    const addNewParticipant = (newRow: ParticipantType) => {
        // find the deelnemerid in the participants array and then update the participant
        setParticipants([...participants, newRow])
    }

    const processParticipantRowUpdate = (newRow: GridRowModel) => {
        void addNewParticipant(newRow as ParticipantType)
        return newRow
    }

    return <Box style={{
        display: 'flex',
    }}>
        <DataGrid
            processRowUpdate={processParticipantRowUpdate}
            experimentalFeatures={{
                newEditingApi: true,
            }}
            components={{
                Toolbar: customToolbar,
            }}
            initialState={{
                pagination: {
                    pageSize: 25,
                },
                columns: {
                    columnVisibilityModel: {
                        'startranking': false,
                        'groepid': false,
                        'lidnr': false,
                    }
                },
                sorting: {
                    sortModel: [{
                        field: 'deelnemerid',
                        sort: 'asc'
                    }]
                }
            }}
            autoHeight={true}
            sx={{
                m: 2,
                flexGrow: 1,
                ...dataGridEditStyle
            }}
            getRowId={(row) => row.deelnemerid as string}
            rows={participants}
            columns={[
                {
                    field: 'deelnemerid',
                    headerName: 'Deelnemer ID',
                    width: 110,
                },
                {
                    field: 'startnummer',
                    headerName: 'Startnummer',
                    width: 100,
                    editable: true,
                    preProcessEditCellProps: (params) => {
                        return validateNumberInput(params)
                    }
                },
                {
                    field: 'fullName',
                    headerName: 'Naam',
                    width: 200,
                    valueGetter: ({row}) => {
                        const rowAsParticipant = row as ParticipantType

                        return capitalize(`${rowAsParticipant.voornaam || ''} ${rowAsParticipant.tussenvoegsel || ''} ${rowAsParticipant.achternaam || ''}`);
                    },
                },
                {
                    field: 'catcode',
                    headerName: 'Categorie',
                    width: 100,
                },
                {
                    field: 'email',
                    headerName: 'Email',
                    width: 300,
                },
                {
                    field: 'geboortedatum',
                    headerName: 'Geboortedatum',
                    width: 120,
                },
                {
                    field: 'geslacht',
                    headerName: 'Geslacht',
                    width: 75,
                },
                {
                    field: 'inschrijfdatum',
                    headerName: 'Inschrijfdatum',
                    width: 120,
                },
                {
                    field: 'lidnr',
                    headerName: 'Lidnr',
                    width: 75,
                },
                {
                    field: 'samenloopnummer',
                    headerName: 'Samenloopnummer',
                    width: 150,
                },
                {
                    field: 'shirtmaat',
                    headerName: 'Shirtmaat',
                    width: 100,
                },
                {
                    field: 'startranking',
                    headerName: 'Startranking',
                    width: 120,
                    renderCell: ({row}) => {
                        const rowAsParticipant = row as ParticipantType
                        return (
                            <div>
                                {Number.parseInt(rowAsParticipant.startranking) / 10000}
                            </div>
                        );
                    }
                },
                {
                    field: 'groepid',
                    headerName: 'Groep ID',
                    width: 75,
                },
                {
                    field: 'woonplaats',
                    headerName: 'Woonplaats',
                    width: 100,
                },
                {
                    field: 'notitie',
                    headerName: 'Notitie',
                    flex: 1,
                    minWidth: 300,
                }

            ]}></DataGrid>
    </Box>
}

export const displayCategories = (categories: CategoryType[], setCategories: (categories: CategoryType[]) => void) => {

    const processCategoryRowUpdate = (newRow: GridRowModel) => {
        setCategories(categories.map(category => category.cat_id === newRow.cat_id ? newRow : category) as CategoryType[])
        return newRow
    }

    return <Box sx={{
        width: '40vw',
    }}>
        <DataGrid
            initialState={{
                pagination: {
                    pageSize: 25,
                },
                columns: {
                    columnVisibilityModel: {
                        shirtkleur: false
                    },
                }
            }}
            sx={
                dataGridEditStyle
            }
            processRowUpdate={processCategoryRowUpdate}
            experimentalFeatures={{newEditingApi: true}}
            autoHeight={true}
            rows={categories}
            getRowId={(row) => {
                const rowAsCategory = row as CategoryType
                return rowAsCategory.cat_id
            }}
            columns={[
                {
                    field: 'cat_code',
                    headerName: 'Categorie',
                    width: 100,
                },
                {
                    field: 'omschrijving',
                    headerName: 'Omschrijving',
                    width: 300,
                },
                {
                    field: 'shirtkleur',
                    headerName: 'Shirtkleur',
                    width: 100,
                },
                {
                    field: 'startvan',
                    headerName: 'Start Van',
                    width: 100,
                    editable: true,
                    preProcessEditCellProps: (params) => {
                        return validateNumberInput(params)
                    }
                },
                {
                    field: 'starttm',
                    headerName: 'Start t/m',
                    width: 100,
                    editable: true,
                    preProcessEditCellProps: (params) => {
                        return validateNumberInput(params);
                    }
                },
                {
                    field: 'starttijd',
                    headerName: 'Starttijd',
                    width: 100,
                    editable: true,
                    preProcessEditCellProps: (params) => {
                        // check if params.props.tabIndex is in the format hh:mm
                        const isInvalidTime = !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(params.props.value as string);
                        return {...params.props, error: isInvalidTime};
                    }
                }
            ]}
        />
    </Box>
}

export const displayStartGroups = (startGroups: StartGroupType[], setStartGroups: (startGroups: StartGroupType[]) => void, categories: CategoryType[]) => {

    const processStartGroupRowUpdate = (newRow: GridRowModel) => {
        setStartGroups(startGroups.map(startGroup => startGroup.id === newRow.id ? newRow : startGroup) as StartGroupType[])
        return newRow
    }

    const AddRowButton = () => {
        return (
            <Box>
                <Button
                    onClick={() => {
                        setStartGroups(startGroups.concat([
                            {
                                startvan: '0',
                                starttm: '0',
                                starttijd: '00:00',
                                omschrijving: '',
                                catcode: '',
                                id: Math.floor(Math.random() * 1000000).toString()
                            }
                        ]))
                    }}>
                    <AddIcon htmlColor={'#31a836'}/>Add Row
                </Button>
            </Box>
        )
    }

    function SelectEditInputCell(props: GridRenderEditCellParams) {
        const {id, field} = props;
        const value = props.value as string;
        const apiRef = useGridApiContext();

        const handleChange = (event: SelectChangeEvent) => {
            void (async () => {
                await apiRef.current.setEditCellValue({id, field, value: event.target.value});
                apiRef.current.stopCellEditMode({id, field});
            })();
        };

        return (
            <Select
                value={value}
                onChange={handleChange}
                size="small"
                sx={{height: 1}}
                native
                autoFocus
            >
                {categories.map((category) => <option key={category.cat_id}
                                                      value={category.cat_code}>{category.omschrijving}</option>)}
            </Select>
        );
    }

    function renderSelectEditInputCell(params: GridRenderEditCellParams) {
        return <SelectEditInputCell {...params} />;
    }

    return <Box sx={{
        width: '1200px',
    }}>
        <DataGrid
            editMode={'row'}
            processRowUpdate={processStartGroupRowUpdate}
            components={{
                Toolbar: GridToolbar,
                Footer: AddRowButton
            }}
            initialState={{
                pagination: {
                    pageSize: 25,
                },
            }}
            sx={{
                m: 2,
                flexGrow: 1,
                ...dataGridEditStyle
            }}
            experimentalFeatures={{newEditingApi: true}}
            autoHeight={true}
            rows={startGroups}
            getRowId={row => row.id as string}
            columns={[
                {
                    field: 'catcode',
                    headerName: 'Categorie',
                    flex: 1,
                    minWidth: 300,
                    editable: true,
                    renderEditCell: renderSelectEditInputCell
                },
                {
                    field: 'startvan',
                    headerName: 'Start Van',
                    width: 100,
                    flex: 0.2,
                    editable: true,
                    type: 'number',
                    preProcessEditCellProps: (params) => {
                        return validateNumberInput(params)
                    }
                },
                {
                    field: 'starttm',
                    headerName: 'Start t/m',
                    width: 100,
                    flex: 0.2,
                    editable: true,
                    type: 'number',
                    preProcessEditCellProps: (params) => {
                        return validateNumberInput(params)
                    }
                },
                {
                    field: 'starttijd',
                    headerName: 'Starttijd',
                    width: 100,
                    flex: 0.5,
                    editable: true,
                    preProcessEditCellProps: (params) => {
                        // check if params.props.tabIndex is in the format hh:mm
                        const isInvalidTime = !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(params.props.value as string);
                        return {...params.props, error: isInvalidTime};
                    }
                },
                {
                    field: 'omschrijving',
                    headerName: 'Omschrijving',
                    width: 300,
                    flex: 1,
                    editable: true,
                    type: 'string'
                }
            ]}
        />
    </Box>
}

export const displayGroups = (groups: GroupType[], setGroups: (groups: GroupType[]) => void) => {
    const processGroupRowUpdate = (newRow: GridRowModel) => {
        setGroups(groups.map(group => group.groep_id === newRow.groep_id ? newRow : group) as GroupType[])
        return newRow
    }

    return <Box sx={{
        width: '40vw',
    }}>
        <DataGrid
            processRowUpdate={processGroupRowUpdate}
            components={{
                Toolbar: GridToolbar
            }}
            initialState={{
                pagination: {
                    pageSize: 25,
                },
            }}
            sx={
                dataGridEditStyle
            }
            experimentalFeatures={{newEditingApi: true}}
            autoHeight={true}
            rows={groups}
            getRowId={row => row.groep_id as string}
            columns={[
                {
                    field: 'groep_id',
                    headerName: 'Groep ID',
                    width: 100,
                },
                {
                    field: 'startnummer',
                    headerName: 'Startnummer',
                    width: 100,
                    editable: true,
                },
                {
                    field: 'teamnaam',
                    headerName: 'Teamnaam',
                    width: 300,
                },
                {
                    field: 'catcode',
                    headerName: 'Categorie',
                    width: 200,
                }
            ]}
        />
    </Box>
};

const validateNumberInput = (params: GridPreProcessEditCellProps) => {
    const hasError = isNaN(params.props.value as number);
    return {...params.props, error: hasError};
}
