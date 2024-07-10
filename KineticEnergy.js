class Circle {
  constructor(x, y, xs, ys, r, mass, c) {
    this.x = x;
    this.y = y;
    this.xs = xs;
    this.ys = ys;
    this.r = r;
    this.mass = mass;
    this.c = c;
    this.velocity = dist(0, 0, this.xs, this.ys);
    this.kineticE = (this.velocity * this.velocity * this.mass) / 2;
  }
  display() {
    fill(this.c);
    circle(this.x, this.y, this.r * 2);
    fill(255); // 흰색 텍스트
    textSize(12);
    textAlign(CENTER, CENTER);
    text(`${this.mass.toFixed(2)}`, this.x, this.y); // 질량 표시
    text(`Velocity: ${this.velocity.toFixed(2)}`, this.x, this.y + this.r + 15); // 속도 벡터 크기 표시
  }

  move() {
    this.x += this.xs;
    this.y += this.ys;
    if (this.x + this.r > width) {
      this.xs = -this.xs;
      this.x += this.xs;
    }
    if (this.x - this.r < 0) {
      this.xs = -this.xs;
      this.x += this.xs;
    }
    if (this.y + this.r > height) {
      this.ys = -this.ys;
      this.y += this.ys;
    }
    if (this.y - this.r < 0) {
      this.ys = -this.ys;
      this.y += this.ys;
    }
  }
}
let circles = [];
function setup() {
  noStroke();
  createCanvas(600, 600);
  background("gray");

  const infoList = document.createElement("ul");
  infoList.setAttribute("id", "infoList");
  document.body.appendChild(infoList);

  const addButton = document.createElement("button");
  addButton.innerText = "원 추가";
  addButton.addEventListener("click", addCircle);
  document.body.appendChild(addButton);

  const t_E_SUM = document.createElement("h1");
  t_E_SUM.innerText = `Energy Sum : `;
  t_E_SUM.setAttribute("id", "energySum");
  document.body.appendChild(t_E_SUM);
}

function draw() {
  background("gray");
  for (let i = 0; i < circles.length; i++) {
    circles[i].move();
    circles[i].display();

    for (let j = i + 1; j < circles.length; j++) {
      checkCircleCollision(circles[i], circles[j]);
    }
  }
}

function addCircle() {
  circles.push(
    new Circle(
      width / 2, //x좌표
      height / 2, //y좌표
      random(-5, 5), //x속도
      random(-5, 5), //y속도
      random(20, 40), //반지름
      random(1, 10), //질량
      color(random(255), random(255), random(255)) //색깔
    )
  );

  const infoList = document.getElementById("infoList");
  const status = document.createElement("li");

  const mass = document.createElement("div");
  mass.innerText = `mass :\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 ${circles[
    circles.length - 1
  ].mass.toFixed(2)} kg`;

  const velocity = document.createElement("div");
  velocity.innerText = `velocity :\u00A0\u00A0 ${circles[
    circles.length - 1
  ].velocity.toFixed(2)} m/s`;

  const kineticE = document.createElement("div");
  kineticE.innerText = `KINETIC ENERGY : ${(
    (circles[circles.length - 1].velocity *
      circles[circles.length - 1].velocity *
      circles[circles.length - 1].mass) /
    2
  ).toFixed(2)} J`;

  status.appendChild(mass);
  status.appendChild(velocity);
  status.appendChild(kineticE);
  infoList.appendChild(status);
}

function checkCircleCollision(circle1, circle2) {
  let dx = circle2.x - circle1.x;
  let dy = circle2.y - circle1.y;
  let distance = sqrt(dx * dx + dy * dy);

  if (distance < circle1.r + circle2.r) {
    let nx = dx / distance;
    let ny = dy / distance;

    let p =
      (2 *
        (circle1.xs * nx +
          circle1.ys * ny -
          circle2.xs * nx -
          circle2.ys * ny)) /
      (circle1.mass + circle2.mass);

    let v1x = circle1.xs - p * circle2.mass * nx;
    let v1y = circle1.ys - p * circle2.mass * ny;
    let v2x = circle2.xs + p * circle1.mass * nx;
    let v2y = circle2.ys + p * circle1.mass * ny;

    circle1.xs = v1x;
    circle1.ys = v1y;
    circle2.xs = v2x;
    circle2.ys = v2y;

    let overlap = (circle1.r + circle2.r - distance) / 2;
    circle1.x -= overlap * nx;
    circle1.y -= overlap * ny;
    circle2.x += overlap * nx;
    circle2.y += overlap * ny;
  }
}

const updateVelo = setInterval(() => {
  let AKE = 0;
  const lists = document.querySelectorAll("#infoList > li");
  const E_SUM = document.getElementById("energySum");
  lists.forEach((list, i) => {
    circles[i].velocity = dist(0, 0, circles[i].xs, circles[i].ys);
    circles[i].kineticE =
      (circles[i].velocity * circles[i].velocity * circles[i].mass) / 2;
    const childs = list.querySelectorAll("div");
    childs[1].innerText = `velocity :\u00A0\u00A0\u00A0\u00A0 ${circles[
      i
    ].velocity.toFixed(2)} m/s`;
    childs[2].innerText = `Kinetic_E : \u00A0\u00A0${circles[
      i
    ].kineticE.toFixed(2)} J`;
    AKE += circles[i].kineticE;
  });
  E_SUM.innerText = `Energy Sum : ${AKE.toFixed(2)} J`;
  console.log(AKE);
}, 0);
