import { useState } from "react";
import Axios from "axios";

const Login = () => {
  const [PassWord, setPassWord] = useState("");
  const [Email, setEmail] = useState("");

  const user = {
    pw: PassWord,
    email: Email,
  };

  const onSubmitUser = (e) => {
    e.preventDefault();
    console.log(PassWord, Email);
    Axios.post("/api/user/Login", user).then((response) => {
      if (response.data) {
        alert("성공");
      } else {
        alert("실패");
      }
    });
  };

  const onPWChange = (e) => {
    setPassWord(e.target.value);
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <>
      <form onSubmit={onSubmitUser}>
        <br />
        <label>
          비밀번호
          <input type="text" onChange={onPWChange} />
        </label>
        <br />
        <label>
          이메일
          <input type="text" onChange={onEmailChange} />
        </label>
        <br />
        <button>로그인</button>
      </form>
    </>
  );
};

export default Login;
