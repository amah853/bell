const BasicColorTheme = require('./templates/BasicColorTheme')
const ColorSchemeTransformations = require('./ColorSchemeTransformations')
const BasicTiming = require('./timings/BasicTiming')

const hearts = new Set()

function drawHeart(ctx, x, y, size, rotation) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.beginPath()
  const topCurveHeight = size * 0.3
  ctx.moveTo(0, topCurveHeight)
  // Left curve
  ctx.bezierCurveTo(
    0, 0,
    -size / 2, 0,
    -size / 2, topCurveHeight
  )
  ctx.bezierCurveTo(
    -size / 2, (topCurveHeight + size) / 2,
    0, (topCurveHeight + size) / 2,
    0, size
  )
  // Right curve
  ctx.bezierCurveTo(
    0, (topCurveHeight + size) / 2,
    size / 2, (topCurveHeight + size) / 2,
    size / 2, topCurveHeight
  )
  ctx.bezierCurveTo(
    size / 2, 0,
    0, 0,
    0, topCurveHeight
  )
  ctx.closePath()
  ctx.restore()
}

module.exports = {
  name: 'Valentines',
  enabled: (secrets) => {
    const now = new Date()
    return (now.getMonth() + 1) === 2 // February
  },
  specialEffects: (ctx, canvas) => {
    if (hearts.size < 30 && Math.random() < 0.08) {
      hearts.add({ 
        x: Math.random() * window.innerWidth, 
        y: -20,
        size: 10 + Math.random() * 15,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        xSpeed: (Math.random() - 0.5) * 1.5,
        ySpeed: 1 + Math.random() * 2,
        color: Math.random() > 0.5 ? '#ff006e' : '#ff4d6d',
        opacity: 0.6 + Math.random() * 0.4,
        clicked: false,
        pulsePhase: Math.random() * Math.PI * 2
      })
    }
    
    for (const heart of hearts) {
      ctx.globalAlpha = heart.opacity
      ctx.fillStyle = heart.clicked ? '#ffffff' : heart.color
      
      // Calculate pulse scale (subtle pulse between 0.9 and 1.1)
      const pulseScale = 1 + Math.sin(heart.pulsePhase) * 0.3
      const currentSize = heart.clicked ? heart.size * 1.5 : heart.size
      
      drawHeart(ctx, heart.x, heart.y, currentSize * pulseScale, heart.rotation)
      ctx.fill()
      
      if (heart.y > window.innerHeight + 50) {
        hearts.delete(heart)
      }
      
      heart.y += heart.ySpeed
      heart.x += heart.xSpeed
      heart.rotation += heart.rotationSpeed
      heart.pulsePhase += 0.05
    }
    ctx.globalAlpha = 1.0
    
    canvas.addEventListener('mousedown', (e) => {
      for (const heart of hearts) {
        const distance = Math.sqrt(Math.pow(heart.x - e.x, 2) + Math.pow(heart.y - e.y, 2))
        if (distance < heart.size) {
          heart.clicked = !heart.clicked
          break
        }
      }
    })
  },
  theme: BasicColorTheme(
    ColorSchemeTransformations.fromObjectStrings,
    BasicTiming,
    [{
      background: {
        'background-image': 'linear-gradient(135deg, #ff6b9d 0%, #ffc3e0 100%)',
        'background-color': '#ff85b3'
      },
      text: '#8b0028',
      subtext: '#c41e5c',
      contrast: 'white'
    }, {
      background: {
        'background-image': 'linear-gradient(135deg, #ff1f5a 0%, #ff6b9d 100%)',
        'background-color': '#ff4578'
      },
      text: '#8b0028',
      subtext: '#c41e5c',
      contrast: 'white'
    }, {
      background: {
        'background-image': 'linear-gradient(135deg, #c9184a 0%, #ff4d6d 100%)',
        'background-color': '#e6335b'
      },
      text: '#ffffff',
      subtext: '#ffc3e0',
      contrast: 'white'
    }, {
      background: {
        'background-image': 'linear-gradient(135deg, #ff4d6d 0%, #ff758f 100%)',
        'background-color': '#ff617e'
      },
      text: '#ffffff',
      subtext: '#ffc3e0',
      contrast: 'white'
    }], {
      holiday: {
        background: {
          'background-image': 'linear-gradient(135deg, #ff006e 0%, #ff85b3 100%)',
          'background-color': '#ff4390'
        },
        text: '#ffffff',
        subtext: '#ffc3e0',
        contrast: 'white'
      },
      weekend: {
        background: {
          'background-image': 'linear-gradient(135deg, #ff006e 0%, #ff85b3 100%)',
          'background-color': '#ff4390'
        },
        text: '#ffffff',
        subtext: '#ffc3e0',
        contrast: 'white'
      }
    }
  )
}
