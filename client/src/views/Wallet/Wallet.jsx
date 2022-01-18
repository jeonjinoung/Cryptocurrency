import React, { useState } from "react";
import Axios from "axios";

const AddressDefault = () => {
  const [Address, setAddress] = useState("");
  //setAddress는 Address의 내용을 기입해주기 위한 환경변수
  const onSubmitAddress = (e) => {
    e.preventDefault();
    Axios.get("/api/wallet/address").then((response) => {
      if (response.data) {
        //환경변수를 통하여 Address안에 값을 넣어주기위한 작업
        setAddress(response.data.address);
        //작업끝난후 콘솔찍어보면 Address안에 값이 들어가 있는것을 알 수 있다.
        console.log(Address);
      } else {
        alert("실패");
      }
    });
  };

  return (
    <>
      <form onSubmit={onSubmitAddress}>
        <button>지갑확인</button>
        {Address}
        <div>지갑주소</div>
      </form>
      {/* key 값을 따로주지않아도 환경변수를 통하여 변수값을 주어주면 값이 나온다. */}
      {/* 중요한것 form 안에서 변수를 선언하고 불러오려고하니 오류가 났다?? 위치는 상관없었다.*/}
    </>
  );
};

export default AddressDefault;
