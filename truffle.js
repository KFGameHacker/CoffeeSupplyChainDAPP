let HDWalletProvider = require("truffle-hdwallet-provider");
const infuraKey = "97635fa595e948b388e3c5266c9e0163";

//just for test net. don't worry the security.
const mnemonic = 'spirit supply whale amount human item harsh scare congress discover talent hamster';

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"+infuraKey),
      network_id: "*",
    },
    rinkeby: {
      provider: new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/"+infuraKey),
      network_id: "*",
    },
  }
};