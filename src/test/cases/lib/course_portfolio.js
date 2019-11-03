const course_portfolio = require('../../../main/lib/course_portfolio')
const { expect } = require('../../chai')

describe('Lib - CoursePortfolio', () => {

	describe('get', () => {

		it('with id', async () => {
			const portfolio = await course_portfolio.get(1)

			// TODO
		})

	})

	describe('new', ()=>{
		it('with id', async ()=>{
			//describe
			let params = {
				department_id: 2,
				course_number: 215,	//Not the course id
				instructor: 'user@uky.edu',		//Not the instructor id
				semester: 'fall',		//Not the semester id
				year: 2019,
				num_students: 41,
				student_learning_outcomes: ["Students will learn basic programming skills in C++", "Students will learn about for"], //[String]
				section
			}
		})
	})
})