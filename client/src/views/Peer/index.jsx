import { useEffect, useState } from "react";
import Axios from "axios";

const PeerDefault = () => {
  const [Peer, setPeer] = useState("");
  const [SuccessPeer, setSuccessPeer] = useState([]);

  const test = {
    data: [`ws://localhost:${Peer}`],
  };

  useEffect(() => {
    Axios.get("/api/peer/peers").then((response) => {
      setSuccessPeer(response.data.peer);
    });
  }, []);

  const onSubmitPeer = (e) => {
    e.preventDefault();
    const ws = `127.0.0.1:${Peer}`;
    if (!SuccessPeer.includes(ws)) {
      Axios.post("/api/peer/addPeers", test).then((response) => {
        const { peer } = response.data;
        Axios.get("/api/peer/peers").then((response) => {
          const peerArray = response.data.peer;
          if (peerArray.includes(ws)) {
            alert(`${peer} 성공`);
            setSuccessPeer(SuccessPeer.concat(ws));
            setPeer("");
          } else {
            alert(`${peer} 실패`);
            setPeer("");
          }
        });
      });
    } else {
      alert(`${ws}는 이미 연결된 상태입니다.`);
      setPeer("");
    }
  };

  const onPeerChange = (e) => {
    setPeer(e.target.value);
  };

  return (
    <>
      4 자리 포트 번호를 입력해주세요.
      <form onSubmit={onSubmitPeer}>
        <input type="number" value={Peer} onChange={onPeerChange} />
        <button>추가하기</button>
        <div>연결된 목록</div>
        {SuccessPeer &&
          SuccessPeer.map((peer) => {
            return <div key={peer}>{peer}</div>;
          })}
      </form>
    </>
  );
};

export default PeerDefault;
