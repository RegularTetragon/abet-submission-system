exports.up = knex => {
  return knex.schema
		.createTable('department', table => {
			table.increments('id')
				.primary()
			table.string('identifier')
				.unique()
				.notNullable()
			table.string('name')
				.unique()
				.notNullable()
		})
    .createTable('users', table => {
			table.increments('id')
				.primary()
			table.string('linkblue_username')
				.unique()
				.notNullable()
    })
    .createTable('term_type', table => {
			table.increments('id')
				.primary()
			table.string('type')
				.unique()
				.notNullable()
    })
    .createTable('term', table => {
			table.increments('id')
				.primary()
			table.integer('type')
				.references('id')
				.inTable('term_type')
				.index()
				.notNullable()
			table.string('value')
				.notNullable()
			table.unique(['type', 'value'])
		})
		.createTable('slo', table => {
			table.increments('id')
				.primary()
			table.integer('department_id')
				.references('id')
				.inTable('department')
				.index()
				.notNullable()
			table.integer('index')	//Original order that the SLO was put in
				.notNullable()
			table.string('description')
				.notNullable()
		})
		.createTable('slo_metric', table => {
			table.increments('id')
				.primary()
			table.integer('slo_id')
				.references('id')
				.inTable('slo')
				.index()
			table.integer('index')
				.notNullable()
			table.string('name')
				.notNullable()
			table.string('exceeds')
				.defaultTo(`n/a`)
				.notNullable()
			table.string('meets')
				.defaultTo(`n/a`)
				.notNullable()
			table.string('partially')
				.defaultTo(`n/a`)
				.notNullable()
			table.string('not')
				.defaultTo(`n/a`)
				.notNullable()
			table.unique(['slo_id', 'index'])
		})
		.createTable('course', table => {
			table.increments('id')
				.primary()
			table.integer('department_id')
				.references('id')
				.inTable('department')
				.index()
				.notNullable()
			table.integer('number')
				.notNullable()
			table.unique(['department_id', 'number'])
			
		})
		.createTable('portfolio', table => {
			table.increments('id')
				.primary()
			table.integer('course_id')
				.references('id')
				.inTable('course')
				.index()
				.notNullable()
			table.integer('instructor_id')
				.references('id')
				.inTable('users')
				.index()
				.notNullable()
			table.integer('semester_term_id')
				.references('id')
				.inTable('term')
				.index()
				.notNullable()
			table.integer('num_students')
				.unsigned()
				.notNullable()
			table.integer('section')
				.unsigned()
				.notNullable()
			table.integer('year')
				.unsigned()
				.notNullable()
			table.unique('course_id', 'section', 'semester_term_id', 'year')
		})
		.createTable('portfolio_slo', table => {
			table.increments('id')
				.primary()
			table.integer('portfolio_id')
				.references('id')
				.inTable('portfolio')
				.index()
				.notNullable()
			table.integer('slo_id')
				.references('id')
				.inTable('slo')
				.index()
				.notNullable()
			table.unique(['portfolio_id', 'slo_id'])
		})
		.createTable('artifact', table => {
			table.increments('id')
				.primary()
			table.integer('portfolio_slo_id')
				.references('id')
				.inTable('portfolio_slo')
				.index()
				.notNullable()
			table.integer('index')
				.notNullable()
			table.string('name')
				.defaultTo('_unset_')
				.notNullable()
			table.unique(['portfolio_slo_id', 'index'])
		})
		.createTable('artifact_evaluation', table => {
			table.increments('id')
				.primary()
			table.integer('artifact_id')
				.references('id')
				.inTable('artifact')
				.index()
				.notNullable()
			table.integer('evaluation_index')
				.notNullable()
			table.integer('student_index')
				.notNullable()
			table.json('evaluation')
				.defaultTo([])
				.notNullable()
			table.binary('file')
				.nullable()
		})
}

exports.down = knex => {
	return knex.schema
		.dropTableIfExists('artifact_evaluation')
		.dropTableIfExists('artifact')
		.dropTableIfExists('portfolio_slo')
		.dropTableIfExists('portfolio')
		.dropTableIfExists('course')
		.dropTableIfExists('slo_metric')
		.dropTableIfExists('slo')
    .dropTableIfExists('users')
    .dropTableIfExists('term')
		.dropTableIfExists('term_type')
		.dropTableIfExists('department')
}