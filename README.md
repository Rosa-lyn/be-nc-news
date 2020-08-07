# The News Den API

A RESTful API that serves as the back-end for my _The News Den_ website, a social news aggregation similar to [Reddit](https://www.reddit.com/).

Users can view all articles, topics, comments and users on the site, post and delete comments, and up- or down-vote comments and articles. I will be adding a front-end in the future.

The API can be viewed here: [The News Den](https://thenewsden.herokuapp.com/api)

## Getting Started

Here's how to get a copy of this project up and running on your own machine.

Fork the repository, copy the URL, then navigate to the folder you want to save it to in your terminal and type the following:

```
git clone <URL-of-your-forked-repo>
```

### Prerequisites

To get started, you will need to download Node.js, which you can do [here](https://nodejs.org/en/). This will also automatically install [NPM](https://www.npmjs.com/) on your machine. To check if you already have these, run the following in your terminal:

```
node -v
npm -v
```

### Installing

To install all the packages you need for the project, run the following in your terminal:

```
npm i
```

This will install the following dependencies:

```
Express v4.17.1
Knex v0.21.2
Pg v8.0.3
Jest v26.2.2
Jest Sorted v1.0.6
Supertest v4.0.2
```

The minimum version requirement is stated next to each dependency.

### Creating and Seeding Databases

There are two databases for this project - `northcoders_news` for development and `northcoders_news_test` for testing. To set these up, run the following script:

```
npm run setup-dbs
```

To set up the tables in the databases, run:

```
npm run migrate-make
```

There are two scripts to seed the databases with data. To seed `northcoders_news_test` with the test data, run:

```
npm run seed-test
```

To seed `northcoders_news` with development data, run:

```
npm run seed
```

### Connecting to the databases

To connect to the databases, you will need to create a file in the root directory of the project called `knexfile.js`. Copy the following into the file, ensuring to add your Linux username and password if you are a Linux user:

```
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
```

You will notice that `knexfile.js` has already been `.gitignore`d to keep your configuration details secure.

### Previewing the app

To check the app is working in your browser or a REST client such as [Insomnia](https://insomnia.rest/), run the following script to start the server:

```
npm start
```

## Endpoints

The following endpoints are available on the app. They can also be viewed [here](https://thenewsden.herokuapp.com/api).

- `GET /api`: serves a JSON representation of all the available endpoints of the API.

- `GET /api/articles`: serves an array of all articles.

- `GET /api/topics`: serves an array of all topics.

- `GET /api/users/:username`: serves a user object.

- `GET /api/articles/:article_id`: serves an article object.

- `PATCH /api/articles/:article_id`: accepts an object in the form `{ inc_votes: newVote }` and serves an article object with the updated number of votes.

- `POST /api/articles/:article_id/comments`: accepts a comment object in the form `{ username: username, body: body }`, adds the comment to the given `article_id` and serves the posted comment.

- `GET /api/articles/:article_id/comments`: serves an array of comments for the given `article_id`.

- `PATCH /api/comments/:comment_id`: accepts an object in the form `{ inc_votes: newVote }`, updates the votes on a comment and serves the updated comment.

- `DELETE /api/comments/:comment_id`: deletes the comment by the given `comment_id`.

## Testing

I used test-driven development to build the API and the utility functions that format the data before it is inserted into the databases.

All available endpoints on the API were tested using the following:

- [Jest](https://jestjs.io/en/) - Testing framework
- [Jest Sorted](https://www.npmjs.com/package/jest-sorted) - `jest.expect` extension package
- [Supertest](https://www.npmjs.com/package/supertest) - Assertion library for testing HTTP requests

To run the testing suite for the endpoints, run the following script:

```
npm test app
```

The utility functions were tested using [Jest](https://jestjs.io/en/). To run the testing suite for the utility functions, run the following script:

```
npm test utils
```

## Built With

- JavaScript/Node.js
- [Express](http://expressjs.com/) - Web framework
- [PostgreSQL](https://www.postgresql.org/docs/current/) - Database
- [Knex](http://knexjs.org/) - Migrations and query building
- [Heroku](https://heroku.com) - Hosting

## Author

Rosalyn Land | [Portfolio](https://rosa-lyn.github.io/)| [GitHub](https://github.com/Rosa-lyn) | [LinkedIn](https://linkedin.com/in/rosalynland)

## Acknowledgements

A big thank you to [Northcoders](https://github.com/northcoders) for providing the data for this project and to the Northcoders tutors for all their help and support.
