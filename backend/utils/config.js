require("dotenv").config();

const PORT = process.env.PORT;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const EMAIL_HOST = process.env.EMAIL_HOST
const EMAIL_PORT = process.env.EMAIL_PORT
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD
const NODE_ENV = process.env.NODE_ENV
const HASH_NUMBER = process.env.HASH_NUMBER
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const REDIS_PORT = process.env.REDIS_PORT
const REDIS_HOST = process.env.REDIS_HOST
const apiKey = process.env.apiKey
const authDomain = process.env.authDomain
const projectId = process.env.projectId
const storageBucket = process.env.storageBucket
const messagingSenderId = process.env.messagingSenderId
const appId = process.env.appId
const measurementId = process.env.measurementId
const firebaseLink = process.env.firebaseLink
module.exports ={
    PORT,DB_HOST,DB_NAME,DB_PASSWORD,DB_USER,NODE_ENV,HASH_NUMBER,JWT_SECRET_KEY,REDIS_HOST,REDIS_PORT,EMAIL_HOST,EMAIL_PORT,EMAIL_USER,EMAIL_PASSWORD,apiKey,authDomain,projectId,storageBucket,messagingSenderId,appId,measurementId,firebaseLink
}