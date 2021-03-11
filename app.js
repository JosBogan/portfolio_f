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


  const paragraphLines = document.querySelectorAll('.paragraph_line')
  const devicons = document.querySelectorAll('.devicon')
  const contactContainer = document.querySelector('.contact_container')
  const aboutInterests = document.querySelectorAll('.about_interests p')
  const aboutIntro = document.querySelectorAll('.about_intro p')


  
  const scrollAnimElements = [...paragraphLines, ...devicons, contactContainer, ...aboutInterests, ...aboutIntro]
  
  console.log(scrollAnimElements)
  // ! Canvas Lines Elements
  
  const linesCanvasBg = document.querySelector('#lines_canvas_bg')
  const linesCtxBg = linesCanvasBg.getContext('2d')

  const linesCanvasFg = document.querySelector('#lines_canvas_fg')
  const linesCtxFg = linesCanvasFg.getContext('2d')

  // ! Canvas LinesBot Elements

  const linesCanvasBgBot = document.querySelector('#lines_canvas_bg_bot')
  const linesCtxBgBot = linesCanvasBgBot.getContext('2d')

  const linesCanvasFgBot = document.querySelector('#lines_canvas_fg_bot')
  const linesCtxFgBot = linesCanvasFgBot.getContext('2d')

  const ctxArray = [linesCtxFg, linesCtxFgBot]

  // console.log(ctxArray.width)


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

  let mouseLocation

  let pastClippedMouseLocation

  // ! OLD TILL 72

  const pastMouseTop = null
  const pastMouseBot = null

  // !  Lines Variables

  const canvasLinesArray = []

  const canvasLinesArrayTop = []
  const canvasLinesArrayBot = []

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

  // ! Initialising Lines background Canvas BOT

  linesCanvasBgBot.width = linesCanvasBgBot.parentElement.getBoundingClientRect().width
  linesCanvasBgBot.height = linesCanvasBgBot.parentElement.getBoundingClientRect().height
  linesCanvasFgBot.width = linesCanvasFgBot.parentElement.getBoundingClientRect().width
  linesCanvasFgBot.height = linesCanvasFgBot.parentElement.getBoundingClientRect().height

  const linesWidthBot = linesCanvasBgBot.offsetWidth
  const linesHeightBot = linesCanvasBgBot.offsetHeight


  const testDimensions = {
    x: 25,
    y: 25
  }

  const topStats = {
    count: {
      xNum: Math.floor(linesCanvasBg.parentElement.getBoundingClientRect().width / testDimensions.x),
      yNum: Math.floor(linesCanvasBg.parentElement.getBoundingClientRect().height / testDimensions.y)
    },
    offset: {
      x: Math.floor(linesCanvasBg.parentElement.getBoundingClientRect().width % testDimensions.x),
      y: Math.floor(linesCanvasBg.parentElement.getBoundingClientRect().height % testDimensions.y)
    }
  }

  const botStats = {
    count: {
      xNum: Math.floor(linesCanvasBgBot.parentElement.getBoundingClientRect().width / testDimensions.x),
      yNum: Math.floor(linesCanvasBgBot.parentElement.getBoundingClientRect().height / testDimensions.y)
    },
    offset: {
      x: Math.floor(linesCanvasBgBot.parentElement.getBoundingClientRect().width % testDimensions.x),
      y: Math.floor(linesCanvasBgBot.parentElement.getBoundingClientRect().height % testDimensions.y)
    }
  }


  const dimensionsBot = {
    x: 20,
    y: 10
  }


  const dimensions = {
    x: 56,
    y: 28
  }

  const gridDimensions = {
    x: linesWidth / dimensions.x,
    y: linesHeight / dimensions.y
  }

  const gridDimensionsBot = {
    x: linesWidth / dimensions.x,
    y: linesHeight / dimensions.y
  }

  const lineHeights = []

  // ! TESTING STUFF

  for (let x = topStats.offset.x / 2; x < window.innerWidth; x += testDimensions.x) {
    // ! Hard coded line distance method - find programmatic
    // let start = 0.1
    for (let y = topStats.offset.y / 2; y < window.innerHeight; y += testDimensions.y) {
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

  for (let x = botStats.offset.x / 2; x < window.innerWidth; x += testDimensions.x) {
    // ! Hard coded line distance method - find programmatic
    // let start = 0.1
    for (let y = botStats.offset.y / 2; y < window.innerHeight; y += testDimensions.y) {
      linesCtxBgBot.fillStyle = '#AA7DCE'
      linesCtxBgBot.beginPath()
      
      // linesCtxBg.arc(x, y + start , 1, 0, 2 * Math.PI)
      // ! Better method, but need to find solution for mouse clipping
      linesCtxBgBot.arc(x, y, 1, 0, 2 * Math.PI)
      linesCtxBgBot.fill()
      // if (lineHeights.length < 28) lineHeights.push(y + start)

      // ! Hard coded line distance method - find programmatic
      // start *= 1.65
    }
  }



  // ! TOP GRID INITIALISATION

  // for (let x = gridDimensions.x / 2; x < window.innerWidth; x += gridDimensions.x) {
  //   // ! Hard coded line distance method - find programmatic
  //   // let start = 0.1
  //   for (let y = gridDimensions.y / 2; y < window.innerHeight; y += gridDimensions.y) {
  //     linesCtxBg.fillStyle = '#AA7DCE'
  //     linesCtxBg.beginPath()
      
  //     // linesCtxBg.arc(x, y + start , 1, 0, 2 * Math.PI)
  //     // ! Better method, but need to find solution for mouse clipping
  //     linesCtxBg.arc(x, y, 1, 0, 2 * Math.PI)
  //     linesCtxBg.fill()
  //     // if (lineHeights.length < 28) lineHeights.push(y + start)

  //     // ! Hard coded line distance method - find programmatic
  //     // start *= 1.65
  //   }
  // }

  // ! BOT GRID INITIALISATION

  // for (let x = gridDimensionsBot.x / 2; x < window.innerWidth; x += gridDimensionsBot.x) {
  //   // ! Hard coded line distance method - find programmatic
  //   // let start = 0.1
  //   for (let y = gridDimensionsBot.y / 2; y < window.innerHeight; y += gridDimensionsBot.y) {
  //     linesCtxBgBot.fillStyle = '#AA7DCE'
  //     linesCtxBgBot.beginPath()
      
  //     // linesCtxBg.arc(x, y + start , 1, 0, 2 * Math.PI)
  //     // ! Better method, but need to find solution for mouse clipping
  //     linesCtxBgBot.arc(x, y, 1, 0, 2 * Math.PI)
  //     linesCtxBgBot.fill()
  //     // if (lineHeights.length < 28) lineHeights.push(y + start)

  //     // ! Hard coded line distance method - find programmatic
  //     // start *= 1.65
  //   }
  // }


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

  // function lineMouseMoveTop(e) {

  //   //! INCLUDE CHECKS TO SEE IF THE MOUSE IS OUTSIDE THE ELEMETN BOUNDS AND RETURN HERE IF IT IS!

  //   const cellX = (parseInt((e.pageX) / gridDimensions.x) * gridDimensions.x) + gridDimensions.x / 2

  //   //! Old method - try maths
  //   const cellY = (parseInt((e.pageY) / gridDimensions.y) * gridDimensions.y) + gridDimensions.y / 2

  //   // ! Work around - Try to find programmatic method!
  //   // const cellY = lineHeights.find((line, i) => {
  //   //   if (e.pageY < lineHeights[0] + ((lineHeights[1] - lineHeights[0]) / 2)) {
  //   //     return i === 0
  //   //   }
  //   //   return (
  //   //     e.pageY < (line + (Math.abs(lineHeights[i + 1] - lineHeights[i]) / 2)) && e.pageY > (line - (Math.abs(lineHeights[i - 1] + lineHeights[i]) / 2))
  //   //   )
  //   // })

    
  //   if (!pastMouseTop) {
  //     pastMouseTop = {
  //       x: cellX,
  //       y: cellY,
  //       a: 1
  //     }
  //     return canvasLinesArrayTop.push(pastMouseTop)
  //   }
  //   if (pastMouseTop.x !== cellX || pastMouseTop.y !== cellY) {
  //     const newLocation = {
  //       x: cellX,
  //       y: cellY,
  //       a: 1
  //     }
  //     canvasLinesArrayTop.push(newLocation)
  //     pastMouseTop = { ...newLocation }
  //   }
  // }

  // function lineMouseMoveBot(e) {

  //   //! INCLUDE CHECKS TO SEE IF THE MOUSE IS OUTSIDE THE ELEMETN BOUNDS AND RETURN HERE IF IT IS!

  //   const cellX = (parseInt((e.pageX) / gridDimensionsBot.x) * gridDimensionsBot.x) + gridDimensionsBot.x / 2

  //   const cellY =  (parseInt((e.pageY) / gridDimensionsBot.y) * gridDimensionsBot.y) + gridDimensionsBot.y / 2


  //   // ! Work around - Try to find programmatic method!
  //   // const cellY = lineHeights.find((line, i) => {
  //   //   if (e.pageY < lineHeights[0] + ((lineHeights[1] - lineHeights[0]) / 2)) {
  //   //     return i === 0
  //   //   }
  //   //   return (
  //   //     e.pageY < (line + (Math.abs(lineHeights[i + 1] - lineHeights[i]) / 2)) && e.pageY > (line - (Math.abs(lineHeights[i - 1] + lineHeights[i]) / 2))
  //   //   )
  //   // })

    
  //   if (!pastMouseBot) {
  //     pastMouseBot = {
  //       x: cellX,
  //       y: cellY,
  //       a: 1
  //     }
  //     return canvasLinesArrayBot.push(pastMouseBot)
  //   }
  //   if (pastMouseBot.x !== cellX || pastMouseBot.y !== cellY) {
  //     const newLocation = {
  //       x: cellX,
  //       y: cellY,
  //       a: 1
  //     }
  //     canvasLinesArrayBot.push(newLocation)
  //     pastMouseBot = { ...newLocation }
  //   }
  // }

  function bubbleCanvasMove(e) {
    clearTimeout(movementTimer)
    client.x = e.pageX
    client.y = e.pageY
    // To reset ball movement
    movementTimer = setTimeout(clearMovement, 1000)
  }

  function updateMousePosition(x, y) {
    mouseLocation = {
      x: x,
      y: y
    }
  }

  function addLinesOnMouseMove() {

    if (mouseLocation.y > (linesCanvasBg.height + 20) && mouseLocation.y < window.pageYOffset + linesCanvasBgBot.getBoundingClientRect().top - 20) return
    
    // const clipPointX = (parseInt((mouseLocation.x) / gridDimensions.x) * gridDimensions.x) + gridDimensions.x / 2
    const clipPointX = (parseInt((mouseLocation.x) / testDimensions.x) * testDimensions.x) + + topStats.offset.x / 2

    // const clipPointY = (parseInt((mouseLocation.y) / gridDimensions.y) * gridDimensions.y) + gridDimensions.y / 2

    const clipPointY = (parseInt((mouseLocation.y) / testDimensions.y) * testDimensions.y) + topStats.offset.y / 2

    if (!pastClippedMouseLocation) {
      pastClippedMouseLocation = {
        x: clipPointX,
        y: clipPointY,
        a: 1
      }
      return canvasLinesArray.push(pastClippedMouseLocation)
    }

    if (pastClippedMouseLocation.x !== clipPointX || pastClippedMouseLocation.y !== clipPointY) {
      const newLocation = {
        x: clipPointX,
        y: clipPointY,
        a: 1
      }
      canvasLinesArray.push(newLocation)
      pastClippedMouseLocation = { ...newLocation }
    }

  }

  function moveMouseFunc(e) {

    updateMousePosition(e.pageX, e.pageY)
    addLinesOnMouseMove()


    // lineMouseMoveTop(e)
    // lineMouseMoveBot(e)
    // console.log(lin)
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


  function linesCanvasTick() {
    if (!canvasLinesArray.length) return
    // console.log('still here')
    ctxArray.forEach(ctx => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    })

    for (let i = 0; i < canvasLinesArray.length - 1; i++) {

      const ctx = canvasLinesArray[i].y < linesCanvasBg.height + 50 ? ctxArray[0] : ctxArray[1]

      const offset = window.pageYOffset + ctx.canvas.getBoundingClientRect().top

      // console.log(offset)

      canvasLinesArray[i].a = canvasLinesArray[i].a - 0.02
      ctx.beginPath()
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(170, 125, 206, ' + canvasLinesArray[i].a + ')'
      ctx.moveTo(canvasLinesArray[i].x, canvasLinesArray[i].y - offset)
      ctx.lineTo(canvasLinesArray[i + 1].x, canvasLinesArray[i + 1].y - offset)
      ctx.stroke()
      ctx.closePath()
      if (canvasLinesArray[i].a < 0) canvasLinesArray.splice(i, 1)

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
          // circle.direction[0] = vector
        }
        if (
          !(circle.position.y + (unitVector[1] * (magnitude / circleSpeed)) + circle.radius >= bubbleContainer.height) &&
          !(circle.position.y + (unitVector[1] * (magnitude / circleSpeed)) - circle.radius <= 0)
        ) {
          const vector = unitVector[1] * (magnitude / circleSpeed)
          // circle.direction = [...v]
          // ISSUE OCURRING BECAUSE THE DISTANCE IS BEING HALVED EACH TIME TO IT NEVER ACTUALLY GETS BEYOND THE DISTANCE
          circle.position.y += vector
          // circle.direction[1] = vector
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
    //lineCanvasTick()
    //lineCanvasTickBot()


    linesCanvasTick()

    bubbleCanvasTick()
    window.requestAnimationFrame(tick)
  }

  window.requestAnimationFrame(tick)


  // Burger Menu

  function burgerMenuFunction() {
    const burgerLines = burgerMenu.childNodes
    switch (burgerOpen) {
      case true:
        document.querySelector('body').style.overflow = 'auto'
        burgerLines[0].classList.remove('burger_line_top_clicked')
        burgerLines[1].classList.remove('burger_line_bot_clicked')

        menuOverlay.classList.remove('menu_overlay_open')
        burgerOpen = false
        break
      case false:
        document.querySelector('body').style.overflow = 'hidden'
        // console.log(burgerLines)
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

  function scrollAnims(event) {
    // console.log(window.pageYOffset)
    scrollAnimElements.forEach(element => {
      if (window.pageYOffset + (window.innerHeight - 100) >= element.getBoundingClientRect().top + window.pageYOffset) {
        // console.log(element.classList.value)
        switch (element.classList.value) {
          case 'paragraph_line':
            element.classList.add('show')
            break
          case 'devicon':
            element.classList.add('anim_right')
            break
          case 'contact_container':
            element.classList.add('show_contact')
            break
          case 'about_content_inner about_interests':
            element.classList.add('text_slide')
            break
          case 'about_content_paragraph':
            element.classList.add('text_slide')
            break
          case 'about_content_paragraph text_left':
            element.classList.add('text_slide')
            break
          case 'about_content_inner about_intro':
            element.classList.add('text_slide')
            break
        }
      }
    })
  }

  function closeWindow() {
    const burgerLines = burgerMenu.childNodes
    burgerLines[0].classList.remove('burger_line_top_clicked')
    burgerLines[1].classList.remove('burger_line_bot_clicked')
    menuOverlay.classList.remove('menu_overlay_open')
    burgerOpen = false
    document.querySelector('body').style.overflow = 'auto'
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