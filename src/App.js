import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import { create } from "ipfs-http-client";

export const StyledButton = styled.button`
  padding: 8px;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [feedback, setFeedback] = useState("Maybe it's your lucky day!");
  const [claimingNft, setClaimingNft] = useState(false);

  const claimNFTs = (_amount) => {
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, _amount)
      .send({
        from: blockchain.account,
        value: blockchain.web3.utils.toWei(
          (0.02 * _amount).toString(),
          "ether"
        ),
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Error");
        setClaimingNft(false);
      })
      .then((receipt) => {
        setFeedback("Success");
        setClaimingNft(false);
      });
  };

  useEffect(() => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.smartContract, dispatch]);

  return (
    <s.Screen>
      {blockchain.account === "" || blockchain.smartContract === null ? (
        <s.Container flex={1} ai={"center"} jc={"center"}>
          <s.TextTitle>Connect to the Blockchain</s.TextTitle>
          <s.SpacerSmall />
          <StyledButton
            onClick={(e) => {
              e.preventDefault();
              dispatch(connect());
            }}
          >
            CONNECT
          </StyledButton>
          <s.SpacerSmall />
          {blockchain.errorMsg !== "" ? (
            <s.TextDescription>{blockchain.errorMsg}</s.TextDescription>
          ) : null}
        </s.Container>
      ) : (
        <s.Container flex={1} ai={"center"} jc={"center"}>
          <s.TextTitle style={{ textAlign: "center" }}>
            Hey, grab one of the NFTs.
          </s.TextTitle>
          <s.SpacerXSmall />
          <s.TextDescription style={{ textAlign: "center" }}>
            {feedback}
          </s.TextDescription>
          <s.SpacerSmall />
          <StyledButton
            disabled={claimingNft ? 1 : 0}
            onClick={(e) => {
              e.preventDefault();
              claimNFTs(1);
            }}
          >
            {claimingNft ? "BUSY CLAIMING" : "CLAIM 1 NFT"}
          </StyledButton>
          <s.SpacerSmall />
          <StyledButton
            disabled={claimingNft ? 1 : 0}
            onClick={(e) => {
              e.preventDefault();
              claimNFTs(5);
            }}
          >
            {claimingNft ? "BUSY CLAIMING" : "CLAIM 5 NFTs"}
          </StyledButton>
          <s.SpacerSmall />
        </s.Container>
      )}
    </s.Screen>
  );
}

export default App;
