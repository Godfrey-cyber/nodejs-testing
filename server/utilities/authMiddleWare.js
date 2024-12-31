import jwt from 'jsonwebtoken'

export const authenticate = (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1]

	if (!token) return res.status(401).json({ message: "Access token required" });
	jwt.verify(token. process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
		if (err) return res.status(403).json({ message: "Invalid token" });
		req.userId = decoded.userId;
    	next();
	})
}