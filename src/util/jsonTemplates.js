export const catTemplate = {
    "_attributes": {
        "catid": "1320",
        "catcode": "BSR",
        "omschrijving": "Basis Survivalrun (BSR)",
        "startvan": "1",
        "starttm": "11",
        "isgroep": "N",
        "shirt_kleur": "Legergroen"
    }
}

export const deelnemerTemplate = {
    "_attributes": {
        "catcode": "9kmZ-Solo",
        "naam": "Jelle Buitenhuis",
        "woonplaats": "Enschede",
        "startnummer": "1",
        "estafettenummer": "0",
        "lidnr": "10955"
    }
}

export const groepTemplate = {
    "_attributes": {
        "catcode": "6km-Groep",
        "teamnaam": "Tartaros",
        "startnummer": "11"
    }
}

export const startgroepTemplate = {
    "_attributes": {
        "catcode": "9kmZ-Solo",
        "startvan": "1",
        "starttm": "10",
        "starttijd": "10:00",
        "omschrijving": "9kmZ-Solo-1"
    }
}

export const createJsonTemplate = (run, credentials) => {
    return {
        "method": "sbn_startlijst_upload_ws",
        "params": [
            credentials.username,
            credentials.password,
            "2022"
        ],
        "runData": {
            "survivalrun": {
                "runid": run[0].run_id,
                "naam": run[0].naam,
                "rundatum": run[0].rundatum,
                "rundatumlaat": run[0].rundatumlaat,
                "versie": run[0].versie,
                "cats": {
                    "cat": []
                },
                "deelnemers": {
                    "deelnemer": []
                },
                "startgroepen": {
                    "startgroep": []

                },
                "groepnamen": {
                    "groepnaam": []
                }
            }
        }
    }
}
