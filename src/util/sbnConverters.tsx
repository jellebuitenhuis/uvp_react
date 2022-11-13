import { catTemplate, deelnemerTemplate, groepTemplate, startgroepTemplate} from "./jsonTemplates";
import {CategoryType, GroupType, ParticipantType, StartGroupType} from "../types/JsonTypes";
import {SbnCategory, SbnGroup, SbnParticipant, SbnStartGroup} from "../types/SbnTypes";

export const categoryToSbn: (category: CategoryType) => SbnCategory = (category: CategoryType) => {
    const categoryJson = structuredClone(catTemplate);
    categoryJson._attributes.catcode = category.cat_code;
    categoryJson._attributes.omschrijving = category.omschrijving;
    categoryJson._attributes.startvan = category.startvan;
    categoryJson._attributes.starttm = category.starttm;
    categoryJson._attributes.isgroep = category.groepsrun;
    categoryJson._attributes.shirt_kleur = category.shirtkleur;
    categoryJson._attributes.catid = category.cat_id;
    return categoryJson;
};

export const sbnToCategory: (sbnCategory: SbnCategory) => CategoryType  = (sbnCategory: SbnCategory) => {
    return {
        cat_id: sbnCategory._attributes.catid,
        cat_code: sbnCategory._attributes.catcode,
        omschrijving: sbnCategory._attributes.omschrijving,
        startvan: sbnCategory._attributes.startvan,
        starttm: sbnCategory._attributes.starttm,
        groepsrun: sbnCategory._attributes.isgroep,
        shirtkleur: sbnCategory._attributes.shirt_kleur
    }

};

export const startGroupToSbn: (startGroup: StartGroupType) => SbnStartGroup = (startGroup: StartGroupType) => {
    const startGroepJson = structuredClone(startgroepTemplate);
    startGroepJson._attributes.catcode = startGroup.catcode;
    startGroepJson._attributes.startvan = startGroup.startvan;
    startGroepJson._attributes.starttm = startGroup.starttm;
    startGroepJson._attributes.starttijd = startGroup.starttijd;
    startGroepJson._attributes.omschrijving = startGroup.omschrijving;
    startGroepJson._attributes.id = startGroup.id;
    return startGroepJson;
}

export const sbnToStartGroup: (sbnStartGroup: SbnStartGroup) => StartGroupType = (sbnStartGroup: SbnStartGroup) => {
    return {
        catcode: sbnStartGroup._attributes.catcode,
        startvan: sbnStartGroup._attributes.startvan,
        starttm: sbnStartGroup._attributes.starttm,
        starttijd: sbnStartGroup._attributes.starttijd,
        omschrijving: sbnStartGroup._attributes.omschrijving,
        id: sbnStartGroup._attributes.id
    };
}

export const participantToSbn: (participant: ParticipantType) => SbnParticipant = (participant: ParticipantType) => {
    const participantJson = structuredClone(deelnemerTemplate);
    participantJson._attributes.naam = `${participant.voornaam || ''} ${participant.tussenvoegsel || ''} ${participant.achternaam || ''}`;
    participantJson._attributes.catcode = participant.catcode;
    participantJson._attributes.lidnr = participant.lidnr;
    participantJson._attributes.woonplaats = participant.woonplaats;
    participantJson._attributes.startnummer = participant.startnummer;
    participantJson._attributes.deelnemerid = participant.deelnemerid;
    participantJson._attributes.groepid = participant.groepid;
    participantJson._attributes.groepcode = participant.groepcode;
    participantJson._attributes.estafettenummer = participant.estafettenummer;
    participantJson._attributes.email = participant.email;
    participantJson._attributes.geboortedatum = participant.geboortedatum;
    participantJson._attributes.geslacht = participant.geslacht;
    participantJson._attributes.inschrijfdatum = participant.inschrijfdatum;
    participantJson._attributes.samenloopnummer = participant.samenloopnummer;
    participantJson._attributes.shirtmaat = participant.shirtmaat;
    participantJson._attributes.notitie = participant.notitie;
    participantJson._attributes.startranking = participant.startranking;

    return participantJson;
}

export const sbnToParticipant: (participant: SbnParticipant) => ParticipantType = (participant: SbnParticipant) => {
    // check how many spaces are in the name
    const name = participant._attributes.naam;
    const nameParts = name.split(" ");

    let voornaam = '';
    let tussenvoegsel = '';
    let achternaam = '';
    if (nameParts.length === 3) {
        voornaam = nameParts[0] || '';
        tussenvoegsel = nameParts[1] || '';
        achternaam = nameParts[2] || '';
    } else if (nameParts.length === 2) {
        voornaam = nameParts[0] || '';
        achternaam = nameParts[1] || '';
    } else {
        voornaam = name || '';
    }
    return {
        voornaam: voornaam,
        tussenvoegsel: tussenvoegsel,
        achternaam: achternaam,
        catcode: participant._attributes.catcode,
        lidnr: participant._attributes.lidnr,
        woonplaats: participant._attributes.woonplaats,
        startnummer: participant._attributes.startnummer,
        deelnemerid: participant._attributes.deelnemerid,
        groepid: participant._attributes.groepid,
        groepcode: participant._attributes.groepcode,
        estafettenummer: participant._attributes.estafettenummer,
        email: participant._attributes.email,
        geboortedatum: participant._attributes.geboortedatum,
        geslacht: participant._attributes.geslacht,
        inschrijfdatum: participant._attributes.inschrijfdatum,
        samenloopnummer: participant._attributes.samenloopnummer,
        shirtmaat: participant._attributes.shirtmaat,
        notitie: participant._attributes.notitie,
        startranking: participant._attributes.startranking
    };
}

export const groupToSbn: (group: GroupType) => SbnGroup = (group: GroupType) => {
    const groupJson = structuredClone(groepTemplate);
    groupJson._attributes.catcode = group.catcode;
    groupJson._attributes.teamnaam = group.teamnaam;
    groupJson._attributes.startnummer = group.startnummer;
    groupJson._attributes.groep_id = group.groep_id;
    return groupJson;
}

export const sbnToGroup: (sbnGroup: SbnGroup) => GroupType = (sbnGroup: SbnGroup) => {
    return {
        catcode: sbnGroup._attributes.catcode,
        teamnaam: sbnGroup._attributes.teamnaam,
        startnummer: sbnGroup._attributes.startnummer,
        groep_id: sbnGroup._attributes.groep_id
    };
}
