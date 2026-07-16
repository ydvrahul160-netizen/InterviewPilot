import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies);
    console.log("Token:", req.cookies.token);
    let { token } = req.cookies;
    if (!token) {
      return res.status(400).json({ message: "user does not have token" });
    }
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Verified Token:", verifyToken);
    if (!verifyToken) {
      return res
        .status(400)
        .json({ message: "user does not have a valid token" });
    }
    req.userId = verifyToken.userId;
    next();
  } catch (error) {
    return res.status(500).json({ message: `isAuth error ${error}` });
  }
};

export default isAuth;
