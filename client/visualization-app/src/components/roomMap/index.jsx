import React, { useEffect, useState } from 'react';
import Canvas from './canvas';

const RoomMap = props => {

  const [ deviceCoordinates, setDeviceCoordinates] = useState([]);
  const [ hubCoordinates, setHubCoordinates] = useState([]);
  const [ moduleCoordinates, setModuleCoordinates] = useState([]);

  const dataURI = "localhost:3500/position"

  useEffect(() => {

    fetch(dataURI).then((res_) =>
      res_.json()).then(res => {
        console.log(res)
      })

    const coords1 = {x: 100, y: 200}
    const coords2 = {x: 50, y: 300}
    setDeviceCoordinates([coords1, coords2])
    setHubCoordinates([{x: 400, y:100}])
    setModuleCoordinates([{x: 200,y: 400}, {x:700, y: 40}])
  }, [])

  return <Canvas devicePositions={deviceCoordinates} hubPositions={hubCoordinates} modulePositions={moduleCoordinates} />
}

export default RoomMap
