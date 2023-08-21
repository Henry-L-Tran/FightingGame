//Creating two constants 
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

//Sets the canvas dimensions
canvas.width = 1024
canvas.height = 576

//Fills in the canvas 
c.fillRect(0, 0, canvas.width, canvas.height)

//Global constant variable 
const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './images/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './images/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './images/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './images/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './images/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './images/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './images/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './images/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './images/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './images/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 162,
        height: 50
    }
})

const enemy = new Fighter({
    position: {
      x: 400,
      y: 100
    },
    velocity: {
      x: 0,
      y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './images/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './images/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './images/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './images/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './images/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './images/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './images/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './images/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 160,
        height: 50
    }
})

enemy.draw()

console.log(player);

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0 

    //Player Movement
    if(keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    }
    else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    }
    else {
        player.switchSprite('idle')
    }

    //Player Jumping
    if(player.velocity.y < 0) {
        player.switchSprite('jump')
    }
    else if(player.velocity.y > 0) {
        player.switchSprite('fall')
    }

     //Enemy Movement
     if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    }
    else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    }
    else {
        enemy.switchSprite('idle')
    }

    //Enemy Jumping
    if(enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    }
    else if(enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    //Keeps Player In Screen Border
    if(player.position.x < 0) {
        player.velocity.x = Math.max(player.velocity.x, 0);
    }
    if((player.position.x + player.width >= canvas.width)) {
        player.velocity.x = Math.min(player.velocity.x, 0);
    }

    //Keeps Enemy In Screen Border
    if(enemy.position.x < 0) {
        enemy.velocity.x = Math.max(enemy.velocity.x, 0);
    }
    if((enemy.position.x + enemy.width >= canvas.width)) {
        enemy.velocity.x = Math.min(enemy.velocity.x, 0);
    }


    //Player Attacks Enemy
    if(rectangularCollisions({
        rectangle1: player,
        rectangle2: enemy
    }) && player.isAttacking && player.framesCurrent === 4) {
        enemy.takeHit()
            player.isAttacking = false
            
            gsap.to('#enemyHealth', {
                width: enemy.health + '%'
            })
    }

    //If Player Misses
    if(player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    //Enemy Attacks Player
    if(rectangularCollisions({
        rectangle1: enemy,
        rectangle2: player
    }) && enemy.isAttacking && enemy.framesCurrent === 2) {
        player.takeHit()
            enemy.isAttacking = false
        
            gsap.to('#playerHealth', {
                width: player.health + '%'
            })
    }

    //If Enemy Misses
    if(enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    //Ends Game Based On Health
    if(enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})

    }
}

decreaseTimer()

animate()

window.addEventListener('keydown', (event) => {
    
    if(!player.dead) {
        switch  (event.key) {
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break;
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break;
            case ' ':
                player.attack()
                break;
            case 'w':
                if(player.velocity.y === 0) {
                player.velocity.y = -20
                break;
                }
        }
    }
    
    if(!enemy.dead) {
        switch  (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break;
            case 'ArrowDown':
                enemy.attack()
                break;
            case 'ArrowUp':
                if(enemy.velocity.y === 0) {
                    enemy.velocity.y = -20
                break;
                }
        }
    }
})

window.addEventListener('keyup', (event) => {
    //Player Keys
    switch  (event.key) {
        case 'd':
            keys.d.pressed = false
            break;
        case 'a':
            keys.a.pressed = false
            break;
    }

    //Enemy Keys
    switch  (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break;
    }
})

