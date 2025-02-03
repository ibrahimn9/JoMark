const createToken = require("../utils/createToken.js");
const ApiError = require("../utils/ApiError.js");
const asyncHandler = require("express-async-handler");
const Seller = require("../model/seller.model.js");
const Buyer = require("../model/buyer.model.js");
const Store_category = require("../model/store_category_association.model.js");
const Store = require("../model/store.model.js");
const nodemailer = require("nodemailer");
const config = require("../utils/config.js");
const redis = require("redis");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Category = require("../model/categories.model.js");

const sendEmailVerification = asyncHandler(async (req, res, next) => {
  const { email, fullName } = await req.body;
  const transporter = nodemailer.createTransport({
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT, // if secure false port will be 587 , if true port will be 465
    secure: true, // true for 465, false for other ports
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // reject
    },
  });
  let confirmationCode = Math.floor(Math.random() * 90000) + 10000;
  const client = redis.createClient({ url: "redis://127.0.0.1:6379" });
  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();
  await client.set(email, confirmationCode,{EX:600});
  // 2) Define email Options (like : from, to, subject,email content)
  const emailOptions = {
    from: `JoMark < ${config.EMAIL_USER} >`,
    to: email,
    subject: `email confirmation`,
    html: `<p>Dear ${fullName.toUpperCase()}</p>
            <p>Thank you for signing up for JoMark Before you can start using our service, we need to confirm your email address. </p>
            <p>Please enter the following confirmation code in the appropriate field on our JoMark</p>
            <h3>${confirmationCode}</h3>
            <p>If you did not sign up for JoMark please disregard this email</p>
            <p>Thank you for choosing JoMark!</p>
            <p>Best regards,</p>`,
  };
  // 3) send email
  await transporter.sendMail(emailOptions);
  await client.disconnect();
  return res
    .status(200)
    .json({ success: true, message: "code confirmation was sent." });
});

const sendEmailOfForgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = await req.body;
  const [[exist1]] = await Seller.findByEmail(email);
  const [[exist2]] = await Buyer.findByEmail(email);

  if (!exist1 && !exist2) {
    return next(new ApiError("email not exist", 401));
  }
  const user = (await exist1) || exist2;
  const transporter = nodemailer.createTransport({
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT, // if secure false port will be 587 , if true port will be 465
    secure: true, // true for 465, false for other ports
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // reject
    },
  });
  let confirmationCode = Math.floor(Math.random() * 90000) + 10000;
  const client = redis.createClient({ url: "redis://127.0.0.1:6379" });
  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();
  await client.set(email, confirmationCode,{EX:600});
  // 2) Define email Options (like : from, to, subject,email content)
  const emailOptions = {
    from: `JoMark < ${config.EMAIL_USER} >`,
    to: email,
    subject: `Forgot password`,
    html: `<p>Dear ${user.fullName.toUpperCase()}</p>
            <p>Before you can change your password, we need to confirm your email address. </p>
            <p>Please enter the following confirmation code in the appropriate field on our JoMark</p>
            <h3>${confirmationCode}</h3>
            <p>Thank you for choosing JoMark!</p>
            <p>Best regards,</p>`,
  };
  // 3) send email
  await transporter.sendMail(emailOptions);
  await client.disconnect();
  return res
    .status(200)
    .json({ success: true, message: "code confirmation was sent." });
});

const SignUp = asyncHandler(async (req, res, next) => {
  const {
    fullName,
    email,
    password,
    phoneNumber,
    address,
    storeName,
    storeSlogan,
    isSeller,
    storePic,
    categories,
    longitude,
    latitude,
  } = await req.body;
  let user;
  if (isSeller) {
    user = new Seller(
      fullName || null,
      email || null,
      password || null,
      phoneNumber || null
    );
    const id = await user.save();
    const store = new Store(
      storeName || null,
      storePic || null,
      storeSlogan || null,
      id,
      address || null,
      longitude || null,
      latitude || null
    );
    const storeId = await store.save();
    if (categories?.length) {
      const categoryData = categories.map((categoryId) => ({
        storeId,
        categoryId,
      }));
      await Store_category.saveMany(categoryData);
    }
    user.storeName = await storeName;
    user.storePic = await storePic;
    user.storeSlogan = await storeSlogan;
  } else {
    user = new Buyer(
      fullName || null,
      email || null,
      password || null,
      phoneNumber || null
    );
    await user.save();
  }
  return res.status(201).json({
    success: true,
    message: "User registered successfully.",
    data: [user],
  });
});

const confirmation = asyncHandler(async (req, res, next) => {
  const { code, email } = await req.body;
  const client = redis.createClient({ url: "redis://127.0.0.1:6379" });
  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();
  let confirmationCode = await client.get(email);
  const valid = (await code) === confirmationCode;
  if (!valid) {
    return next(new ApiError("Invalid code", 400));
  } else {
    await client.del(email);
    await client.disconnect();
    return res
      .status(200)
      .json({ success: true, message: "code verification verified" });
  }
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = await req.body;
  let isSeller;
  let userData; // Variable to hold user data
  // Search for buyer
  const [[buyer]] = await Buyer.findByEmail(email);
  if (buyer) {
    userData = await buyer;
    isSeller = false;
  } else {
    // Search for seller
    const [[seller]] = await Seller.findByEmail(email);
    userData = await seller;
    if (!userData || !(await bcrypt.compare(password, userData.password))) {
      return next(new ApiError("Invalid email or password", 400));
    }
    const [[store]] = await Store.findBySellerId(userData.id);
    userData.store = await store;
    const [categories] = await Category.findByStoreId(store.id);
    userData.store.categories = await categories.map((cat) => cat.id);
    userData.email = await email
    isSeller = true;
  }
  // Compare The password With The hashed Password In Database
  if (!userData || !(await bcrypt.compare(password, userData.password))) {
    return next(new ApiError("Invalid email or password", 400));
  }
  const token = createToken([userData.id, isSeller]);
  let data = await userData;
  data.isSeller = isSeller;
  return res
    .status(200)
    .json({ success: true, message: "Logged in successfully", data, token });
});

const setNewPw = asyncHandler(async (req, res, next) => {
  const { email, newPassword } = await req.body;
  const [[exist1]] = await Seller.findByEmail(email);
  if (!exist1) {
    const [[exist2]] = await Buyer.findByEmail(email);
    if (!exist2) {
      return next(new ApiError("email not exist", 401));
    }
    await Buyer.updatePassword(newPassword, exist2.id);
  } else {
    await Seller.updatePassword(newPassword, exist1.id);
  }
  return res
    .status(200)
    .json({ message: "password was changed successfully " });
});

const protect = asyncHandler(async (req, res, next) => {
  // 1) check if token exist
  const token = await req.header("Authorization")?.split(" ")[1];
  if (!token)
    return next(
      new ApiError(
        "You are not log in , Please log in to access to this route ",
        400
      )
    );

  const decoded = jwt.verify(token, config.JWT_SECRET_KEY);

  if (!decoded) {
    new ApiError(
      "You are not log in , Please log in to access to this route ",
      400
    );
  }

  const isSeller = await decoded.isSeller;
  if (isSeller) {
    user = await Seller.findById(decoded.userId);
  } else {
    user = await Buyer.findById(decoded.userId);
  }
  if (!user) {
    return next(
      new ApiError(
        "The user that belong to this token has no longer exist ",
        400
      )
    );
  }
  req.isSeller = await isSeller;
  req.userId = await decoded.userId;
  next();
});

const verifyIfEmailExist = asyncHandler(async (req,res,next) => {
  const {email} = req.body;
  const [[seller]] = await Seller.findByEmail(email);
  if(seller){
    return res.status(200).json({
      message:true,
      role:"seller"
    });
  }else{
    const [[buyer]] = await Buyer.findByEmail(email);
    if(buyer){
      return res.status(200).json({
        message:true,
        role:"buyer"
      });
    }else{
      return res.status(200).json({
        message:false
      });
    }
  }
});

module.exports = {
  login,
  sendEmailVerification,
  SignUp,
  confirmation,
  sendEmailOfForgotPassword,
  setNewPw,
  protect,
  verifyIfEmailExist,
};
