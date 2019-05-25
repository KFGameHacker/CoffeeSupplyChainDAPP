let ConsumerRole = artifacts.require('ConsumerRole');

contract('ConsumerRole',(accounts)=>{

    let ConsumerRoleManager;
    const owner = accounts[0];
    const newConsumer1 = accounts[1];
    const newConsumer2 = accounts[2];

    before(async()=>{
        
        try{
            ConsumerRoleManager = await ConsumerRole.deployed({from:owner});
        }
        catch(err){
            console.log(err)
        }

        let eventEmitted = false;

        //watch the event
        ConsumerRoleManager.ConsumerAdded((err,res)=>{
            eventEmitted = true;
        });

        assert.equal(eventEmitted,true,'Error: ConsumerAdded event not emitted.');
        console.log("\nConsumer Role AccessControl Contract deployed at: "+ConsumerRoleManager.address+"\n");
    });

    it.only('should owner is a member of Consumer',async()=>{
        let result = await ConsumerRoleManager.isConsumer(owner);

        assert.equal(result,true,'Error: contract owner is not the Consumer');
    });

    it('should add two new Consumers success',async()=>{
        let eventEmitted = false;

        //watch the event
        ConsumerRoleManager.ConsumerAdded((err,res)=>{
            eventEmitted = true;
        });

        //add a new Consumer
        await ConsumerRoleManager.addConsumer(newConsumer1,{from:owner});
        await ConsumerRoleManager.addConsumer(newConsumer2,{from:owner});

        //verify the new Consumer ID
        let result1 = await ConsumerRoleManager.isConsumer(newConsumer1);
        let result2 = await ConsumerRoleManager.isConsumer(newConsumer2);

        assert.equal(eventEmitted,true,'Error: ConsumerAdded event not emitted.');
        assert.equal(result1,true,'Error: '+newConsumer1+' is not the Consumer.');
        assert.equal(result2,true,'Error: '+newConsumer2+' is not the Consumer');
    });

    it('should renounce a Consumer role success by a Consumer',async ()=>{
        let eventEmitted = false;

        //watch the event
        ConsumerRoleManager.ConsumerRemoved((err,res)=>{
            eventEmitted = true;
        });

        //renounce the Consumer role
        await ConsumerRoleManager.renounceConsumer({from:newConsumer2});
        let result = await ConsumerRoleManager.isConsumer(newConsumer2);

        assert.equal(result,false,'Error:'+newConsumer2+'should be removed from roles');
        assert.equal(eventEmitted,true,'Error: ConsumerRemoved event not emitted.');
    })

    it('should failed when adding a existed Consumer',async()=>{
        let eventEmitted = false;

        //watch the event
        ConsumerRoleManager.ConsumerAdded((err,res)=>{
            eventEmitted = true;
        });

        try{
        //add a new Consumer
        await ConsumerRoleManager.addConsumer(owner,{from:owner});
        }
        catch(err){
            assert.ok(err);
        }
        //verify the new Consumer ID
        let result = await ConsumerRoleManager.isConsumer(owner);

        assert.equal(eventEmitted,true,'Error: ConsumerAdded event not emitted.');
        assert.equal(result,true,'Error: '+newConsumer1+' is not the Consumer.');
    });

    it('should failed when renouncing a Consumer role who is not a Consumer',async ()=>{
        let eventEmitted = false;

        //watch the event
        ConsumerRoleManager.ConsumerRemoved((err,res)=>{
            eventEmitted = true;
        });

        try{
            //renounce the Consumer role
            await ConsumerRoleManager.renounceConsumer({from:accounts[5]});
        }catch(err){
            assert.ok(err);
        }
        
        let result = await ConsumerRoleManager.isConsumer(accounts[5]);

        assert.equal(result,false,'Error:'+accounts[5]+'should be removed from roles');
        assert.equal(eventEmitted,true,'Error: ConsumerRemoved event not emitted.');
    })
});