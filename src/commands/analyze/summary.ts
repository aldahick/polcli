import * as _ from "lodash";
import * as lib from "../../lib";
import * as fs from "fs-extra";
import * as oclif from "@oclif/command";

export default class AnalyzeSummary extends oclif.Command {
    public static description = "analyze US House and Senate elections";
    public static flags = {
        filename: oclif.flags.string({
            char: "f",
            description: "JSON file to read election data from"
        }),
        excludeSenate: oclif.flags.boolean({
            char: "S",
            description: "exclude Senate data in analysis"
        }),
        excludeHouse: oclif.flags.boolean({
            char: "H",
            description: "exclude House data in analysis"
        })
    };
    public static args = [];

    public async run(): Promise<void> {
        const {flags} = this.parse(AnalyzeSummary);
        const campaigns = await lib.campaigns.get(flags.filename!, flags);
        const fromAllParties = (worker: (campaigns: lib.Campaign[]) => string | number, alignRight = true): {[key: string]: string | number} => {
            const values: {[key: string]: string} = {
                "All": worker(campaigns.all).toString(),
                "Democratic": worker(campaigns.democrat).toString(),
                "Republican": worker(campaigns.republican).toString(),
                "Independent": worker(campaigns.independent).toString()
            };
            if (alignRight) {
                const largestValueLength = Object.values(values).reduce((p, v) => Math.max(p, v.length), 0);
                for (const label in values) values[label] = _.padStart(values[label], largestValueLength);
            }
            return values;
        };
        const stats: {[key: string]: {[key: string]: string | number}} = {
            "Count": fromAllParties(cs => cs.length),
            "Total Contributions": fromAllParties(cs => "$" +
                _.sum(cs.map(c => _.sum(Object.values(c.contributions)))).toLocaleString()),
            "Individual Contributions": fromAllParties(cs => "$" +
                _.sum(cs.map(c => c.contributions.individual)).toLocaleString()),
            "Party Contributions": fromAllParties(cs => "$" +
                _.sum(cs.map(c => c.contributions.party)).toLocaleString()),
            "PAC Contributions": fromAllParties(cs => "$" +
                _.sum(cs.map(c => c.contributions.pac)).toLocaleString()),
            "Candidate Contributions": fromAllParties(cs => "$" +
                _.sum(cs.map(c => c.contributions.candidate)).toLocaleString())
        };
        Object.keys(stats).forEach(category => {
            console.log("# " + category);
            const largestLabelSize = Object.keys(stats[category]).map(k => k.length).reduce((p, v) => Math.max(p, v), 0);
            Object.keys(stats[category]).forEach(label => {
                console.log("  - " + _.padEnd(label + ":", largestLabelSize + 1), stats[category][label]);
            });
        });
    }
}
