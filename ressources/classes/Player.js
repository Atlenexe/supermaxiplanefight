export class Player {
    speed = 8;
    lives = 0;
    score = 0;

    xPos = 0;
    yPos = 0;

    sprite = new Image();

    keysPressed = {};

    gameInstance = null;

    constructor(lives, score, gameInstance) {
        this.lives = lives;
        this.score = score;
        this.gameInstance = gameInstance;

        this.sprite.src = '/ressources/sprites/player/player.png';

        this.keyboardListeners();
    }

    keyboardListeners() {
        //Écouter les événements clavier (touches préssées et relâchées)
        document.addEventListener('keydown', (event) => this.handleKeyDown(event));
        document.addEventListener('keyup', (event) => this.handleKeyUp(event));
    }

    handleKeyDown(event) {
        //Stocker l'état des touches
        this.keysPressed[event.key] = true;
    }

    handleKeyUp(event) {
        //Mettre à jour l'état des touches lorsqu'elles sont relâchées
        this.keysPressed[event.key] = false;
    }

    updatePosition() {
        //Calculer la nouvelle position du joueur en fonction des touches pressées
        if (this.keysPressed["ArrowUp"] && this.yPos > 0) {
            this.yPos -= this.speed;
        }
        if (this.keysPressed["ArrowDown"] && this.yPos < this.gameInstance.gameViewHeight - this.sprite.height) {
            this.yPos += this.speed;
        }
        if (this.keysPressed["ArrowLeft"] && this.xPos > 0) {
            this.xPos -= this.speed;
        }
        if (this.keysPressed["ArrowRight"] && this.xPos < this.gameInstance.gameViewWidth - this.sprite.width) {
            this.xPos += this.speed;
        }
    }
}