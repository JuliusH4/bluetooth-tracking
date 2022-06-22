import React, { useEffect, useState } from 'react';
import Canvas from './canvas';
import styled from 'styled-components'


const StyledButton = styled.button`
background: "blue";
color: "white";
font-size: 1em;
margin: 1em;
padding: 0.25em 1em;
border: 2px solid palevioletred;
border-radius: 3px;
`

const RoomMap = props => {

  const [ deviceCoordinates, setDeviceCoordinates] = useState([]);
  const [ hubCoordinates, setHubCoordinates] = useState([]);
  const [ moduleCoordinates, setModuleCoordinates] = useState([]);

  const dataURI = "http://192.168.178.146:3000"

  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  const updatePositions = () => {
    const url = dataURI + "/positions"
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch("192.168.178.146:3000/positions", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  useEffect(() => {
    const coords1 = {x: 100, y: 200}
    const coords2 = {x: 50, y: 300}
    setDeviceCoordinates([coords1, coords2])
    setHubCoordinates([{x: 400, y:100}])
    setModuleCoordinates([{x: 200,y: 400}, {x:700, y: 40}])
  }, [])

  return <div>
    <Canvas devicePositions={deviceCoordinates} hubPositions={hubCoordinates} modulePositions={moduleCoordinates} /><br></br>
    <StyledButton onClick={updatePositions}>
    Update Positions
    </StyledButton>
    </div>
}

export default RoomMap
