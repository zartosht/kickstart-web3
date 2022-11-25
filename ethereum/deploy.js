const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { config } = require("dotenv");
const { resolve } = require("path");

config();

const compiledFactory = require(resolve(
  __dirname,
  "build",
  "CampaignFactory.json"
));

const provider = new HDWalletProvider(
  process.env.ACCOUNT_MNEMONIC,
  process.env.NETWORK_URL
);
const web3 = new Web3(provider);

const deploy = async () => {
  const [account] = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", account);

  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ gas: "5000000", from: account });

  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};
deploy();
