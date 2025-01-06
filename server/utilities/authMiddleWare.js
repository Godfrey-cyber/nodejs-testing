import jwt from 'jsonwebtoken'

export const authenticate = (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(" ")[1]

		if (!token) return res.status(401).json({ message: "Access token required" });
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
			if (error) return res.status(403).json({ message: error.message });
			req.userId = decoded.userId;
	    	next();
		})
	} catch (error) {
		return res.status(401).json({ msg: error.message })
	}
}