// src/config/nodemailer.ts

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "onepiecemonkeydluffy20@gmail.com",
    pass: "buxkfckbonrclkvy",
  },
});

export default transporter;
