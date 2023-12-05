const baseUrl = "/api/v1/";
const endPoints = {
  playList: "/playlist",
  posts: "/posts",
  users: "/users",
  login: "/login",
  registerUser: "/register",
  requestResetPassword: "/request/reset/password",
  verifyCode: "/verify/code",
  resetPassword: "/reset/password",
  verifyEmail: "/verify/email",
  verifyEmailSuccess: "/verify/email/success",
  likePost: "/like/posts",
  commentPost: "/comment/posts",
};

module.exports = {
  baseUrl,
  endPoints,
};
