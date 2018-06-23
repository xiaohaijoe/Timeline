import fetch from './fetch'
const request = {

  accountLogin : (username,password) => fetch('/api/account/login',{
    username : username,
    password : password,
  }),

  getAlbumInfo : albumId => fetch('/api/album/getAlbumInfo',{
    albumId : albumId
  })

}
export default request;
