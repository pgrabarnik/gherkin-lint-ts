import { Feature, ResultError } from "../types";

export const name = "no-files-without-scenarios";

export function run(feature: Feature): ResultError[] {
    if (!feature) {
        return [];
    }
    const errors: ResultError[] = [];
    if (!feature.children?.some(child => child.scenario || child.rule?.children?.some(ruleChild => ruleChild.scenario))) {
        errors.push({
            message: "Feature file does not have any Scenarios",
            rule: name,
            line: 1,
        });
    }
    return errors;
}
