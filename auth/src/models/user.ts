import mongoose from 'mongoose';
import { Password } from '../services/password';

// AN interface that describes the properties
// that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// AN interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// we must use function insted arrow function because of this context
// mongoose is old and has problem with async function
// and this is the main reason of using done
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    //first add password is tread as modified
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
    done();
  }
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// const user = User.build({
//   email: 'test@test.com',
//   password: 'password',
// });

export { User };
