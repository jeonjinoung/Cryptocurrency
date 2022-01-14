import { useState } from "react";
import Axios from "axios";

const AddUser = () => {
  const [Name, setName] = useState("");
  const [PassWord, setPassWord] = useState("");
  const [Email, setEmail] = useState("");

  const test = {
    name: Name,
    pw: PassWord,
    Email: Email,
  };

  const onSubmitUser = (e) => {
    e.preventDefault();
    console.log(Name, PassWord, Email);
    Axios.post("/api/addUser", test).then((response) => {
      if (response.data) {
        alert("성공");
      } else {
        alert("실패");
      }
    });
  };

  const onUserChange = (e) => {
    // console.log(e.target.value);
    setName(e.target.value);
    console.log(Name);
  };

  const onPWChange = (e) => {
    // console.log(e.target.value);
    setPassWord(e.target.value);
    console.log(PassWord);
  };

  const onEmailChange = (e) => {
    // console.log(e.target.value);
    setEmail(e.target.value);
    console.log(Email);
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
        <label>
          이메일
          <input type="text" onChange={onEmailChange} />
        </label>
        <br />
        <button>회원가입</button>
      </form>
    </>
  );
};

export default AddUser;
