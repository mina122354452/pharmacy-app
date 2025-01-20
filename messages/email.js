const mailgen = require("mailgen");
async function generatePasswordResetMail(token, firstname, lastname) {
  let mailGenerator = new mailgen({
    theme: "default",
    product: {
      // FIXME: EDIT NAME AND LINK
      name: "pharmacy app",
      link: "https://pharmacy.com/",
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
          link: `http://localhost:4000/api/user/reset-password/${token}`,
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
      name: "pharmacy app",
      link: "https://pharmacy.com/",
    },
  });
  // TODO: add anther content
  let response = {
    body: {
      name: `${firstname} ${lastname}`,
      intro: "You have received this to verify your email address",
      action: {
        instructions: "Click the button below to verify your email:",
        button: {
          color: "#4285F4",
          text: "verify your email",
          // FIXME: EDIT DOMAIN LINK
          link: `http://localhost:4000/api/user/Email-verification/${token}`,
        },
      },
      // todo
      outro:
        "If you did not try to register,no further action is required on your part",
    },
  };
  let mail = mailGenerator.generate(response);
  return mail;
}

module.exports = {
  generatePasswordResetMail,
  generateVerifyMail,
};
