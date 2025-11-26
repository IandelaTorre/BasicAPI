

exports.getMe = async (req, res, next) => {
    try {
        res.status(200).json({ message: "Health" })
    } catch (error) {
        next(error);
    }
}