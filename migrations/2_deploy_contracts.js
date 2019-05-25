// migrating the appropriate contracts
var FarmerRole = artifacts.require("./FarmerRole.sol");
var DistributorRole = artifacts.require("./DistributorRole.sol");
var RetailerRole = artifacts.require("./RetailerRole.sol");
var ConsumerRole = artifacts.require("./ConsumerRole.sol");
var SupplyChain = artifacts.require("./SupplyChain.sol");

const Farmer = accounts[0]
const Distributor = accounts[1];
const Retailer = accounts[2];
const Consumer = accounts[3];

module.exports = function(deployer,accounts) {
  deployer.deploy(FarmerRole,{from:Farmer});
  deployer.deploy(DistributorRole,{from:Distributor});
  deployer.deploy(RetailerRole,{from:Retailer});
  deployer.deploy(ConsumerRole,{from:Consumer});
  deployer.deploy(SupplyChain);
};
