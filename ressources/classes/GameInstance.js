import { Player } from "./Player.js";

export class GameInstance {
    gameViewHeight = 0;
    gameViewWidth = 0;
    player = null;
    ctx = null;

    constructor(gameViewHeight, gameViewWidth, ctx) {
        this.gameViewHeight = gameViewHeight;
        this.gameViewWidth = gameViewWidth;
        this.ctx = ctx;

        this.initEntities();
        this.updateView();
    }

    //Initialiser les entités
    initEntities() {
        const player = new Player(0, 0, this);
        this.player = player;
    }

    //Actualiser l'affichage 60 fois par seconde
    updateView() {
        setInterval(() => {
            this.drawGameView();
        }, 1000 / 60);
    }

    //Afficher le jeux
    drawGameView() {
        this.ctx.clearRect(0, 0, 600, 600);
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(0, 0, 600, 600);

        //Afficher les entités
        this.drawPlayer();
    }

    //Afficher le joueur
    drawPlayer() {
        if (this.player !== null) {
            this.player.updatePosition();
            this.ctx.drawImage(this.player.sprite, this.player.xPos, this.player.yPos);
        }
    }
}