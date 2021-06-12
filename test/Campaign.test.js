const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });

  await factory.methods.createCampaign('100').send({ from:accounts[0], gas: '1000000' });

  //const arraysAddress = await factory.methods.getDeployedCampaigns().call();
  //campaignAddress = arraysAddress[0]

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call(); // prend le premier element
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  ); // syntaxe si on veut recup un contrat deployé <> de la syntaxe du deploiement du Factory
});

describe('Campaigns', () => {
  it('deploys a factory and campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(factory.options.address);
  });

  it('test manager', async () => {
    const manager = await campaign.methods.manager().call(); //solidity crée methode manager car manager est une var publique
    assert.equal(accounts[0], manager);
  });

  it('contribute test', async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: '200'});

    assert(await campaign.methods.approvers(accounts[1]).call());
  });

  it('requires min contribution', async () => {
    try {
      await campaign.methods.contribute().send({
        value: '5',
        from: accounts[1]
      });
      assert(false);
    } catch(err) {
      assert(err);
    }
  });

  it('ability to request', async () => {
    await campaign.methods.createRequest('test', '50', accounts[1])
      .send({
        from: await campaign.methods.manager().call(),
        gas: '1000000'
      });

    const req = await campaign.methods.requests(0).call();
    assert.equal('test', req.description);
  })

  it('end to end', async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether')
    });

    await campaign.methods.createRequest('test', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({
        from: await campaign.methods.manager().call(),
        gas: '1000000'
      });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    let prev_balance = await web3.eth.getBalance(accounts[1]);
    prev_balance = web3.utils.fromWei(prev_balance, 'ether');
    prev_balance = parseFloat(prev_balance);

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);

    assert(balance > (prev_balance + 1));
  });
});
