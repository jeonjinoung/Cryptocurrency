import { useState } from "react";
import Axios from "axios";

const Login = () => {
  const [inputId, setInputId] = useState("");
  const [inputPw, setInputPw] = useState("");

  const test = {
    Id: inputId,
    Pw: inputPw,
  };

  const onClickLogin = (e) => {
    e.preventDefault();
    console.log(inputId, inputPw);
    Axios.post("/api/login", test).then((response) => {
      if (response.data) {
        alert("성공");
      } else {
        alert("실패");
      }
    });
  };

  const handleInputId = (e) => {
    setInputId(e.target.value);
  };
  const handleInputPw = (e) => {
    setInputPw(e.target.value);
  };

  return (
    <div>
      <h2>Login</h2>
      <div>
        <label htmlFor="input_id">ID : </label>
        <input
          type="text"
          name="input_id"
          value={inputId}
          onChange={handleInputId}
        />
      </div>
      <div>
        <label htmlFor="input_pw">PW : </label>
        <input
          type="password"
          name="input_pw"
          value={inputPw}
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
