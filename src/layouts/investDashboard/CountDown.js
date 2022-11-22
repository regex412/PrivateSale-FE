import { useState, useEffect } from "react";
import { Switch } from "antd";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// eslint-disable-next-line no-unused-vars, react/prop-types
function CountDown({ startTime, EndTime, remainAmount }) {
  const [isLive, setIsLive] = useState();
  const [state, setState] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const setNewTime = () => {
    const currentTime = new Date().getTime();
    if (remainAmount !== 0) {
      if (currentTime < EndTime * 1000) {
        let countDown;
        if (currentTime < Number(startTime * 1000 + 10000)) {
          countDown = Number(startTime * 1000 + 10000);
          setIsLive(false);
        } else {
          // eslint-disable-next-line no-unused-vars
          countDown = Number(EndTime * 1000);
          setIsLive(true);
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
        if (startTime === EndTime) {
          // eslint-disable-next-line no-unused-expressions
          remainAmount === 0 ? setIsLive(false) : setIsLive(true);
        } else {
          setIsLive(false);
        }
      }
    } else {
      setState(0, 0, 0, 0);
      setIsLive(false);
    }
  };

  useEffect(() => {
    setInterval(() => setNewTime(), 1000);
  }, []);
  return (
    <MDBox
      coloredShadow="light"
      borderRadius="7px"
      p={1}
      mt={3}
      mb={1}
      style={{ width: "100%", display: "flex", justifyContent: "center" }}
    >
      <MDTypography variant="h6" color="dark" textAlign="left" px={4} py={1}>
        {state.days || "0"}d {state.hours || "0"}h {state.minutes || "0"}m {state.seconds || "0"}s
      </MDTypography>
      <Switch
        style={{ marginTop: "4%" }}
        checkedChildren="On"
        unCheckedChildren="Off"
        checked={isLive}
      />
    </MDBox>
  );
}

export default CountDown;
