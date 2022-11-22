import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TextField from "@mui/material/TextField";
import MDButton from "components/MDButton";
import Grid from "@mui/material/Grid";
import { Badge, message } from "antd";

import config from "config/config";
import PRIVATEFACTORYMANAGERABI from "../../assets/abi/PRESALEFACTORYMANAGERABI.json";

const ethers = require("ethers");

function Organization() {
  const { account } = useWeb3React();
  const Navigate = useNavigate();
  // const [orgvaildation, setOrgValidation] = useState("");
  // const [ownerNamevaildation, setOwnerNameValidation] = useState("");
  // const [contactInfovalidation, setContactInoValidation] = useState("");
  const [createState, setCreateState] = useState(false);

  const Provider = new ethers.providers.Web3Provider(window.ethereum);
  const Signer = Provider.getSigner();

  const PresaleFactoryContract = new ethers.Contract(
    config.PresaleFactoryManager,
    PRIVATEFACTORYMANAGERABI,
    Signer
  );

  const createOrgFunc = () => {
    const organizationTitle = document.getElementById("organizationTitle").value;
    const description = document.getElementById("description").value;
    // const siteUrl = document.getElementById("siteUrl").value;
    const imgUrl = document.getElementById("imgUrl").value;
    // const ownerName = document.getElementById("ownerName").value;
    const contactInfo = document.getElementById("contactInfo").value;
    PresaleFactoryContract.createOrgnization(
      organizationTitle,
      description,
      imgUrl,
      contactInfo
    ).then((tx) => {
      tx.wait().then(() => {
        message.success("Created organization successful.");
        Navigate("/launchDashboard");
      });
    });
    // // organizationTitle === ""
    // //   ? setOrgValidation("This is a mandatory field!")
    // //   : ownerName === ""
    // //   ? setOwnerNameValidation("This is a mandatory fileld!")
    // //   : setContactInoValidation("This is a mandatory field!");
  };

  const createStateFunc = () => {
    const organizationTitle = document.getElementById("organizationTitle").value;
    const ownerName = document.getElementById("ownerName").value;
    const contactInfo = document.getElementById("contactInfo").value;

    // eslint-disable-next-line no-unused-expressions
    organizationTitle !== "" && ownerName !== "" && contactInfo !== ""
      ? setCreateState(true)
      : setCreateState(false);
  };

  useEffect(async () => {
    const orgState = await PresaleFactoryContract.orgOf(account);
    // eslint-disable-next-line no-unused-expressions
    Number(orgState) === 1 ? Navigate("/launchDashboard") : Navigate("/organization");
  }, [account]);

  return (
    <MDBox p={4}>
      <DashboardNavbar />
      <MDBox style={{ minHeight: "500px" }} p={3} color="light">
        <Grid container spacing={1} py={2}>
          <Grid item xs={0} xl={2} md={1} style={{ justifyContent: "center" }} />
          <Grid item xs={12} xl={8} md={10} style={{ justifyContent: "center", width: "100%" }}>
            <MDTypography variant="h2" color="info" style={{ textAlign: "center" }}>
              Introducing Organization!
            </MDTypography>
            <MDTypography variant="h5" color="dark" style={{ textAlign: "center" }}>
              Your wallet {account && account.toString().slice(0, 4)}...
              {account && account.toString().slice(-4)} must be asscociated with an organization to
              proceed forward.
            </MDTypography>
            <MDTypography
              variant="h6"
              color="dark"
              fontWeight="regular"
              style={{ textAlign: "center" }}
            >
              Creating an organization will help you to add multiple admin accounts and other
              features.
            </MDTypography>
            <Badge.Ribbon text="Step1">
              <MDBox mt={5} style={{ borderRadius: "8px", border: "1px solid #e3e3e3" }}>
                <MDBox
                  color="info"
                  style={{
                    padding: "2%",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                    borderBottom: "1px solid #e3e3e3",
                  }}
                >
                  Organization Detail
                </MDBox>
                <MDBox p={4}>
                  {" "}
                  <TextField
                    style={{ width: "100%" }}
                    id="organizationTitle"
                    label=" Organization Title *"
                    type="text"
                    onChange={createStateFunc}
                  />
                  <MDTypography
                    color="dark"
                    fontWeight="light"
                    style={{ textAlign: "left", fontSize: "13px", marginBottom: "3%" }}
                  >
                    You cannot edit this later. This name will be visible to your contributors in
                    pools you create.
                  </MDTypography>
                  <TextField
                    style={{ width: "100%", marginBottom: "3%" }}
                    id="description"
                    label="Description (optional)"
                    type="text"
                  />
                  <TextField
                    style={{ width: "100%" }}
                    id="siteUrl"
                    label="Website / Telegram / Discord / Other Link (Optional)"
                    type="text"
                  />{" "}
                  <MDTypography
                    color="dark"
                    fontWeight="light"
                    style={{ textAlign: "left", fontSize: "13px", marginBottom: "3%" }}
                  >
                    Must be a url link. This link will be visible to your contributors to identify
                    you.
                  </MDTypography>
                </MDBox>
              </MDBox>
            </Badge.Ribbon>
            <Badge.Ribbon text="Step2">
              <MDBox mt={5} style={{ borderRadius: "8px", border: "1px solid #e3e3e3" }}>
                <MDBox
                  color="info"
                  style={{
                    padding: "2%",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                    borderBottom: "1px solid #e3e3e3",
                  }}
                >
                  Upload Logo (Optional)
                </MDBox>
                <MDBox p={4}>
                  {" "}
                  <TextField
                    style={{ width: "100%", marginBottom: "3%" }}
                    id="imgUrl"
                    label=" IMG Url"
                    type="text"
                  />
                </MDBox>
              </MDBox>
            </Badge.Ribbon>
            <Badge.Ribbon text="Step3">
              <MDBox mt={5} style={{ borderRadius: "8px", border: "1px solid #e3e3e3" }}>
                <MDBox
                  color="info"
                  style={{
                    padding: "2%",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                    borderBottom: "1px solid #e3e3e3",
                  }}
                >
                  Organization Owner
                </MDBox>
                <MDBox p={4}>
                  {" "}
                  <TextField
                    style={{ width: "100%", marginBottom: "3%" }}
                    id="ownerName"
                    label=" Your Name *"
                    type="text"
                    onChange={createStateFunc}
                  />
                  <TextField
                    style={{ width: "100%" }}
                    id="contactInfo"
                    label="Contact Info (Your Email / Discord / Telegram / Others)"
                    type="text"
                    onChange={createStateFunc}
                  />
                  <MDTypography
                    color="dark"
                    fontWeight="light"
                    style={{ textAlign: "left", fontSize: "13px", marginBottom: "3%" }}
                  >
                    Must be a url link. This link will be visible to your contributors to identify
                    you.
                  </MDTypography>
                </MDBox>
              </MDBox>
            </Badge.Ribbon>
            <MDButton
              color="info"
              style={{ width: "100%", marginTop: "3%" }}
              onClick={() => createOrgFunc()}
              disabled={!createState}
            >
              <MDTypography variant="h6" color="white" textAlign="center" style={{ width: "100%" }}>
                Create Organization
              </MDTypography>
            </MDButton>
          </Grid>
          <Grid item xs={0} xl={2} md={1} style={{ justifyContent: "center" }} />
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default Organization;
