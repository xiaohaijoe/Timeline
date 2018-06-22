import fetch from './fetch'
const request = {

  getAlbumInfo : albumId => fetch('/api/album/getAlbumInfo',{
    albumId : albumId
  })
}
export default request;
