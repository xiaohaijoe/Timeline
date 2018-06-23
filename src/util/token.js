

const Token = {
  getToken : ()=>{
    let token = localStorage.getItem("token");
    return token === null ? "" : token
  },
  setToken : (token)=>{
    localStorage.setItem("token",token);
    return token
  }
};
export default Token;
