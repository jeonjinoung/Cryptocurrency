import React, { useState } from "react";
import Axios from "axios";

const AddressDefault = () => {
  const [Address, setAddress] = useState("");
  const onSubmitAddress = (e) => {
    e.preventDefault();
    Axios.get("/api/wallet/address").then((response) => {
      if (response.data) {
        setAddress(response.data.address);
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
    </>
  );
};

export default AddressDefault;
