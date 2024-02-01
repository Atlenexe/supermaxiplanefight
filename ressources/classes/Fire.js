export class Fire {
    speed = 20;

    xPos = 0;
    yPos = 0;

    sprite = new Image();

    constructor(xPos, yPos) {
        this.xPos = xPos;
        this.yPos = yPos;

        this.sprite.src = '/ressources/sprites/fire/fire.png';

        this.updatePosition();
    }

    updatePosition() {
        setInterval(() => {
            this.yPos -= this.speed;
        }, 1000 / 60);
    }
}