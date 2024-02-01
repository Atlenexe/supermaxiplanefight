import { Player } from "./Player.js";

export class GameInstance {
    gameViewHeight = 0;
    gameViewWidth = 0;
    player = null;
    ctx = null;
    fireEntityList = [];

    constructor(gameViewHeight, gameViewWidth, ctx) {
        this.gameViewHeight = gameViewHeight;
        this.gameViewWidth = gameViewWidth;
        this.ctx = ctx;

        this.initEntities();
        this.updateView();
        this.killFire();
    }

    //Initialiser les entités
    initEntities() {
        const playerSpawnX = this.gameViewWidth / 2;
        const playerSpawnY = this.gameViewHeight;

        const player = new Player(0, 0, this);
        player.xPos = playerSpawnX - player.sprite.width / 2;
        player.yPos = playerSpawnY - player.sprite.height;
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
        this.ctx.clearRect(0, 0, this.gameViewWidth, this.gameViewHeight);
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(0, 0, this.gameViewWidth, this.gameViewHeight);

        //Afficher les entités
        this.drawPlayer();
        this.drawFires();
    }

    //Afficher le joueur
    drawPlayer() {
        if (this.player !== null) {
            this.player.updatePosition();
            this.ctx.drawImage(this.player.sprite, this.player.xPos, this.player.yPos);
        }
    }

    //Afficher les tirs
    drawFires() {
        this.fireEntityList.forEach(fireEntity => {
            this.ctx.drawImage(fireEntity.sprite, fireEntity.xPos, fireEntity.yPos);
        });
    }

    //Tuer les entités hors de l'écran
    killFire() {
        setInterval(() => {
            this.fireEntityList.forEach(fireEntity => {
                if (fireEntity.yPos < -100) {
                    this.fireEntityList.splice(this.fireEntityList.indexOf(fireEntity), 1);
                }
            });
        }, 1000);
    }
}