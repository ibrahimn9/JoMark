const jwt = require("jsonwebtoken");

const createToken = (payload) =>
	jwt.sign(
		{ userId: payload[0], isSeller: payload[1] },
		process.env.JWT_SECRET_KEY,
	);

module.exports = createToken;