var cron = require('node-cron');
const { sendBFSD } = require('../controllers/new.controller');
const { queryFlag_Generator } = require('./cdc.util');
const dateUtil = () => {

  function getPreviousDay(date = new Date()) {
    const previous = new Date(date.getTime());
    previous.setDate(date.getDate() - 1);

    return previous;
  }

  getPreviousDay()
  console.log(getPreviousDay());

  const ydayDate = () => {
    const dateField = getPreviousDay();
    const year = dateField.getFullYear();
    const month = dateField.getMonth() + 1;
    const datee = dateField.getDate();
    const day = dateField.getDay();
    return `${datee}-${month}-${year}`
  }

  return {
    ydayDate: ydayDate
  }

}





/**Cron_Job Runs for every 20 minutes */
// const job = cron.schedule("*/40 * * * *", async () => {
//   console.log(new Date().toLocaleString());
//   // console.log('This is the Block First')
//   //   sendBFSD()


// });

// const job1 = cron.schedule("0 10 5 * * *", () => {
//   console.log(new Date().toLocaleString());
//   console.log('This is the Block')
//   sendBFSD()
// });


module.exports = { dateUtil }