import nodemailer from "nodemailer";

export const sendResetCodeMail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });

  await transporter.sendMail({
    from: `"ViewPrice" <${process.env.USER_EMAIL}>`,
    to: email,
    subject: "Password Reset Code",
    html: `
      <h2>Password Reset</h2>
      <p>Your password reset code is:</p>
      <h1 style="letter-spacing:5px">${code}</h1>
      <p>This code expires in 10 minutes.</p>
    `,
  });
};

  