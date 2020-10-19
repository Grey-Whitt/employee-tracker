const connection = require("./utils/connection");
const {homePage} = require('./utils/inquirer')

//this gets everything started and fires up the connection
connection.connect(err => {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
  homePage()
});
