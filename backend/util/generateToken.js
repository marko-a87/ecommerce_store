import jwt from "jsonwebtoken";

const generateToken = (res, userId, secret) => {
  let token = jwt.sign({ userId }, secret, {
    expiresIn: "1hr",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    strict: true,
    maxAge: 3600 * 1000,
  });
};

export { generateToken };
