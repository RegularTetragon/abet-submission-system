const User = require('../../../main/models/User')
const { expect } = require('../../chai')

describe('Model - User', () => {

	describe('lookup', () => {

		it('with user id', async () => {
			const user = await User.query()
				.findOne({id: 1})
	
			expect(user).to.deep.equal({
				id: 1,
				linkblue_username: 'user@uky.edu',
				passwordhash: '$2b$10$L1Plm9AJN1DlvUemUkxgmuf8srfTkvNnUV9ImKl/E0UKyAQTbNJS6',
				authtoken: null,
				permission_level: 1
			})
		})
	
		it('with linkblue_username', async () => {
			const user = await User.query()
				.findById('user@uky.edu')
	
			expect(user).to.deep.equal({
				id: 1,
				linkblue_username: 'user@uky.edu',
				passwordhash: '$2b$10$L1Plm9AJN1DlvUemUkxgmuf8srfTkvNnUV9ImKl/E0UKyAQTbNJS6',
				authtoken: null,
				permission_level: 1
			})
		})

	})

	describe('creation', () => {

		it('checks for duplicates', async () => {
			const user_promise = User.query().insert({
				id: 1,
				linkblue_username: 'user@uky.edu',
				passwordhash: "$2b$10$L1Plm9AJN1DlvUemUkxgmuf8srfTkvNnUV9ImKl/E0UKyAQTbNJS6",
				authtoken: null,
				permission_level: 1
			})

			expect(user_promise).to.eventually.be.rejected
		})

	})

})