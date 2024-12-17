const user = require('../modules/userModel')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {

    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(401).json({
            message: "All fields are required",
            success: false
        })
    }

    const findUser = await user.findOne({ email });
    if (findUser) {
        return res.status(401).json({
            message: "This email id already exits",
            success: false
        })
    }

    const hashPassword = await bcryptjs.hash(password, 16)

    await user.create({
        fullName,
        email,
        password: hashPassword
    })
    return res.status(201).json({
        message: "User created successfully",
        success: true
    })
}



const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({
                message: "All fields are required",
                success: false
            })
        }

        const userFind = await user.findOne({ email })

        if (!userFind) {
            return res.status(401).json({
                message: "Invalid credential",
                success: false
            })
        }

        const isPassword = await bcryptjs.compare(password, userFind.password)
        if (!isPassword) {
            return res.status(401).json({
                message: "Invalid credential",
                success: false
            })
        }

        const token = jwt.sign(
            { userId: userFind._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const userData = {
            id: userFind._id,
            fullName: userFind.fullName
        };


        const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

        return res.status(201).cookie('token', token, { httpOnly: true, expires: expiryDate }).json({
            message: `Welcome to ${userFind.fullName}`,
            userData,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

const logout = (req, res) => {
    return res.status(200).cookie('token', '', {
        expires: 0
    }).json({
        message: "Logout Successfully",
        success: true
    });
}

module.exports = { register, login, logout }