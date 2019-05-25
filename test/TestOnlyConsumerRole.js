let ConsumerRole = artifacts.require('ConsumerRole');

contract('ConsumerRole',(accounts)=>{

    let ConsumerRoleManager;
    const owner = accounts[0]
    const newConsumer1 = accounts[1];
    const newConsumer2 = accounts[2];

    before(async()=>{
        ConsumerRoleManager = await ConsumerRole.deployed();
        console.log("\nConsumerRole Contract deployed at: "+ConsumerRoleManager.address+"\n");
    });

    it('should owner is a member of consumer',async()=>{
        let result = await ConsumerRoleManager.isConsumer(owner);

        assert.equal(result,true,'Error: contract owner is not the consumer');
    });

    it('should add two new consumers success',async()=>{
        let eventEmitted = false;

        //watch the event
        ConsumerRoleManager.ConsumerAdded((err,res)=>{
            eventEmitted = true;
        });

        //add a new consumer
        await ConsumerRoleManager.addConsumer(newConsumer1,{from:owner});
        await ConsumerRoleManager.addConsumer(newConsumer2,{from:owner});

        //verify the new consumer ID
        let result1 = await ConsumerRoleManager.isConsumer(newConsumer1);
        let result2 = await ConsumerRoleManager.isConsumer(newConsumer2);

        assert.equal(eventEmitted,true,'Error: ConsumerAdded event not emitted.');
        assert.equal(result1,true,'Error: '+newConsumer1+' is not the consumer.');
        assert.equal(result2,true,'Error: '+newConsumer2+' is not the consumer');
    });

    it('should renounce a consumer role success by a consumer',async ()=>{
        let eventEmitted = false;

        //watch the event
        ConsumerRoleManager.ConsumerRemoved((err,res)=>{
            eventEmitted = true;
        });

        //renounce the consumer role
        await ConsumerRoleManager.renounceConsumer({from:newConsumer2});
        let result = await ConsumerRoleManager.isConsumer(newConsumer2);

        assert.equal(result,false,'Error:'+newConsumer2+'should be removed from roles');
        assert.equal(eventEmitted,true,'Error: ConsumerRemoved event not emitted.');
    })

    it('should failed when adding a existed consumer',async()=>{
        let eventEmitted = false;

        //watch the event
        ConsumerRoleManager.ConsumerAdded((err,res)=>{
            eventEmitted = true;
        });

        try{
        //add a new consumer
        await ConsumerRoleManager.addConsumer(owner,{from:owner});
        }
        catch(err){
            assert.ok(err);
        }
        //verify the new consumer ID
        let result = await ConsumerRoleManager.isConsumer(owner);

        assert.equal(eventEmitted,true,'Error: ConsumerAdded event not emitted.');
        assert.equal(result,true,'Error: '+newConsumer1+' is not the consumer.');
    });

    it('should failed when renouncing a consumer role who is not a consumer',async ()=>{
        let eventEmitted = false;

        //watch the event
        ConsumerRoleManager.ConsumerRemoved((err,res)=>{
            eventEmitted = true;
        });

        try{
            //renounce the consumer role
            await ConsumerRoleManager.renounceConsumer({from:accounts[5]});
        }catch(err){
            assert.ok(err);
        }
        
        let result = await ConsumerRoleManager.isConsumer(accounts[5]);

        assert.equal(result,false,'Error:'+accounts[5]+'should be removed from roles');
        assert.equal(eventEmitted,true,'Error: ConsumerRemoved event not emitted.');
    })
});