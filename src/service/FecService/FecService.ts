import axios, { AxiosResponse } from "axios";
import Container, { Service } from "typedi";
import { ZipService } from "../ZipService";
import { FecCampaign } from "./FecCampaign";

@Service()
export class FecService {
  private zipService = Container.get(ZipService);

  public async getForYear(year: string): Promise<FecCampaign[]> {
    // based on https://www.fec.gov/files/bulk-downloads/2018/weball18.zip
    const baseFilename = "weball" + year.substr(2);
    let response: AxiosResponse;
    try {
      response = await axios.get(`https://www.fec.gov/files/bulk-downloads/${year}/${baseFilename}.zip`, {
        responseType: "arraybuffer"
      });
    } catch (err) {
      if (err.response.status === 404) {
        throw new Error("Couldn't find FEC data for " + year);
      }
      throw err;
    }
    const rawData = await this.zipService.decompress(response.data, baseFilename + ".txt");
    const campaigns = rawData.split("\n").map(line => this.rowToCampaign(line.split("|")));
    campaigns.forEach(c => c.year = year);
    return campaigns;
  }

  private rowToCampaign(row: string[]): FecCampaign {
    return {
      year: "",
      candidate: {
        id: row[0],
        name: row[1],
        isIncumbent: row[2] === "I",
        party: row[4],
        state: row[18],
        district: row[19]
      },
      totalReceipts: Number(row[5]),
      authorizedCommitteeTransfers: {
        from: Number(row[6]),
        to: Number(row[8])
      },
      disbursements: Number(row[7]),
      cashOnHand: {
        initial: Number(row[9]),
        final: Number(row[10])
      },
      contributions: {
        candidate: Number(row[11]),
        individual: Number(row[17]),
        pac: Number(row[25]),
        party: Number(row[26])
      },
      loans: {
        candidate: {
          given: Number(row[12]),
          repaid: Number(row[14])
        },
        other: {
          given: Number(row[13]),
          repaid: Number(row[15])
        },
        owed: Number(row[16])
      },
      refunds: {
        individual: Number(row[28]),
        committee: Number(row[29])
      },
      end: new Date(row[27])
    };
  }
}
