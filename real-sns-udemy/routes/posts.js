const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

// 投稿を作成
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        return res.status(200).json({savedPost});
    } catch (err) {
        return res.status(500).json({errMessage: err});
    };
});

// 投稿を更新
router.post("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({
                $set: req.body,
            });
            return res.status(200).json({message: "投稿の変更に成功しました。"})
        } else {
            return res.status(403).json({errMessage: "他の人の投稿を編集できません。"});
        };
        return res.status(200).json({});
    } catch (err) {
        return res.status(403).json({errMessage: err});
    };
});

// 投稿を更新
router.post("/:id/delete", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne({
                $set: req.body,
            });
            return res.status(200).json({message: "投稿の削除に成功しました。"})
        } else {
            return res.status(403).json({errMessage: "他の人の投稿を削除できません。"});
        };
        return res.status(200).json({});
    } catch (err) {
        return res.status(403).json({errMessage: err});
    };
});

// 投稿情報の取得
router.post("/:id/show", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json({
            post: post,
        });
    } catch (err) {
        return res.status(500).json({errMessage: err});
    };
});

// いいね機能
router.post("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // まだ投稿にいいねが押されていなかったら..
        if (!post.likes.includes(req.body.userId)) {
            // 相手のフォロワーに自分を含める
            await post.updateOne({
                $push: {
                    likes: req.body.userId,
                },
            });
            return res.status(200).json({message: "投稿にいいねを押しました"})
        } else {
            await post.updateOne({
                $pull: {
                    likes: req.body.userId,
                }
            });
            res.status(500).json({message: "投稿のいいねを解除しました。"});
        };
    } catch (err) {
        res.status(500).json({errMessage: err});
    };
});

// タイムラインの投稿を取得
router.post("/timeline/all", async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({
            userId: currentUser._id
        });
        // フォロワーの投稿内容をすべて取得
        const friendPost = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({userId: friendId});
            })
        );
        return res.status(200).json(userPosts.concat(...friendPost));
    } catch (err) {
        return res.status(500).json({errMessage: err});
    };
});

module.exports = router;