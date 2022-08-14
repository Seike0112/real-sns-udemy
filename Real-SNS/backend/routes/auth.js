const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// ユーザー登録
router.post("/register", async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    // 登録データ
    const newUser = await new User({
      username: username,
      email: email,
      password: password,
    });

    const user = await newUser.save();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ errMessage: err });
  }
});

// ログイン
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ errMessage: "ユーザーが見つかりません。" });
    }

    // ハッシュのでクリプトに成功しているか判断
    const vailedPassword = req.body.password === user.password;
    if (!vailedPassword) {
      return res.status(400).json({ errMessage: "パスワードが違います。" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
