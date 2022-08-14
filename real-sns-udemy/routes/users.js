const router = require("express").Router();
const User = require("../models/User");

// CRUD
// ユーザー情報の更新
router.post("/:id/update", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json({
        message: "ユーザー情報が更新されました。",
      });
    } catch (err) {
      return res.status(500).json({ errMessage: err });
    }
  } else {
    return res.status(403).json({ errMessage: "アカウント情報が異なります。" });
  }
});

// ユーザー情報の削除
router.post("/:id/delete", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json({
        message: "ユーザー情報が削除されました。",
      });
    } catch (err) {
      return res.status(500).json({ errMessage: err });
    }
  } else {
    return res.status(403).json({ errMessage: "アカウント情報が異なります。" });
  }
});

// ユーザー情報の取得
router.post("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // 余分なパスワードと更新時間を排除
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json({
      user: other,
    });
  } catch (err) {
    return res.status(500).json({ errMessage: err });
  }
});

// ユーザーのフォロー
router.post("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      // フォロワーに自分がいるのか確認する
      if (!user.followers.includes(req.body.userId)) {
        // 相手のフォロワーに自分を含める
        await user.updateOne({
          $push: {
            followers: req.body.userId,
          },
        });
        // 自分のフォローに相手を含める
        await currentUser.updateOne({
          $push: {
            followings: req.params.id,
          },
        });
        return res
          .status(200)
          .json({ message: `${user.username}さんのフォローに成功しました` });
      } else {
        res.status(500).json({ errMessage: "すでにフォローしています。" });
      }
    } catch (err) {
      res.status(500).json({ errMessage: err });
    }
  } else {
    return res
      .status(500)
      .json({ errMessage: "自分自身をフォローできません。" });
  }
});

// ユーザーのフォロー解除
router.post("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      // フォロワーに自分がいるのか確認する
      if (user.followers.includes(req.body.userId)) {
        // 相手のフォロワーに自分を含める
        await user.updateOne({
          $pull: {
            followers: req.body.userId,
          },
        });
        // 自分のフォローに相手を含める
        await currentUser.updateOne({
          $pull: {
            followings: req.params.id,
          },
        });
        return res
          .status(200)
          .json({ message: `${user.username}さんのフォローを解除しました` });
      } else {
        res
          .status(500)
          .json({ errMessage: "すでにこのユーザーをフォロー解除しています。" });
      }
    } catch (err) {
      res.status(500).json({ errMessage: err });
    }
  } else {
    return res
      .status(500)
      .json({ errMessage: "自分自身をフォローできません。" });
  }
});

module.exports = router;
