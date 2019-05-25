let RetailerRole = artifacts.require('RetailerRole');

contract('RetailerRole',(accounts)=>{

    let RetailerRoleManager;
    const owner = accounts[0]
    const newRetailer1 = accounts[1];
    const newRetailer2 = accounts[2];

    before(async()=>{
        RetailerRoleManager = await RetailerRole.deployed({from:owner});
        console.log("\nRetailerRole Contract deployed at: "+RetailerRoleManager.address+"\n");
    });

    it('should owner is a member of Retailer',async()=>{
        let result = await RetailerRoleManager.isRetailer(owner);

        assert.equal(result,true,'Error: contract owner is not the Retailer');
    });

    it('should add two new Retailers success',async()=>{
        let eventEmitted = false;

        //watch the event
        RetailerRoleManager.RetailerAdded((err,res)=>{
            eventEmitted = true;
        });

        //add a new Retailer
        await RetailerRoleManager.addRetailer(newRetailer1,{from:owner});
        await RetailerRoleManager.addRetailer(newRetailer2,{from:owner});

        //verify the new Retailer ID
        let result1 = await RetailerRoleManager.isRetailer(newRetailer1);
        let result2 = await RetailerRoleManager.isRetailer(newRetailer2);

        assert.equal(eventEmitted,true,'Error: RetailerAdded event not emitted.');
        assert.equal(result1,true,'Error: '+newRetailer1+' is not the Retailer.');
        assert.equal(result2,true,'Error: '+newRetailer2+' is not the Retailer');
    });

    it('should renounce a Retailer role success by a Retailer',async ()=>{
        let eventEmitted = false;

        //watch the event
        RetailerRoleManager.RetailerRemoved((err,res)=>{
            eventEmitted = true;
        });

        //renounce the Retailer role
        await RetailerRoleManager.renounceRetailer({from:newRetailer2});
        let result = await RetailerRoleManager.isRetailer(newRetailer2);

        assert.equal(result,false,'Error:'+newRetailer2+'should be removed from roles');
        assert.equal(eventEmitted,true,'Error: RetailerRemoved event not emitted.');
    })

    it('should failed when adding a existed Retailer',async()=>{
        let eventEmitted = false;

        //watch the event
        RetailerRoleManager.RetailerAdded((err,res)=>{
            eventEmitted = true;
        });

        try{
        //add a new Retailer
        await RetailerRoleManager.addRetailer(owner,{from:owner});
        }
        catch(err){
            assert.ok(err);
        }
        //verify the new Retailer ID
        let result = await RetailerRoleManager.isRetailer(owner);

        assert.equal(eventEmitted,true,'Error: RetailerAdded event not emitted.');
        assert.equal(result,true,'Error: '+newRetailer1+' is not the Retailer.');
    });

    it('should failed when renouncing a Retailer role who is not a Retailer',async ()=>{
        let eventEmitted = false;

        //watch the event
        RetailerRoleManager.RetailerRemoved((err,res)=>{
            eventEmitted = true;
        });

        try{
            //renounce the Retailer role
            await RetailerRoleManager.renounceRetailer({from:accounts[5]});
        }catch(err){
            assert.ok(err);
        }
        
        let result = await RetailerRoleManager.isRetailer(accounts[5]);

        assert.equal(result,false,'Error:'+accounts[5]+'should be removed from roles');
        assert.equal(eventEmitted,true,'Error: RetailerRemoved event not emitted.');
    })
});