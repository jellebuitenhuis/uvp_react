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
import SbnType, {SbnParticipant, SbnStartGroup} from "../types/SbnTypes";

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

                const BOM = new Uint8Array([0xEF,0xBB,0xBF]);
                const blob = new Blob([BOM, csv], {
                    type: 'text/csv;chartset=utf-8',
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

const CSVExportStartGroupMenuItem = (props: ToolbarPropsType) => {

    const {jsonToCSV } = usePapaParse();

    const {participants, categories, groups, credentials, run, startGroups} = props

    const {hideMenu} = props;

    return (
        <MenuItem
            onClick={() => {
                const jsonString = JSON.parse(getJson(participants, credentials, categories, groups, run, startGroups)) as SbnType;

                const startGroupsInfo = jsonString.runData.survivalrun.startgroepen.startgroep.map((startGroup: SbnStartGroup) => {
                    const startGroupAttributes = startGroup._attributes
                    return {
                        'catcode': startGroupAttributes.catcode,
                        'startvan': startGroupAttributes.startvan,
                        'starttm': startGroupAttributes.starttm,
                        'starttijd': startGroupAttributes.starttijd,
                        'omschrijving': startGroupAttributes.omschrijving,
                        'id': startGroupAttributes.id,
                    }
                })

                if(startGroupsInfo.length === 0) {
                    // for every category, create an empty startgroup
                    startGroupsInfo.push(...categories.map((category: CategoryType) => {
                        return {
                            'catcode': category.cat_code ,
                            'startvan': '',
                            'starttm': '',
                            'starttijd': '',
                            'omschrijving': '',
                            'id': '',
                        }
                    }))
                }

                const csv = jsonToCSV(startGroupsInfo, {
                    header: true,
                    columns: ['catcode', 'startvan', 'starttm', 'starttijd', 'omschrijving'],
                    skipEmptyLines: false,
                });
                const BOM = new Uint8Array([0xEF,0xBB,0xBF]);
                const blob = new Blob([BOM, csv], {
                    type: 'text/csv;chartset=utf-8',
                });

                exportBlob(blob, `startgroepen${run.naam}.csv`);

                // Hide the export menu after the export
                hideMenu?.();
            }}
        >
            Export CSV
        </MenuItem>
    );
};

const CustomStartGroupExportButton = (props: ToolbarPropsType) => {
    return (
        <GridToolbarExportContainer {...props}>
            <CSVExportStartGroupMenuItem participants={props.participants} categories={props.categories} groups={props.groups} credentials={props.credentials} run={props.run} startGroups={props.startGroups}/>
        </GridToolbarExportContainer>
    )
}

export const CustomStartGroupToolbar = (participants: ParticipantType[], categories: CategoryType[], groups: GroupType[], credentials: CredentialsType, run: RunType, startGroups: StartGroupType[]) => {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton/>
            <GridToolbarFilterButton/>
            <GridToolbarDensitySelector/>
            <CustomStartGroupExportButton participants={participants} categories={categories} groups={groups} credentials={credentials} run={run} startGroups={startGroups}/>
        </GridToolbarContainer>
    )
}
