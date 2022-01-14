import { useState } from "react";
import Axios from "axios";

const Login = () => {
  const [Email, setEmail] = useState("");
  const [PassWord, setPassWord] = useState("");

  const users = {
    Id: Email,
    Pw: PassWord,
  };

  const onClickLogin = (e) => {
    e.preventDefault();
    console.log(Email, PassWord);
    Axios.post("/api/login", users).then((response) => {
      if (response.data) {
        alert("성공");
      } else {
        alert("실패");
      }
    });
  };

  const handleInputId = (e) => {
    setEmail(e.target.value);
  };
  const handleInputPw = (e) => {
    setPassWord(e.target.value);
  };

  return (
    <div>
      <h2>Login</h2>
      <div>
        <label htmlFor="input_id">ID : </label>
        <input
          type="text"
          name="input_id"
          value={Email}
          onChange={handleInputId}
        />
      </div>
      <div>
        <label htmlFor="input_pw">PW : </label>
        <input
          type="password"
          name="input_pw"
          value={PassWord}
          onChange={handleInputPw}
        />
      </div>
      <div>
        <button type="button" onClick={onClickLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
