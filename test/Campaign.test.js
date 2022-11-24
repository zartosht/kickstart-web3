const assert = require("assert");
const ganache = require("ganache");
const { resolve } = require("path");
const Chance = require("chance");
const Web3 = require("web3");

const chance = new Chance();
const web3 = new Web3(
  ganache.provider({
    logger: {
      log: (message) => {
        if (process.argv.includes("-verbose")) {
          console.log(message);
        }
      },
    },
  })
);

const compiledFactory = require(resolve(
  __dirname,
  "..",
  "ethereum",
  "build",
  "CampaignFactory.json"
));
const compiledCampaign = require(resolve(
  __dirname,
  "..",
  "ethereum",
  "build",
  "Campaign.json"
));

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({
      data: compiledFactory.evm.bytecode.object,
    })
    .send({
      from: accounts[0],
      gas: "5000000",
    });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000",
  });
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe("Campaigns", () => {
  it("Deploys a contract", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("Marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  it("Allows people to contribute money and marks them as approvers", async () => {
    await campaign.methods.contribute().send({
      value: "101",
      from: accounts[1],
    });
    const isUserAApprover = await campaign.methods
      .approvers(accounts[1])
      .call();
    assert.ok(isUserAApprover);
  });

  it("Requires a minimum contribution", async () => {
    await assert.rejects(
      campaign.methods.contribute().send({
        from: accounts[0],
        value: 1,
      })
    );
  });

  it("Only manager can make a payment request", async () => {
    await assert.rejects(
      campaign.methods
        .createRequest(
          chance.sentence(),
          chance.integer({ min: 1, max: 100 }).toString(),
          accounts[accounts.length - 1]
        )
        .send({ from: accounts[1], gas: "1000000" })
    );
  });

  it("Allows a manager to make a payment request", async () => {
    const description = chance.sentence();
    const value = chance.integer({ min: 1, max: 100 });
    const recipient = accounts[accounts.length - 1];

    await campaign.methods
      .createRequest(description, value, recipient)
      .send({ from: accounts[0], gas: "1000000" });

    const request = await campaign.methods.requests(0).call();
    assert.equal(request.value, value);
    assert.equal(request.description, description);
    assert.equal(request.recipient, recipient);
    assert.ok(!request.complete);
    assert.equal(request.approvalCount, 0);
  });

  it("Processes requests", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: web3.utils.toWei("10", "ether"),
    });

    const description = chance.sentence();
    const value = web3.utils.toWei("5", "ether");
    const recipient = accounts[accounts.length - 1];

    await campaign.methods
      .createRequest(description, value, recipient)
      .send({ from: accounts[0], gas: "1000000" });

    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[1], gas: "1000000" });

    const initialBalance = await web3.eth
      .getBalance(accounts[accounts.length - 1])
      .then((res) => web3.utils.fromWei(res));
    await campaign.methods
      .finalizeRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    const balance = await web3.eth
      .getBalance(accounts[accounts.length - 1])
      .then((res) => web3.utils.fromWei(res));

    assert.notEqual(balance, initialBalance);
    assert.ok(+balance > +initialBalance);
  });
});
