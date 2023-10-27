class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
        // "I need to go to therapy"
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup as a physics object to collide with the ball later
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)

        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - (height / 10), 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)   // "Medium Bouncy"
        // Chain methods as long as they are all operating on the same object
        this.ball.setDamping(true).setDrag(0.5)

        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width / 2, width - wallA.width / 2))
        wallA.body.setImmovable(true)

        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width / 2, width - wallB.width / 2))
        wallB.body.setImmovable(true)

        this.walls = this.add.group([wallA, wallB])

        // add one way wall
        this.oneWay = this.physics.add.sprite(0, (height / 4) * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width / 2, width - this.oneWay.width / 2)) 
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false
        this.oneWay.body.setCollideWorldBounds(true)
        this.oneWay.body.setBounce(1)

        // add terrible golfer
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100

        // Also works with touch input
        this.input.on('pointerdown', (pointer) => {
            this.shotCount++
            let shotDirectionX, shotDirectionY
            pointer.x <= this.ball.x ? shotDirectionX = 1 : shotDirectionX = -1
            pointer.y <= this.ball.y ? shotDirectionY = 1 : shotDirectionY = -1
            this.ball.body.setVelocityX(Phaser.Math.Between(0, this.SHOT_VELOCITY_X) * shotDirectionX)
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirectionY)
        })

        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            this.score++
            this.ballReset(ball)
        })

        this.physics.add.collider(this.ball, this.walls)
        this.physics.add.collider(this.ball, this.oneWay)

        this.shotCount = 0
        this.score = 0
        this.percentageText = 0.00
        
        // Shot Counter
        let textConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: width / 2
        }
        this.shotText = this.add.text(5, 5, this.shotCount, textConfig);
        this.scoreText = this.add.text(width / 2, 5, this.score, textConfig)
        this.percentageText = this.add.text(5, height - 50, this.percentage, textConfig)
    }

    update() {
        this.shotText.text = "Shot Count: " + this.shotCount
        this.scoreText.text = "Score: " + this.score
        this.percentageText.text = "Success %: " + (this.score / this.shotCount)
    
        this.oneWay.setVelocityX(200)
    }

    ballReset(ball) {
        ball.setVelocity(0)
        ball.setX(width / 2)
        ball.setY(height - (height / 10))
    }
}