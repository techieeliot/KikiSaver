const { con } = require('./db')
const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = (req, res) => {
  con.query(resetQuery(req.body.email), (err, results, fields) => {
    if (err) {
      console.log(err)
    } else if (results) {
      const link = `http://localhost:3001/changePass/${results[1][0].reset_key}`;
      const msg = {
        to: req.body.email,
        from: 'kiki@mscode.dev',
        subject: 'Password Reset',
        text: `Here is your password reset link: ${link}`,
        html: `<p>Here is your password reset link: ${link}</p>`,
      };
      //sgMail.send(msg);
      console.log(`http://localhost:3001/changePass/${results[1][0].reset_key}`)
      res.status(200).send('Ok')
    }
    
  })
}

const randNum = () => {
  return Math.floor(Math.random() * Math.pow(10, 16))
}

const resetQuery = username => {
  return `insert into user_resets (user_id, created_at, reset_key) values ((select id from users where username='${username}'), now(), '${randNum()}'); select * from user_resets where id=(select LAST_INSERT_ID())`
}

module.exports = { sendMail }
