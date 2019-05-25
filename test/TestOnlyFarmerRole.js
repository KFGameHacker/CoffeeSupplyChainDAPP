let FarmerRole = artifacts.require('FarmerRole');

contract('FarmerRole',(accounts)=>{

    let FarmerRoleManager;
    const owner = accounts[0]
    const newFarmer1 = accounts[1];
    const newFarmer2 = accounts[2];

    before(async()=>{
        FarmerRoleManager = await FarmerRole.deployed();
        console.log("\nFarmerRole Contract deployed at: "+FarmerRoleManager.address+"\n");
    });

    it('should owner is a member of farmer',async()=>{
        let result = await FarmerRoleManager.isFarmer(owner);

        assert.equal(result,true,'Error: contract owner is not the farmer');
    });

    it('should add two new farmers success',async()=>{
        let eventEmitted = false;

        //watch the event
        FarmerRoleManager.FarmerAdded((err,res)=>{
            eventEmitted = true;
        });

        //add a new farmer
        await FarmerRoleManager.addFarmer(newFarmer1,{from:owner});
        await FarmerRoleManager.addFarmer(newFarmer2,{from:owner});

        //verify the new farmer ID
        let result1 = await FarmerRoleManager.isFarmer(newFarmer1);
        let result2 = await FarmerRoleManager.isFarmer(newFarmer2);

        assert.equal(eventEmitted,true,'Error: FarmerAdded event not emitted.');
        assert.equal(result1,true,'Error: '+newFarmer1+' is not the farmer.');
        assert.equal(result2,true,'Error: '+newFarmer2+' is not the farmer');
    });

    it('should renounce a farmer role success by a farmer',async ()=>{
        let eventEmitted = false;

        //watch the event
        FarmerRoleManager.FarmerRemoved((err,res)=>{
            eventEmitted = true;
        });

        //renounce the farmer role
        await FarmerRoleManager.renounceFarmer({from:newFarmer2});
        let result = await FarmerRoleManager.isFarmer(newFarmer2);

        assert.equal(result,false,'Error:'+newFarmer2+'should be removed from roles');
        assert.equal(eventEmitted,true,'Error: FarmerRemoved event not emitted.');
    })

    it('should failed when adding a existed farmer',async()=>{
        let eventEmitted = false;

        //watch the event
        FarmerRoleManager.FarmerAdded((err,res)=>{
            eventEmitted = true;
        });

        try{
        //add a new farmer
        await FarmerRoleManager.addFarmer(owner,{from:owner});
        }
        catch(err){
            assert.ok(err);
        }
        //verify the new farmer ID
        let result = await FarmerRoleManager.isFarmer(owner);

        assert.equal(eventEmitted,true,'Error: FarmerAdded event not emitted.');
        assert.equal(result,true,'Error: '+newFarmer1+' is not the farmer.');
    });

    it('should failed when renouncing a farmer role who is not a farmer',async ()=>{
        let eventEmitted = false;

        //watch the event
        FarmerRoleManager.FarmerRemoved((err,res)=>{
            eventEmitted = true;
        });

        try{
            //renounce the farmer role
            await FarmerRoleManager.renounceFarmer({from:accounts[5]});
        }catch(err){
            assert.ok(err);
        }
        
        let result = await FarmerRoleManager.isFarmer(accounts[5]);

        assert.equal(result,false,'Error:'+accounts[5]+'should be removed from roles');
        assert.equal(eventEmitted,true,'Error: FarmerRemoved event not emitted.');
    })
});