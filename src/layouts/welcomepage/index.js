import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Card, Spin } from "antd";

import { injected } from "hooks/connect";
import { switchNetwork } from "hooks/switch-network";

import config from "config/config";
import PRIVATEFACTORYMANAGERABI from "../../assets/abi/PRESALEFACTORYMANAGERABI.json";

import metamaskIMG from "../../assets/images/connectedIcon.png";

const ethers = require("ethers");

function WelcomePage() {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { chainId, activate, account } = useWeb3React();
  const Navigate = useNavigate();

  const Provider = new ethers.providers.Web3Provider(window.ethereum);
  const Signer = Provider.getSigner();

  const PresaleFactoryContract = new ethers.Contract(
    config.PresaleFactoryManager,
    PRIVATEFACTORYMANAGERABI,
    Signer
  );

  async function connect() {
    if (chainId !== 97 || chainId === undefined) {
      switchNetwork();
    }
    try {
      await activate(injected);
      localStorage.setItem("isWalletConnected", true);
      setLoading(false);
      const orgState = await PresaleFactoryContract.orgOf(account);
      // eslint-disable-next-line no-unused-expressions
      Number(orgState) === 1 ? Navigate("/launchDashboard") : Navigate("/organization");
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.log(ex);
    }
  }

  useEffect(() => {
    if (pageLoading) {
      setTimeout(() => {
        setPageLoading(false);
      }, 1000);
    }
  }, [pageLoading]);

  return (
    <MDBox
      style={{
        width: "100%",
        margin: "0px",
      }}
    >
      {pageLoading ? (
        <MDBox
          style={{
            zIndex: 1000,
            position: "absolute",
            top: "43%",
            width: "100%",
            textAlign: "center",
          }}
          p={2}
          color="light"
        >
          <Spin />
        </MDBox>
      ) : (
        <MDBox
          style={{
            position: "absolute",
            top: "20%",
            width: "100%",
            textAlign: "center",
          }}
          p={2}
          color="light"
        >
          <MDBox>
            <MDTypography variant="h2" color="info" fontWeight="bold">
              Welcome to PrivateSale Factory !
            </MDTypography>
            <MDTypography variant="h4">To get started, connect your wallet</MDTypography>
            <MDBox
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              color="light"
              onClick={() => connect()}
            >
              <Card
                hoverable
                style={{
                  borderRadius: "10px",
                  marginTop: "5%",
                  width: "100%",
                  maxWidth: "360px",
                }}
              >
                <MDBox style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                  <img src={metamaskIMG} alt="metamaskimg" style={{ width: "70px" }} />
                  <MDTypography variant="h4" fontWeight="bold" p={2}>
                    METAMASK {loading && <Spin />}
                  </MDTypography>
                </MDBox>
              </Card>
            </MDBox>
          </MDBox>
        </MDBox>
      )}
    </MDBox>
  );
}

export default WelcomePage;
