import { Player } from "./Player.js";
import { Enemy } from "./Enemy.js";

export class GameInstance {
    gameViewHeight = 0;
    gameViewWidth = 0;
    player = null;
    ctx = null;
    fireEntityList = [];
    enemyEntityList = [];

    constructor(gameViewHeight, gameViewWidth, ctx) {
        this.gameViewHeight = gameViewHeight;
        this.gameViewWidth = gameViewWidth;
        this.ctx = ctx;

        this.initEntities();
        this.updateView();
        this.killEntities();
    }

    //Initialiser les entités
    initEntities() {
        this.spawnPlayer();
        this.spawnEnemy();
    }

    spawnPlayer() {
        const playerSpawnX = this.gameViewWidth / 2;
        const playerSpawnY = this.gameViewHeight;

        const player = new Player(0, 0, this);

        player.xPos = playerSpawnX - player.sprite.width / 2;
        player.yPos = playerSpawnY - player.sprite.height;
        this.player = player;
    }

    spawnEnemy() {
        const enemy = new Enemy(0, 0);

        this.enemyEntityList.push(enemy);

        const enemySpawnX = Math.random() * (this.gameViewWidth - enemy.sprite.width);
        const enemySpawnY = -100;

        enemy.xPos = enemySpawnX;
        enemy.yPos = enemySpawnY;
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
        this.drawEnemies();
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

    //Afficher les ennemis
    drawEnemies() {
        this.enemyEntityList.forEach(enemyEntity => {
            this.ctx.drawImage(enemyEntity.sprite, enemyEntity.xPos, enemyEntity.yPos);
        });
    }

    //Tuer les entités hors de l'écran
    killEntities() {
        setInterval(() => {
            this.fireEntityList.forEach(fireEntity => {
                if (fireEntity.yPos < -100) {
                    this.killFireEntity(fireEntity);
                }
            });

            this.enemyEntityList.forEach(enemyEntity => {
                if (enemyEntity.yPos > this.gameViewHeight + enemyEntity.sprite.height) {
                    this.enemyEntityList.splice(this.enemyEntityList.indexOf(enemyEntity), 1);
                }
            });
        }, 1000);
    }

    killFireEntity(fireEntity) {
        this.fireEntityList.splice(this.fireEntityList.indexOf(fireEntity), 1);
    }
}