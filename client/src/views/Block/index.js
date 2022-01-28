import BlocksCard from "./BlocksCard";
import Axios from "axios";
import { useEffect, useState } from "react";

const BlockDefault = () => {
  const [Value, setValue] = useState('');

  const data = {
    data : [Value]
  }

  const handleClick = (e) => {
    Axios.post('/api/mineBlock', data)
      .then(response => {
        console.log("채굴완료")
      });
  };

  const onChangeInput = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
      <form onSubmit={handleClick}>
        <input value={Value} onChange={onChangeInput} />
        <button>채굴하기</button>
      </form>
      <BlocksCard />    
    </>
  );
};

export default BlockDefault;
