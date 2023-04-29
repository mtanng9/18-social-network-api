const { User } = require("../models");

module.exports = {
// get all users
async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
},
// get one user by _id
async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' })
      }

      res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
},
// post a new user
async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
},
// update user by _id
async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        res.status(404).json({ message: 'No user with this id!' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
},
// delete user by _id
async deleteUser(req, res) {
    try {
        const user = await User.findOneAndRemove({ _id: req.params.userId });

        if (!user) {
        return res.status(404).json({ message: 'No such user exists' });
        }

        res.json({ message: 'User successfully deleted' });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
},
// post to add friend
async addFriend(req, res) {
    try {
        const user = await User.findOne({ _id: req.params.userId });

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }
        
        user.friends.push(req.params.friendId);
        user.save();

        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
},
// delete to remove friend
async deleteFriend(req, res) {
    try {
        const user = await User.findOne({ _id: req.params.userId });

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }
        
        user.friends = user.friends.filter(function(e) {return e != req.params.friendId});
        user.save();

        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
},
}