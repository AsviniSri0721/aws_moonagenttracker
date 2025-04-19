require('dotenv').config();
const cote = require('cote');
const nodemailer = require('nodemailer');



const responder = new cote.Responder({ name: 'notification-responder', key: 'notification' });

responder.on('sendNotification', async (req, cb) => {
    try {
        const { email, subject, message } = req;

        console.log("📩 Sending email to:", email);

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let info = await transporter.sendMail({
            from: `"Insurance Dekho" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: subject,
            text: message
        });

        console.log('✅ Email sent:', info.messageId);
        cb(null, { success: true, messageId: info.messageId });
    } catch (err) {
        console.error('❌ Email error:', err.message);
        cb({ error: 'Notification failed' });
    }
});
