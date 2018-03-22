import * as fs from "fs-extra";
import * as oclif from "@oclif/command";
import * as path from "path";
import * as request from "request";
import * as requestPromise from "request-promise";
import * as zip from "../../helpers/zip";

export default class DownloadFEC extends oclif.Command {
    public static description = "download FEC campaign data for a given year and outputs it as JSON";
    public static examples: string[] = [];
    public static args = [];
    public static flags = {
        year: oclif.flags.string({
            char: "y",
            description: "year to download data for",
            default: new Date().getFullYear().toString()
        }),
        filename: oclif.flags.string({
            char: "f",
            description: "filename to write JSON to",
            required: true
        })
    };

    public async run(): Promise<void> {
        const {flags} = this.parse(DownloadFEC);
        // based on https://www.fec.gov/files/bulk-downloads/2018/weball18.zip
        const baseFilename = "weball" + flags.year!.substr(2);
        const url = `https://www.fec.gov/files/bulk-downloads/${flags.year}/${baseFilename}.zip`;
        const response: request.Response = await requestPromise.get(url, {
            resolveWithFullResponse: true,
            // need null, not undefined
            // tslint:disable-next-line
            encoding: null
        });
        if (response.statusCode === 404) {
            return this.error("Couldn't find FEC data for " + flags.year, { exit: 1 });
        }
        const rawData = await zip.readFile(response.body, baseFilename + ".txt");
        const mapped = rawData.split("\n").map(line => DownloadFEC.mapRow(line.split("|")));
        await fs.mkdirp(path.dirname(flags.filename));
        await fs.writeFile(flags.filename, JSON.stringify(mapped, undefined, 2));
        console.log(`Wrote ${mapped.length} rows to ${flags.filename}`);
    }

    private static mapRow(tokens: string[]): {[key: string]: any} {
        return {
            candidate: {
                id: tokens[0],
                name: tokens[1],
                isIncumbent: tokens[2] === "I",
                party: tokens[4],
                state: tokens[18],
                district: tokens[19]
            },
            totalReceipts: Number(tokens[5]),
            authorizedCommitteeTransfers: {
                from: Number(tokens[6]),
                to: Number(tokens[8])
            },
            disbursements: Number(tokens[7]),
            cashOnHand: {
                initial: Number(tokens[9]),
                final: Number(tokens[10])
            },
            contributions: {
                candidate: Number(tokens[11]),
                individual: Number(tokens[17]),
                pac: Number(tokens[25]),
                party: Number(tokens[26])
            },
            loans: {
                candidate: {
                    given: Number(tokens[12]),
                    repaid: Number(tokens[14])
                },
                other: {
                    given: Number(tokens[13]),
                    repaid: Number(tokens[15])
                },
                owed: Number(tokens[16])
            },
            refunds: {
                individual: Number(tokens[28]),
                committee: Number(tokens[29])
            },
            end: new Date(tokens[27])
        };
    }
}
