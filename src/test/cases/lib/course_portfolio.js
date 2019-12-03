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
				section:1
			}
		})
	})

	describe('isActive', ()=>{
		it('is inactive', async()=>{
			//describe
			let instance = {
				department_id: 2,
				course_number: 215,	//Not the course id
				instructor: 'user@uky.edu',		//Not the instructor id
				semester: {value: 'fall'},		//Not the semester id
				year: 2016,
				num_students: 41,
				student_learning_outcomes: ["Students will learn basic programming skills in C++", "Students will learn about for"], //[String]
				section:1
			}
			//act
			let result = await course_portfolio.isActive(instance, Date.now())
			//assert
			expect(result).to.be.false
		})
		
		it('is active', async()=>{
			//describe
			let instance = {
				department_id: 2,
				course_number: 215,	//Not the course id
				instructor: 'user@uky.edu',		//Not the instructor id
				semester: {value:'fall'},		//Not the semester id
				year: 2019,
				num_students: 41,
				student_learning_outcomes: ["Students will learn basic programming skills in C++", "Students will learn about for"], //[String]
				section:1
			}
			//act
			let result = await course_portfolio.isActive(instance, Date.now())
			//assert
			expect(result).to.be.true
		})
	})

	describe('getDueDateFromYearTerm', async ()=>{
		it('returns correct date', async()=>{
			//describe
			let year = 2019
			let term = {value:"fall"}
			//act
			let result = course_portfolio.getDueDateFromYearTerm(year, term)
			//assert
			expect(result.getFullYear()).to.equal(2020)
			expect(result.getDate()).to.equal(1)
		})

		it('throws an error for invalid terms', async()=>{
			//describe
			let year = 2019
			let term = "na"
			
			//act
			let action = ()=>course_portfolio.getDueDateFromYearTerm(year, term)
			//assert
			expect(action).to.throw()
		})
		
	})

	describe('collect', async()=> {
		it('has at least one course for userid 1', async()=> {
			//describe
			userid = 1;
			//act
			let collection = await course_portfolio.collect(1);
			//assert
			expect(collection.length >= 1).to.be.true;
		})
		
	})

	describe('partition', async()=> {
		it('groups instances properly', async()=>{
			//describe
			let courses = [
				{
					department_id: 2,
					course_number: 215,	//Not the course id
					instructor: 'user@uky.edu',		//Not the instructor id
					semester: {value: 'fall'},		//Not the semester id
					year: 2020,
					num_students: 41,
					student_learning_outcomes: ["Students will learn basic programming skills in C++", "Students will learn about for"], //[String]
					section:1
				},
				{
					department_id: 2,
					course_number: 215,	
					instructor: 'user@uky.edu',		
					semester: {value: 'fall'},		
					year: 2016,
					num_students: 41,
					student_learning_outcomes: ["Students will learn basic programming skills in C++", "Students will learn about for"], //[String]
					section:1
				},
				{
					department_id: 2,
					course_number: 215,
					instructor: 'user@uky.edu',		
					semester: {value: 'fall'},		
					year: 2011,
					num_students: 41,
					student_learning_outcomes: ["Students will learn basic programming skills in C++", "Students will learn about for"], //[String]
					section:1
				}
			]
			let {active, inactive} = await course_portfolio.partition(courses)
			//assert
			expect(  active.length).to.equal(1)
			expect(inactive.length).to.equal(2)
		})
	})

	describe('duedate', async() => {
		it('returns a valid date', async ()=>{
			//describe
			let course = {
				semester: {value: "fall"},
				year: 2019
			}

			//act
			let date = await course_portfolio.duedate(course);

			//assert
			expect(date.getFullYear()).to.equal(2020)
			expect(date.getMonth()).to.equal(1)
		})
	})
})