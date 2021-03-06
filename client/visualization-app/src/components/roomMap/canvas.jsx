import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'

const StyledCanvas = styled.canvas`
border: 5px solid #000000
`

const Canvas = props => {

  console.log("Canvas props",props)

  const canvasRef = useRef(null)
  const deviceRadius = 8
  // const hubRadius = 12
  const moduleRadius = 10

  const draw = (context, devices, color, radius) => {
    context.fillStyle = color
  
    Object.keys(devices).forEach(device => {
      context.beginPath()
      const position = devices[device]
      console.log("draw", position)
      context.arc(parseInt(position.x), parseInt(position.y), radius, 0, 2*Math.PI)
      context.fill()
    });
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height);
    draw(context, props.devicePositions, "#0000FF", deviceRadius)
    //draw(context, props.hubPositions, "#FF0000", hubRadius)
    draw(context, props.modulePositions, "#00FFFF", moduleRadius)
  }, [props])

  return <StyledCanvas ref={canvasRef} height={500} width={1000}/>
}

export default Canvas