import * as PIXI from "pixi.js";
import { keyboard } from "./keyboard";
import { Howl, Howler } from "howler";
import pixiSound from "pixi-sound";
// import {tutorial} from "tut.js";

const world = {
  width: window.innerWidth * 0.9,
  height: window.innerHeight * 0.9,
};

if (world.width > world.height) {
  world.width = world.height;
}

const actResults = {
  hunting: {
    title: ["Удачная охота", "Обычная охота", "Неудачная охота"],
    text: [
      "Вам повезло, вы захуярили огромного зверя",
      "Вы захуярили зверя среднего размера",
      "Зверь дал вам пизды",
    ],
  },
  supplies: {
    title: ["Сбор припасов"],
    text: ["Вы собрали немного дров"],
  },
  sleep: {
    title: ["Бессонная ночь", "Обычная ночь", "Спокойная ночь"],
    text: [
      "Переживания прошедшего дня долго не давали вам уснуть",
      "Вы выспались и готовы к новому дню",
      "Вы отлично выспались ",
    ],
  },
  gathering: {
    title: ["Собирательство"],
    text: ["Вы собрали немного фруктов с растущих рядом деревьев"],
  },
  eating: {
    title: ["Приём пищи"],
    text: ["Вы восстановили немного энергии и здоровья"],
  },
  kindle: {
    title: ["Разжечь костёр"],
    text: ["Вы подбросили дров. Костёр приятно и успокаивающе потрескивает"],
  },
  rest: {
    title: ["Отдых"],
    text: ["Вы отдохнули и восстановили немного энергии"],
  },
  death: {
    title: ["Вы умерли"],
    text: ["Доисторический мир оказался слишком суровым"],
  },
};

const player = {
  satiety: 80,
  health: 6,
  energy: 80,
};

const resources = {
  wood: 15,
  food: 25,
  flame: 50,
};

const max = {
  satiety: 120,
  health: 6,
  energy: 100,
  wood: 30,
  food: 40,
  flame: 100,
};

const vitalStates = {
  day: 1,
  isDay: true,
};

const tutorialText = [
  "Добро пожаловать в Before \n\n\nЭто пошаговая survival игра на движке JavaScript",
  "Эта игра - часть моего обучения JS\n\nХотя это и не предусмотрено, будет здорово, если вы получите удовольствие от неё",
  "Вы начинаете игру в качестве пещерного человека, которому предстоит выжить в суровом доисторическом мире. \n\nИгровой цикл состоит из двух фаз: дня и ночи. Днём можно совершать вылазки из пещеры для добычи припасов, ночь стоит посвятить заботе о потребностях своего персонажа.",
  "У каждого действия есть вероятность успеха или неудачи, но у некоторых эти эффекты выражены острее. \n\nДобывайте пищу, собирайте припасы и обустраивайте пещеру. Следите за состоянием шкал здоровья, сытости и энергии. \n\nИ не дайте костру погаснуть!",
  "Со временем, поддерживая баланс своих потребностей, вы повысите эффективность своих действий и откроете новые. Вы начнёте больше понимать окружающий ваc мир, создавать орудия, предметы искусства или способы коммуникации. \n\n Помните, что каждый ваш выбор важен. \n Удачной игры!",
];

const app = new PIXI.Application({
  width: world.width,
  height: world.height,
  backgroundColor: 0x9423E1,
});
document.body.appendChild(app.view);

console.log(app.stage.height, app.stage.width);
console.log(world.width, world.height);

app.loader
  .add("fon", "fon5.png")
  .add("food", "food3.png")
  .add("wood", "wood2.png")
  .add("soup", "soup.png")
  .add("fullHeart", "fullheart.png")
  .add("bonfire", "bonfire2.png")
  .add("energy", "energy.png")
  .add("brownButton", "brownButton.png")
  .add("redButton", "redButton2.png")
  .add("smallBonfire", "smallBonfire2.png")
  .add("click", "music/click.mp3")
  .add("music/start.mp3")
  .add("day", "day.png")
  .add("night", "night.png")
  .add("start", "start2.png")
  .add("start6", "start6.png")
  .add("cave", "cave.jpg")
  .add("cave2", "cave3.jpg")
  .add("wall", "wall.jpg")
  .add("paper", "paper3.png")
  .add("leftArrow", "leftArrow.png")
  .add("rightArrow", "rightArrow.png")
  // .load(setup);
  .load(startMenu)

let gameScene = new PIXI.Container();
gameScene.position.set(0, 0);
gameScene.width = world.width;
gameScene.height = world.height;
gameScene.backgroundColor = 0x7c030e;
app.stage.addChild(gameScene);


let textMap = new Map();
let actionMap = new Map();

let click = new Howl({
  src: ["music/click.mp3"],
});
click.volume = 1.0;

let startMuz = new Howl({
  src: ["music/start.mp3"],
});
click.volume = 1.0;

function startMenu() {
const textureCave = PIXI.Texture.from("cave");
const currentFon = new PIXI.Sprite(textureCave);
currentFon.width = world.width;
currentFon.height = world.height;

gameScene.addChild(currentFon)

  let startTexture = new PIXI.Texture.from("start");
  let start6Texture = new PIXI.Texture.from("start6");
  currentFon.tint = 0x888888;

  let start6 = new PIXI.Sprite(start6Texture);
  start6.anchor.set(0.5, 0.5);
  start6.height = start6.width = 50;
  start6.position.set(world.width * 0.7, world.height * 0.7);

  let start = new PIXI.Sprite(startTexture);
  start.anchor.set(0.5, 0.5);
  start.height = start.width = 100;
  start.position.set(world.width / 2, world.height / 2);
  // start.tint = 0x888888;
  start.buttonMode = start.interactive = true;

  const gameStart = () => {
    // startMuz.play()
    // DontTintThis.bind(currentFon)
    currentFon.tint = 0xffffff;
    gameScene.removeChild(start, start6);
    // setup()
    tutorial();
  };
  const scalerSpinner = () => {
    start.height = start.width = 120;
    app.ticker.add(() => {
      start6.rotation += 0.05;
    });
  };

  const scalerSpinnerOff = () => {
    start.height = start.width = 100;
    start6.rotation = 0;
    app.ticker.add(() => {
      start6.rotation -= 0.05;
    });
  };

  start
    .on("pointerover", scalerSpinner)
    .on("pointerout", scalerSpinnerOff)
    .on("pointerdown", gameStart);

  gameScene.addChild(start, start6);
}

function tutorial() {
  const left = PIXI.Texture.from("leftArrow");
  const right = PIXI.Texture.from("rightArrow");

  const container = new PIXI.Container();
  container.x = world.width / 10;
  container.y = world.height / 4;
  gameScene.addChild(container);

  const paper = new PIXI.Texture.from("paper");
  let tutWindow = new PIXI.Sprite(paper);
  tutWindow.width = world.width * 0.8;
  tutWindow.height = world.height * 0.6;

  container.addChild(tutWindow);

  const style = new PIXI.TextStyle({
    fontFamily: "Impala",
    fontSize: 18,
    fill: "#1d1b1b",
    stroke: "#fafafa",
    strokeThickness: 2,
    wordWrap: true,
    wordWrapWidth: tutWindow.width * 0.65,
  });
  let page = 0;
  let currentText;

  const pageRefresher = (num) => {
    currentText = new PIXI.Text(tutorialText[num], style);
    currentText.x = tutWindow.x + tutWindow.width * 0.18;
    currentText.y = tutWindow.y + tutWindow.height * 0.15;
    container.addChild(currentText);
  };
  pageRefresher(page);

  const leftArrow = new PIXI.Sprite(left);
  const rightArrow = new PIXI.Sprite(right);
  leftArrow.y = rightArrow.y = tutWindow.height * 0.8;
  leftArrow.height = rightArrow.height = 50;
  leftArrow.width = rightArrow.width = 25;
  leftArrow.x = tutWindow.width * 0.35;
  rightArrow.x = tutWindow.width * 0.6;
  container.addChild(leftArrow, rightArrow);
  leftArrow.buttonMode =
    leftArrow.interactive =
    rightArrow.buttonMode =
    rightArrow.interactive =
      true;
  leftArrow
    .on("pointerover", tintThis)
    .on("pointerout", DontTintThis)
    .on("pointerdown", prevPage);
  rightArrow
    .on("pointerover", tintThis)
    .on("pointerout", DontTintThis)
    .on("pointerdown", nextPage);

  console.log(tutorialText.length);
  function nextPage() {
    container.removeChild(currentText);
    if (page < tutorialText.length - 1) {
      page += 1;
      pageRefresher(page);
    } else {
      container.removeChildren();
      setup();
    }
  }

  function prevPage() {
    container.removeChild(currentText);
    page -= 1;
    if (page < 0) {
      page = 0;
    }
    pageRefresher(page);
  }
}

// const next = (func) => {
//   func()
// }

// next(tutorial)

function setup() {
  //#region textures
  let textureStone = PIXI.Texture.from("fon");
  let textureWood = PIXI.Texture.from("wood");
  let textureFood = PIXI.Texture.from("food");
  let textureSoup = PIXI.Texture.from("soup");
  let textureFullheart = PIXI.Texture.from("fullHeart");
  let textureBonfire = PIXI.Texture.from("bonfire");
  let textureEnergy = PIXI.Texture.from("energy");
  let textureBrownButton = PIXI.Texture.from("brownButton");
  let textureRedButton = PIXI.Texture.from("redButton");
  let textureSmallBonfire = PIXI.Texture.from("smallBonfire");
  let textureDay = PIXI.Texture.from("day");
  let textureNight = PIXI.Texture.from("night");
  //#endregion

  // let rockFon = new PIXI.Sprite(textureStone)
  // rockFon.x=rockFon.y=10
  // rockFon.width = 200
  // rockFon.height = 50
  // gameScene.addChild(rockFon)
  
  //#region fonrendering
  const textureCave = PIXI.Texture.from("cave");
  const textureCaveAtNight = PIXI.Texture.from("cave2");
  const morning = new PIXI.Sprite(textureCave);
  const evening = new PIXI.Sprite(textureCaveAtNight);
  morning.width = evening.width = world.width;
  morning.height = evening.height = world.height;
  let currentFon = morning
  
  
  const fon = new PIXI.Container
  gameScene.addChild(fon)
  // console.log(rockFon)

  const fonRenderer = (day) => {
    fon.removeChildren
    if (day) {
      currentFon = morning;
    } else {
      currentFon = evening;
    }
    fon.addChild(currentFon)
  };
  //#endregion

  let dayActs = [
    "Пойти на охоту",
    "Собирать ягоды",
    "Собирать припасы",
    "Отдыхать",
  ];
  let nightActs = ["Поесть", "Подбросить дров", "Лечь спать"];
  let availibleActs = dayActs;

  let resourceBar = new PIXI.Container(); // resourceContainer
  let healthBar = new PIXI.Container(); // resourceContainer
  resourceBar.position.set(0, 0);
  gameScene.addChild(resourceBar);
  gameScene.addChild(healthBar);



  actionMap.set(dayActs[0], hunting);
  actionMap.set(dayActs[1], gathering);
  actionMap.set(dayActs[2], supplies);
  actionMap.set(dayActs[3], rest);
  actionMap.set(nightActs[0], eating);
  actionMap.set(nightActs[1], kindle);
  actionMap.set(nightActs[2], sleep);

  //#region images

  let resourceBarFon = new PIXI.Sprite(textureStone);
  resourceBarFon.position.set(0, 0);
  resourceBarFon.width = world.width;
  resourceBarFon.height = world.height * 0.15;
  // resourceBar.addChild(resourceBarFon);

  let healthBarFon = new PIXI.Sprite(textureStone);
  healthBarFon.width = app.stage.width;
  healthBarFon.height = world.height * 0.25;
  healthBarFon.position.set(0, world.height - healthBarFon.height);
  // // healthBar.addChild(healthBarFon);

  const tab = world.height / 10;

  let foodImage = new PIXI.Sprite(textureFood);
  foodImage.position.set(world.width / 2, tab / 4);
  foodImage.height = tab;
  foodImage.width = tab;
  resourceBar.addChild(foodImage);
  textMap.set(foodImage, "Охотьтесь или собирайте ягоды, чтобы добыть пищу");
  foodImage.interactive = true;
  foodImage.buttonMode = true;
  foodImage
    .on("pointerdown", showResources)
    .on("pointerup", bonfireMenuClose)
    .on("pointerover", hintTab)
    .on("pointerout", hintTabHide);

  let woodImage = new PIXI.Sprite(textureWood);
  woodImage.position.set(world.width / 2 + tab * 2.5, tab / 2);
  woodImage.height = 50;
  woodImage.width = 70;
  resourceBar.addChild(woodImage);
  textMap.set(woodImage, "Ищите припасы, чтобы добыть древесину");
  woodImage.interactive = true;
  woodImage.buttonMode = true;
  woodImage
    .on("pointerdown", bonfireMenu)
    .on("pointerup", bonfireMenuClose)
    .on("pointerover", hintTab)
    .on("pointerout", hintTabHide);

  let energyImage = new PIXI.Sprite(textureEnergy);
  energyImage.height = energyImage.width = tab*0.6;
  energyImage.position.set(world.width / 25, tab/10);
  healthBar.addChild(energyImage);
  textMap.set(energyImage, "Сон и отдых восстанавливают энергию");
  energyImage.interactive = true;
  energyImage.buttonMode = true;
  energyImage
    .on("pointerdown", bonfireMenu)
    .on("pointerup", bonfireMenuClose)
    .on("pointerover", hintTab)
    .on("pointerout", hintTabHide);  
  
    let soupImage = new PIXI.Sprite(textureSoup);
  soupImage.height = soupImage.width = tab*0.6;
  soupImage.position.set(world.width / 25, energyImage.y+energyImage.height*1.1);
  healthBar.addChild(soupImage);
  textMap.set(soupImage, "Используйте еду, чтобы заполнить шкалу сытости");
  soupImage.interactive = true;
  soupImage.buttonMode = true;
  soupImage
    .on("pointerdown", bonfireMenu)
    .on("pointerup", bonfireMenuClose)
    .on("pointerover", hintTab)
    .on("pointerout", hintTabHide);

  let smallBonfireImage = new PIXI.Sprite(textureSmallBonfire);
  smallBonfireImage.height = smallBonfireImage.width = tab*0.6;
  smallBonfireImage.position.set(
    world.width / 25,
    soupImage.y+soupImage.height*1.1
  );
  healthBar.addChild(smallBonfireImage);
  textMap.set(smallBonfireImage, "Поддерживайте огонь, бросая в костёр дрова");
  smallBonfireImage.interactive = true;
  smallBonfireImage.buttonMode = true;
  smallBonfireImage
    .on("pointerdown", bonfireMenu)
    .on("pointerup", bonfireMenuClose)
    .on("pointerover", hintTab)
    .on("pointerout", hintTabHide);

  let bonfire = new PIXI.Sprite(textureBonfire);
  bonfire.height = bonfire.width = tab * 2.5;
  bonfire.anchor.set(0.5, 0.5);
  bonfire.position.set(world.width / 5, world.height * 0.85);
  gameScene.addChild(bonfire);
  textMap.set(bonfire, "Нажмите на костёр чтобы открыть меню действий");
  bonfire.interactive = true;
  bonfire.buttonMode = true;
  bonfire
    .on("pointertap", bonfireMenu)
    .on("pointerupoutside", bonfireMenuClose)
    .on("pointerover", hintTab)
    .on("pointerout", hintTabHide);

  //#endregion

  let style = new PIXI.TextStyle({
    fontFamily: "Comic Sans MS",
    fontSize: tab,
    fill: "#fafafa",
    stroke: "#1d1b1b",
    strokeThickness: 2,
  });

  let food, wood;

  function foodRenderer() {
    food = new PIXI.Text(resources.food, style);
    food.x = foodImage.x + 1.2 * foodImage.width;
    food.y = 0.3 * foodImage.y;
    food.zIndex = 10;
    resourceBar.addChild(food);
  }

  let woodRenderer = () => {
    wood = new PIXI.Text(resources.wood, style);
    wood.x = woodImage.x + 1.2 * woodImage.width;
    wood.y = 0.3 * woodImage.y;
    resourceBar.addChild(wood);
  };

  let time = new PIXI.Container();
  time.position.set((world.width * 3) / 4, resourceBarFon.height);
  gameScene.addChild(time);
  let day = new PIXI.Sprite(textureDay);
  let night = new PIXI.Sprite(textureNight);

  const timeRender = () => {
    time.removeChildren();
    let actualTime;
    let currentData = "День " + vitalStates.day;
    if (vitalStates.isDay) {
      actualTime = day;
      currentData += "\n Утро";
    } else {
      actualTime = night;
      currentData += "\n Вечер";
    }
    actualTime.position.set(0, 0);
    actualTime.height = tab * 1.5;
    actualTime.width = world.width / 4;
    let text = new PIXI.Text(currentData, {
      fontSize: tab / 2,
      fontFamily: "Comic Sans MS",
      fill: "#fafafa",
      stroke: "#1d1b1b",
      strokeThickness: 2,
      align: "center",
      wordWrap: true,
      wordWrapWidth: world.width / 4,
    });
    text.x += actualTime.width / 6;

    time.addChild(actualTime, text);
  };

  let resourceRefresher = () => {
    resourceBar.removeChildren();
    resourceBar.addChild(foodImage, woodImage);
    foodRenderer();
    woodRenderer();
    timeRender();
  };

  const healthRender = () => {
    let renderedHearts = Math.floor(player.health / 2);
    let hearts = [];
    for (let i = 0; i < renderedHearts; i++) {
      hearts[i] = new PIXI.Sprite(textureFullheart);
      hearts[i].width = hearts[i].height = tab;
      hearts[i].y = world.height*0.85
      hearts[i].x = world.width / 2 + (i + 1) * 1.2 * hearts[i].width;
      hearts[i].interactive = hearts[i].buttonMode = true;
      textMap.set(hearts[i], "Сон и отдых восстанавливают здоровье");
      healthBar.addChild(hearts[i]);
      hearts[i]
        .on("pointerdown", bonfireMenu)
        .on("pointerup", bonfireMenuClose)
        .on("pointerover", hintTab)
        .on("pointerout", hintTabHide);
    }
  };

  const satietyRenderer = () => {
    let satietyMax = new PIXI.Graphics();
    satietyMax.beginFill(0xff0000);
    satietyMax.drawRect(
      soupImage.x + soupImage.width * 1.2,
      soupImage.y + soupImage.height / 3,
      max.satiety,
      soupImage.height / 3
    );
    healthBar.addChild(satietyMax);

    let satiety = new PIXI.Graphics();
    satiety.beginFill(0x008000);
    satiety.drawRect(
      soupImage.x + soupImage.width * 1.2,
      soupImage.y + soupImage.height / 3,
      player.satiety,
      soupImage.height / 3
    );
    healthBar.addChild(satiety);
  };

  const flameRenderer = () => {
    let flameMax = new PIXI.Graphics();
    flameMax.beginFill(0xff0000);
    flameMax.drawRect(
      smallBonfireImage.x + smallBonfireImage.width * 1.2,
      smallBonfireImage.y + smallBonfireImage.height / 3,
      max.flame,
      smallBonfireImage.height / 3
    );
    healthBar.addChild(flameMax);

    let flame = new PIXI.Graphics();
    flame.beginFill(0x008000);
    flame.drawRect(
      smallBonfireImage.x + smallBonfireImage.width * 1.2,
      smallBonfireImage.y + smallBonfireImage.height / 3,
      resources.flame,
      smallBonfireImage.height / 3
    );
    healthBar.addChild(flame);
  };

  const energyRenderer = () => {
    let energyMax = new PIXI.Graphics();
    energyMax.beginFill(0xff0000);
    energyMax.drawRect(
      energyImage.x + energyImage.width * 1.2,
      energyImage.y + energyImage.height / 3,
      max.energy,
      energyImage.height / 3
    );

    let energy = new PIXI.Graphics();
    energy.beginFill(0x008000);
    energy.drawRect(
      energyImage.x + energyImage.width * 1.2,
      energyImage.y + energyImage.height / 3,
      player.energy,
      energyImage.height / 3
    );
    healthBar.addChild(energyMax);
    healthBar.addChild(energy);
  };

  let healthBarRefresher = () => {
    healthBar.removeChildren();
    healthBar.addChild(energyImage, soupImage, smallBonfireImage);
    energyRenderer();
    satietyRenderer();
    flameRenderer();
    healthRender();
  };

  let refresher = () => {
    fonRenderer(vitalStates.isDay)
    resourceRefresher();
    healthBarRefresher();
    // gameScene.addChild(currentFon)
  };

  function deathCheck() {
    if (player.health < 1) {
      resultTab(
        actResults.death,
        "Обновите страницу \nчтобы попробовать ещё раз"
      );
    }
  }

  function check(obj) {
    for (let key in obj) {
      if (obj[key] > max[key]) obj[key] = max[key];
      if (obj[key] < 0) obj[key] = 0;
    }
  }

  refresher();

  let bonfireMenuFon = new PIXI.Container();
  bonfireMenuFon.position.set(0, 0);

  function bonfireMenu() {
    hintTabHide();
    gameScene.addChild(bonfireMenuFon);
    bonfireMenuFon.removeChildren();
    click.play();
    let button = [];
    let buttonText = [];

    let menuStyle = new PIXI.TextStyle({
      fontFamily: "Comic Sans MS",
      fontSize: 18,
      fill: "#fafafa",
      stroke: "#1d1b1b",
      strokeThickness: 2,
      wordWrap: true,
      wordWrapWidth: ((world.width - bonfire.x) / 2) * 0.9,
    });

    for (let i = 0; i < availibleActs.length; i++) {
      button[i] = new PIXI.Sprite(textureBrownButton);
      button[i].x = bonfire.x + tab;
      button[i].width = (world.width - bonfire.x) / 2;
      button[i].height = tab;
      button[i].y =
        resourceBar.height + button[i].height / 2 + i * button[i].height;
      bonfireMenuFon.addChild(button[i]);
      button[i].buttonMode = button[i].interactive = true;
      buttonText[i] = new PIXI.Text(availibleActs[i], menuStyle);
      buttonText[i].x = button[i].x + button[i].width / 20;
      buttonText[i].y = button[i].y + button[i].height / 4;
      button[i]
        .on("pointerover", tintThis)
        .on("pointerout", DontTintThis)
        .on("pointertap", actionMap.get(availibleActs[i]));
      bonfireMenuFon.addChild(buttonText[i]);
    }
    let closeButton = new PIXI.Sprite(textureBrownButton);
    closeButton.tint = 0xff0000;
    closeButton.width = button[availibleActs.length - 1].width;
    closeButton.height = button[availibleActs.length - 1].height;
    closeButton.x = button[availibleActs.length - 1].x;
    closeButton.y =
      button[availibleActs.length - 1].height +
      button[availibleActs.length - 1].y;
    bonfireMenuFon.addChild(closeButton);
    closeButton.buttonMode = closeButton.interactive = true;
    closeButton
      .on("pointertap", bonfireMenuClose)
      .on("pointerover", tintThis)
      .on("pointerout", DontTintThis);
    let closeButtonText = new PIXI.Text("Закрыть", menuStyle);
    closeButtonText.x = closeButton.x + closeButton.width / 20;
    closeButtonText.y = closeButton.y + closeButton.height / 4;
    bonfireMenuFon.addChild(closeButtonText);
  }

  function bonfireMenuClose() {
    click.play();
    gameScene.removeChild(bonfireMenuFon);
  }

  function hunting() {
    click.play();
    let huntingResults = {
      damage: 0,
    };
    let luck = Math.random();
    // let luck = 0.1;

    if (luck > 0.5) {
      huntingResults.variant = 0;
      huntingResults.food = 5;
    } else if (luck > 0.2) {
      huntingResults.variant = 1;
      huntingResults.food = 3;
    } else {
      huntingResults.variant = 2;
      huntingResults.food = 1;
      huntingResults.damage = 2;
    }
    huntingResults.text = " Eда + " + huntingResults.food + " \n Энергия -50";
    if (!huntingResults.damage == 0) {
      huntingResults.text += "\n Здоровье -" + huntingResults.damage;
    }
    resources.food += huntingResults.food;
    player.energy -= 50;
    player.health -= huntingResults.damage;

    bonfireMenuClose();
    check(resources);
    check(player);
    dayToNight();
    refresher();
    resultTab(actResults.hunting, huntingResults.text, huntingResults.variant);
    deathCheck();
  }

  function gathering() {
    click.play();
    bonfireMenuClose();
    let luck = Math.random();
    let crop = 2;

    if (luck > 0.6) {
      crop = 3;
    }
    resources.food += crop;
    player.energy -= 30;
    let result = "Еда +" + crop + "\nЭнергия -30";
    dayToNight();
    check(resources);
    check(player);
    refresher();
    resultTab(actResults.gathering, result);
  }

  function supplies() {
    click.play();
    bonfireMenuClose();
    let crop = 5;
    resources.wood += crop;
    player.energy -= 30;
    let result = "Дрова +" + crop + "\nЭнергия -30";
    dayToNight();
    check(resources);
    check(player);
    refresher();
    resultTab(actResults.supplies, result);
  }

  function rest() {
    click.play();
    bonfireMenuClose();
    player.energy += 10;
    dayToNight();
    check(player);
    refresher();
    resultTab(actResults.rest, "Энергия +10");
  }

  function eating() {
    click.play();
    bonfireMenuClose();
    resources.food -= 5;
    player.energy += 10;
    player.satiety += 40;
    check(resources);
    check(player);
    nightToDay();
    refresher();
    resultTab(actResults.eating, "Энергия +10, \nСытость +40");
  }

  function kindle() {
    click.play();
    bonfireMenuClose();
    resources.wood -= 5;
    resources.flame += 20;
    check(resources);
    nightToDay();
    refresher();
    resultTab(actResults.kindle, "Дрова -5, \nПламя Костра +20");
  }

  function sleep() {
    click.play();
    bonfireMenuClose();
    player.energy += 30;
    player.satiety -= 20;
    resources.flame -= 10;
    nightToDay();
    check(resources);
    check(player);
    refresher();
    resultTab(actResults.sleep, "Энергия +30");
  }

  function showResources() {
    // let text = resources.food + " / " + resources.foodMax + "\n";
    // resultTab(none, text);
  }

  let resultContainer = new PIXI.Container();
  resultContainer.position.set(
    world.width / 4,
    foodImage.y + foodImage.height / 2
  );
  gameScene.addChild(resultContainer);

  function resultTab(act, summary, variant) {
    if (!variant) {
      variant = 0;
    }

    bonfire.interactive = bonfire.buttonMode = false;
    let resultTabFon = new PIXI.Graphics();
    resultTabFon.lineStyle(10, 0xc34a17, 1);
    resultTabFon.beginFill(0xe1c13b);
    resultTabFon.drawRoundedRect(
      0,
      0,
      world.width / 1.9,
      bonfire.y - resultContainer.y,
      20
    );
    resultTabFon.endFill();
    resultContainer.addChild(resultTabFon);

    let okayButton = new PIXI.Sprite(textureBrownButton);
    okayButton.position.set(
      resultTabFon.width / 4,
      (resultTabFon.height * 8) / 10
    );
    okayButton.height = 50;
    okayButton.width = resultTabFon.width / 2;
    resultContainer.addChild(okayButton);
    okayButton.buttonMode = okayButton.interactive = true;
    okayButton.on("pointertap", closeThis);

    let title = new PIXI.Text(act.title[variant]);
    title.style = {
      fontSize: okayButton.height * 0.6,
      fontFamily: "Comic Sans MS",
      fill: "#fafafa",
      stroke: "#1d1b1b",
      strokeThickness: 2,
      align: "center",
    };
    let text = new PIXI.Text(act.text[variant]);
    text.style = {
      fontSize: okayButton.height / 3,
      fontFamily: "Comic Sans MS",
      fill: "#fafafa",
      stroke: "#1d1b1b",
      strokeThickness: 2,
      align: "left",
      wordWrap: true,
      wordWrapWidth: resultTabFon.width - title.style.strokeThickness * 10,
    };
    title.position.set(title.style.strokeThickness * 5, 0);
    text.position.set(title.style.strokeThickness * 5, resultTabFon.height / 4);

    let result = new PIXI.Text(summary);
    result.style = {
      fontSize: okayButton.height / 3,
      fontFamily: "Comic Sans MS",
      fill: "#fafafa",
      stroke: "#1d1b1b",
      strokeThickness: 2,
      align: "left",
      wordWrap: true,
      wordWrapWidth: resultTabFon.width - title.style.strokeThickness * 10,
    };
    result.position.set(
      title.style.strokeThickness * 5,
      resultTabFon.height / 2
    );
    resultContainer.addChild(title, text, result);

    let okay = new PIXI.Text("    OK    ");
    okay.x = okayButton.x;
    okay.y = okayButton.y;
    okay.style = {
      fontSize: (okayButton.height * 2) / 3,
      fontFamily: "Comic Sans MS",
      fill: "#fafafa",
      stroke: "#1d1b1b",
      strokeThickness: 2,
      align: "center",
    };

    resultContainer.addChild(okay);
  }

  function closeThis() {
    click.play();
    this.parent.removeChildren();
    bonfire.interactive = bonfire.buttonMode = true;
  }

  function dayToNight() {
    availibleActs = nightActs;
    vitalStates.isDay = false;
  }

  function nightToDay() {
    availibleActs = dayActs;
    vitalStates.isDay = true;
    vitalStates.day++;
  }

  // app.ticker.add(() => gameloop());
}

// let gameloop = () => {}

let hint, hintBackground;

function hintTab() {
  hintBackground = new PIXI.Graphics();
  hintBackground.beginFill(0x808080);
  let X = this.x + this.width / 2 + 15;
  let Y = this.y - this.height / 2;
  if (Y < world.height * 0.15) {
    Y += this.height / 2;
  } else if (Y > (world.height * 3) / 5) {
    Y -= this.height;
  }

  hintBackground.drawRoundedRect(X, Y, 150, 70, 10);
  gameScene.addChild(hintBackground);
  let currentText = textMap.get(this);

  let hintStyle = new PIXI.TextStyle({
    fontFamily: "Comic Sans MS",
    fontSize: 14,
    fill: "#fafafa",
    stroke: "#1d1b1b",
    strokeThickness: 2,
    wordWrap: true,
    wordWrapWidth: 150,
  });

  hint = new PIXI.Text(currentText, hintStyle);
  hint.x = X + 5;
  hint.y = Y + 5;
  gameScene.addChild(hint);
}

function hintTabHide() {
  gameScene.removeChild(hintBackground);
  gameScene.removeChild(hint);
}

function tintThis() {
  this.tint = 0x8b3621;
}

function DontTintThis() {
  this.tint = 0xffffff;
}
