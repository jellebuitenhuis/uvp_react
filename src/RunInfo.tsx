import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Tab,
    Tabs, Typography
} from "@mui/material";
import React, {ReactFragment, useEffect, useState} from "react";
import {CustomStartGroupToolbar, CustomToolbar} from "./components/ToolbarButtons";
import {TabPanel} from "./components/TabPanel";
import {displayCategories, displayGroups, displayParticipants, displayStartGroups} from "./components/DataGrids";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import PublishIcon from '@mui/icons-material/Publish';
import RestoreIcon from '@mui/icons-material/Restore';
import _ from "lodash";
import {
    participantToSbn,
    sbnToCategory,
    sbnToGroup,
    sbnToParticipant,
    sbnToStartGroup,
    startGroupToSbn
} from "./util/sbnConverters";
import {publishStartList} from "./util/fetchHelpers";
import {getJson} from "./util/fileHelpers";
import {usePapaParse} from "react-papaparse";
import {createJsonTemplate} from "./util/jsonTemplates";
import RunInfoPropsType from "./types/RunInfoPropsType";
import {ParseResult} from "papaparse";
import {CategoryType, GroupType, ParticipantType, StartGroupType} from "./types/JsonTypes";
import SbnType, {SbnParticipant, SbnStartGroup} from "./types/SbnTypes";
import {ImportFileType} from "./types/FileTypes";
import {useTheme} from "@mui/styles";

function RunInfo(props: RunInfoPropsType) {

    const {readString} = usePapaParse();
    const [startNumberCsvData, setStartNumberCsvData] = useState<ParticipantType[]>();
    const [startGroupCsvData, setStartGroupCsvData] = useState<StartGroupType[]>();

    const startNumberCsvToJson = (data: string) => {
        readString(data, {
            worker: true,
            header: true,
            skipEmptyLines: true,
            complete: (results: ParseResult<ParticipantType>) => {
                setStartNumberCsvData(results.data);
            }
        });
    }

    const startGroupCsvToJson = (data: string) => {
        readString(data, {
            header: true,
            worker: true,
            skipEmptyLines: "greedy",
            complete: (results: ParseResult<StartGroupType>) => {
                // include a random id for each start group
                const startGroups = results.data.map((startGroup: StartGroupType) => {
                    return {...startGroup, id: _.uniqueId()}
                });
                setStartGroupCsvData(startGroups);
            }
        });
    }

    useEffect(() => {
        if (startGroupCsvData) {
            const startGroups: SbnStartGroup[] = []
            for (const startGroup of startGroupCsvData) {
                startGroups.push(startGroupToSbn(startGroup));
            }
            const jsonTemplate = createJsonTemplate(run, credentials)
            jsonTemplate.runData.survivalrun.startgroepen.startgroep = startGroups
            mergeCurrentData(jsonTemplate)
        }
    }, [startGroupCsvData]);

    useEffect(() => {
        if (startNumberCsvData) {
            const participants: SbnParticipant[] = []
            for (const participant of startNumberCsvData) {
                participant.voornaam = participant.naam as string;
                participants.push(participantToSbn(participant))
            }
            const jsonTemplate = createJsonTemplate(run, credentials)
            jsonTemplate.runData.survivalrun.deelnemers.deelnemer = participants
            mergeCurrentData(jsonTemplate)
        }
    }, [startNumberCsvData]);

    const {
        run,
        categories,
        groups,
        participants,
        credentials,
        setCategories,
        setParticipants,
        setGroups,
        startGroups,
        setStartGroups
    } = props;

    const [dialogTitle, setDialogTitle] = useState("Title");
    const [dialogContent, setDialogContent] = useState<ReactFragment>();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogActions, setDialogActions] = useState<ReactFragment>();

    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const createCustomToolbar = () => {
        return CustomToolbar(participants, categories, groups, credentials, run, startGroups)
    }

    const createCustomStartGroupToolbar = () => {
        return CustomStartGroupToolbar(participants, categories, groups, credentials, run, startGroups)
    }

    const mergeCurrentData = (oldData: SbnType) => {
        let newCategories: CategoryType[] = []
        for (const category of oldData.runData.survivalrun.cats.cat) {
            newCategories.push(sbnToCategory(category))
        }
        newCategories = _.unionBy(newCategories, categories, 'cat_id')
        setCategories(newCategories)

        let newGroups: GroupType[] = []
        for (const group of oldData.runData.survivalrun.groepnamen.groepnaam) {
            newGroups.push(sbnToGroup(group))
        }
        newGroups = _.unionBy(newGroups, groups, 'groep_id')
        setGroups(newGroups)

        let newParticipants: ParticipantType[] = []
        for (const participant of oldData.runData.survivalrun.deelnemers.deelnemer) {
            newParticipants.push(sbnToParticipant(participant))
        }
        newParticipants = _.unionBy(newParticipants, participants, 'deelnemerid')
        setParticipants(newParticipants)

        let newStartGroups: StartGroupType[] = []
        for (const startGroup of oldData.runData.survivalrun.startgroepen.startgroep) {
            newStartGroups.push(sbnToStartGroup(startGroup))
        }
        newStartGroups = _.unionBy(newStartGroups, startGroups, 'id')
        setStartGroups(newStartGroups)
    }

    const overwriteCurrentData = (data: SbnType) => {
        const newCategories: CategoryType[] = []
        for (const category of data.runData.survivalrun.cats.cat) {
            newCategories.push(sbnToCategory(category))
        }
        setCategories(newCategories)

        const newParticipants = []
        for (const participant of data.runData.survivalrun.deelnemers.deelnemer) {
            newParticipants.push(sbnToParticipant(participant))
        }
        setParticipants(newParticipants)

        const newGroups = []
        for (const group of data.runData.survivalrun.groepnamen.groepnaam) {
            newGroups.push(sbnToGroup(group))
        }
        setGroups(newGroups)

        const newStartGroups = []
        for (const startGroup of data.runData.survivalrun.startgroepen.startgroep) {
            newStartGroups.push(sbnToStartGroup(startGroup))
        }
        setStartGroups(newStartGroups)
    }

    const optionsExplanation = (fileType: ImportFileType) => {
        return (
            <Box>
                {fileType === 'JSON' &&
                <Typography>
                    Met de optie &quot;Overschrijven&quot; zal de huidige startlijst worden overschreven met de
                    backup. Al je
                    huidige
                    werk
                    gaat verloren!
                </Typography>
                }
                <Typography>
                    Met de optie &quot;Samenvoegen&quot; worden de startnummers van de backup in de huidige startlijst
                    gezet.
                </Typography>
            </Box>
        )
    }

    const showFileDialogStartNumbers = (fileType: ImportFileType, fileContent: string) => {
        setDialogTitle(`${fileType.toString()}-bestand uploaden?`)
        setDialogContent(
            <Box flex={1}>
                <Typography>
                    {`Weet je zeker dat je dit ${fileType.toString()}-bestand wilt uploaden? Je huidige werk gaat verloren!`}
                </Typography>
                <br/>
                {optionsExplanation(fileType)}
            </Box>
        )
        setDialogActions(
            <Box>
                <Button onClick={() => {
                    setDialogOpen(false)
                }}>
                    Annuleren
                </Button>
                {fileType === 'JSON' &&
                <Button onClick={() => {
                    setDialogOpen(false)
                    const sbnData = JSON.parse(fileContent) as SbnType
                    overwriteCurrentData(sbnData)
                }}>
                    Overschrijven
                </Button>
                }
                <Button onClick={() => {
                    setDialogOpen(false)
                    if (fileType === 'JSON') {
                        const sbnData = JSON.parse(fileContent) as SbnType
                        mergeCurrentData(sbnData)
                    } else if (fileType === 'CSV') {
                        console.log('CSV')
                        startNumberCsvToJson(fileContent)
                        // mergeCurrentData(csvToSbn(reader.result))
                    }
                }}>
                    Samenvoegen
                </Button>
            </Box>
        )
        setDialogOpen(true)
    }

    const showFileDialogStartGroups = (fileType: ImportFileType, fileContent: string) => {
        setDialogTitle(`${fileType}-bestand uploaden?`)
        setDialogContent(
            <Box flex={1}>
                <Typography>
                    {`Weet je zeker dat je dit ${fileType.toString()}-bestand wilt uploaden? Je huidige werk gaat verloren!`}
                </Typography>
                <br/>
                {optionsExplanation(fileType)}
            </Box>
        )
        setDialogActions(
            <Box>
                <Button onClick={() => {
                    setDialogOpen(false)
                }}>
                    Annuleren
                </Button>
                <Button onClick={() => {
                    setDialogOpen(false)
                    startGroupCsvToJson(fileContent)
                }}>
                    Samenvoegen
                </Button>
            </Box>
        )
        setDialogOpen(true)
    }

    return (
        <Box>
            <Tabs
                value={tabIndex}
                onChange={handleChange}
                variant={"scrollable"}
                scrollButtons={true}
            >
                <Tab label="Categorieën"/>
                <Tab label="Startgroepen"/>
                <Tab label="Groepen"/>
                <Tab label="Deelnemers"/>
            </Tabs>
            <Box style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                {run.naam && <h2>Naam: {run.naam}</h2>}
                {run.rundatum && <h3>Datum: {run.rundatum}</h3>}
                {run.rundatumlaat && <h3>Datum laat: {run.rundatumlaat}</h3>}
                <Box>
                    <Button component="label">
                        <input type="file" id="file" accept="text/csv, application/json" style={{display: 'none'}}
                               onChange={(e) => {
                                   if (e.target.files && e.target.files.length > 0) {
                                       const file = e.target.files[0]
                                       console.log(e.target.files[0])
                                       // get file content
                                       const reader = new FileReader();
                                       reader.onload = (e) => {
                                           if (e.target && e.target.result) {
                                               const fileContent = e.target.result.toString()
                                               switch (file.type) {
                                                   case 'text/csv':
                                                   case 'application/vnd.ms-excel':
                                                       showFileDialogStartNumbers('CSV', fileContent)
                                                       break;
                                                   case 'application/json':
                                                       showFileDialogStartNumbers('JSON', fileContent)
                                                       break;
                                                   default:
                                                       // TODO: warn user that the file type is not supported
                                                       setDialogTitle('Foute bestandstype')
                                                       setDialogContent(`Het bestandstype ${file.type} is niet ondersteund`)
                                                       setDialogActions(
                                                           <DialogActions>
                                                               <Button onClick={() => setDialogOpen(false)}
                                                                       color="primary">
                                                                   Sluiten
                                                               </Button>
                                                           </DialogActions>
                                                       )
                                                       setDialogOpen(true)
                                                       break;
                                               }
                                           }
                                       };
                                       reader.readAsText(e.target.files[0]);
                                   }
                               }}/>
                        <FileUploadIcon color={'primary'}/> Importeer startnummers
                    </Button>

                    <Button component="label">
                        <input type="file" id="file" accept="text/csv" style={{display: 'none'}}
                               onChange={(e) => {
                                   if (e.target.files && e.target.files.length > 0) {
                                       const file = e.target.files[0]
                                       // get file content
                                       const reader = new FileReader();
                                       reader.onload = (e) => {
                                           if (e.target && e.target.result) {
                                               const fileContent = e.target.result.toString()
                                               switch (file.type) {
                                                   case 'text/csv':
                                                   case 'application/vnd.ms-excel':
                                                       showFileDialogStartGroups('CSV', fileContent)
                                                       break;
                                                   default:
                                                       setDialogTitle('Foute bestandstype')
                                                       setDialogContent(`Het bestandstype ${file.type} is niet ondersteund`)
                                                       setDialogActions(
                                                           <DialogActions>
                                                               <Button onClick={() => setDialogOpen(false)}
                                                                       color="primary">
                                                                   Sluiten
                                                               </Button>
                                                           </DialogActions>
                                                       )
                                                       setDialogOpen(true)
                                                       break;
                                               }
                                           }
                                       };
                                       reader.readAsText(e.target.files[0]);
                                   }
                               }}/>
                        <FileUploadIcon color={'primary'}/> Importeer startgroepen
                    </Button>

                    <Button
                        onClick={() => {
                            setDialogTitle("Startlijst exporteren")
                            setDialogContent("Weet je zeker dat je de startlijst wilt publiceren? \n " +
                                "Dit zorgt ervoor dat de startlijst op de SBN-website wordt getoond.")
                            setDialogActions(
                                <Box>
                                    <Button onClick={() => {
                                        setDialogOpen(false)
                                    }}>
                                        Annuleren
                                    </Button>
                                    <Button onClick={() => {
                                        const startList = getJson(participants, credentials, categories, groups, run, startGroups);
                                        void publishStartList(credentials, startList).then((data) => {
                                            console.log(data)
                                        })
                                        setDialogOpen(false)
                                    }}>
                                        Publiceren
                                    </Button>
                                </Box>
                            )
                            setDialogOpen(true)
                        }}
                    >
                        <PublishIcon color={'primary'}/> Publiceer startlijst
                    </Button>

                    <Button
                        onClick={() => {
                            setDialogTitle("Backup herstellen")
                            setDialogContent(
                                <Box flex={1}>
                                    <Typography>
                                        Weet je zeker dat je de lokale backup wilt herstellen? Deze actie zal de
                                        startlijst herstellen van de vorige keer dat je deze app gebruikte.
                                    </Typography>
                                    <br/>
                                    {optionsExplanation('JSON')}
                                </Box>
                            )
                            setDialogActions(
                                <Box>
                                    <Button onClick={() => {
                                        setDialogOpen(false)
                                    }}>
                                        Annuleren
                                    </Button>
                                    <Button onClick={() => {
                                        setDialogOpen(false)
                                        const localData = window.localStorage.getItem('data')
                                        if (localData) {
                                            const data = JSON.parse(localData) as SbnType;
                                            overwriteCurrentData(data)
                                        }
                                    }}>
                                        Overschrijven
                                    </Button>
                                    <Button onClick={() => {
                                        setDialogOpen(false)
                                        const localData = window.localStorage.getItem('data')
                                        if (localData) {
                                            const data = JSON.parse(localData) as SbnType;
                                            mergeCurrentData(data)
                                        }
                                    }}>
                                        Samenvoegen
                                    </Button>
                                </Box>
                            )
                            setDialogOpen(true)
                        }}
                    >
                        <RestoreIcon color={'primary'}/> Herstel locale backup
                    </Button>
                </Box>
            </Box>

            <Dialog open={dialogOpen} fullWidth={true} maxWidth={"lg"}>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent sx={{width: '60vw'}}>
                    {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */}
                    <DialogContentText style={{color: useTheme().palette.secondary.main}}>
                        {dialogContent}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {dialogActions}
                </DialogActions>
            </Dialog>

            <TabPanel value={tabIndex} index={0} style={{
                display: 'flex',
                justifyContent: 'center',
                height: 10
            }}>
                {categories && <h2>Categorieën: {displayCategories(categories)}</h2>}
            </TabPanel>
            <TabPanel value={tabIndex} index={1} style={{
                display: 'flex',
                justifyContent: 'center',
                height: 10
            }}>
                {groups && <h2>Startgroepen: {displayStartGroups(startGroups, setStartGroups, categories, createCustomStartGroupToolbar)}</h2>}
            </TabPanel>
            <TabPanel value={tabIndex} index={2} style={{
                display: 'flex',
                justifyContent: 'center',
                height: 10
            }}>
                {groups && <h2>Groepen: {displayGroups(groups)}</h2>}
            </TabPanel>
            <TabPanel value={tabIndex} index={3}>
                {participants &&
                <h2>Deelnemers: {displayParticipants(participants, createCustomToolbar, setParticipants)}</h2>}
            </TabPanel>
        </Box>
    )

}

export default RunInfo;
