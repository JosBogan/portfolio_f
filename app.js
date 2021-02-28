function init() {

  // ! Menu Elements

  const burgerMenu = document.querySelector('#burger_menu')
  const menuOverlay = document.querySelector('#menu_overlay')

  //  ! About elements

  const aboutContents = document.querySelectorAll('.about_content_inner')
  const aboutToggles = document.querySelectorAll('.about_toggle')

  // ! Project Elements

  const projectButtons = document.querySelectorAll('.project_upper')
  const projectLowers = document.querySelectorAll('.project_lower')

  // ! Menu Buttons

  const menuButton = document.querySelector('#homeButton')
  const projectsButton = document.querySelector('#projectsButton')
  const aboutButton = document.querySelector('#aboutButton')
  const contactButton = document.querySelector('#contactButton')

  const menuButtons = [menuButton, projectsButton, aboutButton, contactButton]

  // ! Canvas Lines Elements
  
  const linesCanvasBg = document.querySelector('#lines_canvas_bg')
  const linesCtxBg = linesCanvasBg.getContext('2d')

  const linesCanvasFg = document.querySelector('#lines_canvas_fg')
  const linesCtxFg = linesCanvasFg.getContext('2d')


  // ! Canvas Bubble Elements

  const bubbleCanvas = document.querySelector('#bubble_canvas')

  const home = document.querySelector('.home')


  // ! Important Variables


  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  document.documentElement.style.setProperty('--vh', `${windowHeight * 0.01}px`)
  document.documentElement.style.setProperty('--vw', `${windowWidth * 0.01}px`)

  // ! State Variables

  let burgerOpen = false

  let pastMouse = null

  const projectStates = {
    kaku: false,
    asteroid: false,
    beehive: false,
    games: false
  }

  // !  Lines Variables

  const arr = []

  // ! Bubble Variables 

  const bubbleContainer = {
    height: bubbleCanvas.parentElement.getBoundingClientRect().height,
    width: bubbleCanvas.parentElement.getBoundingClientRect().width
  }

  const numberOfCircles = Math.floor((bubbleContainer.height * bubbleContainer.width)  / 30000)
  // const numberOfCircles = 1 // ! FOR TESTING PURPOSES
  const maxRadius = 30
  const minRadius = 3
  const circleSensitivity = 200
  const circleSpeed = 30
  const circleStaticSpeed = 4
  let movementTimer

  const circles = []
  
  // const colours = ['#C03221', '#88CCF1', '#F2D0A4', '#545E75', '#3F826D']
  const colours = ['#AA7DCE', '#8663a3', '#c28fec'] 

  const client = {
    x: null,
    y: null
  }


  // ! Initialising Lines background Canvas

  linesCanvasBg.width = linesCanvasBg.parentElement.getBoundingClientRect().width
  linesCanvasBg.height = linesCanvasBg.parentElement.getBoundingClientRect().height
  linesCanvasFg.width = linesCanvasFg.parentElement.getBoundingClientRect().width
  linesCanvasFg.height = linesCanvasFg.parentElement.getBoundingClientRect().height

  const linesWidth = linesCanvasBg.offsetWidth
  const linesHeight = linesCanvasBg.offsetHeight


  // const dimensions = {
  //   x: 21,
  //   y: 10
  // }

  const dimensions = {
    x: 56,
    y: 28
  }

  const gridDimensions = {
    x: linesWidth / dimensions.x,
    y: linesHeight / dimensions.y
  }

  const lineHeights = []

  for (let x = gridDimensions.x / 2; x < window.innerWidth; x += gridDimensions.x) {
    // ! Hard coded line distance method - find programmatic
    // let start = 0.1
    for (let y = gridDimensions.y / 2; y < window.innerHeight; y += gridDimensions.y) {
      linesCtxBg.fillStyle = '#AA7DCE'
      linesCtxBg.beginPath()
      
      // linesCtxBg.arc(x, y + start , 1, 0, 2 * Math.PI)
      // ! Better method, but need to find solution for mouse clipping
      linesCtxBg.arc(x, y, 1, 0, 2 * Math.PI)
      linesCtxBg.fill()
      // if (lineHeights.length < 28) lineHeights.push(y + start)

      // ! Hard coded line distance method - find programmatic
      // start *= 1.65
    }
  }

  console.log(lineHeights)

  // ! Initialising the Bubbles canvas

  bubbleCanvas.width = bubbleContainer.width
  bubbleCanvas.height = bubbleContainer.height

  // bubbleCanvas.width = windowWidth
  // bubbleCanvas.height = windowHeight

  
  const bubbleCtx = bubbleCanvas.getContext('2d')

  function randomColours() {
    // console.log(Math.ceil(Math.random() * colours.length) - 1)
    return Math.ceil(Math.random() * colours.length) - 1

  }

  class Circle {
    constructor(radius, position) {
      this.colour = colours[randomColours()]
      this.radius = radius
      this.position = {
        x: position[0],
        y: position[1]
      }
      this.direction = [(parseFloat(Math.random().toFixed(2)) - 0.5) / circleStaticSpeed, (parseFloat(Math.random().toFixed(2)) - 0.5) / circleStaticSpeed]
    }
  }

  function createCircle() {
    const radius = Math.floor(Math.random() * (maxRadius - minRadius)) + minRadius
    let positionX = Math.ceil(Math.random() * bubbleContainer.width)
    positionX = Math.min(Math.max(positionX, 0 + radius), bubbleContainer.width - radius)
    let positionY = Math.ceil(Math.random() * bubbleContainer.height) 
    positionY = Math.min(Math.max(positionY, 0 + radius), bubbleContainer.height - radius)
    return { radius, positionX, positionY }
  }

  function createCircles(num) {
    for (let i = 0; i < num; i++) {
      const newCircle = createCircle()
      // console.log(newCircle)
      // newCircle = circleChecker()
      circles.push(new Circle(newCircle.radius, [newCircle.positionX, newCircle.positionY]))
    }
  }

  function drawCircles() {
    circles.forEach(circle => {
      
      bubbleCtx.fillStyle = circle.colour

      bubbleCtx.beginPath()
      bubbleCtx.ellipse(circle.position.x, circle.position.y, circle.radius, circle.radius, 0, 0, Math.PI * 2)
      bubbleCtx.fill()
      bubbleCtx.closePath()
    })
  }

  function clearMovement() {
    client.x = null
    client.y = null
  }


  // ! TRACK MOUSE MOVEMENT

  // * Use this function for the programmatic mouse clipping
  function calcExponent(mouse) {
    const starting = parseInt((mouse) / gridDimensions.y)
    const extra = 0.1 * (1.6 ** starting)
    return extra

  }

  function lineMouseMove(e) {

    //! INCLUDE CHECKS TO SEE IF THE MOUSE IS OUTSIDE THE ELEMETN BOUNDS AND RETURN HERE IF IT IS!

    const cellX = (parseInt((e.pageX) / gridDimensions.x) * gridDimensions.x) + gridDimensions.x / 2

    //! Old method - try maths
    const cellY = (parseInt((e.pageY) / gridDimensions.y) * gridDimensions.y) + gridDimensions.y / 2

    // ! Work around - Try to find programmatic method!
    // const cellY = lineHeights.find((line, i) => {
    //   if (e.pageY < lineHeights[0] + ((lineHeights[1] - lineHeights[0]) / 2)) {
    //     return i === 0
    //   }
    //   return (
    //     e.pageY < (line + (Math.abs(lineHeights[i + 1] - lineHeights[i]) / 2)) && e.pageY > (line - (Math.abs(lineHeights[i - 1] + lineHeights[i]) / 2))
    //   )
    // })

    
    if (!pastMouse) {
      pastMouse = {
        x: cellX,
        y: cellY,
        a: 1
      }
      return arr.push(pastMouse)
    }
    if (pastMouse.x !== cellX || pastMouse.y !== cellY) {
      const newLocation = {
        x: cellX,
        y: cellY,
        a: 1
      }
      arr.push(newLocation)
      pastMouse = { ...newLocation }
    }
  }

  function bubbleCanvasMove(e) {
    clearTimeout(movementTimer)
    client.x = e.pageX
    client.y = e.pageY
    // To reset ball movement
    movementTimer = setTimeout(clearMovement, 1000)
  }

  function moveMouseFunc(e) {
    lineMouseMove(e)
    bubbleCanvasMove(e)
  }

  // ! BUBBLES

  function calculateDistance(circle) {
    const opp = Math.pow(circle.position.x - client.x, 2)
    const adj = Math.pow((circle.position.y + bubbleCanvas.getBoundingClientRect().top + window.pageYOffset) - client.y, 2)
    const hyp = Math.sqrt(opp + adj)
    return hyp
  }
  
  // function calculateDistanceBetweenCircles(circle, pointX, pointY, radius) {
  //   const opp = Math.pow(circle.position.x - pointX, 2)
  //   const adj = Math.pow(circle.position.y - pointY, 2)
  //   const hyp = Math.abs(Math.sqrt(opp + adj))
  //   if (circle.radius + radius <= hyp) return true
  //   return false
  // }
  
  function calculateUnitVector(circle) {
    const opp = circle.position.x - client.x
    const adj = (circle.position.y + bubbleCanvas.getBoundingClientRect().top + window.pageYOffset) - client.y
    const magnitude = Math.sqrt(Math.pow(opp, 2) + Math.pow(adj, 2) )
    const unitVector = [opp / magnitude, adj / magnitude]
    return unitVector
  }


  // ! about content block

  function changeAboutContent(event) {

    aboutContents.forEach(content => {
      content.getAttribute('data-name') === event.target.getAttribute('data-name') ? content.style.display = 'block' : content.style.display = 'none'
    })
    aboutToggles.forEach(toggle => {
      toggle === event.target ? toggle.classList.add('about_toggle_on') : toggle.classList.remove('about_toggle_on')
    })

  }

  // ! onTick Canvas 

  function lineCanvasTick() {
    linesCtxFg.clearRect(0, 0, linesCanvasFg.width, linesCanvasFg.height)
    for (let i = 0; i < arr.length - 1; i++) {
      arr[i].a = arr[i].a - 0.02
      linesCtxFg.beginPath()
      linesCtxFg.lineWidth = 1
      linesCtxFg.strokeStyle = 'rgba(170, 125, 206, ' + arr[i].a + ')'
      linesCtxFg.moveTo(arr[i].x, arr[i].y)
      linesCtxFg.lineTo(arr[i + 1].x, arr[i + 1].y)
      linesCtxFg.stroke()
      linesCtxFg.closePath()
      if (arr[i].a < 0) arr.splice(i, 1)
    }
  }

  function bubbleCanvasTick() {
    bubbleCtx.clearRect(0, 0, bubbleContainer.width, bubbleContainer.height)
    circles.forEach(circle => {
      // checking if the mouse is near
      const distance = calculateDistance(circle)
      if (
        distance < circleSensitivity && 
        client.x !== null && client.y !== null
      ) {
        const unitVector = calculateUnitVector(circle) // Use this to find the angle it is flying off in
        const magnitude = circleSensitivity - distance
        // circle.direction = [unitVector[0] * magnitude, unitVector[1] * magnitude]
        if (
          !(circle.position.x + (unitVector[0] * (magnitude / circleSpeed)) + circle.radius >= bubbleContainer.width) &&
          !(circle.position.x + (unitVector[0] * (magnitude / circleSpeed)) - circle.radius <= 0)
        ) {
          const vector = unitVector[0] * (magnitude / circleSpeed)
          // ISSUE OCURRING BECAUSE THE DISTANCE IS BEING HALVED EACH TIME TO IT NEVER ACTUALLY GETS BEYOND THE DISTANCE
          circle.position.x += vector
          circle.direction[0] = vector
        }
        if (
          !(circle.position.y + (unitVector[1] * (magnitude / circleSpeed)) + circle.radius >= bubbleContainer.height) &&
          !(circle.position.y + (unitVector[1] * (magnitude / circleSpeed)) - circle.radius <= 0)
        ) {
          const vector = unitVector[1] * (magnitude / circleSpeed)
          // circle.direction = [...v]
          // ISSUE OCURRING BECAUSE THE DISTANCE IS BEING HALVED EACH TIME TO IT NEVER ACTUALLY GETS BEYOND THE DISTANCE
          circle.position.y += vector
          circle.direction[1] = vector
        }
      } else {
        if (
          !(circle.position.x + circle.direction[0] + circle.radius >= bubbleContainer.width) &&
          !(circle.position.x + circle.direction[0] - circle.radius <= 0)
        ) {
          circle.position.x += circle.direction[0]
        } else {
          circle.direction[0] = (parseFloat(Math.random().toFixed(2)) - 0.5) / circleStaticSpeed
        }
        if (
          !(circle.position.y + circle.direction[1] + circle.radius >= bubbleContainer.height) &&
          !(circle.position.y + circle.direction[1] - circle.radius <= 0)
        ) {
          circle.position.y += circle.direction[1]
        } else {
          circle.direction[1] = (parseFloat(Math.random().toFixed(2)) - 0.5) / circleStaticSpeed
        }
      }
    })

    drawCircles()
  }

  function tick() {
    // ! Cut down processing power by dictating when these are set off!
    lineCanvasTick()
    bubbleCanvasTick()
    window.requestAnimationFrame(tick)
  }

  window.requestAnimationFrame(tick)


  // Burger Menu

  function burgerMenuFunction() {
    const burgerLines = burgerMenu.childNodes
    switch (burgerOpen) {
      case true:
        burgerLines[0].classList.remove('burger_line_top_clicked')
        burgerLines[1].classList.remove('burger_line_bot_clicked')

        menuOverlay.classList.remove('menu_overlay_open')
        burgerOpen = false
        break
      case false:
        console.log(burgerLines)
        burgerLines[0].classList.add('burger_line_top_clicked')
        burgerLines[1].classList.add('burger_line_bot_clicked')
        menuOverlay.classList.add('menu_overlay_open')
        burgerOpen = true
        break
    }
  }

  // ! Project funtionality

  function openProject(e) {
    const target = Array.from(projectLowers).find(el => el.getAttribute('data-name') === e.target.getAttribute('data-name'))
    if (target.classList.value.includes('project_lower_open')) {
      target.classList.remove('project_lower_open')
    } else {
      target.classList.add('project_lower_open')
    }
  }

  function scrollAnims() {

  }

  function closeWindow() {
    const burgerLines = burgerMenu.childNodes
    burgerLines[0].classList.remove('burger_line_top_clicked')
    burgerLines[1].classList.remove('burger_line_bot_clicked')
    menuOverlay.classList.remove('menu_overlay_open')
    burgerOpen = false
  }


  // ! Setting stuff in motion

  createCircles(numberOfCircles)

  // ? NEED RESIZE EVents

  // ! event Listeneters

  window.addEventListener('mousemove', moveMouseFunc)

  aboutToggles.forEach(toggle => toggle.addEventListener('click', changeAboutContent))
  // window.addEventListener('click', clickTarget)

  burgerMenu.addEventListener('click', burgerMenuFunction)

  projectButtons.forEach(project => {
    project.addEventListener('click', openProject)
  })

  menuButtons.forEach(button => {
    button.addEventListener('click', closeWindow)
  })

  document.addEventListener('scroll', scrollAnims)


}

window.addEventListener('DOMContentLoaded', init)