import * as fs from "fs-extra";
import * as oclif from "@oclif/command";
import * as path from "path";
import * as lib from "../../lib/";

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
            description: "year to download data for",
            default: new Date().getFullYear().toString()
        })
    };

    public async run(): Promise<void> {
        const {flags, args} = this.parse(DownloadFEC);
        const campaigns = await lib.fec.getForYear(flags.year!);
        await fs.mkdirp(path.dirname(args.filename));
        await fs.writeFile(args.filename, JSON.stringify(campaigns, undefined, 2));
        console.log(`Wrote ${campaigns.length} rows to ${args.filename}`);
    }
}
