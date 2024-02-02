export class Enemy {
    speed = 3;
    maxLife = 2;
    life = 0;

    xPos = 0;
    yPos = 0;

    sprite = new Image();

    constructor(xPos, yPos) {
        this.life = this.maxLife;
        this.xPos = xPos;
        this.yPos = yPos;

        this.sprite.src = '/ressources/sprites/enemy_test/enemy.png';

        this.updatePosition();
    }

    updatePosition() {
        setInterval(() => {
            this.yPos += this.speed;
        }, 1000 / 60);
    }
}