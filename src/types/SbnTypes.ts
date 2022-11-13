export default interface SbnType {
    method: string;
    params: string[];
    runData: {
        survivalrun: {
            runid: string;
            naam: string;
            rundatum: string;
            rundatumlaat: string;
            versie: string;
            cats: {
                cat: SbnCategory[];
            }
            deelnemers: {
                deelnemer: SbnParticipant[];
            }
            startgroepen: {
                startgroep: SbnStartGroup[];
            }
            groepnamen: {
                groepnaam: SbnGroup[];
            }
        }
    }

}

export interface SbnGroup {
    _attributes: {
        catcode: string;
        teamnaam: string;
        startnummer: string;
        groep_id: string;
    }
}

export interface SbnParticipant {

    _attributes: {
        naam: string;
        catcode: string;
        lidnr: string;
        woonplaats: string;
        startnummer: string;
        deelnemerid: string;
        groepid: string;
        groepcode: string;
        estafettenummer: string;
        email: string;
        geboortedatum: string;
        geslacht: string;
        inschrijfdatum: string;
        samenloopnummer: string;
        shirtmaat: string;
        notitie: string;
        startranking: string;
    }
}

export interface SbnStartGroup {
    _attributes: {
        catcode: string;
        startvan: string;
        starttm: string;
        starttijd: string;
        omschrijving: string;
        id: string;
    }
}

export interface SbnCategory {

    _attributes: {
        catcode: string;
        omschrijving: string;
        startvan: string;
        starttm: string;
        isgroep: string;
        shirt_kleur: string;
        catid: number;
    }
}
