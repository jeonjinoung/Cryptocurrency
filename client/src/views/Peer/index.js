import { useState } from "react";
import Axios from "axios";

const PeerDefault = () => {
  const [Peer, setPeer] = useState("");

  const test = {
    data: [Peer],
  };

  const onSubmitPeer = (e) => {
    e.preventDefault();
    console.log(Peer);
    Axios.post("/api/addPeers", test).then((response) => {
      if (response.data) {
        alert("성공");
      } else {
        alert("실패");
      }
    });
  };

  const onPeerChange = (e) => {
    console.log(e.target.value);
    setPeer(e.target.value);
    console.log(Peer);
  };

  return (
    <>
      <form onSubmit={onSubmitPeer}>
        <input type="text" onChange={onPeerChange} />
        <button>노드 추가하기</button>
      </form>
    </>
  );
};

export default PeerDefault;
