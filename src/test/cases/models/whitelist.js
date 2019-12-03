const Whitelist = require('../../../main/models/Whitelist')
const { expect } = require('../../chai')

describe('Model - Whitelist', async ()=> {
    describe('lookup', async ()=>{
        it('by id', async ()=>{
            const whitelist = await Whitelist.query().findOne({id:1})

            expect(whitelist).to.deep.equal({id:1, email:"user@uky.edu"});
        })

        it('by email', async()=> {
            const whitelist = await Whitelist.query().findOne({email:"user@uky.edu"});

            expect(whitelist).to.deep.equal({id:1, email:"user@uky.edu"});
        })
    })
})