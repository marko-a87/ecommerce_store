import nodemailer from "nodemailer";
import { google } from "googleapis";

const sendEmail = async (email, product, quantity) => {
  try {
    const username = process.env.OAUTH2_USER;
    const password = process.env.OAUTH2_PASS;
    const clientID = process.env.OAUTH2_CLIENT_ID;
    const clientSecret = process.env.OAUTH2_CLIENT_SECRET;
    const refreshToken = process.env.OAUTH2_REFRESH_TOKEN;
    const redirectURI = process.env.OAUTH2_REDIRECT_URI;
    const oAuth2Client = new google.auth.OAuth2(
      clientID,
      clientSecret,
      redirectURI
    );
    oAuth2Client.setCredentials({ refresh_token: refreshToken });
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        type: "OAuth2",
        user: username,
        password: password,
        clientId: clientID,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        accessToken: accessToken,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: `${process.env.EMAIL}`,
      to: email,
      subject: "You have ordered the product",
      text:
        "Thank you for purchasing from our store. You have received: " +
        product.name +
        ". " +
        "The quantity is: " +
        quantity +
        " ." +
        "The price of the product is : " +
        product.price +
        ". " +
        "The size of the product is: " +
        product.size +
        ".",
    };

    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent successfully");
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export { sendEmail };
