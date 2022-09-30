export default interface RunType {
    run_id: string;
    naam: string;
    rundatum: string;
    rundatumlaat: string;
    versie: string;
}

export interface CategoryType {
    cat_code: string;
    omschrijving: string;
    startvan: string;
    starttm: string;
    groepsrun: string;
    shirtkleur: string;
    cat_id: number;
}

export interface StartGroupType {
    catcode: string;
    startvan: string;
    starttm: string;
    starttijd: string;
    omschrijving: string;
    id: string;
}

export interface ParticipantType {
    voornaam?: string;
    naam?: string;
    tussenvoegsel: string;
    achternaam: string;
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

export interface GroupType {
    catcode: string;
    teamnaam: string;
    startnummer: string;
    groep_id: string;
}