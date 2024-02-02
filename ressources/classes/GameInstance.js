import { Player } from "./Player.js";
import { Enemy } from "./Enemy.js";
import { keyboard } from './KeyBoard.js';
import { GameStates } from "../enums/GameStates.js";

export class GameInstance {
    gameViewHeight = 0;
    gameViewWidth = 0;
    player = null;
    ctx = null;
    keyboard = new keyboard();
    fireEntityList = [];
    enemyEntityList = [];

    gameState = GameStates.menu;

    constructor(gameViewHeight, gameViewWidth, ctx) {
        this.gameViewHeight = gameViewHeight;
        this.gameViewWidth = gameViewWidth;
        this.ctx = ctx;

        this.startGame();

        this.updateView();
        this.killEntities();
    }

    startGame() {
        this.gameState = GameStates.inGame;
        this.initEntities();
    }

    //Initialiser les entités
    initEntities() {
        this.spawnPlayer();
        this.spawnEnemy();
    }

    spawnPlayer() {
        const playerSpawnX = this.gameViewWidth / 2;
        const playerSpawnY = this.gameViewHeight;

        const player = new Player(0, 0, this, this.keyboard);

        player.xPos = playerSpawnX - player.sprite.width / 2;
        player.yPos = playerSpawnY - player.sprite.height;
        this.player = player;
    }

    spawnEnemy() {
        const enemy = new Enemy(0, 0);

        this.enemyEntityList.push(enemy);

        const enemySpawnX = Math.random() * (this.gameViewWidth - enemy.sprite.width);
        const enemySpawnY = -enemy.sprite.height - 100;

        enemy.xPos = enemySpawnX;
        enemy.yPos = enemySpawnY;
    }

    //Actualiser l'affichage 60 fois par seconde
    updateView() {
        setInterval(() => {
            this.drawGameView();

            this.enemyEntityList.forEach(enemyEntity => {
                this.checkFireCollision(enemyEntity);
                this.checkPlayerCollision(enemyEntity);
            });
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
                if (fireEntity.yPos < -fireEntity.sprite) {
                    this.killFireEntity(fireEntity);
                }
            });

            this.enemyEntityList.forEach(enemyEntity => {
                if (enemyEntity.yPos > this.gameViewHeight + enemyEntity.sprite.height) {
                    this.enemyEntityList.splice(this.enemyEntityList.indexOf(enemyEntity), 1);
                    this.spawnEnemy();
                }
            });
        }, 1000);
    }

    killFireEntity(fireEntity) {
        this.fireEntityList.splice(this.fireEntityList.indexOf(fireEntity), 1);
    }

    killEnemyEntity(enemyEntity) {
        this.enemyEntityList.splice(this.enemyEntityList.indexOf(enemyEntity), 1);
    }

    checkFireCollision(enemyEntity) {
        this.fireEntityList.forEach(fireEntity => {
            //Hitbox de l'ennemi
            const fireInXRange = fireEntity.xPos > enemyEntity.xPos && fireEntity.xPos < enemyEntity.xPos + enemyEntity.sprite.width;
            const fireInYRange = fireEntity.yPos > enemyEntity.yPos + enemyEntity.sprite.height * 1 / 2 && fireEntity.yPos < enemyEntity.yPos + enemyEntity.sprite.height * 3 / 4;

            if (fireInXRange && fireInYRange) {
                this.killEnemyEntity(enemyEntity);
                this.killFireEntity(fireEntity);
                this.spawnEnemy();
            }
        });
    }

    checkPlayerCollision(enemyEntity) {
        //Hitbox de l'ennemi
        const playerInXRange = this.player.xPos + this.player.sprite.width > enemyEntity.xPos + enemyEntity.sprite.width * 3 / 4 && this.player.xPos < enemyEntity.xPos + enemyEntity.sprite.width - enemyEntity.sprite.width * 3 / 4;
        const playerInYRange = this.player.yPos + this.player.sprite.height * 1 / 4 > enemyEntity.yPos && this.player.yPos < enemyEntity.yPos + enemyEntity.sprite.height;

        if (playerInXRange && playerInYRange) {
            this.killEnemyEntity(enemyEntity);
            this.spawnEnemy();
        }
    }
}