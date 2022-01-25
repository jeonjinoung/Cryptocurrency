import React from "react";
import { useEffect, useState } from "react";
import Axios from "axios";

const Wallet = () => {
  const [Wallets, setWallets] = useState("");
  const [WalletHeaders, setWalletHeaders] = useState({});

  const { address } = WalletHeaders;

  console.log(address);
  useEffect(() => {
    Axios.get("/api/address").then((response) => {
      console.log(response);
      console.log(response.data);
      setWalletHeaders(response.data.address);
      setWallets(response.data.body);
    });
  }, []);

  return (
    <div>
      {Wallets}
      Address :{address}
    </div>
  );
};

export default Wallet;

// const [BodyBlock, setBodyBlock] = useState([]);
//   const [HeaderBlock, setHeaderBlock] = useState({});
//   const [PreviousHash, setPreviousHash] = useState("");
//   const [MerkleRoot, setMerkleRoot] = useState("");
//   const [anchorEl, setAnchorEl] = useState(null);
//   const theme = useTheme();

//   const { index, timestamp, version } = HeaderBlock;
//   const previousHashDisplay = `${PreviousHash.substring(0, 15)}...`;
//   const merkleRootDisplay = `${MerkleRoot.substring(0, 15)}...`;

//   useEffect(() => {
//     Axios.get("/api/lastBlock").then((response) => {
//       console.log(response);
//       setBodyBlock(response.data.body);
//       setHeaderBlock(response.data.header);
//       setPreviousHash(response.data.header.previousHash);
//       setMerkleRoot(response.data.header.merkleRoot);
//       setHeaderBlock(response.data.header);
//     });
//   }, []);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };
