import { useState } from "react";
import { message, Spin, Modal } from "antd";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import TextField from "@mui/material/TextField";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { CopyOutlined, CheckOutlined } from "@ant-design/icons";

import config from "config/config";
import STANDARDPRESALEABI from "../../assets/abi/STANDARDPRESALEABI.json";
import REWARDTOKENABI from "../../assets/abi/REWARDTOKENABI.json";

const ethers = require("ethers");

// eslint-disable-next-line react/prop-types
function FinalizeclaimButton({
  // eslint-disable-next-line react/prop-types
  contractAddress,
  // eslint-disable-next-line react/prop-types
  isFinishedPrivateSale,
  // eslint-disable-next-line react/prop-types
  tokenAmount,
  // eslint-disable-next-line react/prop-types
  isStartClaim,
  // eslint-disable-next-line react/prop-types
  startTime,
  // eslint-disable-next-line react/prop-types
  endTime,
  // eslint-disable-next-line react/prop-types
  period,
  // eslint-disable-next-line react/prop-types
  currentTime,
  // eslint-disable-next-line react/prop-types
}) {
  const [finalizeButtonLoading, setFinalizeButtonLoading] = useState(false);
  const [startClaimButtonLoading, setStartClaimButtonLoading] = useState(false);
  const [claimButtonState, setClaimButtonState] = useState(false);
  const [isStartClaimModal, setIsStartClaimModal] = useState(false);
  //   const [rewardTokenAddr, setRewardTokenAddr] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const Provider = new ethers.providers.Web3Provider(window.ethereum);
  const Signer = Provider.getSigner();

  const standardFactoryContract = new ethers.Contract(contractAddress, STANDARDPRESALEABI, Signer);
  const rewardTokenContract = new ethers.Contract(config.RewardToken, REWARDTOKENABI, Signer);

  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const showStartClaimModal = () => {
    setIsStartClaimModal(true);
  };

  const startClaimModalCancel = () => {
    setIsStartClaimModal(false);
  };

  const changeRewardTokenInput = (e) => {
    // eslint-disable-next-line no-unused-expressions
    e.length === 42 ? setClaimButtonState(true) : setClaimButtonState(false);
  };

  const flinalizeFunc = async () => {
    setFinalizeButtonLoading(true);
    await standardFactoryContract
      .setFinishPresale()
      .then((tx) => {
        tx.wait().then(() => {
          message.success("PrivateSale is finished.");
          window.location.reload();
          setFinalizeButtonLoading(false);
        });
      })
      .catch(() => {
        message.info("Not Success");
        setFinalizeButtonLoading(false);
      });
  };

  const startClaimFunc = async () => {
    setStartClaimButtonLoading(true);

    await rewardTokenContract
      .approve(contractAddress, ethers.utils.parseEther(tokenAmount.toString()))
      .then((tx) => {
        tx.wait().then(async () => {
          await standardFactoryContract
            .startClaim(config.RewardToken, { gasLimit: 300000 })
            .then((tx2) => {
              tx2
                .wait()
                .then(() => {
                  message.success("Claim is started");
                  window.location.reload();
                  setStartClaimButtonLoading(false);
                })
                .catch(() => {
                  message.info("Canceled");
                  setStartClaimButtonLoading(false);
                });
            });
        });
      });
  };

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {isFinishedPrivateSale ? (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
          {!isStartClaim && (
            <MDButton color="info" style={{ width: "100%" }} onClick={showStartClaimModal}>
              Start Claim
            </MDButton>
          )}
        </>
      ) : (
        <MDButton
          color="info"
          style={{ width: "100%" }}
          onClick={flinalizeFunc}
          disabled={!((startTime < endTime && currentTime > endTime * 1000) || period === 0)}
        >
          {finalizeButtonLoading ? <Spin style={{ width: "40px" }} /> : "Finalize"}
        </MDButton>
      )}
      <Modal
        closable={false}
        open={isStartClaimModal}
        width={500}
        footer={[<MDButton onClick={startClaimModalCancel}>Cancel</MDButton>]}
        className="launchdasboardModal"
      >
        <MDBox style={{ width: "100%" }}>
          <MDBox style={{ width: "100%", display: "flex", justifyContent: "center" }} p={2}>
            <MDTypography
              style={{ border: "1px solid  #e5e5e5", borderRadius: "8px", padding: "7px" }}
              variant="h6"
            >
              {" "}
              {config.RewardToken.toString().slice(0, 32)}...
            </MDTypography>
            <CopyToClipboard text={config.RewardToken} onCopy={onCopyText}>
              <MDTypography style={{ padding: "7px" }}>
                {!isCopied ? (
                  <CopyOutlined style={{ color: "#696969" }} />
                ) : (
                  <CheckOutlined style={{ color: "#696969" }} />
                )}
              </MDTypography>
            </CopyToClipboard>
          </MDBox>
          <TextField
            style={{ width: "100%", marginBottom: "3%" }}
            id="investAmount2"
            label=" Reward Token Address"
            type="text"
            onChange={(e) => changeRewardTokenInput(e.target.value)}
          />
          <MDButton
            color="info"
            style={{ width: "100%" }}
            onClick={() => startClaimFunc()}
            disabled={!claimButtonState}
          >
            <MDTypography variant="h6" color="white" textAlign="center" style={{ width: "100%" }}>
              {!startClaimButtonLoading ? "Start Claim" : <Spin />}
            </MDTypography>
          </MDButton>
        </MDBox>
      </Modal>
    </>
  );
}

export default FinalizeclaimButton;
