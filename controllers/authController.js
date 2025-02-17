const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // Ganti dari 465 ke 587
    secure: false, // false untuk TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    }
});

exports.register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        console.log(req.body);

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        User.create({ name, email, password: hashedPassword, verificationCode }, (err, user) => {
            if (err) return res.status(500).json({ error: err.message });

            transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Email Verification',
                text: `Your verification code is ${verificationCode}`
            });

            res.status(201).json({ message: 'User registered. Check your email for verification code' });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.verifyEmail = (req, res) => {
    const { code } = req.body;

    User.findOne(code, (err, user) => {
        console.log(code);
        console.log(user);
        if (!user) return res.status(400).json({ message: 'Invalid code' });

        User.verifyEmail(user.email, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Email verified successfully' });
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, async (err, user) => {
        if (!user || !(await bcrypt.compare(password, user.password)))
            return res.status(400).json({ message: 'Invalid credentials' });

        if (!user.isVerif) return res.status(400).json({ message: 'Email not verified' });

        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
            status: 200,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isVerif: user.isVerif
            }
        });
    });
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        User.findByEmail(email, async (err, user) => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const newPassword = generateRandomPassword();

            // Hash the new password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            // Update user's password in the database
            User.updatePassword(email, hashedPassword, async (err, user) => {
                transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Your New Password',
                    text: `Your new password is ${newPassword}`
                });

                res.status(200).json({ message: 'New password has been sent to your email' });
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

function generateRandomPassword() {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    let password = '';

    for (let i = 0; i < 5; i++) {
        password += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    for (let i = 0; i < 3; i++) {
        password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    return password;
}
