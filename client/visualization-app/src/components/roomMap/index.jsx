import React, { useEffect, useState } from "react";
import Canvas from "./canvas";
import styled from "styled-components";
const axios = require("axios");

const StyledButton = styled.button`
  background: "blue";
  color: "white";
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

const RoomMap = (props) => {
  const [deviceCoordinates, setDeviceCoordinates] = useState({});
  //const [ hubCoordinates, setHubCoordinates] = useState([]);
  const [moduleCoordinates, setModuleCoordinates] = useState([]);

  const dataURI = "http://192.168.178.146:3330";

  const updatePositions = () => {
    const url_pos = dataURI + "/positions";
    axios.get(url_pos).then((response) => {
      console.log("update positions", response);
      const data = response.data;
      setDeviceCoordinates(data);
    });

    const url_mod = dataURI + "/modules";
    axios.get(url_mod).then((response) => {
      console.log("update modules", response);
      const data = response.data;
      setModuleCoordinates(data);
    });
  };

  useEffect(() => {
    //setHubCoordinates([{x: 400, y:100}])
    // setModuleCoordinates([
    //   { x: 200, y: 400 },
    //   { x: 700, y: 40 },
    // ]);
    updatePositions();
  }, []);

  return (
    <div>
      <Canvas
        devicePositions={deviceCoordinates}
        /*hubPositions={hubCoordinates}*/ modulePositions={moduleCoordinates}
      />
      <br></br>
      <StyledButton onClick={updatePositions}>Update Positions</StyledButton>
    </div>
  );
};

export default RoomMap;
