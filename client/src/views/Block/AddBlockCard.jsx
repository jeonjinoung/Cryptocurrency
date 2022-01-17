import PropTypes from "prop-types";
import { useState } from "react";
import Axios from "axios";

const AddBlockCard = () => {
  const [AdBlocks, setAdBlocks] = useState('');
  const blocks = {
    data: [AdBlocks],
  };

  const onSubmitAddBlock = (e) => {
    e.preventDefault();
    Axios.post("/api/block/mineBlock", blocks).then((response) => {
      setAdBlocks('');
    });
  };

  const onBlockChange = (e) => {
    setAdBlocks(e.target.value);
  };

  return (
    <>
      <form onSubmit={onSubmitAddBlock}>
        <label>
          <input type="text" value={AdBlocks} onChange={onBlockChange} />
        </label>
        <button>채굴 하기</button>
      </form>
    </>
  );
};

AddBlockCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default AddBlockCard;
