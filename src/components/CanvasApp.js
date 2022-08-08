import React, { useEffect, useState } from 'react';

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 600;
const UNIT_WIDTH = 50;
const UNIT_HEIGHT = 50;

const CanvasApp = () => {
  let [score, setScore] = useState(0)
  let [characterX, setCharacterX] = useState(250)
  let [characterY, setCharacterY] = useState(250)
  let [context, setContext] = useState(null)
  const obstacles = [
    { x: 50, y: 50, width: 50, height: 50},
    { x: 0, y: 350, width: 50, height: 50},
    { x: 100, y: 200, width: 50, height: 50},
    { x: 150, y: 500, width: 50, height: 50},
    { x: 350, y: 350, width: 50, height: 50},
    { x: 900, y: 100, width: 50, height: 50},
    { x: 800, y: 450, width: 50, height: 50},
    { x: 600, y: 100, width: 50, height: 50},
    { x: 500, y: 150, width: 50, height: 50},
  ]

  const getCorrectPrize = () => {
    let assignedX = 0, assignedY = 0
    while(true) {
      assignedX = Math.floor(Math.random() * CANVAS_WIDTH/50) * 50
      assignedY = Math.floor(Math.random() * CANVAS_HEIGHT/50) * 50
      if (!obstacles.find((obs) => obs.x === assignedX && obs.y === assignedY)) break
    }
    return {
      x: assignedX,
      y: assignedY,
      width: UNIT_WIDTH,
      height: UNIT_HEIGHT
    }
  }

  let [prize, setPrize] = useState(getCorrectPrize)
  let [prizeWon, setPrizeWon] = useState(false)

  const collision = (valueX, valueY) => (
    valueX < 0 ||
    valueX >= CANVAS_WIDTH ||
    valueY < 0 ||
    valueY >= CANVAS_HEIGHT ||
    obstacles.find((obs) => obs.x === valueX && obs.y === valueY)
  )

  const handleKeyEvents = (event) => {
    console.log(event.key)
    switch (event.key) {
      case 'w':
        if (!collision(characterX, characterY - 50)) setCharacterY(characterY -= 50)
        break;
      case 's':
        if (!collision(characterX, characterY + 50)) setCharacterY(characterY += 50)
        break;
      case 'd':
        if (!collision(characterX + 50, characterY)) setCharacterX(characterX += 50)
        break;
      case 'a':
        if (!collision(characterX - 50, characterY)) setCharacterX(characterX -= 50)
        break;
      default:
        break;
    }
    if (characterX === prize.x && characterY === prize.y) setPrizeWon(true)
  }

  const displayPrize = (prizeFound) => {
    context.fillStyle = '#FFFF33';
    context.fillRect(prize.x, prize.y, prize.width, prize.height);
  }

  useEffect(() => {
    if (prizeWon) {
      setScore(score + 1)

      setPrize(getCorrectPrize)
      setPrizeWon(false)
    }
  }, [prizeWon]);

  useEffect(() => {
    window.addEventListener('keypress', handleKeyEvents);
    return () => window.removeEventListener('keypress', handleKeyEvents);
  }, [characterX, characterY])

  useEffect(() => {
    reRenderCanvas()
  }, [context, handleKeyEvents])

  const reRenderCanvas = async () => {
    await setContext(document.getElementById('tutorial').getContext('2d'));
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Background
    context.fillStyle = '#00AA0033';
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Character
    context.fillStyle = '#00AA00';
    context.fillRect(characterX, characterY, UNIT_WIDTH, UNIT_HEIGHT);

    // Obstacles
    context.fillStyle = '#0000AA';
    obstacles.forEach((obs) => context.fillRect(obs.x, obs.y, obs.width, obs.height))

    // Prize
    displayPrize(false)

  }


  return (
      <div>
        <p>Score: {score}</p>
        <canvas
          id='tutorial'
          height={CANVAS_HEIGHT}
          style={{
            border: '1px solid black',
          }}
          width={CANVAS_WIDTH}
        ></canvas>
      </div>
  );
}

export default CanvasApp;
