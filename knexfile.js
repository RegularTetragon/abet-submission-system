module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: '127.0.0.1',
      database: 'abet_system_dev',
      user: 'postgres',
      password: 'waluigitime'
		},
		migrations: {
			directory: './src/main/migrations'
		},
		seeds: {
			directory: './src/dev/seeds'
		},
    pool: {
      min: 2,
      max: 10
    }
	},
	
	test: {
    client: 'postgresql',
    connection: {
      database: 'abet_system_dev'
		},
		migrations: {
			directory: './src/main/migrations'
		},
		seeds: {
			directory: './src/test/seeds'
		},
    pool: {
      min: 2,
      max: 10
    }
	},

  production: {
    client: 'postgresql',
    connection: {
      database: 'abet_system'
    },
		migrations: {
			directory: './src/main/migrations'
		},
    pool: {
      min: 2,
      max: 10
    }
  }
};