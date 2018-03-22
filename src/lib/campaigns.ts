import FEC from "./fec";
import Campaign from "./interfaces/Campaign";
import * as fs from "fs-extra";

export default class Campaigns {
    public static async get(filename: string, filters: {
        excludeSenate: boolean;
        excludeHouse: boolean;
    }): Promise<CampaignGroups> {
        const campaigns: CampaignGroups = {
            all: [],
            democrat: [],
            republican: [],
            independent: []
        };
        if (filename) campaigns.all = await fs.readJSON(filename);
        else campaigns.all = await FEC.getForYear(new Date().getFullYear().toString());
        if (filters.excludeHouse && filters.excludeSenate) {
            throw new Error("No bodies included (House and Senate were both excluded.)");
        } else if (!filters.excludeHouse && !filters.excludeSenate) {
            // don't do anything, we're including all the data
        } else if (!filters.excludeHouse && filters.excludeSenate) {
            campaigns.all = campaigns.all.filter(c => c.candidate.district !== "00");
        } else if (!filters.excludeSenate && filters.excludeHouse) {
            campaigns.all = campaigns.all.filter(c => c.candidate.district === "00");
        }
        campaigns.democrat = campaigns.all.filter(c => c.candidate.party === "DEM");
        campaigns.republican = campaigns.all.filter(c => c.candidate.party === "REP");
        campaigns.independent = campaigns.all.filter(c => c.candidate.party !== "DEM" && c.candidate.party !== "REP");
        return campaigns;
    }
}

export type CampaignGroups = {
    [key in "all" | "democrat" | "republican" | "independent"]: Campaign[];
};
