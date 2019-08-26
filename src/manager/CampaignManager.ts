import * as fs from "fs-extra";
import Container, { Service } from "typedi";
import { FecCampaign, FecService } from "../service/FecService";

@Service()
export class CampaignManager {
  private fecService = Container.get(FecService);

  public async get(filename: string, filters: {
    excludePresident: boolean;
    excludeSenate: boolean;
    excludeHouse: boolean;
  }): Promise<CampaignGroups> {
    const campaigns: CampaignGroups = {
      all: [],
      democrat: [],
      republican: [],
      independent: []
    };
    if (filename) {
      campaigns.all = await fs.readJSON(filename);
    } else {
      campaigns.all = await this.fecService.getForYear(new Date().getFullYear().toString());
    }
    // filtering bodies
    if (filters.excludeHouse) { campaigns.all = campaigns.all.filter(c => c.candidate.district !== "00"); }
    if (filters.excludeSenate) { campaigns.all = campaigns.all.filter(c => !(c.candidate.state === "00" && c.candidate.state !== "00")); }
    if (filters.excludePresident) { campaigns.all = campaigns.all.filter(c => c.candidate.state !== "00"); }
    // populating groups
    campaigns.democrat = campaigns.all.filter(c => c.candidate.party === "DEM");
    campaigns.republican = campaigns.all.filter(c => c.candidate.party === "REP");
    campaigns.independent = campaigns.all.filter(c => c.candidate.party !== "DEM" && c.candidate.party !== "REP");
    return campaigns;
  }
}

export type CampaignGroups = {
  [key in "all" | "democrat" | "republican" | "independent"]: FecCampaign[];
};
