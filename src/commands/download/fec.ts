import * as oclif from "@oclif/command";
import * as fs from "fs-extra";
import * as path from "path";
import Container from "typedi";
import { FecService } from "../../service/FecService";

export default class DownloadFEC extends oclif.Command {
  public static description = "download FEC campaign data for a given year and outputs it as JSON";
  public static examples: string[] = [];
  public static args = [{
    name: "filename",
    description: "filename to write JSON to",
    required: true
  }];
  public static flags = {
    year: oclif.flags.string({
      char: "y",
      description: "year(s) to download data for (comma-separated)",
      default: new Date().getFullYear().toString()
    })
  };

  public async run(): Promise<void> {
    const fecService = Container.get(FecService);
    const { flags, args } = this.parse(DownloadFEC);
    const years: string[] = flags.year.split(",").map(y => y.trim());
    const campaigns = (await Promise.all(years.map(y => fecService.getForYear(y)))).reduce((p, v) => p.concat(v));
    await fs.mkdirp(path.dirname(args.filename));
    await fs.writeFile(args.filename, JSON.stringify(campaigns, undefined, 2));
    console.log(`Wrote ${campaigns.length} rows to ${args.filename}`);
  }
}
