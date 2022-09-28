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
import {useEffect, useState} from "react";
import {CustomToolbar} from "./components/ToolbarButtons";
import {TabPanel} from "./components/TabPanel";
import {displayCategories, displayGroups, displayParticipants, displayStartGroups} from "./components/DataGrids";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {useTheme} from "@mui/styles";
import PublishIcon from '@mui/icons-material/Publish';
import RestoreIcon from '@mui/icons-material/Restore';
import _ from "lodash";
import {participantToSbn, sbnToCategory, sbnToGroup, sbnToParticipant, sbnToStartGroup} from "./util/sbnConverters";
import {publishStartList} from "./util/fetchHelpers";
import {getJson} from "./util/fileHelpers";
import {usePapaParse} from "react-papaparse";
import {createJsonTemplate, startgroepTemplate} from "./util/jsonTemplates";

function RunInfo(props) {

    const {readString} = usePapaParse();
    const [csvData, setCsvData] = useState(null);

    const csvToJson = (data) => {
        readString(data, {
            header: true,
            complete: (results) => {
                setCsvData(results.data);
            }
        });
    }

    useEffect(() => {
        if (csvData) {
            console.log(csvData)
            let participants = []
            for (let participant of csvData) {
                participant.voornaam = participant.naam
                participants.push(participantToSbn(participant))
            }
            console.log(participants)
            let jsonTemplate = createJsonTemplate(run, credentials)
            jsonTemplate.runData.survivalrun.deelnemers.deelnemer = participants
            mergeCurrentData(jsonTemplate)
        }
    }, [csvData]);

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
    const [dialogContent, setDialogContent] = useState("Content");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogActions, setDialogActions] = useState(null);

    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const theme = useTheme();

    const createCustomToolbar = () => {
        return CustomToolbar(participants, categories, groups, credentials, run, startGroups)
    }

    const mergeCurrentData = (oldData) => {
        let newCategories = []
        for (const category of oldData.runData.survivalrun.cats.cat) {
            newCategories.push(sbnToCategory(category))
        }
        newCategories = _.unionBy(newCategories, categories, 'cat_id')
        setCategories(newCategories)

        let newGroups = []
        for (const group of oldData.runData.survivalrun.groepnamen.groepnaam) {
            newGroups.push(sbnToGroup(group))
        }
        newGroups = _.unionBy(newGroups, groups, 'groep_id')
        setGroups(newGroups)

        let newParticipants = []
        for (const participant of oldData.runData.survivalrun.deelnemers.deelnemer) {
            newParticipants.push(sbnToParticipant(participant))
        }
        newParticipants = _.unionBy(newParticipants, participants, 'deelnemerid')
        setParticipants(newParticipants)

        let newStartGroups = []
        for (const startGroup of oldData.runData.survivalrun.startgroepen.startgroep) {
            newStartGroups.push(sbnToStartGroup(startGroup))
        }
        newStartGroups = _.unionBy(newStartGroups, startGroups, 'id')
        setStartGroups(newStartGroups)
    }

    const overwriteCurrentData = (data) => {
        let newCategories = []
        for (const category of data.runData.survivalrun.cats.cat) {
            newCategories.push(sbnToCategory(category))
        }
        setCategories(newCategories)

        let newParticipants = []
        for (const participant of data.runData.survivalrun.deelnemers.deelnemer) {
            newParticipants.push(sbnToParticipant(participant))
        }
        setParticipants(newParticipants)

        let newGroups = []
        for (const group of data.runData.survivalrun.groepnamen.groepnaam) {
            newGroups.push(sbnToGroup(group))
        }
        setGroups(newGroups)

        let newStartGroups = []
        for (const startGroup of data.runData.survivalrun.startgroepen.startgroep) {
            newStartGroups.push(sbnToStartGroup(startGroup))
        }
        setStartGroups(newStartGroups)
    }

    const optionsExplanation = (fileType) => {
        return (
            <Box>
                {fileType === 'JSON' &&
                    <Typography>
                        Met de optie "Overschrijven" zal de huidige startlijst worden overschreven met de backup. Al je
                        huidige
                        werk
                        gaat verloren!
                    </Typography>
                }
                <Typography>
                    Met de optie "Samenvoegen" worden de startnummers van de backup in de huidige startlijst gezet.
                </Typography>
            </Box>
        )
    }

    const showFileDialog = (fileType, fileContent) => {
        setDialogTitle(`${fileType}-bestand uploaden?`)
        setDialogContent(
            <Box flex={1}>
                <Typography>
                    {`Weet je zeker dat je dit ${fileType}-bestand wilt uploaden? Je huidige werk gaat verloren!`}
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
                    overwriteCurrentData(JSON.parse(fileContent))
                }}>
                    Overschrijven
                </Button>
                }
                <Button onClick={() => {
                    setDialogOpen(false)
                    if (fileType === 'JSON') {
                        mergeCurrentData(JSON.parse(fileContent))
                    } else if (fileType === 'CSV') {
                        console.log('CSV')
                        csvToJson(fileContent)
                        // mergeCurrentData(csvToSbn(reader.result))
                    }
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
                scrollButtons={"on"}
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
                {run[0].naam && <h2>Naam: {run[0].naam}</h2>}
                {run[0].rundatum && <h3>Datum: {run[0].rundatum}</h3>}
                {run[0].rundatumlaat && <h3>Datum laat: {run[0].rundatumlaat}</h3>}
                <Box>
                    <Button component="label">
                        <input type="file" id="file" accept="text/csv, application/json" style={{display: 'none'}}
                               onChange={(e) => {
                                   const file = e.target.files[0]
                                   console.log(e.target.files[0])
                                   // get file content
                                   const reader = new FileReader();
                                   reader.onload = (e) => {
                                       switch (file.type) {
                                           case 'text/csv':
                                               showFileDialog('CSV', e.target.result)
                                               break;
                                           case 'application/json':
                                               showFileDialog('JSON', e.target.result)
                                               break;
                                           default:
                                               // TODO: warn user that the file type is not supported
                                               console.log('default')
                                               setDialogTitle('Foute bestandstype')
                                               setDialogContent(`Het bestandstype ${file.type} is niet ondersteund`)
                                               setDialogActions(
                                                   <DialogActions>
                                                       <Button onClick={() => setDialogOpen(false)} color="primary">
                                                           Sluiten
                                                       </Button>
                                                   </DialogActions>
                                               )
                                               setDialogOpen(true)
                                               break;
                                       }
                                   };
                                   reader.readAsText(e.target.files[0]);
                               }}/>
                        <FileUploadIcon color={theme.palette.secondary.main}/> Importeer startlijst
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
                                        publishStartList(credentials, startList).then((data) => {
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
                        <PublishIcon color={theme.palette.secondary.main}/> Publiceer startlijst
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
                                        const data = JSON.parse(window.localStorage.getItem('data'));
                                        overwriteCurrentData(data)
                                    }}>
                                        Overschrijven
                                    </Button>
                                    <Button onClick={() => {
                                        setDialogOpen(false)
                                        const data = JSON.parse(window.localStorage.getItem('data'));
                                        mergeCurrentData(data)
                                    }}>
                                        Samenvoegen
                                    </Button>
                                </Box>
                            )
                            setDialogOpen(true)
                        }}
                    >
                        <RestoreIcon color={theme.palette.secondary.main}/> Herstel locale backup
                    </Button>
                </Box>
            </Box>

            <Dialog open={dialogOpen} fullWidth={true} maxWidth={"lg"}>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent sx={{width: '60vw'}}>
                    <DialogContentText style={{color: theme.palette.secondary.main}}>
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
                {categories && <h2>Categorieën: {displayCategories(categories, setCategories)}</h2>}
            </TabPanel>
            <TabPanel value={tabIndex} index={1} style={{
                display: 'flex',
                justifyContent: 'center',
                height: 10
            }}>
                {groups && <h2>Startgroepen: {displayStartGroups(startGroups, setStartGroups, categories)}</h2>}
            </TabPanel>
            <TabPanel value={tabIndex} index={2} style={{
                display: 'flex',
                justifyContent: 'center',
                height: 10
            }}>
                {groups && <h2>Groepen: {displayGroups(groups, setGroups)}</h2>}
            </TabPanel>
            <TabPanel value={tabIndex} index={3}>
                {participants &&
                <h2>Deelnemers: {displayParticipants(participants, createCustomToolbar, setParticipants)}</h2>}
            </TabPanel>
        </Box>
    )

}

export default RunInfo;
