import {
    GridCsvExportMenuItem, GridToolbarColumnsButton,
    GridToolbarContainer, GridToolbarDensitySelector,
    GridToolbarExportContainer, GridToolbarFilterButton,
    useGridApiContext
} from "@mui/x-data-grid";
import {MenuItem} from "@mui/material";
import {exportBlob, getJson} from "../util/fileHelpers";

const JsonExportMenuItem = (props) => {
    const {participants, categories, groups, credentials, run, startGroups} = props

    const {hideMenu} = props;

    return (
        <MenuItem
            onClick={() => {
                const jsonString = getJson(participants, credentials, categories, groups, run, startGroups);
                const blob = new Blob([jsonString], {
                    type: 'text/json',
                });

                exportBlob(blob, `startlijst_${run[0].naam}.json`);

                // Hide the export menu after the export
                hideMenu?.();
            }}
        >
            Export JSON
        </MenuItem>
    );
};

const CustomExportButton = (props) => {
    return (
        <GridToolbarExportContainer {...props}>
            <GridCsvExportMenuItem/>
            <JsonExportMenuItem participants={props.participants} categories={props.categories} groups={props.groups} credentials={props.credentials} run={props.run} startGroups={props.startGroups}/>
        </GridToolbarExportContainer>
    )
}

export const CustomToolbar = (participants, categories, groups, credentials, run, startGroups) => {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton/>
            <GridToolbarFilterButton/>
            <GridToolbarDensitySelector/>
            <CustomExportButton participants={participants} categories={categories} groups={groups} credentials={credentials} run={run} startGroups={startGroups}/>
        </GridToolbarContainer>
    )
}
