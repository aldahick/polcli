import Campaign from "./Campaign";

type CampaignGroups = {
    [key in "all" | "democrat" | "republican" | "independent"]: Campaign[];
};

export default CampaignGroups;
