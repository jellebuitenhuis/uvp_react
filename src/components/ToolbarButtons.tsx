import {
    GridToolbarColumnsButton,
    GridToolbarContainer, GridToolbarDensitySelector,
    GridToolbarExportContainer, GridToolbarFilterButton
} from "@mui/x-data-grid";
import {MenuItem} from "@mui/material";
import {exportBlob, getJson} from "../util/fileHelpers";
import {usePapaParse} from "react-papaparse";
import RunType, {CategoryType, GroupType, ParticipantType, StartGroupType} from "../types/JsonTypes";
import CredentialsType from "../types/CredentialsType";
import {ToolbarPropsType} from "../types/RunInfoPropsType";
import SbnType, {SbnParticipant} from "../types/SbnTypes";

const JsonExportMenuItem = (props: ToolbarPropsType) => {
    const {participants, categories, groups, credentials, run, startGroups} = props

    const {hideMenu} = props;

    return (
        <MenuItem
            onClick={() => {
                const jsonString = getJson(participants, credentials, categories, groups, run, startGroups);
                const blob = new Blob([jsonString], {
                    type: 'text/json',
                });

                exportBlob(blob, `startlijst_${run.naam}.json`);

                // Hide the export menu after the export
                hideMenu?.();
            }}
        >
            Export JSON
        </MenuItem>
    );
};

const CSVExportMenuItem = (props: ToolbarPropsType) => {

    const {jsonToCSV } = usePapaParse();

    const {participants, categories, groups, credentials, run, startGroups} = props

    const {hideMenu} = props;

    return (
        <MenuItem
            onClick={() => {
                const jsonString = JSON.parse(getJson(participants, credentials, categories, groups, run, startGroups)) as SbnType;

                const participantsInfo = jsonString.runData.survivalrun.deelnemers.deelnemer.map((participant: SbnParticipant) => {
                    const participantAttributes = participant._attributes;
                    return {
                        'catcode': participantAttributes.catcode,
                        'naam': participantAttributes.naam,
                        'woonplaats': participantAttributes.woonplaats,
                        'estafettenummer': participantAttributes.estafettenummer,
                        'lidnr': participantAttributes.lidnr,
                        'deelnemerid': participantAttributes.deelnemerid,
                        'startnummer': participantAttributes.startnummer,
                        'email': participantAttributes.email,
                        'geboortedatum': participantAttributes.geboortedatum,
                        'geslacht': participantAttributes.geslacht,
                        'inschrijfdatum': participantAttributes.inschrijfdatum,
                        'samenloopnummer': participantAttributes.samenloopnummer,
                        'shirtmaat': participantAttributes.shirtmaat,
                        'notitie': participantAttributes.notitie,
                        'startranking': participantAttributes.startranking,
                        'groepid': participantAttributes.groepid,
                    }
                })

                const csv = jsonToCSV(participantsInfo, {
                    header: true,
                });

                const blob = new Blob([csv], {
                    type: 'text/csv',
                });

                exportBlob(blob, `startlijst_${run.naam}.csv`);

                // Hide the export menu after the export
                hideMenu?.();
            }}
        >
            Export CSV
        </MenuItem>
    );
};

const CustomExportButton = (props: ToolbarPropsType) => {
    return (
        <GridToolbarExportContainer {...props}>
            <CSVExportMenuItem participants={props.participants} categories={props.categories} groups={props.groups} credentials={props.credentials} run={props.run} startGroups={props.startGroups}/>
            <JsonExportMenuItem participants={props.participants} categories={props.categories} groups={props.groups} credentials={props.credentials} run={props.run} startGroups={props.startGroups}/>
        </GridToolbarExportContainer>
    )
}

export const CustomToolbar = (participants: ParticipantType[], categories: CategoryType[], groups: GroupType[], credentials: CredentialsType, run: RunType, startGroups: StartGroupType[]) => {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton/>
            <GridToolbarFilterButton/>
            <GridToolbarDensitySelector/>
            <CustomExportButton participants={participants} categories={categories} groups={groups} credentials={credentials} run={run} startGroups={startGroups}/>
        </GridToolbarContainer>
    )
}
