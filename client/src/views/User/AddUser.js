import { useState } from "react";
import Axios from "axios";

const AddUser = () => {
  const [Name, setName] = useState("");
  const [PassWord, setPassWord] = useState("");
  const [Email, setEmail] = useState("");
  const [Age, setAge] = useState("");

  const user = {
    name: Name,
    pw: PassWord,
    email: Email,
    age: Age,
  };

  const onSubmitUser = (e) => {
    e.preventDefault();
    console.log(Name, PassWord, Email, Age);
    Axios.post("/api/addUser", user).then((response) => {
      if (response.data) {
        alert("성공");
      } else {
        alert("실패");
      }
    });
  };

  const onUserChange = (e) => {
    setName(e.target.value);
    console.log(Name);
  };

  const onPWChange = (e) => {
    setPassWord(e.target.value);
    console.log(PassWord);
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);
    console.log(Email);
  };
  const onAgeChange = (e) => {
    setAge(e.target.value);
    console.log(Age);
  };

  return (
    <>
      <form onSubmit={onSubmitUser}>
        <label>
          이름
          <input type="text" onChange={onUserChange} />
        </label>
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
        <label>
          나이
          <input type="text" onChange={onAgeChange} />
        </label>
        <br />
        <button>회원가입</button>
      </form>
    </>
  );
};

export default AddUser;
