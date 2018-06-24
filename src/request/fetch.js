import axios from 'axios'
import {requestUrl} from '../config/env'


let fetch = function (url, data,success,fail,error) {
  url = requestUrl + url;
  axios.post(url, data)
    .then(response => {
      let data = response.data;
      console.log(data);
      if(data.err === 0){
        success(data)
      }else{
        fail(data)
      }
    })
    .catch(response => {
      console.log(response);
      error(response)
    })
};

export default fetch;
