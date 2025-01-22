const mailgen = require("mailgen");
const PORT = process.env.PORT || 4000;
const HOST = process.env.APP_URL || "pharmacy.APP";
async function generatePasswordResetMail(token, firstname, lastname) {
  let mailGenerator = new mailgen({
    theme: "default",
    product: {
      // FIXME: EDIT NAME AND LINK
      name: "pharmacy app",
      link: `https://${HOST}/`,
    },
  });
  // TODO: add anther content
  let response = {
    body: {
      name: `${firstname} ${lastname}`,
      intro:
        "You have received this email because a password reset request for your account was received.",
      action: {
        instructions: "Click the button below to reset your password:",
        button: {
          color: "#DC4D2F",
          text: "Reset your password",
          // FIXME: EDIT DOMAIN LINK
          link: `http://${HOST}/user/reset-password/${token}`,
        },
      },
      // todo
      outro:
        "If you did not request a password reset, no further action is required on your part.",
    },
  };
  let mail = mailGenerator.generate(response);
  return mail;
}
async function generateVerifyMail(token, firstname, lastname) {
  let mailGenerator = new mailgen({
    theme: "default",
    product: {
      // FIXME: EDIT NAME AND LINK
      name: "pharmacy app	",
      link: `https://${HOST}/`,
      // logo: "https://avatars.githubusercontent.com/u/102463841?v=4",
    },
  });
  // TODO: add anther content
  let response = {
    body: {
      signature: "Sincerely",
      name: `${firstname} ${lastname}`,
      intro:
        "You have received this to verify your email address. <br> please NOTE: (if you didn't verify the email during 30 days, User account will be deleted).<br> if that happened you can create a new user",
      action: {
        instructions: "Click the button below to verify your email:",
        button: {
          color: "#4285F4",
          text: "verify your email",
          // FIXME: EDIT DOMAIN LINK

          link: `http://${HOST}/user/Email-verification/${token}`,
        },
      },
      // todo
      outro:
        "If you did not try to register , no further action is required on your part",
    },
  };
  let mail = mailGenerator.generate(response);
  return mail;
}
async function generateVerifyMailForPharmacy(token, name) {
  let mailGenerator = new mailgen({
    theme: "default",
    product: {
      // FIXME: EDIT NAME AND LINK
      name: "pharmacy app",
      link: `https://${HOST}/`,
    },
  });
  // TODO: add anther content
  let response = {
    body: {
      name: `${name} pharmacy`,
      intro:
        "You have received this to verify your pharmacy's email address. <br> please NOTE: (if you didn't verify the email during 20 days, your pharmacy will be deleted).<br> if that happened you can create a new pharmacy",
      action: {
        instructions: "Click the button below to verify your pharmacy's email:",
        button: {
          color: "#074799",
          text: "verify your email",
          // FIXME: EDIT DOMAIN LINK

          link: `http://${HOST}/pharmacy/Email-verification/${token}`,
        },
      },
      // todo
      outro:
        "If you did not try to verify your pharmacy's email , no further action is required on your part",
    },
  };
  let mail = mailGenerator.generate(response);
  return mail;
}
module.exports = {
  generatePasswordResetMail,
  generateVerifyMail,
  generateVerifyMailForPharmacy,
};
