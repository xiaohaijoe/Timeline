import fetch from './fetch'

const request = {

  // 账号登录
  accountLogin: (username, password, success, fail) => fetch('/api/account/login', {
    username: username,
    password: password,
  }, success, fail),

  // 检查token
  checkToken: (token, success, fail) => fetch('/api/account/checkToken', {
    token: token
  }, success, fail),

  getUserInfo: (token, success, fail) => fetch('/api/user/getUserInfo', {
    token: token
  }, success, fail),

  // 个人中心-获取专辑列表
  getUserAlbums: (token, success, fail) => fetch('/api/user/getUserAlbums', {
    token: token
  }, success, fail),

  getAlbumInfo: (albumId, success, fail) => fetch('/api/album/getAlbumInfo', {
    albumId: albumId
  }, success, fail)

};
export default request;
