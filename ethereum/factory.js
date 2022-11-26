import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  // process.env.NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS,
  "0xFdb3e9e1801e7ef37D6c18234E988b8f8137428A",
);

export default instance;
