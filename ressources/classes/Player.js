import { Fire } from './Fire.js';

export class Player {
    xSpeed = 12;
    ySpeed = 8;

    life = 5;
    score = 0;

    xPos = 0;
    yPos = 0;

    sprite = new Image();

    gameInstance = null;
    keyboard = null;

    constructor(gameInstance, keyboard) {
        this.gameInstance = gameInstance;
        this.keyboard = keyboard;

        this.sprite.src = '/ressources/sprites/player_test/player.png';
    }

    updatePosition() {
        const sideXLimit = this.sprite.width / 2;
        const sideYLimit = this.sprite.height / 2;

        if (this.keyboard.checkTappedFromKeyBinds('shoot')) {
            this.shoot();
        }

        //Calculer la nouvelle position du joueur en fonction des touches pressées
        if (this.keyboard.checkFromKeyBinds('forward') && this.yPos > 0) {
            this.yPos -= this.ySpeed;
        }
        if (this.keyboard.checkFromKeyBinds('backward') && this.yPos < this.gameInstance.gameViewHeight - this.sprite.height + sideYLimit) {
            this.yPos += this.ySpeed;
        }
        if (this.keyboard.checkFromKeyBinds('left') && this.xPos > 0 - sideXLimit) {
            this.xPos -= this.xSpeed;
        }
        if (this.keyboard.checkFromKeyBinds('right') && this.xPos < this.gameInstance.gameViewWidth - this.sprite.width + sideXLimit) {
            this.xPos += this.xSpeed;
        }
    }

    shoot() {
        this.gameInstance.fireEntityList.push(new Fire(this.xPos + this.sprite.width / 2, this.yPos - this.sprite.height / 3));
    }
}