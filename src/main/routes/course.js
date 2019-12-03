var express = require('express');
var mustache = require('../common/mustache')
var html = require('../common/html')
var course_portfolio_lib = require('../lib/course_portfolio')
var router = express.Router();
var assert = require('assert');

const Department = require('../models/Department')
const TermType = require('../models/TermType')
const User = require('../models/User');
const user = require("../lib/user")
let Course = require('../models/Course')
let CoursePortfolio = require('../models/CoursePortfolio/index')

const course_manage_page = async (res, course_id) => {
	let course_info = await course_portfolio_lib.get(course_id);
	if (!course_info) {
		throw "Course not found with id " + course_id + " :(";
	}
	/*let course_info = {
		student_learning_outcomes: [
			{
				index: portfolio_id,
				description: 'n/a',
				metrics: [
					{
						name: 'n/a',
						exceeds: 'n/a',
						meets: 'n/a',
						partially: 'n/a',
						not: 'n/a'
					},
					{
						name: 'n/a',
						exceeds: 'n/a',
						meets: 'n/a',
						partially: 'n/a',
						not: 'n/a'
					},
					{
						name: 'n/a',
						exceeds: 'n/a',
						meets: 'n/a',
						partially: 'n/a',
						not: 'n/a'
					},
					{
						name: 'n/a',
						exceeds: 'n/a',
						meets: 'n/a',
						partially: 'n/a',
						not: 'n/a'
					},
				],
				artifacts: [
					{
						name: 'n/a',
						evaluations: [
							{
								index: 1,
								evaluation: [
									{
										metric: 1,
										value: 6
									},
									{
										metric: 2,
										value: 6
									},
									{
										metric: 3,
										value: 6
									},
									{
										metric: 4,
										value: 6
									}
								]
							}
						]
					}
				]
			}
		]
	};
	*/
	res.render('base_template', {
		title: "CS Whatever",
		body: mustache.render('course/manage', course_info)
	})
}

const course_new_page = async (res, department = false) => {
	const departments = await Department.query().select()
	const semesters = await (await TermType.query()
		.findById('semester'))
		.$relatedQuery('terms')
	let student_learning_outcomes = false

	if (department) {
		student_learning_outcomes = await (await Department.query().findById(department))
			.$relatedQuery('student_learning_outcomes')
	}

	res.render('base_template', {
		title: 'New Course Portfolio',
		body: mustache.render('course/new', {
			departments,
			department,
			student_learning_outcomes,
			semesters
		})
	})
}

/* GET course home page */
router.route('/')
	.get(html.auth_wrapper(async (req, res, next) => {
		let user = await user.getuserfromtoken(req.session.id)
		assert(user != undefined);
		let coursedata = await course_portfolio_lib.partition(user.id);
		
		for (course of coursedata.active) {
			course.due = "Due date not done";
			course.completion = "Completion not done";
		}
		if (user) {
			res.render('base_template', {
				title: 'Course Portfolios',
				body: mustache.render('course/index', coursedata),
				linkblue_username: user.linkblue_username
			})
		}
		else {
			res.redirect('/login')
		}
	}))

	/* GET course page */
router.route('/:id')
	.get(html.auth_wrapper(async (req, res, next) => {
		if (req.params.id === 'new') {
			await course_new_page(res)
		} else {
			await course_manage_page(res, req.params.id)
		}
	}))


	.post(html.auth_wrapper(async (req, res, next) => {
		if (req.params.id === 'new') {
			if (req.body.course_submit) {
				const course_portfolio = await course_portfolio_lib.new({
					department_id: req.body.department,
					course_number: req.body.course_number,
					instructor: 1,
					semester: req.body.semester,
					year: req.body.course_year,
					num_students: req.body.num_students,
					student_learning_outcomes: Object.entries(req.body)
						.filter(entry => entry[0].startsWith('slo_') && entry[1] === 'on')
						.map(entry => entry[0].split('_')[1]),
					section: req.body.course_section
				})

				res.redirect(302, `/course/${course_portfolio.id}`)
			} else {
				await course_new_page(res, req.body.department)
			}
		} else {
			await course_manage_page(res, 499)
		}
	}))

module.exports = router;
