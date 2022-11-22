/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-no-useless-fragment */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import { Progress, Switch, Spin, message, Skeleton, Modal } from "antd";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import TextField from "@mui/material/TextField";
import MDButton from "components/MDButton";

// eslint-disable-next-line import/no-extraneous-dependencies
import {
  TwitterCircleFilled,
  FacebookFilled,
  EllipsisOutlined,
  DribbbleCircleFilled,
  PlayCircleFilled,
} from "@ant-design/icons";

// eslint-disable-next-line no-unused-vars
import { useWeb3React } from "@web3-react/core";
import config from "config/config";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import STANDARDPRESALEABI from "../../assets/abi/STANDARDPRESALEABI.json";
import BUSDABI from "../../assets/abi/BUSDABI.json";

import InvestListTable from "./investListTable";

// eslint-disable-next-line import/no-named-as-default
import FinalizeclaimButton from "./finalizeclaimButton";
import noIMG from "../../assets/images/noIMG.png";

const ethers = require("ethers");

function PreSaleView() {
  const { account } = useWeb3React();
  const { contractAddress } = useParams();
  const [state, setState] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [loading, setLoading] = useState(false);
  const [getInvestLoadingState, setGetInvestLoadingState] = useState(false);

  const [liveState, setLiveState] = useState();
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvestListModalOpen, setIsInvestListModalOpen] = useState(false);
  const [getDataLoading, setGetDataLoading] = useState(true);

  const [presaleArray, setPresaleArray] = useState([]);
  const [investerArray, setInvesterArray] = useState([]);
  const Provider = new ethers.providers.Web3Provider(window.ethereum);
  const Signer = Provider.getSigner();
  const standardFactoryContract = new ethers.Contract(contractAddress, STANDARDPRESALEABI, Signer);
  const BusdTokenContract = new ethers.Contract(config.BusdAddress, BUSDABI, Signer);

  const array = [];
  const getData = async () => {
    // eslint-disable-next-line no-underscore-dangle
    const start_Time = await standardFactoryContract._startTime();
    // eslint-disable-next-line no-underscore-dangle
    const period = await standardFactoryContract._period();
    // eslint-disable-next-line no-underscore-dangle
    const privateTitle = await standardFactoryContract._title();
    // eslint-disable-next-line no-underscore-dangle
    const token_owner = await standardFactoryContract._owner();
    // eslint-disable-next-line no-underscore-dangle
    const token_price = await standardFactoryContract._tokenPrice();
    // eslint-disable-next-line no-underscore-dangle
    const total_amount = await standardFactoryContract._totalMaxAmount();
    const remain_amount = await standardFactoryContract.getRemainingTokens();
    // eslint-disable-next-line no-underscore-dangle
    const min_contribute_Amount = await standardFactoryContract._minInvestAmount();
    // eslint-disable-next-line no-underscore-dangle
    const max_contribute_Amount = await standardFactoryContract._maxInvestAmount();

    const startDateEvent = new Date(Number(start_Time) * 1000).toString();
    // eslint-disable-next-line camelcase
    const endDateEvent = new Date(Number(start_Time) * 1000 + Number(period) * 1000).toString();
    // eslint-disable-next-line no-underscore-dangle
    const logo_url = await standardFactoryContract._logoUrl();
    // eslint-disable-next-line no-underscore-dangle
    const facebook_url = await standardFactoryContract._facebookUrl();
    // eslint-disable-next-line no-underscore-dangle
    const website_url = await standardFactoryContract._extraUrl();
    // eslint-disable-next-line no-underscore-dangle
    const twitter_url = await standardFactoryContract._twitterUrl();
    // eslint-disable-next-line no-underscore-dangle
    const other_url = await standardFactoryContract._maxInvestAmount();
    // eslint-disable-next-line no-underscore-dangle
    const token_description = await standardFactoryContract._description();
    // eslint-disable-next-line no-underscore-dangle
    const is_Native = await standardFactoryContract._isNative();
    // eslint-disable-next-line no-underscore-dangle
    const finised_privateSale = await standardFactoryContract._isFinished();
    // eslint-disable-next-line no-underscore-dangle
    const isStarted_claim = await standardFactoryContract._isStartClaim();
    // eslint-disable-next-line no-underscore-dangle
    // const is_Claimed = await standardFactoryContract._isClaimed(account);
    const invested_Amount = await standardFactoryContract.getInvestedAmountPerUser(account);
    // eslint-disable-next-line no-underscore-dangle
    const claimed_Amount = await standardFactoryContract._claimedAmount(account);
    // eslint-disable-next-line no-underscore-dangle
    const initial_claimpercent = await standardFactoryContract._initialClaimPercent();
    // eslint-disable-next-line no-underscore-dangle
    const vesting_cycle = await standardFactoryContract._vestingCycle();
    // eslint-disable-next-line no-underscore-dangle
    const cycle_percent = await standardFactoryContract._cyclePercent();
    const current_Time = new Date().getTime();

    array.push({
      // eslint-disable-next-line camelcase
      startTime: startDateEvent,
      // eslint-disable-next-line camelcase
      title: privateTitle.toString(),
      endTime: endDateEvent,
      owner: token_owner.toString(),
      periods: Number(period),
      startTimeStamp: Number(start_Time) + 50,
      endTimeStamp: Number(start_Time) + Number(period) + 50,
      tokenPrice: Number(token_price) / 1000000,
      totalAmount: Number(total_amount) / 1000000,
      remainAmount: Number(remain_amount) / 1000000,
      minContriAmount: Number(ethers.utils.formatEther(min_contribute_Amount)),
      maxContriAmount: Number(ethers.utils.formatEther(max_contribute_Amount)),
      logoUrl: logo_url.toString(),
      websiteUrl: website_url.toString(),
      twitterUrl: twitter_url.toString(),
      facebookUrl: facebook_url.toString(),
      otherUrl: other_url.toString(),
      description: token_description.toString(),
      isNative: is_Native,
      isFinished: finised_privateSale,
      isStartClaim: isStarted_claim,
      claimedAmount: Number(ethers.utils.formatEther(claimed_Amount)),
      initialClaimPercent: Number(initial_claimpercent),
      cyclePercent: Number(cycle_percent),
      vestingCycle: Number(vesting_cycle),
      investAmount: Number(invested_Amount),
      currentTime: current_Time,
    });
    setPresaleArray(array[0]);
    setGetDataLoading(false);
  };

  const setNewTime = () => {
    const currentTime = new Date().getTime();
    if (array.length !== 0 && array[0].remainAmount !== 0) {
      if (currentTime < array[0].endTimeStamp * 1000) {
        let countDown;
        if (currentTime < Number(array[0].startTimeStamp * 1000)) {
          setLiveState(false);
          countDown = Number(array[0].startTimeStamp * 1000);
        } else {
          // eslint-disable-next-line no-unused-vars
          countDown = Number(array[0].endTimeStamp * 1000);
          setLiveState(true);
        }

        const distanceToDate = countDown - currentTime;
        let days = Math.floor(distanceToDate / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distanceToDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distanceToDate % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distanceToDate % (1000 * 60)) / 1000);

        const numbersToAddZeroTo = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        days = `${days}`;
        if (numbersToAddZeroTo.includes(hours)) {
          hours = `0${hours}`;
        } else if (numbersToAddZeroTo.includes(minutes)) {
          minutes = `0${minutes}`;
        } else if (numbersToAddZeroTo.includes(seconds)) {
          seconds = `0${seconds}`;
        }

        setState({ days, hours, minutes, seconds });
      } else {
        setState(0, 0, 0, 0);
        if (array[0].startTimeStamp === array[0].endTimeStamp) {
          // eslint-disable-next-line no-unused-expressions
          array[0].remainAmount === 0 ? setLiveState(false) : setLiveState(true);
        } else {
          setLiveState(false);
        }
      }
    } else {
      setState(0, 0, 0, 0);
      setLiveState(false);
    }
  };

  const investToken = async (target) => {
    setLoading(true);
    let tokenAmountValue;
    target === 1
      ? (tokenAmountValue = document.getElementById("investAmount1").value)
      : (tokenAmountValue = document.getElementById("investAmount2").value);
    if (tokenAmountValue > presaleArray.totalAmount) {
      message.error("Please enter the correct value (value < Max.Contribution)");
    } else {
      presaleArray.isNative
        ? standardFactoryContract
            .investWithNativeToken({
              value: ethers.utils.parseEther(tokenAmountValue.toString()),
            })
            .then((tx) => {
              tx.wait().then(() => {
                setLoading(false);
                message.success("Invested Successful");
                window.location.reload();
              });
            })
        : BusdTokenContract.approve(
            contractAddress,
            ethers.utils.parseEther(tokenAmountValue.toString())
          ).then((tx) => {
            tx.wait().then(() => {
              standardFactoryContract
                .investWithToken(ethers.utils.parseEther(tokenAmountValue.toString()), {})
                .then((tx2) => {
                  tx2.wait().then(() => {
                    setLoading(false);
                    message.success("Invested Successful");
                    window.location.reload();
                  });
                });
            });
          });
    }
  };

  const ClaimToken = async () => {
    setLoading(true);
    await standardFactoryContract.claimToken().then((tx) => {
      tx.wait().then(() => {
        message.success("Claimed successful.");
        window.location.reload();
        setLoading(false);
      });
    });
  };

  // const showModal = () => {
  //   setIsModalOpen(true);
  // };

  // const handleCancel = () => {
  //   setIsModalOpen(false);
  // };

  const showInvestListModal = async () => {
    setGetInvestLoadingState(true);
    setIsInvestListModalOpen(true);
    const investList = [];
    let investersList = [];
    investersList = await standardFactoryContract.getInvestorList();
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < investersList.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      const investAmount = await standardFactoryContract.getInvestedAmountPerUser(investersList[i]);

      investList.push({
        invester: investersList[i],
        tokenAmount: Number(investAmount) / 1000000,
        priceAmount: Number(investAmount) / (presaleArray.tokenPrice * 1000000),
      });
    }
    setInvesterArray(investList);
    setGetInvestLoadingState(false);
  };

  const investListModalCancel = () => {
    setIsInvestListModalOpen(false);
  };

  useEffect(async () => {
    account && getData();
  }, [account]);

  useEffect(() => {
    account && setInterval(() => setNewTime(), 1000);
  }, [account]);

  return (
    <DashboardLayout>
      <DashboardNavbar componentTitle="PrivateSale" componentIcon={<CurrencyExchangeIcon />} />
      <MDBox style={{ minHeight: "500px" }} pt={3}>
        <Card>
          <Grid container spacing={1} py={5} px={3}>
            <Grid
              item
              xs={12}
              xl={3}
              md={3}
              mt={3}
              style={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              {getDataLoading ? (
                <Skeleton.Avatar
                  active="true"
                  style={{
                    width: "250px",
                    height: "250px",
                    borderRadius: "10%",
                    objectPosition: "center",
                  }}
                />
              ) : (
                <img
                  alt="example"
                  src={presaleArray.logoUrl === "" ? noIMG : presaleArray.logoUrl}
                  style={{
                    width: "250px",
                    height: "250px",
                    borderRadius: "10%",
                    objectFit: "cover",
                  }}
                />
              )}
            </Grid>
            <Grid item xs={12} xl={6} md={6} mt={3}>
              <MDBox style={{ width: "100%" }} coloredShadow="light" borderRadius="10px" p={3}>
                {getDataLoading ? (
                  <>
                    <Skeleton.Input
                      active="true"
                      block="true"
                      style={{ borderRadius: "8px", marginBottom: "4px" }}
                    />
                    <Skeleton.Input
                      active="true"
                      block="true"
                      style={{ borderRadius: "8px", marginBottom: "4px" }}
                    />
                    <Skeleton.Input
                      active="true"
                      block="true"
                      style={{ borderRadius: "8px", marginBottom: "4px" }}
                    />
                    <Skeleton.Input
                      active="true"
                      block="true"
                      style={{ borderRadius: "8px", marginBottom: "4px" }}
                    />
                    <Skeleton.Avatar
                      active="true"
                      block="true"
                      style={{ borderRadius: "50%", marginBottom: "4px" }}
                    />{" "}
                    <Skeleton.Avatar
                      active="true"
                      block="true"
                      style={{ borderRadius: "50%", marginBottom: "4px" }}
                    />{" "}
                    <Skeleton.Avatar
                      active="true"
                      block="true"
                      style={{ borderRadius: "50%", marginBottom: "4px" }}
                    />{" "}
                    <Skeleton.Avatar
                      active="true"
                      block="true"
                      style={{ borderRadius: "50%", marginBottom: "4px" }}
                    />{" "}
                    <Skeleton.Avatar
                      active="true"
                      block="true"
                      style={{ borderRadius: "50%", marginBottom: "4px" }}
                    />
                  </>
                ) : (
                  <>
                    <MDTypography variant="h6" color="info" textAlign="left">
                      PrivateSale Title :{" "}
                      <span style={{ fontSize: "14px", color: "#344767" }}>
                        {presaleArray.title}
                      </span>
                    </MDTypography>
                    <MDTypography variant="h6" color="info" textAlign="left">
                      Description :{" "}
                      {presaleArray.description ? (
                        <span style={{ fontSize: "14px", color: "#344767" }}>
                          {presaleArray.description && presaleArray.description}
                        </span>
                      ) : (
                        <span style={{ fontSize: "14px", color: "#344767" }}>No description</span>
                      )}
                      {/* {presaleArray.description && (
                        <MDButton onClick={showModal}> ... See More</MDButton>
                      )} */}
                    </MDTypography>
                    <MDTypography variant="h6" color="info" textAlign="left">
                      PrivateSale Addr :{" "}
                      <span style={{ fontSize: "14px", color: "#344767" }}>
                        {contractAddress && contractAddress.slice(0, 10)} ...{" "}
                        {contractAddress.slice(-5)}
                      </span>
                    </MDTypography>
                    <MDTypography variant="h6" color="info" textAlign="left">
                      1 {presaleArray.isNative ? "BNB" : "BUSD"} ={" "}
                      {presaleArray && presaleArray.tokenPrice} Token(s)
                    </MDTypography>

                    <MDTypography variant="h6" color="success" textAlign="left" py={1}>
                      <MDButton color="info" mt={3}>
                        Verified
                      </MDButton>{" "}
                    </MDTypography>
                    <Progress
                      percent={parseFloat(
                        ((presaleArray.totalAmount - presaleArray.remainAmount) /
                          presaleArray.totalAmount) *
                          100
                      ).toFixed(4)}
                      status="active"
                      style={{ paddingRight: "30px" }}
                    />

                    <MDTypography variant="h6" color="dark" textAlign="center">
                      {parseFloat(presaleArray.totalAmount - presaleArray.remainAmount).toFixed(2)}/
                      {presaleArray.totalAmount} Token(s)
                    </MDTypography>
                    <MDBox style={{ width: "100%", display: "flex" }} borderRadius="10px" pt={1}>
                      <a
                        href={presaleArray.websiteUrl}
                        style={{ marginRight: "1%" }}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {" "}
                        <DribbbleCircleFilled style={{ fontSize: "25px" }} />
                      </a>
                      <a
                        href={
                          presaleArray.twitterUrl === ""
                            ? `https://twitter.com`
                            : presaleArray.twitterUrl
                        }
                        style={{ marginRight: "1%" }}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {" "}
                        <TwitterCircleFilled style={{ fontSize: "25px" }} />
                      </a>
                      <a
                        href={presaleArray.facebookUrl}
                        style={{ marginRight: "1%" }}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {" "}
                        <FacebookFilled style={{ fontSize: "25px" }} />{" "}
                      </a>
                      <a
                        href={presaleArray.otherUrl}
                        style={{ marginRight: "1%" }}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {" "}
                        <PlayCircleFilled style={{ fontSize: "25px" }} />{" "}
                      </a>
                      <a
                        href={presaleArray.otherUrl}
                        style={{ marginRight: "1%" }}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {" "}
                        <EllipsisOutlined style={{ fontSize: "25px" }} />{" "}
                      </a>
                    </MDBox>
                  </>
                )}
              </MDBox>
            </Grid>
            <Grid item xs={12} xl={3} md={3} mt={3}>
              <MDBox style={{ width: "100%" }} coloredShadow="light" borderRadius="10px" p={3}>
                {getDataLoading ? (
                  <Skeleton.Input
                    active="true"
                    block="true"
                    style={{ borderRadius: "8px", marginBottom: "4px" }}
                  />
                ) : (
                  <>
                    {!presaleArray.isFinished ? (
                      <>
                        <TextField
                          style={{ width: "100%", marginBottom: "3%" }}
                          id="investAmount1"
                          label=" Amount"
                          type="number"
                        />
                        <MDButton
                          color="info"
                          style={{ width: "100%" }}
                          onClick={() => investToken(1)}
                          disabled={!liveState}
                        >
                          <MDTypography
                            variant="h6"
                            color="white"
                            textAlign="center"
                            style={{ width: "100%" }}
                          >
                            {!loading ? "Invest" : <Spin />}
                          </MDTypography>
                        </MDButton>
                      </>
                    ) : (
                      <>
                        {" "}
                        {!presaleArray.claimedAmount ===
                          presaleArray.totalAmount - presaleArray.remainAmount &&
                        presaleArray.investAmount !== 0 &&
                        presaleArray.investAmount !== 0 ? (
                          <>
                            <MDButton
                              color="info"
                              style={{ width: "100%" }}
                              onClick={() => ClaimToken()}
                              disabled={!presaleArray.isStartClaim}
                            >
                              <MDTypography
                                variant="h6"
                                color="white"
                                textAlign="center"
                                style={{ width: "100%" }}
                              >
                                {!loading ? "Claim" : <Spin />}
                              </MDTypography>
                            </MDButton>
                            <MDTypography variant="h6" color="dark" textAlign="center">
                              {presaleArray.claimedAmount}/
                              {parseFloat(
                                presaleArray.totalAmount - presaleArray.remainAmount
                              ).toFixed(2)}{" "}
                              Token(s)
                            </MDTypography>
                          </>
                        ) : (
                          <MDTypography
                            variant="h6"
                            color="info"
                            textAlign="center"
                            style={{ width: "100%" }}
                          >
                            This PrivateSale was finised
                          </MDTypography>
                        )}
                      </>
                    )}
                  </>
                )}
              </MDBox>
            </Grid>
          </Grid>
          <Grid container spacing={1} py={5} px={3}>
            <Grid item xs={12} xl={8} md={8} mt={3} style={{ justifyContent: "center" }}>
              <MDBox style={{ width: "100%" }} coloredShadow="light" borderRadius="10px" p={3}>
                {!presaleArray.isFinished && (
                  <MDBox style={{ width: "100%", display: "flex", justifyContent: "start" }} pt={3}>
                    <MDTypography
                      variant="h6"
                      color="dark"
                      textAlign="center"
                      style={{
                        padding: "2%",
                        borderRadius: "7px",
                        marginRight: "1%",
                      }}
                    >
                      <Switch checkedChildren="On" unCheckedChildren="Off" checked={liveState} />
                    </MDTypography>
                    <MDTypography
                      variant="h6"
                      color="dark"
                      textAlign="center"
                      style={{
                        border: "1px solid rgba(0,0,0,0.2)",
                        padding: "2%",
                        borderRadius: "7px",
                        marginRight: "1%",
                      }}
                    >
                      {state.days || "0"} d
                    </MDTypography>
                    <MDTypography
                      variant="h6"
                      color="dark"
                      textAlign="center"
                      style={{
                        border: "1px solid rgba(0,0,0,0.2)",
                        padding: "2%",
                        borderRadius: "7px",
                        marginRight: "1%",
                      }}
                    >
                      {state.hours || "00"} h
                    </MDTypography>
                    <MDTypography
                      variant="h6"
                      color="dark"
                      textAlign="center"
                      style={{
                        border: "1px solid rgba(0,0,0,0.2)",
                        padding: "2%",
                        borderRadius: "7px",
                        marginRight: "1%",
                      }}
                    >
                      {state.minutes || "00"} m
                    </MDTypography>
                    <MDTypography
                      variant="h6"
                      color="dark"
                      textAlign="center"
                      style={{
                        border: "1px solid rgba(0,0,0,0.2)",
                        padding: "2%",
                        borderRadius: "7px",
                        marginRight: "1%",
                      }}
                    >
                      {state.seconds || "00"} s
                    </MDTypography>
                  </MDBox>
                )}

                <MDTypography variant="h6" color="success" textAlign="left" py={3}>
                  You can send {presaleArray.isNative ? "BNB" : "BUSD"} to the PrivateSale address
                  (if transaction fails increase gas limit to 200K-1M) or use a button below Make
                  sure that you use Binance Smart Chain (BSC) Testnet <br />
                  Make sure that you use Binance Smart Chain (BSC) Testnet
                </MDTypography>
                {getDataLoading ? (
                  <Skeleton.Input
                    active="true"
                    block="true"
                    style={{ borderRadius: "8px", marginBottom: "4px" }}
                  />
                ) : (
                  <>
                    <Progress
                      percent={parseFloat(
                        ((presaleArray.totalAmount - presaleArray.remainAmount) /
                          presaleArray.totalAmount) *
                          100
                      ).toFixed(4)}
                      status="active"
                      style={{ padding: "30px" }}
                    />
                    <MDTypography variant="h6" color="dark" textAlign="center">
                      {parseFloat(presaleArray.totalAmount - presaleArray.remainAmount).toFixed(2)}/
                      {presaleArray.totalAmount} Token(s)
                    </MDTypography>
                  </>
                )}

                <Grid container spacing={1} py={1} px={1}>
                  <Grid item xs={12} xl={6} md={6} mt={3} style={{ justifyContent: "center" }}>
                    <MDBox
                      style={{ width: "100%" }}
                      coloredShadow="light"
                      borderRadius="10px"
                      p={3}
                      bgColor="white"
                    >
                      {getDataLoading ? (
                        <>
                          <Skeleton.Input
                            active="true"
                            block="true"
                            style={{ borderRadius: "8px", marginBottom: "4px" }}
                          />
                          <Skeleton.Input
                            active="true"
                            style={{ borderRadius: "8px", marginBottom: "4px" }}
                          />
                        </>
                      ) : (
                        <>
                          <MDTypography
                            variant="h6"
                            color="dark"
                            textAlign="left"
                            style={{ width: "100%", display: "flex" }}
                          >
                            Start : {presaleArray.startTime}
                          </MDTypography>
                          <MDTypography
                            variant="h6"
                            color="dark"
                            textAlign="left"
                            style={{ width: "100%", display: "flex" }}
                          >
                            End :{" "}
                            {presaleArray.endTime === presaleArray.startTime
                              ? "No Limit"
                              : presaleArray.endTime}
                          </MDTypography>
                        </>
                      )}
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} xl={6} md={6} mt={3} style={{ justifyContent: "center" }}>
                    <MDBox
                      style={{ width: "100%" }}
                      coloredShadow="light"
                      borderRadius="10px"
                      p={3}
                      bgColor="white"
                    >
                      {getDataLoading ? (
                        <>
                          <Skeleton.Input
                            active="true"
                            block="true"
                            style={{ borderRadius: "8px", marginBottom: "4px" }}
                          />
                          <Skeleton.Input
                            active="true"
                            style={{ borderRadius: "8px", marginBottom: "4px" }}
                          />
                        </>
                      ) : (
                        <>
                          <MDTypography
                            variant="h6"
                            color="dark"
                            textAlign="left"
                            style={{ width: "100%", display: "flex" }}
                          >
                            Min : {presaleArray.minContriAmount}{" "}
                            {presaleArray.isNative ? "BNB" : "BUSD"}
                          </MDTypography>
                          <MDTypography
                            variant="h6"
                            color="dark"
                            textAlign="left"
                            style={{ width: "100%", display: "flex" }}
                          >
                            Max :{" "}
                            {presaleArray.maxContriAmount > config.uintMaxValue
                              ? "No Limit"
                              : presaleArray.maxContriAmount}{" "}
                            {presaleArray.isNative ? "BNB" : "BUSD"}
                          </MDTypography>
                        </>
                      )}
                    </MDBox>
                  </Grid>
                </Grid>
                <Grid container spacing={1} py={1} px={1}>
                  {presaleArray && !presaleArray.isFinished ? (
                    <>
                      <Grid item xs={12} xl={6} md={6} mt={3} style={{ justifyContent: "center" }}>
                        <TextField
                          style={{ width: "100%" }}
                          id="investAmount2"
                          label="Invest Amount"
                          type="number"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        xl={6}
                        md={6}
                        mt={3}
                        style={{ justifyContent: "center", width: "100%", display: "flex" }}
                      >
                        <MDButton
                          color="info"
                          style={{ width: "100%" }}
                          onClick={() => investToken(2)}
                          disabled={!liveState}
                        >
                          <MDTypography
                            variant="h6"
                            color="white"
                            textAlign="center"
                            style={{ width: "100%" }}
                          >
                            {!loading ? "Invest" : <Spin />}
                          </MDTypography>
                        </MDButton>
                      </Grid>
                    </>
                  ) : (
                    <>
                      {!presaleArray.claimedAmount ===
                        presaleArray.totalAmount - presaleArray.remainAmount &&
                        presaleArray.investAmount !== 0 && (
                          <MDBox justifyContent="center" width="100%">
                            <MDBox
                              coloredShadow="light"
                              color="light"
                              m={2}
                              style={{
                                borderRadius: "8px",
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "7px",
                              }}
                            >
                              <MDTypography variant="h6" color="dark">
                                InitialClaimPercent : {presaleArray.initialClaimPercent} %
                              </MDTypography>
                              <MDTypography variant="h6" color="dark">
                                Vesting Cycle : {presaleArray.vestingCycle} s
                              </MDTypography>
                              <MDTypography variant="h6" color="dark">
                                Cycle Percent : {presaleArray.cyclePercent}%
                              </MDTypography>
                            </MDBox>
                            <MDButton
                              color="info"
                              style={{ width: "100%" }}
                              onClick={() => ClaimToken()}
                              disabled={!presaleArray.isStartClaim}
                            >
                              <MDTypography
                                variant="h6"
                                color="white"
                                textAlign="center"
                                style={{ width: "100%" }}
                              >
                                {!loading ? "Claim" : <Spin />}
                              </MDTypography>
                            </MDButton>

                            <Progress
                              percent={parseFloat(
                                (presaleArray.claimedAmount /
                                  (presaleArray.totalAmount - presaleArray.remainAmount)) *
                                  100
                              ).toFixed(4)}
                              status="active"
                              style={{ paddingRight: "30px" }}
                            />
                            <MDTypography variant="h6" color="dark" textAlign="center">
                              {presaleArray.claimedAmount}/
                              {parseFloat(
                                presaleArray.totalAmount - presaleArray.remainAmount
                              ).toFixed(2)}{" "}
                              Token(s)
                            </MDTypography>
                          </MDBox>
                        )}
                    </>
                  )}
                </Grid>
              </MDBox>
            </Grid>
            <Grid item xs={12} xl={4} md={4} mt={3}>
              <MDBox
                style={{ width: "100%" }}
                coloredShadow="light"
                borderRadius="10px"
                p={3}
                bgColor="info"
              >
                <MDTypography variant="h4" color="light" textAlign="center">
                  Invested Token Amount
                </MDTypography>
                {getDataLoading ? (
                  <Skeleton.Input
                    active="true"
                    block="true"
                    style={{ borderRadius: "8px", marginBottom: "4px" }}
                  />
                ) : (
                  <MDTypography variant="h6" color="light" textAlign="left">
                    Invested:{" "}
                    {parseFloat(presaleArray.totalAmount - presaleArray.remainAmount).toFixed(2)}{" "}
                    Token(s) ={" "}
                    {parseFloat(
                      (presaleArray.totalAmount - presaleArray.remainAmount) /
                        presaleArray.tokenPrice
                    ).toFixed(2)}
                    {presaleArray.isNative ? "BNB" : "BUSD"}
                  </MDTypography>
                )}
              </MDBox>
              {account && account === presaleArray.owner ? (
                <MDBox
                  style={{ width: "100%", display: "flex" }}
                  coloredShadow="light"
                  borderRadius="10px"
                  p={3}
                  my={2}
                >
                  <MDButton
                    color="info"
                    style={{ width: "100%", marginRight: "2%" }}
                    onClick={showInvestListModal}
                  >
                    View Invest Lists
                  </MDButton>{" "}
                  <FinalizeclaimButton
                    contractAddress={contractAddress}
                    isFinishedPrivateSale={presaleArray.isFinished}
                    tokenAmount={presaleArray.totalAmount}
                    isStartClaim={presaleArray.isStartClaim}
                    startTime={presaleArray.startTimeStamp}
                    endTime={presaleArray.endTimeStamp}
                    currentTime={presaleArray.currentTime}
                    period={presaleArray.periods}
                    investAmount={presaleArray.investAmount}
                  />
                </MDBox>
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
        </Card>
      </MDBox>
      {/* <Modal
        closable={false}
        open={isModalOpen}
        width={500}
        footer={[<MDButton onClick={handleCancel}>Cancel</MDButton>]}
        className="launchdasboardModal"
      >
        <MDTypography variant="h4" fontWeight="bold">
          Description
        </MDTypography>
        <span style={{ fontSize: "14px" }}>{presaleArray.description}</span>
      </Modal> */}
      <Modal
        key="2"
        closable={false}
        open={isInvestListModalOpen}
        width={500}
        footer={[<MDButton onClick={investListModalCancel}>Cancel</MDButton>]}
        className="launchdasboardModal"
      >
        <MDTypography variant="h4" fontWeight="bold">
          Invest List
        </MDTypography>
        <InvestListTable data={investerArray} getInvestLoadingState={getInvestLoadingState} />
      </Modal>
    </DashboardLayout>
  );
}

export default PreSaleView;
