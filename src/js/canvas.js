import platform from '../images/platform.png'
import hills from '../images/hills.png'
import background from '../images/background.png'
import platformSmallTall from '../images/platformSmallTall.png'

const canvas = document.querySelector('canvas')

const context = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576
const gravity = .5

class Player {
    constructor(){
        this.speed = 10
        this.position = {
            x: 100,
            y:100
        }
        this.velocity = {
            x: 0,
            y:0
        }
        this.width =30
        this.height = 30
    }

    draw(){
        context.fillStyle= 'red'
        context.fillRect(this.position.x,
            this.position.y,this.width,this.height)
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.position.y + this.height + this.velocity.y <= canvas.height){
        this.velocity.y +=gravity}
    }
}

class Platform {
    constructor({x,y, image}){
        this.position ={
            x,
            y
        }
        this.image=image
        this.width = image.width
        this.height = image.height
        
    }
    draw(){
        context.drawImage(this.image, this.position.x, this.position.y)
    }
}

class GenericObject {
    constructor({x,y, image}){
        this.position ={
            x,
            y
        }
        this.image=image
        this.width = 580
        this.height = image.height
        
    }
    draw(){
        context.drawImage(this.image, this.position.x, this.position.y)
    }
}

function createImage(imageScr){
    const image = new Image()
    image.src = imageScr
    return image
}

let platformImage = createImage(platform)
let platformSmallTallImage=createImage(platformSmallTall)
let player = new Player()
let platforms= []


let genericObjects= []


const keys = {
    right:{
        pressed: false
    },
    left:{
        pressed: false
    }
}

let scrollOffset = 0

function init() {
platformImage = createImage(platform)
platformSmallTallImage=createImage(platformSmallTall)
player = new Player()
platforms= [
    new Platform({x:platformImage.width*3+300-2+platformImage.width-platformSmallTallImage.width, y:270, image: createImage(platformSmallTall)}),
    new Platform({
  x:-1, 
  y:470,
  image: platformImage
}), 
  new Platform({x:platformImage.width-3, y:470, image: platformImage}),
  new Platform({x:platformImage.width*2+100, y:470, image: platformImage}), 
  new Platform({x:platformImage.width*3 +300-2, y:470, image: platformImage}),
  new Platform({x:platformImage.width*4 +700-2, y:470, image: platformImage})
  

]

genericObjects= [
    new GenericObject({
    x:-1, 
    y:-1,
    image: createImage(background)
  }),
  new GenericObject({
    x:-1, 
    y:-1,
    image: createImage(hills)
  })

]
scrollOffset = 0
}

function animate(){
    requestAnimationFrame(animate)
    context.fillStyle = 'white'
    context.fillRect(0, 0, canvas.width, canvas.height)
    
genericObjects.forEach(genericObjects => {
    genericObjects.draw()
})

    platforms.forEach(platform =>{
        platform.draw()
    })
    player.update()

    if(keys.right.pressed && player.position.x <400){
        player.velocity.x=player.speed
    }
    else if ((keys.left.pressed && player.position.x>100)||(keys.left.pressed && scrollOffset===0
    && player.position>0)){
        player.velocity.x= -player.speed
    }
    else {
        player.velocity.x=0

        if(keys.right.pressed){
            scrollOffset += player.speed
            platforms.forEach(platform =>{
                platform.position.x -= player.speed
            })
            genericObjects.forEach(genericObject =>{
                genericObject.position.x -= player.speed* .66
            })
        } else if (keys.left.pressed && scrollOffset>0){
            scrollOffset-=player.speed
            platforms.forEach(platform =>{
                platform.position.x+=player.speed
            })
                genericObjects.forEach(genericObject =>{
                genericObject.position.x+= player.speed* .66
            })
            
        }
    }
    
    //platform collision detector
    platforms.forEach(platform =>{
    if (player.position.y + player.height <= platform.position.y && player.position.y + 
        player.height + player.velocity.y >= platform.position.y && player.position.x + player.width>=platform.position.x 
        && player.position.x <= platform.position.x + platform.width){
        player.velocity.y = 0
    } 
    })

    //Win condition
    if (scrollOffset > platformImage.width*4 +300-2){
        consolelog('win')
    }

    //Lose condition
    if (player.position.y>canvas.height){
        init()
    }
}
init()
animate()

addEventListener('keydown', (event)=>{
    var x =  event.key
    if (x=="w"){
        player.velocity.y -= 15}
    if(x=="d"){
        keys.right.pressed = true
    }
    if(x=="a"){
        keys.left.pressed = true
    }
    if(x=="s"){

    }
    
})

addEventListener('keyup', (event)=>{
    var x =  event.key
    if (x=="w"){
        }
    if(x=="d"){
        keys.right.pressed = false
    }
    if(x=="a"){
        keys.left.pressed = false
    }
    if(x=="s"){

    }
    
})