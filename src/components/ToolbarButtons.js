import {
    GridCsvExportMenuItem, GridToolbarColumnsButton,
    GridToolbarContainer, GridToolbarDensitySelector,
    GridToolbarExportContainer, GridToolbarFilterButton,
    useGridApiContext
} from "@mui/x-data-grid";
import {MenuItem} from "@mui/material";
import {exportBlob, getJson} from "../util/fileHelpers";
import {usePapaParse} from "react-papaparse";

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

const CSVExportMenuItem = (props) => {

    const {jsonToCSV } = usePapaParse();

    const {participants, categories, groups, credentials, run, startGroups} = props

    const {hideMenu} = props;

    return (
        <MenuItem
            onClick={() => {
                const jsonString = JSON.parse(getJson(participants, credentials, categories, groups, run, startGroups));

                const participantsInfo = jsonString.runData.survivalrun.deelnemers.deelnemer.map((participant) => {
                    participant = participant._attributes
                    return {
                        'catcode': participant.catcode,
                        'naam': participant.naam,
                        'woonplaats': participant.woonplaats,
                        'estafettenummer': participant.estafettenummer,
                        'lidnr': participant.lidnr,
                        'deelnemerid': participant.deelnemerid,
                        'startnummer': participant.startnummer,
                        'email': participant.email,
                        'geboortedatum': participant.geboortedatum,
                        'geslacht': participant.geslacht,
                        'inschrijfdatum': participant.inschrijfdatum,
                        'samenloopnummer': participant.samenloopnummer,
                        'shirtmaat': participant.shirtmaat,
                        'notitie': participant.notitie,
                        'startranking': participant.startranking,
                        'groepid': participant.groepid,
                    }
                })

                const csv = jsonToCSV(participantsInfo, {
                    header: true,
                });

                const blob = new Blob([csv], {
                    type: 'text/csv',
                });

                exportBlob(blob, `startlijst_${run[0].naam}.csv`);

                // Hide the export menu after the export
                hideMenu?.();
            }}
        >
            Export CSV
        </MenuItem>
    );
};

const CustomExportButton = (props) => {
    return (
        <GridToolbarExportContainer {...props}>
            <CSVExportMenuItem participants={props.participants} categories={props.categories} groups={props.groups} credentials={props.credentials} run={props.run} startGroups={props.startGroups}/>
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