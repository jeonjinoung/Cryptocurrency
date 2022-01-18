import React, { useState } from "react";
import Axios from "axios";

const AddressDefault = () => {
  const [Address, setAddress] = useState("");

  const wallets = {
    adress: Address,
  };

  const onSubmitAddress = (e) => {
    e.preventDefault();
    console.log(Address);
    Axios.get("/api/wallet/address", wallets).then((response) => {
      console.log(response.data);
      if (response.data) {
        alert("성공");
      } else {
        alert("실패");
      }
    });
  };
  const onAddressChange = (e) => {
    setAddress(e.target.value);
    console.log(Address);
  };
  return (
    <>
      <form onSubmit={onSubmitAddress}>
        <label>
          Address
          <input onChange={onAddressChange} />
        </label>
        <button>지갑확인</button>
      </form>
    </>
  );
};

export default AddressDefault;
