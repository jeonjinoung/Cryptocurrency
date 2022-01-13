import { useState } from "react";
import Axios from "axios";

const AddUser = () => {
  const [User, setUser] = useState("");
  const [PassWord, setPassWord] = useState("");
  const [Email, setEmail] = useState("");

  const test = {
    id: User,
    pw: PassWord,
    email: Email,
  };

  const onSubmitUser = (e) => {
    e.preventDefault();
    console.log(User, PassWord, Email);
    Axios.post("/api/addUsers", test).then((response) => {
      if (response.data) {
        alert("성공");
      } else {
        alert("실패");
      }
    });
  };

  const onUserChange = (e) => {
    console.log(e.target.value);
    setUser(e.target.value);
    console.log(User);
  };

  const onPwChange = (e) => {
    console.log(e.target.value);
    setPassWord(e.target.value);
    console.log(PassWord);
  };

  const onEmailChange = (e) => {
    console.log(e.target.value);
    setEmail(e.target.value);
    console.log(Email);
  };

  return (
    <>
      <form onSubmit={onSubmitUser}>
        <legend>
          이름
          <input type="text" onChange={onUserChange} />
        </legend>
        <legend>
          비밀번호
          <input type="text" onChange={onPwChange} />
        </legend>
        <legend>
          이메일
          <input type="text" onChange={onEmailChange} />
        </legend>
        <button>회원가입</button>
      </form>
    </>
  );
};

export default AddUser;
