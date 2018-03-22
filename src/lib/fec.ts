import * as oclif from "@oclif/command";
import * as request from "request";
import * as requestPromise from "request-promise";
import * as zip from "../helpers/zip";
import Campaign from "./interfaces/Campaign";

export default class FEC {
    public static async getForYear(year: string): Promise<Campaign[]> {
        // based on https://www.fec.gov/files/bulk-downloads/2018/weball18.zip
        const baseFilename = "weball" + year.substr(2);
        const url = `https://www.fec.gov/files/bulk-downloads/${year}/${baseFilename}.zip`;
        const response: request.Response = await requestPromise.get(url, {
            resolveWithFullResponse: true,
            // need null, not undefined
            // tslint:disable-next-line
            encoding: null
        });
        if (response.statusCode === 404) {
            throw new Error("Couldn't find FEC data for " + year);
        }
        const rawData = await zip.readFile(response.body, baseFilename + ".txt");
        return rawData.split("\n").map(line => mapRawRow(line.split("|")));
    }
}

function mapRawRow(tokens: string[]): Campaign {
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
