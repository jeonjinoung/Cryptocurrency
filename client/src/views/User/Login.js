import { useState } from "react";
import Axios from "axios";

const Login = () => {
  const [PassWord, setPassWord] = useState("");
  const [Email, setEmail] = useState("");

  const id = {
    pw: PassWord,
    email: Email,
  };

  console.log(id);
  const onSubmitUser = (e) => {
    e.preventDefault();
    console.log(PassWord, Email);
    Axios.post("/api/Login", id).then((response) => {
      console.log(4444444444444444444444);
      console.log(response.data);
      console.log(3333333333333333333333333);
      console.log(id);
      if (response.data) {
        alert("성공");
      } else {
        alert("실패");
      }
    });
  };

  const onPWChange = (e) => {
    setPassWord(e.target.value);
    console.log(PassWord);
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);
    console.log(Email);
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
