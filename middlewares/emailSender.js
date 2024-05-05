
const nodemailer = require('nodemailer')
require('dotenv').config();
const passwordKey = process.env.PASS_KEY;


function sendWelcomeEmail(id, email, password) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'balstore.info@gmail.com',
            pass: passwordKey,
        },
        });
    
    const mailContent = {
        from: 'balstore.info@gmail.com',
        to: email,
        subject: 'Welcome to Our Website',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
            <h2 style="color: #333;">Welcome to Our Website!</h2>
            <p style="color: #555;">Thank you for signing up. Your account has been created successfully.</p>
            <p style="color: #555;">Now you can log in using your credentials:</p>
            <p style="color: #555;"><strong>Email:</strong> ${email}</p>
            <p style="color: #555;"><strong>Password:</strong> ${password}</p>
            <p style="color: #555;">Please do not share your login information with anyone.</p>
            <p style="color: #555;">Click <a href="https://e-commerce-project-backend-yec6.onrender.com/v1/customers/validate/${id}" style="color: #007BFF; text-decoration: none; font-weight: bold;">here</a> to log in to your account.</p>
            </div>
        `,
    };
    
        transporter.sendMail(mailContent, (err, info) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Email sent:', info.response);
        }
        });
}




function sendWelcomeEmailForUser(email, userName, password) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'balstore.info@gmail.com',
            pass: passwordKey,
        },
        });
    
        const mailContent = {
        from: 'balstore.info@gmail.com',
        to: email,
        subject: 'Welcome to Our Website',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
            <h2 style="color: #333;">Welcome to Our Website!</h2>
            <p style="color: #555;">Thank you for signing up. Your account has been created successfully.</p>
            <p style="color: #555;">Now you can log in using your credentials:</p>
            <p style="color: #555;"><strong>Username:</strong> ${userName}</p>
            <p style="color: #555;"><strong>Password:</strong> ${password}</p>
            <p style="color: #555;">Please do not share your login information with anyone.</p>
            </div>
        `,
        };
    
        transporter.sendMail(mailContent, (err, info) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Email sent:', info.response);
        }
        });
}
    



    // for reset passss =========================

    function sendResetEmail(email, resetToken) {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth:{
                user: 'balstore.info@gmail.com',
                pass: passwordKey
            }
        });
        const mailContent = {
            from: 'balstore.info@gmail.com',
            to: email,
            subject: 'Password Reset',
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; text-align: center;">
                <img src="https://res.cloudinary.com/dv9arhzij/image/upload/v1701472759/E-COMERCEimgs/e3nqz7pbbek2sdxs8r0c.png" alt="LOGO" style="max-width: 260px; height: auto;" />
                <h2 style="color: #333;">Password Reset</h2>
                <p style="color: #555;">You requested a password reset. Click the link below to reset your password:</p>
                <p style="color: #555; margin: 20px 0;">
                    <a href="https://e-commerce-project-back-office.vercel.app/reset-password/${resetToken}" style="color: #333; background-color: #f1e496; border-radius: 15px; padding: 15px 20px; text-decoration: none; font-weight: bold;">Reset Password</a>
                </p>
                <p style="color: #555;">You only got 5 minuts to reset your password.</p>
                <p style="color: #555;">If you didn't request a password reset, you can ignore this email.</p>
            </div>
        `,
            
        };
        transporter.sendMail(mailContent, (err, info) => {
            if (err) {
                console.error(err);
            } else { 
                console.log('Email sent:', info.response);
            }
        })
        }


        function sendResetEmailForCustommer(email, resetToken) {
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth:{
                    user: 'balstore.info@gmail.com',
                    pass: passwordKey
                }
            });
            const mailContent = {
                from: 'balstore.info@gmail.com',
                to: email,
                subject: 'Password Reset',
                html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; text-align: center;">
                    <img src="https://res.cloudinary.com/dv9arhzij/image/upload/v1701472759/E-COMERCEimgs/e3nqz7pbbek2sdxs8r0c.png" alt="LOGO" style="max-width: 260px; height: auto;" />
                    <h2 style="color: #333;">Password Reset</h2>
                    <p style="color: #555;">You requested a password reset. Click the link below to reset your password:</p>
                    <p style="color: #555; margin: 20px 0;">
                        <a href="http://localhost:5173/reset-password/${resetToken}" style="color: #333; background-color: #f1e496; border-radius: 15px; padding: 15px 20px; text-decoration: none; font-weight: bold;">Reset Password</a>
                    </p>
                    <p style="color: #555;">You only got 5 minuts to reset your password.</p>
                    <p style="color: #555;">If you didn't request a password reset, you can ignore this email.</p>
                </div>
            `,
                
            };
            transporter.sendMail(mailContent, (err, info) => {
                if (err) {
                    console.error(err);
                } else { 
                    console.log('Email sent:', info.response);
                }
            })
            }




    

module.exports = {
    sendWelcomeEmail:sendWelcomeEmail,
    sendWelcomeEmailForUser:sendWelcomeEmailForUser,
    sendResetEmail:sendResetEmail,
    sendResetEmailForCustommer:sendResetEmailForCustommer
};
