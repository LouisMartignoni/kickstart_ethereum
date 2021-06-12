// on demande accès au web3 de metamask; ici on pourra gérer si l'utilisateur n'a pas metamask plus tard
// l'utilisateur a besoin de metamask pour interagir avec le contrat
import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask; ce code va s'executer quand le serveur next.js build l'app et quand le user l'utilise
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/3b50e983f79e48be8bfa5753556b8175" // on utilise notre clef infura pour accéeder à la blockchain ethereum
  );
  web3 = new Web3(provider);
}

export default web3;
