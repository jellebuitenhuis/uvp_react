import SbnType, {SbnCategory, SbnGroup, SbnParticipant, SbnStartGroup} from "../types/SbnTypes";
import CredentialsType from "../types/CredentialsType";
import RunType from "../types/JsonTypes";

export const catTemplate: SbnCategory = {
    "_attributes": {
        "catid": 1320,
        "catcode": "BSR",
        "omschrijving": "Basis Survivalrun (BSR)",
        "startvan": "1",
        "starttm": "11",
        "isgroep": "N",
        "shirt_kleur": "Legergroen"
    }
}

export const deelnemerTemplate: SbnParticipant  = {
    "_attributes": {
        "catcode": "9kmZ-Solo",
        "naam": "Jelle Buitenhuis",
        "woonplaats": "Enschede",
        "startnummer": "1",
        "estafettenummer": "0",
        "lidnr": "10955",
        "deelnemerid": "0",
        "groepid": "0",
        "groepcode": "",
        "email": "",
        "geboortedatum": "1990-01-01",
        "geslacht": "M",
        "inschrijfdatum": "2019-01-01",
        "samenloopnummer": "",
        "shirtmaat": "",
        "notitie": "",
        "startranking": ""
    }
}

export const groepTemplate: SbnGroup = {
    "_attributes": {
        "catcode": "6km-Groep",
        "teamnaam": "Tartaros",
        "startnummer": "11",
        "groep_id": "0",
    }
}

export const startgroepTemplate: SbnStartGroup = {
    "_attributes": {
        "catcode": "9kmZ-Solo",
        "startvan": "1",
        "starttm": "10",
        "starttijd": "10:00",
        "omschrijving": "9kmZ-Solo-1",
        "id": "0"
    }
}


export const createJsonTemplate = (run: RunType, credentials: CredentialsType): SbnType => {
    return {
        "method": "sbn_startlijst_upload_ws",
        "params": [
            credentials.username,
            credentials.password,
            "2022"
        ],
        "runData": {
            "survivalrun": {
                "runid": run.run_id,
                "naam": run.naam,
                "rundatum": run.rundatum,
                "rundatumlaat": run.rundatumlaat,
                "versie": run.versie,
                "cats": {
                    "cat": new Array<SbnCategory>()
                },
                "deelnemers": {
                    "deelnemer": new Array<SbnParticipant>()
                },
                "startgroepen": {
                    "startgroep": new Array<SbnStartGroup>()

                },
                "groepnamen": {
                    "groepnaam": new Array<SbnGroup>()
                }
            }
        }
    }
}
