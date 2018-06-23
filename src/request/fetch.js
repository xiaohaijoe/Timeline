import axios from 'axios'
import {requestUrl} from '../config/env'


let fetch = async function (url, data) {
  url = requestUrl + url;
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response =>{
        let data = response.data;
        console.log(data);
        resolve(data)
      })
      .catch(response =>{
        console.log(response)
        reject(response)
      })
  });
};

export default fetch;
