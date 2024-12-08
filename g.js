const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "green";
ctx.fillRect(20, 20, 150, 110);

ctx.fillStyle = "yellow";
ctx.fillRect(200, 20, 150, 110);

ctx.fillStyle = "red";
ctx.fillRect(400, 20, 150, 110);

ctx.lineWidth = 5;
ctx.strokeStyle = 'green';
ctx.strokeRect(20, 200, 150, 110);