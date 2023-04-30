const nodemailer = require("nodemailer");
const googleApis = require("googleapis");
const REDIRECT_URI = `https://developers.google.com/oauthplayground`;
const CLIENT_ID = `967005603712-lc39237kgm5ghngpmhf5laepbffh3q2r.apps.googleusercontent.com`;
const CLIENT_SECRET = `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`;
const REFRESH_TOKEN = `1//04QhjDdfSrMCBCgYIARAAGAQSNwF-L9Ir-JDUbPEzKa0mvrevBbe3_vTx4DX2eL48sGHYuj8Ddy75_aws1Uia4_rmfbXW7BK0E94`;
const authClient = new googleApis.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET,
    REDIRECT_URI);
authClient.setCredentials({ refresh_token: REFRESH_TOKEN });
async function mailer(receiver , otp , userid) {
    try {
        const ACCESS_TOKEN = await authClient.getAccessToken();
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "nn.jain5272@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: ACCESS_TOKEN
            }
        })
        const details = {
            from: " Naman <nn.jain5272@gmail.com>",
            to: receiver,
            subject: "kuchh bhi likh do",
            text: "message text",
            html: `<h2>you can reset password via this link </h2> <a href = " http://localhost:3000/reset/password/${userid}/${otp}">http://localhost:3000/reset/password/${userid}/${otp}</a>`  
         }
        const result = await transport.sendMail(details);
        return result;
    }
    catch (err) {
        return err;
    }
}
 
module.exports = mailer;
