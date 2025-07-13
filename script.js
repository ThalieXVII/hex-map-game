const canvas = document.getElementById("hexCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const hexSize = 40;
const totalCols = 200;
const totalRows = 200;

let offsetX = 0;
let offsetY = 0;

// 🧱 Génération de la carte étendue
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
  const x = hexSize * 1.5 * col - offsetX;
  const y = hexSize * Math.sqrt(3) * (row + 0.5 * (col % 2)) - offsetY;
  return { x, y };
}

function drawMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let col = 0; col < totalCols; col++) {
    for (let row = 0; row < totalRows; row++) {
      const { x, y } = gridToPixel(col, row);
      if (x > -hexSize && x < canvas.width + hexSize &&
          y > -hexSize && y < canvas.height + hexSize) {
        drawHex(x, y);
      }
    }
  }
}

drawMap();

// 🕹️ Déplacement dans la grande carte avec flèches
window.addEventListener("keydown", (e) => {
  const scrollAmount = 80;
  if (e.key === "ArrowUp") offsetY -= scrollAmount;
  if (e.key === "ArrowDown") offsetY += scrollAmount;
  if (e.key === "ArrowLeft") offsetX -= scrollAmount;
  if (e.key === "ArrowRight") offsetX += scrollAmount;
  drawMap();
  restoreCharacters(); // repositionne les persos au bon endroit
});

// 📦 Sauvegarde dans localStorage après déplacement
function saveCharacters() {
  const characters = Array.from(document.querySelectorAll(".character")).map(c => ({
    src: c.src,
    left: c.style.left,
    top: c.style.top
  }));
  localStorage.setItem("characters", JSON.stringify(characters));
}

// 👥 Gestion des personnages sélectionnés
document.querySelectorAll("input[type=checkbox]").forEach(checkbox => {
  checkbox.addEventListener("change", (e) => {
    const src = e.target.value;

    if (e.target.checked) {
      const img = document.createElement("img");
      img.src = src;
      img.className = "character";
      img.draggable = true;
      img.style.left = "100px";
      img.style.top = "100px";
      document.body.appendChild(img);

      img.addEventListener("dragend", (ev) => {
        img.style.left = `${ev.pageX - 30}px`;
        img.style.top = `${ev.pageY - 30}px`;
        saveCharacters();
      });

      saveCharacters();

    } else {
      document.querySelectorAll(`img[src='${src}']`).forEach(img => img.remove());
      saveCharacters();
    }
  });
});

// 🔁 Réaffichage des personnages mémorisés
function restoreCharacters() {
  const saved = JSON.parse(localStorage.getItem("characters") || "[]");
  document.querySelectorAll(".character").forEach(c => c.remove()); // nettoyage
  saved.forEach(data => {
    const img = document.createElement("img");
    img.src = data.src;
    img.className = "character";
    img.draggable = true;
    img.style.left = data.left;
    img.style.top = data.top;
    document.body.appendChild(img);

    img.addEventListener("dragend", (ev) => {
      img.style.left = `${ev.pageX - 30}px`;
      img.style.top = `${ev.pageY - 30}px`;
      saveCharacters();
    });
  });
}

restoreCharacters(); // au chargement
