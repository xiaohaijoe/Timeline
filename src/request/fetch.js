import axios from 'axios'
import {requestUrl} from '../config/env'


let fetch = async function (url, data) {
  url = requestUrl + url;
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response =>{
        console.log(response)
        resolve(response)
      })
      .catch(response =>{
        console.log(response)
        reject(response)
      })
  });
}
export default fetch;
