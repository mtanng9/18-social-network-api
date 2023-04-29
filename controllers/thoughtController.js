const { Thought, User } = require("../models");

module.exports = {
// get all thoughts
async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
},
// get one thought by _id
async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
},
// post a new thought and push id to users thoughts array
async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);

      const user = await User.findOne({ _id: req.body.userId });

      if (!user) {
          return res.status(404).json({ message: 'No user with that ID' });
      }
      
      user.thoughts.push(thought._id);
      user.save();

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
},
// update thought by _id
async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
},
// delete thought by _id
async deleteThought(req, res) {
    try {
        const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

        if (!thought) {
        return res.status(404).json({ message: 'No such thought exists' });
        }

        res.json({ message: 'Thought successfully deleted' });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
},
// post to add friend
async addReaction(req, res) {
    try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId });

        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' });
        }
        
        thought.reactions.push(req.body);
        thought.save();

        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
},
// delete to remove friend
async deleteReaction(req, res) {
    try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId });

        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' });
        }
        
        thought.reactions = thought.reactions.filter(function(e) {return e._id != req.params.reactionId});
        thought.save();

        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
},
}