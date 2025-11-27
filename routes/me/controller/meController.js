const { sendTestEmail } = require("../../../utils/emailService");


exports.getMe = async (req, res, next) => {
    try {
        const randomCode = Math.floor(100000 + Math.random() * 900000);
        const toEmail = "ianaxelperezdelatorre@gmail.com";
        await sendTestEmail(toEmail, randomCode);
        res.status(200).json({ message: "Health", code: randomCode });
    } catch (error) {
        next(error);
    }
}