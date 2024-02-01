import { GameInstance } from "./ressources/classes/GameInstance.js";

window.onload = function () {
    let canvas = document.getElementById("gameView");

    const canvasHeight = 600;
    const canvasWidth = 600;

    canvas.height = canvasHeight;
    canvas.width = canvasWidth;

    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");

        const gameViewHeight = canvas.height;
        const gameViewWidth = canvas.width;

        const gameInstance = new GameInstance(gameViewHeight, gameViewWidth, ctx);
    } else {
    }
}