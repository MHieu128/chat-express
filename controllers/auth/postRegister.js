const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const postRegister = async (req, res) => {
  try {
    const { username, mail, password } = req.body;
    const userMailExists = await User.exists({ mail: mail.toLowerCase() });
    const userNameExists = await User.exists({ username: username });
    let invalidMsg = "";

    if (userMailExists) {
      invalidMsg += "E-mail already in use! ";
    }

    if (userNameExists) {
      invalidMsg += "User name already in use! ";
    }

    if (invalidMsg != "") {
      return res.status(409).send(invalidMsg);
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      mail: mail.toLowerCase(),
      password: encryptedPassword,
    });

    const token = jwt.sign(
      {
        userId: user._id,
        username,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "24h",
      }
    );

    res.status(201).json({
      userDetails: {
        mail: user.mail,
        token: token,
        username: user.username,
      },
    });
  } catch (err) {
    return res.status(500).send("Error occured. Please try again!");
  }
};

module.exports = postRegister;
