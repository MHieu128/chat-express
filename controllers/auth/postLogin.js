const User = require('../../models/user');
const bcrypt = require('bcryptjs');

const postlogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username});

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = "JWT_TOKEN";

      return res.status(200).json({
        userDetails: {
          mail: user.mail,
          token: token,
          username: user.username
        }
      });
    }

    return res.status(400).send("Invalid credentials. Please try again!")
  } catch (err) {
    return res.status(500).send("Error occured. Please try again!")
  }
};

module.exports = postlogin