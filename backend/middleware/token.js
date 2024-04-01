// Change the bcrypt import statement
const jwt=require('jsonwebtoken')

// Pass decoded payload to the next middleware or route handler in protect middleware
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            jwt.verify(token, process.env.Jwt_secret);
            next();
        } catch (error) {
            res.status(401).send("No token");
        }
    }
    if(!token){
        res.status(401).send("No TOken")
    }
};

module.exports = protect;
