import { Feature, File, ResultError } from "../types";

export const name = "no-dupe-scenario-names";
export const availableConfigs = [
    "anywhere",
    "in-feature",
];
let scenarios = [];

export function run(feature: Feature, file: File, configuration) {
    if (!feature) {
        return [];
    }
    let errors: ResultError[] = [];
    if (configuration === "in-feature") {
        scenarios = [];
    }
    feature.children?.forEach(child => {
        if (child.scenario && child.scenario.name) {
            if (child.scenario.name in scenarios) {
                const dupes = getFileLinePairsAsStr(scenarios[child.scenario.name].locations);
                scenarios[child.scenario.name].locations.push({
                    file: file.relativePath,
                    line: child.scenario.location?.line,
                });
                errors.push({
                    message: `Scenario name is already used in: ${dupes}`,
                    rule: name,
                    line: child.scenario.location?.line || -1,
                });
            } else {
                scenarios[child.scenario.name] = {
                    locations: [
                        {
                            file: file.relativePath,
                            line: child.scenario.location?.line,
                        },
                    ],
                };
            }
        }
    });
    return errors;
}

function getFileLinePairsAsStr(objects) {
    let strings: string[] = [];
    objects.forEach(object => {
        strings.push(`${object.file}:${object.line}`);
    });
    return strings.join(", ");
}
