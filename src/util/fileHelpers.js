import {
    createJsonTemplate,
} from "./jsonTemplates";
import {categoryToSbn, groupToSbn, participantToSbn, startGroupToSbn} from "./sbnConverters";

export const getJson = (participants, credentials, categories, groups, run, startGroups) => {
    let startListJson = structuredClone(createJsonTemplate(run, credentials));
    startListJson.params = [
        credentials.username,
        credentials.password,
        "2022"
    ]

    for (const startGroup of startGroups) {
        const startGroepJson = startGroupToSbn(startGroup);
        startListJson.runData.survivalrun.startgroepen.startgroep.push(startGroepJson);
    }

    for (const participant of participants) {
        const participantJson = participantToSbn(participant);
        startListJson.runData.survivalrun.deelnemers.deelnemer.push(participantJson);
    }

    for (const category of categories) {
        const categoryJson = categoryToSbn(category)
        startListJson.runData.survivalrun.cats.cat.push(categoryJson);
    }

    for (const group of groups) {
        const groupJson = groupToSbn(group);
        startListJson.runData.survivalrun.groepnamen.groepnaam.push(groupJson);
    }

    // Stringify with some indentation
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#parameters
    return JSON.stringify(startListJson, null, 4);
};

export const exportBlob = (blob, filename) => {
    // Save the blob in a json file
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    setTimeout(() => {
        URL.revokeObjectURL(url);
    });
};
