import * as oclif from "@oclif/command";
import * as _ from "lodash";
import Container from "typedi";
import { CampaignManager } from "../../manager/CampaignManager";
import { FecCampaign } from "../../service/FecService";

export default class AnalyzeSummary extends oclif.Command {
  public static description = "analyze US House and Senate elections";
  public static flags = {
    filename: oclif.flags.string({
      char: "f",
      description: "JSON file to read election data from"
    }),
    excludePresident: oclif.flags.boolean({
      char: "P",
      description: "exclude Presidential data in analysis"
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
    const campaignManager = Container.get(CampaignManager);
    const { flags } = this.parse(AnalyzeSummary);
    const campaigns = await campaignManager.get(flags.filename!, flags);
    const fromAllParties = (worker: (campaigns: FecCampaign[]) => number, alignRight = true, prefix = ""): { [key: string]: string } => {
      const rawValues: { [key: string]: number } = {
        All: worker(campaigns.all),
        Democratic: worker(campaigns.democrat),
        Republican: worker(campaigns.republican),
        Independent: worker(campaigns.independent)
      };
      const largestValueLength = Object.values(rawValues).reduce((p, v) => Math.max(p, this.numberToString(v).length), 0);
      const values: { [key: string]: string } = { };
      Object.keys(rawValues).forEach(label => {
        let str = prefix + this.numberToString(rawValues[label]);
        if (alignRight) { str = _.padStart(str, largestValueLength + prefix.length); }
        if (label !== "All") {
          str += " (" + (100 * rawValues[label] / rawValues.All).toFixed(2) + "%)";
        }
        values[label] = str;
      });
      return values;
    };
    const stats: { [key: string]: { [key: string]: string | number } } = {
      "Count": fromAllParties(cs => cs.length),
      "Total Contributions": fromAllParties(cs => _.sum(cs.map(c => _.sum(Object.values(c.contributions)))), true, "$"),
      "Individual Contributions": fromAllParties(cs => _.sum(cs.map(c => c.contributions.individual)), true, "$"),
      "Party Contributions": fromAllParties(cs => _.sum(cs.map(c => c.contributions.party)), true, "$"),
      "PAC Contributions": fromAllParties(cs => _.sum(cs.map(c => c.contributions.pac)), true, "$"),
      "Candidate Contributions": fromAllParties(cs => _.sum(cs.map(c => c.contributions.candidate)), true, "$")
    };
    Object.keys(stats).forEach(category => {
      console.log("# " + category);
      const largestLabelSize = Object.keys(stats[category]).map(k => k.length).reduce((p, v) => Math.max(p, v), 0);
      Object.keys(stats[category]).forEach(label => {
        console.log("  - " + _.padEnd(label + ":", largestLabelSize + 1), stats[category][label]);
      });
    });
  }

  private numberToString(value: number): string {
    let str = value.toLocaleString();
    if (/\.\d$/.test(str)) {
      str += "0";
    } else if (!str.includes(".")) {
      str += ".00";
    }
    return str;
  }
}
