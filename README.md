# CSV Schema
Analyzes a CSV file and generates database table schema, all within the browser

[![screenshot of application](http://i.imgur.com/jfGmGMM.png)](https://csv-schema.surge.sh)

This application parses CSV files (including huge ones)
within the browser. It analyzes each field to suggest the best database field type, max length,
and whether or not there are any `null` values. From there, you can rename fields, ignore them,
override field types/lengths, etc. and generate database table creation sql for MySQL, MariaDB,
Postres, Oracle, or SQLite3.

## Development
* Install dependencies using `npm install`
* Run a development server using `npm start`
* Run linter and tests using `npm test`
* Run a production build using `npm run build`
* Deploy the application to [surge](https://surge.sh) using `npm run deploy`

This application uses [PapaParse](http://papaparse.com/) for CSV parsing and
[Knex.js](http://knexjs.org/) for SQL query building.
