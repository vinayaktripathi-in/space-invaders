var interval;
var ctx = document.getElementById("canvas").getContext("2d");

function GameObject(x, y, img) {
  this.x = x;
  this.y = y;
  this.img = img;
  this.active = true;
}
GameObject.prototype.draw = function (ctx) {
  this.active && ctx.drawImage(this.img, this.x, this.y, 40, 40);
};
GameObject.prototype.move = function (dx, dy) {
  this.x += dx;
  this.y += dy;
};
GameObject.prototype.fire = function (dy) {
  return new Shot(this.x + 20, this.y + 20, dy);
};
GameObject.prototype.isHitBy = function (shot) {
  function between(x, a, b) {
    return a < x && x < b;
  }
  return (
    this.active &&
    between(shot.x, this.x, this.x + 40) &&
    between(shot.y + 10, this.y, this.y + 20)
  );
};
function Shot(x, y, dy) {
  this.x = x;
  this.y = y;
  this.dy = dy;
}
Shot.prototype.move = function () {
  this.y += this.dy;
  return this.y > 0 && this.y < 600;
};
Shot.prototype.draw = function (ctx) {
  ctx.fillStyle = "#000";
  ctx.fillRect(this.x - 1, this.y, 3, 20);
};
var enemyDx = -5;
var enemys = [];
var player = new GameObject(230, 550, document.getElementById("player"));
var enemyShot, playerShot;

function init() {
  var img = document.getElementById("enemy");
  for (var y = 0; y < 3; y++) {
    for (var x = 0; x < 8; x++) {
      enemys.push(new GameObject(50 + x * 50, 20 + y * 50, img));
    }
  }
}

function draw() {
  ctx.fillStyle = "#ddd";
  ctx.fillRect(0, 0, 500, 600);
  enemys.forEach((inv) => inv.draw(ctx));
  player.draw(ctx);
  enemyShot && enemyShot.draw(ctx);
  playerShot && playerShot.draw(ctx);
}

function move() {
  var leftX = enemys[0].x,
    rightX = enemys[enemys.length - 1].x;
  if (leftX <= 20 || rightX >= 440) enemyDx = -enemyDx;
  enemys.forEach((inv) => inv.move(enemyDx, 0.5));
  if (enemyShot && !enemyShot.move()) {
    enemyShot = null;
  }
  if (!enemyShot) {
    var active = enemys.filter((i) => i.active);
    var r = active[Math.floor(Math.random() * active.length)];
    enemyShot = r.fire(20);
  }
  if (playerShot) {
    var hit = enemys.find((inv) => inv.isHitBy(playerShot));
    if (hit) {
      hit.active = false;
      playerShot = null;
    } else {
      if (!playerShot.move()) playerShot = null;
    }
  }
}

function isGameOver() {
  return (
    player.isHitBy(enemyShot) || enemys.find((inv) => inv.active && inv.y > 530)
  );
}
function game() {
  move();
  draw();
  if (isGameOver()) {
    alert("Game over");
    clearInterval(interval);
  }
}

function start() {
  init();
  document.addEventListener("keydown", function (e) {
    if (e.keyCode == 37 && player.x > 40) player.move(-20, 0);
    if (e.keyCode == 39 && player.x < 420) player.move(20, 0);
    if (e.keyCode == 32 && !playerShot) playerShot = player.fire(-30);
  });
  interval = setInterval(game, 50);
}

window.onload = start;
