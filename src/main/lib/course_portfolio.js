const Portfolio = require('../models/CoursePortfolio')
const User = require('../models/User');
const user = require("./user.js")
const Course = require('../models/Course');
const Term = require('../models/Term');
const SloPortfolioRelation = require('../models/CoursePortfolio/StudentLearningOutcome')
const Slo = require('../models/StudentLearningOutcome/index')


/**
 * @interface CoursePortfolio
 */

const eagertable = {
	owner: {
		owner: true
	},
	instructor: true,
	semester: true,
	outcomes: {
		slo: {
			metrics: true
		},
		artifacts: {
			evaluations: true
		}
	}
}



module.exports.new = async ({
	department_id,	
	course_number,	//Not the course id
	instructor,		//Not the instructor id
	semester,		//Not the semester id
	year,
	num_students,
	student_learning_outcomes, //[String]
	section
}) => {
	let [instructor_id, course_id, semester_term_id] = await Promise.all([
		User.query()
			.select("id")
			.where({"linkblue_username":instructor})
			.where("number_key", ">", 34)
			.first()
		,
		Course.query()
			.select("id")
			.where({"number":course_number, "department":department_id})
			.first()
		,
		Term.query()
			.select("id")
			.where({"name":semester})
			.first()
	]);
	
	let portfolio = await Portfolio.query().upsert({
		course_id:			course_id,
		instructor_id:  	instructor_id,
		semester_term_id:	semester_term_id,
		num_students:		num_students,
		section:			section,
		year:				year
	});

	let outcomes = await Slo.query()
		.insert(student_learning_outcomes.map((description, index)=>({
			department_id: department_id,
			index: index,
			description: description,
		})))
	
	let portfolio_outcome_relations = await SloPortfolioRelation.query()
		.insert(outcomes.map(({id: id, description: description})=>({
			portfolio_id: portfolio_id,
			slo_id: id,
			description: description
		})));
	// TODO
	return portfolio;
}


module.exports.get = async (portfolio_id)  =>{
	let raw_portfolio = await Portfolio.query()
		.eager(eagertable)
		.findById(portfolio_id)
	
	

	let portfolio = {
		portfolio_id: raw_portfolio.id,
		course_id: raw_portfolio.course_id,
		instructor: raw_portfolio.instructor,
		num_students: raw_portfolio.num_students,
		outcomes: [],// JESSIAH DO THIS BRO: Outcomes is an array of strings!!
			
		
		// UNTIL HERE BRO
		course: {
			department: raw_portfolio.owner.owner.identifier,
			number: raw_portfolio.owner.number,
			section: raw_portfolio.section,
			semester: raw_portfolio.semester.value,
			year: raw_portfolio.year
		},
	}

	console.log(raw_portfolio)

	for (let i in raw_portfolio.outcomes) {
		portfolio.outcomes.push(Object.assign({
			artifacts: raw_portfolio.outcomes[i].artifacts
		}, raw_portfolio.outcomes[i].slo))
	}

	return portfolio
}

module.exports.collect = async (userid) => {
	let portfolios = await Portfolio.query().eager(eagertable).where({"instructor_id":userid}) 
	
	for (portfolio of portfolios) {
		portfolio.completion = module.exports.coursecompletion(portfolio)
		portfolio.duedate = await module.exports.duedate(portfolio)
	}
	return portfolios;
}
/**
 * @description breaks courses into active and inactive lists.
 * @param {Array<Object>} courses
 * @returns {Array<Array<Object>>}
 */
module.exports.partition = async (courses) =>{
	let active = [];
	let inactive = [];
	for (course of courses) {
		module.exports.isActive(course) ? active.push(course) : inactive.push(course)
	}
	return {active:active, inactive:inactive};
}
/**
 * @description Returns the string representing the completion of the course
 * @param {*} courseinstance 
 * @returns {String}
 */
module.exports.coursecompletion = (courseinstance) => {
	return "Not done";
}

/**
 * 
 * @param {Object} courseinstance
 * @returns {Date}
 */
//Goal: 2 weeks after finals
module.exports.duedate = async (courseinstance) => {
	let term = await Term.query().findById(courseinstance.semester_term_id)
	let year = courseinstance.year
	return module.exports.getDueDateFromYearTerm(year, term.value);
}
/**
 * @param {Number} year
 * @param {String} term
 * @returns {Date}
 */
module.exports.getDueDateFromYearTerm = (year, term) => {
	switch(term) {
		case "fall":
			return new Date(year + 1, 1, 1);
		case "spring":
			return new Date(year, 5, 8 + 14);
		case "summer 1":
			return new Date(year, 8, 6 + 14);
		case "summer 2":
			return new Date(year, 8, 6 + 14);
		case "winter":
			return new Date(year + 1, 1, 14 + 14);
		case "does not apply":
			return new Date(year, 12, 31);
		default:
			throw new Error("duedate not implemented for term " + term );
	}
}


/**
 * Determines if the course is active by the date provided.
 * @param {Object} courseinstance
 * @param {Date} currentDate
 * @returns {Boolean}
 */
module.exports.isActive = (courseinstance, currentDate) => {
	return module.exports.duedate(courseinstance) > currentDate;
}