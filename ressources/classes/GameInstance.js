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

        this.updateGame();
        this.killEntities();
    }

    startGame() {
        if (this.gameState !== GameStates.inGame) {
            this.gameState = GameStates.inGame;
            this.initEntities();
        }
    }

    //Initialiser les entités
    initEntities() {
        this.spawnPlayer();
        this.spawnEnemy(true);
    }

    spawnPlayer() {
        const playerSpawnX = this.gameViewWidth / 2;
        const playerSpawnY = this.gameViewHeight;

        const player = new Player(-150, 0, this, this.keyboard);
        this.player = player;

        //On attend que l'image du joueur soit chargée pour définir sa position
        player.sprite.onload = () => {
            player.xPos = playerSpawnX - player.sprite.width / 2;
            player.yPos = playerSpawnY - player.sprite.height;
        };
    }

    spawnEnemy(isFirstSpawn) {
        const enemy = new Enemy(-100, 0);

        this.enemyEntityList.push(enemy);

        let enemySpawnX = 0;

        if (isFirstSpawn) {
            enemySpawnX = this.gameViewWidth / 2 - enemy.sprite.width / 2;
        } else {
            enemySpawnX = Math.random() * (this.gameViewWidth - enemy.sprite.width);
        }

        const enemySpawnY = -enemy.sprite.height - 100;

        enemy.sprite.onload = () => {
            enemy.xPos = enemySpawnX;
            enemy.yPos = enemySpawnY;
        }
    }

    updateGame() {
        setInterval(() => {
            this.updateView();

            if (this.keyboard.checkTappedKey('start')) {
                this.startGame();
            }

            if (this.gameState === GameStates.inGame) {
                this.enemyEntityList.forEach(enemyEntity => {
                    this.checkFireCollision(enemyEntity);
                    this.checkPlayerCollision(enemyEntity);
                });
                this.killEntities();

                if (this.player.life <= 0) {
                    this.gameOver();
                }
            }
        }, 1000 / 60);
    }

    //Actualiser l'affichage 60 fois par seconde
    updateView() {
        this.drawGameView();
    }

    //Afficher le jeux
    drawGameView() {
        this.ctx.clearRect(0, 0, this.gameViewWidth, this.gameViewHeight);
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(0, 0, this.gameViewWidth, this.gameViewHeight);

        if (this.gameState === GameStates.inGame) {
            this.drawPlayer();
            this.drawFires();
            this.drawEnemies();
        }
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
        this.fireEntityList.forEach(fireEntity => {
            if (fireEntity.yPos < -fireEntity.sprite) {
                this.killFireEntity(fireEntity);
            }
        });

        this.enemyEntityList.forEach(enemyEntity => {
            if (enemyEntity.yPos > this.gameViewHeight + enemyEntity.sprite.height) {
                this.enemyEntityList.splice(this.enemyEntityList.indexOf(enemyEntity), 1);
                this.player.life--;

                if (this.player.life >= 0) {
                    this.spawnEnemy();
                }
            }
        });
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
                enemyEntity.life--;
                this.player.score += 10;

                if (enemyEntity.life <= 0) {
                    this.player.score += 10;
                    this.killEnemyEntity(enemyEntity);
                    this.spawnEnemy();
                }

                this.killFireEntity(fireEntity);
            }
        });
    }

    checkPlayerCollision(enemyEntity) {
        //Hitbox de l'ennemi
        const playerInXRange = this.player.xPos + this.player.sprite.width > enemyEntity.xPos + enemyEntity.sprite.width * 3 / 4 && this.player.xPos < enemyEntity.xPos + enemyEntity.sprite.width - enemyEntity.sprite.width * 3 / 4;
        const playerInYRange = this.player.yPos + this.player.sprite.height * 1 / 4 > enemyEntity.yPos && this.player.yPos < enemyEntity.yPos + enemyEntity.sprite.height;

        if (playerInXRange && playerInYRange) {
            this.player.life -= 2;

            if (this.player.life >= 0) {
                this.killEnemyEntity(enemyEntity);
                this.spawnEnemy();
            }
        }
    }

    gameOver() {
        this.fireEntityList = [];
        this.enemyEntityList = [];
        this.gameState = GameStates.gameOver;
        delete this.player;
    }
}