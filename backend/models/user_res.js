class UserRes {
  constructor(user) {
    this._id = user._id;
    this.email = user.email;
    this.username = user.username;
    this.imageUrl = user.imageUrl;
  }
}

export default UserRes;
