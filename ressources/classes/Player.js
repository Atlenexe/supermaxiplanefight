import { Fire } from './Fire.js';

export class Player {
    speed = 8;
    life = 0;
    score = 0;

    xPos = 0;
    yPos = 0;

    antiSpam = false;

    sprite = new Image();

    keysPressed = {};

    gameInstance = null;

    constructor(lives, score, gameInstance) {
        this.lives = lives;
        this.score = score;
        this.gameInstance = gameInstance;

        this.sprite.src = '/ressources/sprites/player_test/player.png';

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

        if (this.keysPressed[' '] && !this.antiSpam) {
            this.shoot();
            this.antiSpam = true;
        }
    }

    handleKeyUp(event) {
        //Mettre à jour l'état des touches lorsqu'elles sont relâchées
        this.keysPressed[event.key] = false;

        if (event.key === ' ') {
            this.antiSpam = false;
        }
    }

    updatePosition() {
        const sideXLimit = this.sprite.width / 2;
        const sideYLimit = this.sprite.height / 2;

        //Calculer la nouvelle position du joueur en fonction des touches pressées
        if (this.keysPressed['ArrowUp'] && this.yPos > 0) {
            this.yPos -= this.speed;
        }
        if (this.keysPressed['ArrowDown'] && this.yPos < this.gameInstance.gameViewHeight - this.sprite.height + sideYLimit) {
            this.yPos += this.speed;
        }
        if (this.keysPressed['ArrowLeft'] && this.xPos > 0 - sideXLimit) {
            this.xPos -= this.speed;
        }
        if (this.keysPressed['ArrowRight'] && this.xPos < this.gameInstance.gameViewWidth - this.sprite.width + sideXLimit) {
            this.xPos += this.speed;
        }
    }

    shoot() {
        this.gameInstance.fireEntityList.push(new Fire(this.xPos + this.sprite.width / 2, this.yPos - this.sprite.height / 3));
    }
}