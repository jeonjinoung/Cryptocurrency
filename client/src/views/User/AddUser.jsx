import { useState } from "react";
import Axios from "axios";

const AddUser = () => {
  const [Name, setName] = useState("");
  const [PassWord, setPassWord] = useState("");
  const [Email, setEmail] = useState("");

  const user = {
    name: Name,
    pw: PassWord,
    email: Email,
  };
  const onSubmitUser = (e) => {
    e.preventDefault();
    console.log(Name, PassWord, Email);
    Axios.post(`/api/user/addUser`, user).then((response) => {
      console.log(response.data)
      if (response.data.success) {
        alert("회원가입 성공");
      } else {
        alert("회원가입 실패");
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

  return (
    <>
      <form onSubmit={onSubmitUser}>
        <label>
          이메일
          <input type="text" onChange={onEmailChange} />
        </label>
        <br />
        <label>
          비밀번호
          <input type="password" onChange={onPWChange} />
        </label>
        <br />
        <label>
          이름
          <input type="text" onChange={onUserChange} />
        </label>
        <br />
        <button>회원가입</button>
      </form>
    </>
  );
};

export default AddUser;
