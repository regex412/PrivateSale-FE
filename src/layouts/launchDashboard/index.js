/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-no-useless-fragment */
import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Link, useNavigate } from "react-router-dom";

import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import Cards from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import { Modal, Input, Spin, Card, message } from "antd";
import RocketLaunchSharpIcon from "@mui/icons-material/RocketLaunchSharp";

import config from "config/config";
import STANDARDPRESALEABI from "../../assets/abi/STANDARDPRESALEABI.json";
import PRESALEFACTORYMANAGERABI from "../../assets/abi/PRESALEFACTORYMANAGERABI.json";

const ethers = require("ethers");

const { TextArea } = Input;
function LaunchDashboard() {
  const { account, chainId } = useWeb3React();
  const Navigate = useNavigate();
  const [presaleArray, setPresaleArray] = useState([]);
  const [modalpresaleArray, setModalPresaleArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataState, setDataState] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);

  const Provider = new ethers.providers.Web3Provider(window.ethereum);
  const Signer = Provider.getSigner();
  const presaleFactoryContract = new ethers.Contract(
    config.PresaleFactoryManager,
    PRESALEFACTORYMANAGERABI,
    Signer
  );

  const getPresaleData = async () => {
    setLoading(true);
    // eslint-disable-next-line camelcase
    const presale_Array = [];
    await presaleFactoryContract.getAllPresalesPerUser(account).then(async (data) => {
      if (data.length === 0) {
        setDataState(false);
        setLoading(false);
      } else {
        setDataState(true);
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < data.length; i++) {
          const startDateEvent = new Date(Number(data[i].startTime) * 1000).toString();
          const endDateEvent = new Date(
            (Number(data[i].startTime) + Number(data[i].period)) * 1000
          ).toString();
          presale_Array.push({
            title: data[i].title.toString(),
            contractAddress: data[i].presaleAddress.toString(),
            // eslint-disable-next-line camelcase
            startTime: startDateEvent,
            // eslint-disable-next-line camelcase
            endTime: endDateEvent,
            tokenPrice: Number(data[i].tokenPrice) / 1000000,
            totalAmount: Number(data[i].totalMaxAmount) / 1000000,
            minContriAmount: Number(ethers.utils.formatEther(data[i].minInvestAmount)),
            maxContriAmount: Number(ethers.utils.formatEther(data[i].maxInvestAmount)),
          });
        }
      }
      // eslint-disable-next-line no-plusplus
    });
    setPresaleArray(presale_Array);
    setLoading(false);
  };

  const publishInfo = async () => {
    setPublishLoading(true);
    const logoLink = document.getElementById("logoLink").value;
    const websiteLink = document.getElementById("websiteLink").value;
    const telegramLink = document.getElementById("telegramLink").value;
    const twitterLink = document.getElementById("twitterLink").value;
    const facebookLink = document.getElementById("facebookLink").value;
    const otherLink = document.getElementById("otherLink").value;
    const description = document.getElementById("description").value;
    const presaleContract = new ethers.Contract(
      modalpresaleArray.contractAddress,
      STANDARDPRESALEABI,
      Signer
    );

    presaleContract
      .setInformation(
        logoLink,
        websiteLink,
        telegramLink,
        twitterLink,
        facebookLink,
        otherLink,
        description
      )
      .then((tx) => {
        tx.wait().then(() => {
          setPublishLoading(false);
          message.success("Published Successful");
          // eslint-disable-next-line no-use-before-define
          setIsModalOpen(false);
        });
      })
      .catch(() => {
        // eslint-disable-next-line no-use-before-define
        setIsModalOpen(false);
        message.info("Publish Canceled");
        setPublishLoading(false);
      });
  };

  useEffect(async () => {
    const orgState = await presaleFactoryContract.orgOf(account);
    // eslint-disable-next-line no-unused-expressions
    if (Number(orgState) === 0) {
      Navigate("/");
      window.location.reload();
    } else {
      account && (await getPresaleData());
    }
  }, [account]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showModal = (index) => {
    setModalPresaleArray(presaleArray[index]);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar
        componentTitle="Launch Dashboard"
        componentIcon={<RocketLaunchSharpIcon />}
      />
      <MDBox style={{ minHeight: "500px" }} pt={3}>
        <Cards>
          {account ? (
            <>
              {loading ? (
                <Spin style={{ margin: "4%" }} />
              ) : (
                <>
                  {dataState ? (
                    <Grid container spacing={3} py={1} px={2}>
                      {presaleArray.map((presale, index) => (
                        <Grid
                          item
                          xs={12}
                          xl={6}
                          md={6}
                          mt={3}
                          key={index}
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <Card
                            style={{ borderRadius: "8px" }}
                            hoverable
                            onClick={() => showModal(index)}
                          >
                            <MDTypography
                              variant="h6"
                              color="dark"
                              textAlign="center"
                              style={{ width: "100%" }}
                            >
                              Title : {presale && presale.title}
                            </MDTypography>
                            <MDTypography
                              variant="h6"
                              color="dark"
                              textAlign="center"
                              style={{ width: "100%" }}
                            >
                              PrivateSale Address :{" "}
                              {presale && presale.contractAddress.slice(0, 10)}...{" "}
                              {presale && presale.contractAddress.slice(-5)}
                            </MDTypography>
                            <MDTypography
                              variant="h6"
                              color="dark"
                              textAlign="center"
                              style={{ width: "100%" }}
                            >
                              Start Date : {presale.startTime}
                              <br />
                            </MDTypography>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <>
                      {" "}
                      <MDTypography
                        variant="h6"
                        color="dark"
                        textAlign="center"
                        p={3}
                        style={{ width: "100%" }}
                      >
                        No Data
                        <br />
                      </MDTypography>
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <MDTypography
              variant="h6"
              color="dark"
              textAlign="center"
              style={{ width: "100%" }}
              p={3}
            >
              Please Connect Wallet
              <br />
            </MDTypography>
          )}
        </Cards>
      </MDBox>
      <Modal
        closable={false}
        open={isModalOpen}
        width={800}
        footer={[<MDButton onClick={handleCancel}>Cancel</MDButton>]}
        className="launchdasboardModal"
      >
        <MDTypography variant="h4" color="dark" textAlign="left" style={{ width: "80%" }} pb={1}>
          PrivateSale
        </MDTypography>
        <MDTypography
          variant="h7"
          fontWeight="bold"
          color="info"
          textAlign="left"
          style={{ width: "100%", display: "flex" }}
        >
          PrivateSale Address :
        </MDTypography>
        <MDTypography variant="h7" color="dark" textAlign="left" fontWeight="regular">
          {modalpresaleArray && modalpresaleArray.contractAddress}
        </MDTypography>
        <Grid container spacing={1} mt={3}>
          <Grid item xs={12} xl={6} md={6} mt={1} style={{ justifyContent: "center" }}>
            <MDTypography variant="h4" color="dark" textAlign="left" fontWeight="bold">
              PrivateSale Parameters
            </MDTypography>
            <MDTypography
              variant="h7"
              fontWeight="bold"
              color="info"
              pb={2}
              textAlign="left"
              style={{ width: "100%", display: "flex" }}
            >
              TokenPrice :
              <MDTypography variant="h7" color="dark" textAlign="left" px={3} fontWeight="regular">
                {modalpresaleArray.tokenPrice}
              </MDTypography>
            </MDTypography>
            <MDTypography
              variant="h7"
              fontWeight="bold"
              color="info"
              pb={2}
              textAlign="left"
              style={{ width: "100%", display: "flex" }}
            >
              TokenAmount :
              <MDTypography variant="h7" color="dark" textAlign="left" px={3} fontWeight="regular">
                {modalpresaleArray.totalAmount}
              </MDTypography>
            </MDTypography>
            <MDTypography
              variant="h7"
              fontWeight="bold"
              color="info"
              textAlign="left"
              style={{ width: "100%", display: "flex" }}
            >
              Min. / Max.Contribution :
              <MDTypography variant="h7" color="dark" textAlign="left" px={3} fontWeight="regular">
                {modalpresaleArray.minContriAmount} /{" "}
                {modalpresaleArray.maxContriAmount > config.uintMaxValue
                  ? "No Limit"
                  : modalpresaleArray.maxContriAmount}
              </MDTypography>
            </MDTypography>

            <MDTypography
              variant="h7"
              fontWeight="bold"
              color="info"
              pb={2}
              textAlign="left"
              style={{ width: "100%", display: "flex" }}
            >
              StartDate :
              <MDTypography variant="h7" color="dark" textAlign="left" px={3} fontWeight="regular">
                {modalpresaleArray.startTime}
              </MDTypography>
            </MDTypography>
            <MDTypography
              variant="h7"
              fontWeight="bold"
              color="info"
              textAlign="left"
              mb={4}
              style={{ width: "100%", display: "flex" }}
            >
              EndDate :
              <MDTypography variant="h7" color="dark" textAlign="left" px={3} fontWeight="regular">
                {modalpresaleArray.endTime === modalpresaleArray.startTime
                  ? "No Limit"
                  : modalpresaleArray.endTime}
              </MDTypography>
            </MDTypography>

            <MDTypography
              variant="h6"
              color="white"
              textAlign="left"
              style={{ width: "100%" }}
              fontweight="bold"
            >
              <Link to={`/privatesale/${modalpresaleArray.contractAddress}/${chainId}`}>
                https://privatesale-work.web.app/privatesale/{chainId}
                {modalpresaleArray.contractAddress}
              </Link>
            </MDTypography>
          </Grid>
          <Grid item xs={12} xl={6} md={6} mt={1} style={{ justifyContent: "center" }}>
            <MDTypography
              variant="h4"
              color="dark"
              textAlign="left"
              style={{ width: "100%" }}
              pb={3}
            >
              Edit Description
            </MDTypography>
            <TextField
              style={{ width: "100%", marginBottom: "8%" }}
              id="logoLink"
              label="Logo IMG Link"
              placeholder="https://.."
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              style={{ width: "100%", marginBottom: "8%" }}
              placeholder="https://.."
              id="videoLink"
              label="Video Link"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              style={{ width: "100%", marginBottom: "8%" }}
              id="websiteLink"
              placeholder="https://.."
              label="Website"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              style={{ width: "100%", marginBottom: "8%" }}
              id="telegramLink"
              placeholder="https://t.me/.."
              label="Telegram"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
            />{" "}
            <TextField
              style={{ width: "100%", marginBottom: "8%" }}
              id="twitterLink"
              placeholder="https://twitter/.."
              label="Twitter"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
            />{" "}
            <TextField
              style={{ width: "100%", marginBottom: "8%" }}
              id="facebookLink"
              placeholder="https://Facebook/.."
              label="Facebook"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
            />{" "}
            <TextField
              style={{ width: "100%", marginBottom: "8%" }}
              id="otherLink"
              label="OtherLink"
              placeholder="https://.."
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
            />{" "}
            <TextArea
              rows={4}
              id="description"
              style={{ borderRadius: "8px", marginBottom: "5%" }}
              placeholder="Description"
            />
            {!publishLoading ? (
              <MDButton color="info" onClick={() => publishInfo()}>
                <MDTypography
                  variant="h7"
                  color="white"
                  textAlign="center"
                  style={{ width: "100%" }}
                >
                  Publish
                </MDTypography>
              </MDButton>
            ) : (
              <MDButton color="info">
                <MDTypography
                  variant="h7"
                  color="white"
                  textAlign="center"
                  style={{ width: "50px" }}
                >
                  <Spin size="small" />
                </MDTypography>
              </MDButton>
            )}
          </Grid>
        </Grid>
      </Modal>
    </DashboardLayout>
  );
}

export default LaunchDashboard;
