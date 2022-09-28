import {catTemplate, deelnemerTemplate, groepTemplate, startgroepTemplate} from "./jsonTemplates";

export const categoryToSbn = (category) => {
    let categoryJson = structuredClone(catTemplate);
    categoryJson._attributes.catcode = category.cat_code;
    categoryJson._attributes.omschrijving = category.omschrijving;
    categoryJson._attributes.startvan = category.startvan;
    categoryJson._attributes.starttm = category.starttm;
    categoryJson._attributes.isgroep = category.groepsrun;
    categoryJson._attributes.shirt_kleur = category.shirtkleur;
    categoryJson._attributes.catid = category.cat_id;
    return categoryJson;
};

export const sbnToCategory = (sbnCategory) => {
    let category = {};
    category.cat_code = sbnCategory._attributes.catcode;
    category.omschrijving = sbnCategory._attributes.omschrijving;
    category.startvan = sbnCategory._attributes.startvan;
    category.starttm = sbnCategory._attributes.starttm;
    category.groepsrun = sbnCategory._attributes.isgroep;
    category.shirtkleur = sbnCategory._attributes.shirt_kleur;
    category.cat_id = sbnCategory._attributes.catid;
    return category;
};

export const startGroupToSbn = (startGroup) => {
    let startGroepJson = structuredClone(startgroepTemplate);
    startGroepJson._attributes.catcode = startGroup.catcode;
    startGroepJson._attributes.startvan = startGroup.startvan;
    startGroepJson._attributes.starttm = startGroup.starttm;
    startGroepJson._attributes.starttijd = startGroup.starttijd;
    startGroepJson._attributes.omschrijving = startGroup.omschrijving;
    startGroepJson._attributes.id = startGroup.id;
    return startGroepJson;
}

export const sbnToStartGroup = (sbnStartGroup) => {
    let startGroup = {};
    startGroup.catcode = sbnStartGroup._attributes.catcode;
    startGroup.startvan = sbnStartGroup._attributes.startvan;
    startGroup.starttm = sbnStartGroup._attributes.starttm;
    startGroup.starttijd = sbnStartGroup._attributes.starttijd;
    startGroup.omschrijving = sbnStartGroup._attributes.omschrijving;
    startGroup.id = sbnStartGroup._attributes.id;
    return startGroup;
}

export const participantToSbn = (participant) => {
    let participantJson = structuredClone(deelnemerTemplate);
    participantJson._attributes.naam = `${participant.voornaam} ${participant.tussenvoegsel || ''} ${participant.achternaam || ''}`;
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

export const sbnToParticipant = (participant) => {
    let participantJson = {};
    // check how many spaces are in the name
    let name = participant._attributes.naam;
    let nameParts = name.split(" ");
    if (nameParts.length === 3) {
        participantJson.voornaam = nameParts[0] || '';
        participantJson.tussenvoegsel = nameParts[1] || '';
        participantJson.achternaam = nameParts[2] || '';
    } else if (nameParts.length === 2) {
        participantJson.voornaam = nameParts[0] || '';
        participantJson.achternaam = nameParts[1] || '';
    } else {
        participantJson.voornaam = name || '';
    }
    participantJson.catcode = participant._attributes.catcode;
    participantJson.lidnr = participant._attributes.lidnr;
    participantJson.woonplaats = participant._attributes.woonplaats;
    participantJson.startnummer = participant._attributes.startnummer;
    participantJson.deelnemerid = participant._attributes.deelnemerid;
    participantJson.groepid = participant._attributes.groepid;
    participantJson.groepcode = participant._attributes.groepcode;
    participantJson.estafettenummer = participant._attributes.estafettenummer;
    participantJson.email = participant._attributes.email;
    participantJson.geboortedatum = participant._attributes.geboortedatum;
    participantJson.geslacht = participant._attributes.geslacht;
    participantJson.inschrijfdatum = participant._attributes.inschrijfdatum;
    participantJson.samenloopnummer = participant._attributes.samenloopnummer;
    participantJson.shirtmaat = participant._attributes.shirtmaat;
    participantJson.notitie = participant._attributes.notitie;
    participantJson.startranking = participant._attributes.startranking;
    return participantJson;
}

export const groupToSbn = (group) => {
    let groupJson = structuredClone(groepTemplate);
    groupJson._attributes.catcode = group.catcode;
    groupJson._attributes.teamnaam = group.teamnaam;
    groupJson._attributes.startnummer = group.startnummer;
    groupJson._attributes.groep_id = group.groep_id;
    return groupJson;
}

export const sbnToGroup = (sbnGroup) => {
    let group = {};
    group.catcode = sbnGroup._attributes.catcode;
    group.teamnaam = sbnGroup._attributes.teamnaam;
    group.startnummer = sbnGroup._attributes.startnummer;
    group.groep_id = sbnGroup._attributes.groep_id;
    return group;
}
