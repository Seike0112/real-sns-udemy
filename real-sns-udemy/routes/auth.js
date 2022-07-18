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
        return res.status(500).json({errMessage: err});
    };
});

// ログイン
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(404).json({errMessage: "ユーザーが見つかりません。"});
        };

        // ハッシュのでクリプトに成功しているか判断
        const vailedPassword = req.body.password === user.password;
        if (!vailedPassword) {
            return res.status(400).json({errMessage: "パスワードが違います。"});
        };

        return res.status(200).json({user});
    } catch (err) {
        return res.status(500).json(err);
    }
});

// ログイン機能(カリキュラム外の為、コメントアウト)
// router.post("/login", async (req, res) => {
//     try {
//         const user = await User.findOne({
//             email: req.body.email
//         });

//         //ID,PW取得
//         const email = req.body.email;
//         const password = req.body.password;

//         if (email === user.email && password === user.password) {
//             //token生成（フォマットは適当だが、有効期限を設定）
//             const token = jwt.sign({ email: email }, 'secret');
//             res.status(200).json({
//                 token: token
//             });
//         } else {
//             res.status(404).json({
//                 error: "auth error"
//             });
//         };

//     } catch (err) {
//         return res.status(500).json(err);
//     };
// });

// トークン認証APIカリキュラム外の為、コメントアウト
// router.post('/protected', async (req, res) => {
//     try {
//         const authHeader = req.headers["authorization"];

//         if (authHeader !== undefined) {
//             const bearer = await authHeader.split(' ');
//             const token = await bearer[0];
//             const user = await jwt.verify(token, 'secret');
//             res.status(200).json({ user });
//         } else {
//             res.status(404).json({error: "Authorizationヘッダーが見つかりません。"})
//         };

//         const user = await User.findOne({
//             email: req.body.email
//         });

module.exports = router;