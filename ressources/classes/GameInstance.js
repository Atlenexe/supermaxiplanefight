import { Player } from './Player.js';
import { Enemy } from './Enemy.js';
import { keyboard } from './KeyBoard.js';
import { GameStates } from '../enums/GameStates.js';

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

        const player = new Player(this, this.keyboard);
        this.player = player;

        //On attend que l'image du joueur soit chargée pour définir sa position
        player.sprite.onload = () => {
            player.xPos = playerSpawnX - player.sprite.width / 2;
            player.yPos = playerSpawnY - player.sprite.height;
        };
    }

    spawnEnemy(isFirstSpawn) {
        const enemy = new Enemy(-100, -100);

        this.enemyEntityList.push(enemy);

        enemy.sprite.onload = () => {
            const enemySpawnX = isFirstSpawn ? (this.gameViewWidth - enemy.sprite.width) / 2 : Math.random() * (this.gameViewWidth - enemy.sprite.width);
            const enemySpawnY = -enemy.sprite.height - 100;

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
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(0, 0, this.gameViewWidth, this.gameViewHeight);

        if (this.gameState === GameStates.inGame) {
            this.drawEnemies();
            this.drawFires();
            this.drawPlayer();
        }

        this.drawUi();
    }

    drawUi() {
        this.ctx.font = '30px BrokenConsoleBold';
        this.ctx.fillStyle = 'white';

        switch (this.gameState) {
            case GameStates.menu:
                this.ctx.textAlign = 'center';
                this.ctx.fillText('Press ENTER to play', this.gameViewWidth / 2, this.gameViewHeight / 2);
                break;
            case GameStates.inGame:
                this.ctx.textAlign = 'start';
                this.ctx.fillText('Score : ' + this.player.score, 10, 50);
                this.ctx.fillText('Life : ' + this.player.life, 10, 100);
                break;
            case GameStates.gameOver:
                this.ctx.textAlign = 'center';
                this.ctx.fillText('Game over, press ENTER to restart', this.gameViewWidth / 2, this.gameViewHeight / 2);
                break;
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
            this.drawLifeBar(enemyEntity);
        });
    }

    drawLifeBar(enemyEntity) {
        const lifeBarWidth = 80;
        const lifeBarHeight = 11;

        const shadowOffset = 2;

        const lifeBarXPos = enemyEntity.xPos + enemyEntity.sprite.width / 2 - lifeBarWidth / 2;

        let lifeBarValueWidth = lifeBarWidth * enemyEntity.life / enemyEntity.maxLife;

        this.ctx.fillStyle = '#403224';
        this.ctx.fillRect(lifeBarXPos - shadowOffset, enemyEntity.yPos - lifeBarHeight * 2 + shadowOffset, lifeBarWidth, lifeBarHeight);

        this.ctx.fillStyle = '#f42574';
        this.ctx.fillRect(lifeBarXPos + shadowOffset, enemyEntity.yPos - lifeBarHeight * 2 - shadowOffset, lifeBarValueWidth, lifeBarHeight);
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