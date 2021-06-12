const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
  'robot onion base point private select tuition sauce income fossil face spread',
  'https://rinkeby.infura.io/v3/3b50e983f79e48be8bfa5753556b8175'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy( { data: '0x' + compiledFactory.bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log('contract deployed to:', result.options.address);
};

deploy(); // cette syntaxe pour pouvoir mettre le async
// contract deployed to 0xA81f12c6db678bEcBbD874512485A35c1435fF9A
