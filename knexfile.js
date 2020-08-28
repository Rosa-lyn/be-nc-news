const ENV = process.env.NODE_ENV || "development";
const { DB_URL } = process.env;

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations",
  },
  seeds: {
    directory: "./db/seeds",
  },
};

const customConfig = {
  development: {
    connection: {
      database: "northcoders_news",
      // for linux users:
      // username: 'your-username-here',
      // password: 'your-password-here'
    },
  },
  test: {
    connection: {
      database: "northcoders_news_test",
      // for linux users:
      // username: 'your-username-here',
      // password: 'your-password-here'
    },
  },
  production: {
    connection: {
      connectionString: DB_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};

module.exports = { ...customConfig[ENV], ...baseConfig };
