console.log("Hello World!");

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

        ctx.fillStyle = "blue";
        ctx.fillRect(0, 0, gameViewHeight, gameViewWidth);

        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, 100, 100);
    } else {
    }
}