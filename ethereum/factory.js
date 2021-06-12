// on utilise le web3 de metamask de web3.js pour avoir une instance correspondant au contrat déployé

import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface), // interface issue de la compilation du contrat
  '0x63aa459ddf817cC6c0c3f9e9795E608089b20031' //adresse où le contrat a été deployé
);

export default instance;
