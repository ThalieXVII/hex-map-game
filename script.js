const canvas = document.getElementById("hexCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const hexSize = 40;
const cols = 10;
const rows = 10;

function drawHex(x, y) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const dx = x + hexSize * Math.cos(angle);
    const dy = y + hexSize * Math.sin(angle);
    ctx.lineTo(dx, dy);
  }
  ctx.closePath();
  ctx.strokeStyle = "#ccc";
  ctx.stroke();
}

function gridToPixel(col, row) {
  const x = hexSize * 1.5 * col;
  const y = hexSize * Math.sqrt(3) * (row + 0.5 * (col % 2));
  return { x, y };
}

for (let col = 0; col < cols; col++) {
  for (let row = 0; row < rows; row++) {
    const { x, y } = gridToPixel(col, row);
    drawHex(x, y);
  }
}

// 👤 Personnage déplaçable
const character = document.getElementById("character");
character.style.position = "absolute";
character.style.left = "100px";
character.style.top = "100px";

character.addEventListener("dragend", (e) => {
  character.style.left = `${e.pageX - 30}px`;
  character.style.top = `${e.pageY - 30}px`;
});

// 🎮 Changement de personnage
const select = document.getElementById("characterSelect");
select.addEventListener("change", () => {
  character.src = select.value;
  character.style.left = "100px";
  character.style.top = "100px";
});
