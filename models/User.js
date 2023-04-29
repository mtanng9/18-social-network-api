const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(v) {
          return /^([a-zA-Z0-9_\.-]+)@([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,6})$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
      },
    },
    thoughts: [      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      },
    ],
    friends: [      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

userSchema.virtual('friendCount')
    .get(function () {
        return this.friends.length;
});

const User = model('user', userSchema);

module.exports = User;
