const canvas = document.getElementById("hexCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const hexSize = 40;
const totalCols = 200;
const totalRows = 200;
let offsetX = 0;
let offsetY = 0;

// 🏷️ Identifie la carte active (ville, forest, index)
const pageName = location.pathname.split("/").pop().replace(".html", "");
const STORAGE_KEY = "characters-" + pageName;

// 🟨 Dessine chaque hexagone avec son label
function drawHex(x, y, label) {
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

  // 🔤 Affiche coordonnée en bas
  ctx.font = "8px sans-serif";
  ctx.fillStyle = "#999";
  ctx.textAlign = "center";
  ctx.fillText(label, x, y + hexSize / 2);
}

// 📍 Coordonnée grille → pixel à l’écran
function gridToPixel(col, row) {
  const x = hexSize * 1.5 * col - offsetX;
  const y = hexSize * Math.sqrt(3) * (row + 0.5 * (col % 2)) - offsetY;
  return { x, y };
}

// 🗺️ Dessine la carte visible
function drawMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let col = 0; col < totalCols; col++) {
    for (let row = 0; row < totalRows; row++) {
      const { x, y } = gridToPixel(col, row);
      if (x > -hexSize && x < canvas.width + hexSize &&
          y > -hexSize && y < canvas.height + hexSize) {
        const colLetter = String.fromCharCode(65 + (col % 26));
        const label = `${colLetter}-${row + 1}`;
        drawHex(x, y, label);
      }
    }
  }
}

// 🔁 Rafraîchit carte et personnages
function refresh() {
  drawMap();
  restoreCharacters();
}

refresh();

// ⌨️ Déplacement avec flèches clavier
window.addEventListener("keydown", (e) => {
  const scrollAmount = 80;
  if (e.key === "ArrowUp") offsetY -= scrollAmount;
  if (e.key === "ArrowDown") offsetY += scrollAmount;
  if (e.key === "ArrowLeft") offsetX -= scrollAmount;
  if (e.key === "ArrowRight") offsetX += scrollAmount;
  refresh();
});

// 💾 Sauvegarde des personnages par case logique
function saveCharacters() {
  const characters = Array.from(document.querySelectorAll(".character")).map(c => ({
    src: c.dataset.src,
    col: parseInt(c.dataset.col),
    row: parseInt(c.dataset.row)
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
}

// 🔄 Affiche personnages aux bonnes cases
function restoreCharacters() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  document.querySelectorAll(".character").forEach(c => c.remove());

  saved.forEach(data => {
    const { x, y } = gridToPixel(data.col, data.row);
    const img = document.createElement("img");
    img.src = data.src;
    img.className = "character";
    img.draggable = true;
    img.dataset.src = data.src;
    img.dataset.col = data.col;
    img.dataset.row = data.row;
    img.style.position = "absolute";
    img.style.left = `${x - 30}px`;
    img.style.top = `${y - 30}px`;
    document.body.appendChild(img);

    img.addEventListener("dragend", (e) => {
      const mouseX = e.pageX + offsetX;
      const mouseY = e.pageY + offsetY;
      const col = Math.round(mouseX / (hexSize * 1.5));
      const row = Math.round(mouseY / (hexSize * Math.sqrt(3)));
      const { x, y } = gridToPixel(col, row);
      img.style.left = `${x - 30}px`;
      img.style.top = `${y - 30}px`;
      img.dataset.col = col;
      img.dataset.row = row;
      saveCharacters();
    });
  });
}

// ✅ Ajouter personnages depuis cases cochées
document.querySelectorAll("input[type=checkbox]").forEach(checkbox => {
  checkbox.addEventListener("change", (e) => {
    const src = e.target.value;
    if (e.target.checked) {
      const col = 10;
      const row = 10;
      const { x, y } = gridToPixel(col, row);
      const img = document.createElement("img");
      img.src = src;
      img.className = "character";
      img.draggable = true;
      img.dataset.src = src;
      img.dataset.col = col;
      img.dataset.row = row;
      img.style.position = "absolute";
      img.style.left = `${x - 30}px`;
      img.style.top = `${y - 30}px`;
      document.body.appendChild(img);

      img.addEventListener("dragend", (e) => {
        const mouseX = e.pageX + offsetX;
        const mouseY = e.pageY + offsetY;
        const col = Math.round(mouseX / (hexSize * 1.5));
        const row = Math.round(mouseY / (hexSize * Math.sqrt(3)));
        const { x, y } = gridToPixel(col, row);
        img.style.left = `${x - 30}px`;
        img.style.top = `${y - 30}px`;
        img.dataset.col = col;
        img.dataset.row = row;
        saveCharacters();
      });

      saveCharacters();
    } else {
      document.querySelectorAll(`img[src='${src}']`).forEach(img => img.remove());
      saveCharacters();
    }
  });
});
