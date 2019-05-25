let FarmerRole = artifacts.require('FarmerRole');
let DistributorRole = artifacts.require('DistributorRole');
let RetailerRole = artifacts.require('RetailerRole');
let ConsumerRole = artifacts.require('ConsumerRole');

contract('Whole Supply Chain Simulation',(accounts)=>{

    let FarmerRoleManager;
    let DistributorRoleManager;
    let RetailerRoleManager;
    let ConsumerRoleManager;

    //Address in ropsten testnet
    const FarmerRoleContractAddress = '0x2ED88E1eC2E422029beADba37f5d387bE94f7c32';
    const DistributorRoleContractAddress = '0xB09E439d7D04637Bf1897b70e07CccCcBf77e292';
    const RetailerRoleContractAddress = '0x2D5DE78B33B7ad3a4458eE887989Dba8f14B73F0';
    const ConsumerRoleContractAddress = '0x9e52D8Eafc46fB48FeDa1566995204759e62bE4E';

    const Farmer = accounts[0]
    const Distributor = accounts[1];
    const Retailer = accounts[2];
    const Consumer = accounts[3];

    before(async()=>{
        FarmerRoleManager = await FarmerRole.at(FarmerRoleContractAddress);
        DistributorRoleManager = await DistributorRole.at(DistributorRoleContractAddress);
        RetailerRoleManager = await RetailerRole.at(RetailerRoleContractAddress);
        ConsumerRoleManager = await ConsumerRole.at(ConsumerRoleContractAddress);
        console.log("\n FarmerRole Contract deployed at: "+FarmerRoleManager.address+" Owner:"+await FarmerRoleManager.getOwner());
        console.log("\n DistributorRole Contract deployed at: "+DistributorRoleManager.address+" Owner:"+await DistributorRoleManager.getOwner());
        console.log("\n RetailerRole Contract deployed at: "+RetailerRoleManager.address+" Owner:"+await RetailerRoleManager.getOwner());
        console.log("\n ConsumerRole Contract deployed at: "+ConsumerRoleManager.address+" Owner:"+await ConsumerRoleManager.getOwner());
    });


    it('should verify 4 roles ID right.',async()=>{
        assert.equal(await FarmerRoleManager.isFarmer(Farmer),true,'Error: is not the farmer');
        assert.equal(await DistributorRoleManager.isDistributor(Distributor),true,'Error: is not the Distributor');
        assert.equal(await RetailerRoleManager.isRetailer(Retailer),true,'Error: is not the Retailer');
        assert.equal(await ConsumerRoleManager.isConsumer(Consumer),true,'Error: is not the Consumer');
    });

    
});