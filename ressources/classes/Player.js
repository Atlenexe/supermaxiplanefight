import { Fire } from './Fire.js';
import keyBinds from '../config/keyBinds.json' assert { type: 'json' };

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

        if (this.checkFromKeyBinds('shoot') && !this.antiSpam) {
            this.shoot();
            this.antiSpam = true;
        }
    }

    handleKeyUp(event) {
        //Mettre à jour l'état des touches lorsqu'elles sont relâchées
        this.keysPressed[event.key] = false;

        if (keyBinds['shoot'].includes(event.key)) {
            this.antiSpam = false;
        }
    }

    //Vérifier si une touche est pressée depuis le fichier config de touches
    checkFromKeyBinds(key) {
        return keyBinds[key].some(bind => this.keysPressed[bind]);
    }

    updatePosition() {
        const sideXLimit = this.sprite.width / 2;
        const sideYLimit = this.sprite.height / 2;

        //Calculer la nouvelle position du joueur en fonction des touches pressées
        if (this.checkFromKeyBinds('forward') && this.yPos > 0) {
            this.yPos -= this.speed;
        }
        if (this.checkFromKeyBinds('backward') && this.yPos < this.gameInstance.gameViewHeight - this.sprite.height + sideYLimit) {
            this.yPos += this.speed;
        }
        if (this.checkFromKeyBinds('left') && this.xPos > 0 - sideXLimit) {
            this.xPos -= this.speed;
        }
        if (this.checkFromKeyBinds('right') && this.xPos < this.gameInstance.gameViewWidth - this.sprite.width + sideXLimit) {
            this.xPos += this.speed;
        }
    }

    shoot() {
        this.gameInstance.fireEntityList.push(new Fire(this.xPos + this.sprite.width / 2, this.yPos - this.sprite.height / 3));
    }
}