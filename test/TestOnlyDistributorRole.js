let DistributorRole = artifacts.require('DistributorRole');

contract('DistributorRole',(accounts)=>{

    let DistributorRoleManager;
    const owner = accounts[0]
    const newDistributor1 = accounts[1];
    const newDistributor2 = accounts[2];

    before(async()=>{
        DistributorRoleManager = await DistributorRole.deployed();
        console.log("\nDistributorRole Contract deployed at: "+DistributorRoleManager.address+"\n");
    });

    it('should owner is a member of distributor',async()=>{
        let result = await DistributorRoleManager.isDistributor(owner);

        assert.equal(result,true,'Error: contract owner is not the distributor');
    });

    it('should add two new distributors success',async()=>{
        let eventEmitted = false;

        //watch the event
        DistributorRoleManager.DistributorAdded((err,res)=>{
            eventEmitted = true;
        });

        //add a new distributor
        await DistributorRoleManager.addDistributor(newDistributor1,{from:owner});
        await DistributorRoleManager.addDistributor(newDistributor2,{from:owner});

        //verify the new distributor ID
        let result1 = await DistributorRoleManager.isDistributor(newDistributor1);
        let result2 = await DistributorRoleManager.isDistributor(newDistributor2);

        assert.equal(eventEmitted,true,'Error: DistributorAdded event not emitted.');
        assert.equal(result1,true,'Error: '+newDistributor1+' is not the distributor.');
        assert.equal(result2,true,'Error: '+newDistributor2+' is not the distributor');
    });

    it('should renounce a distributor role success by a distributor',async ()=>{
        let eventEmitted = false;

        //watch the event
        DistributorRoleManager.DistributorRemoved((err,res)=>{
            eventEmitted = true;
        });

        //renounce the distributor role
        await DistributorRoleManager.renounceDistributor({from:newDistributor2});
        let result = await DistributorRoleManager.isDistributor(newDistributor2);

        assert.equal(result,false,'Error: '+newDistributor2+' should be removed from roles');
        assert.equal(eventEmitted,true,'Error: DistributorRemoved event not emitted.');
    })

    it('should failed when adding a existed distributor',async()=>{
        let eventEmitted = false;

        //watch the event
        DistributorRoleManager.DistributorAdded((err,res)=>{
            eventEmitted = true;
        });

        try{
        //add a new distributor
        await DistributorRoleManager.addDistributor(owner,{from:owner});
        }
        catch(err){
            assert.ok(err);
        }
        //verify the new distributor ID
        let result = await DistributorRoleManager.isDistributor(owner);

        assert.equal(eventEmitted,true,'Error: DistributorAdded event not emitted.');
        assert.equal(result,true,'Error: '+newDistributor1+' is not the distributor.');
    });

    it('should failed when renouncing a distributor role who is not a distributor',async ()=>{
        let eventEmitted = false;

        //watch the event
        DistributorRoleManager.DistributorRemoved((err,res)=>{
            eventEmitted = true;
        });

        try{
            //renounce the distributor role
            await DistributorRoleManager.renounceDistributor({from:accounts[5]});
        }catch(err){
            assert.ok(err);
        }
        
        let result = await DistributorRoleManager.isDistributor(accounts[5]);

        assert.equal(result,false,'Error:'+accounts[5]+'should be removed from roles');
        assert.equal(eventEmitted,true,'Error: DistributorRemoved event not emitted.');
    })
});