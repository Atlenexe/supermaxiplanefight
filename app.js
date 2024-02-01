import { GameInstance } from "./ressources/classes/GameInstance.js";

window.onload = function () {
    let canvas = document.getElementById("gameView");

    const canvasHeight = document.body.clientHeight;
    const canvasWidth = 480;

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