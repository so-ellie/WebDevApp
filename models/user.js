// Object oriented files for User model

class User {
  //constructor is doing decomposed assignment
  constructor({ id, email, fullName, passwordHash, createdAt }) {
    this.id = id;
    this.email = email;
    this.fullName = fullName;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt;
  }
}

module.exports = User;
