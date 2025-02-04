let baguniList = [];
let faucet = {};
window.baguniList = baguniList;
window.faucet = faucet;
window.addEventListener('load', async () => {

   const { app, pixics, world, size, PIXICS, b2 } = await initPixics({
      resolution: { width: 1920, height: 1080 },
      container: document.querySelector('body'),
      gravity: { x: 0, y: -5 },
      worldscale: 200,
   });
   const { ratio } = size;
   const { width, height } = size.actualSize;
   console.clear();

   let tickness = 10 * ratio;
   let boundary = new PIXICS.PhysicsGraphics({ world });
   boundary.getBody().SetBullet(true);
   boundary.drawRect(width * 1000 / 2, 0, tickness, height);
   boundary.drawRect(-width * 1000 / 2, 0, tickness, height);
   boundary.drawRect(0, height / 2, width, tickness);
   boundary.drawRect(0, -height / 2, width, tickness);
   // boundary.setContactable(false);
   boundary.getGraphic().alpha = 0.2;
   app.stage.addChild(boundary.getGraphic());

   let faucetWaterStartPointAreaSize = (1080 / 11.5) * ratio;

   function createFaucetWater() {
      let turningState = false;
      let faucetWaterStartPoint = new PIXICS.PhysicsGraphics({ world });
      faucetWaterStartPoint.getGraphic().alpha = 0;
      faucetWaterStartPoint.drawRect(0, 0, faucetWaterStartPointAreaSize, faucetWaterStartPointAreaSize / 2, 0x00ff00);
      faucetWaterStartPoint.setPosition(-315 * ratio, (310 * ratio) + (faucetWaterStartPointAreaSize / 2 / 2));
      faucetWaterStartPoint.setSensor(true);
      app.stage.addChild(faucetWaterStartPoint.getGraphic());

      let aimline = new PIXICS.PhysicsGraphics({ world });
      aimline.drawRect(0, 0, 1 * ratio, 740 * ratio, 0x00ff00);
      aimline.setPosition(-315 * ratio, -0 * ratio);
      aimline.setContactable(false);
      aimline.setSensor(true);
      app.stage.addChild(aimline.getGraphic());
      let aimed = false;
      (async () => {
         let state = true;
         while (true) {
            state = !state;
            if (aimed) {
               aimline.getGraphic().alpha = 1;
               aimline.getDraw(0).color = 0x00ff00;
            } else {
               aimline.getGraphic().alpha = state ? 0.2 : 0;
               aimline.getDraw(0).color = 0xffffff;

            }
            await pixics.sleep(16 * 4);
         }
      })();
      (async () => {
         await pixics.sleep(16);
         while (true) {
            for (let i = 0; i < baguniList.length; i++) {
               let baguniCenter = baguniList[i].getCenter();
               let aimlineX = aimline.getPosition().x;
               if (Math.abs(baguniCenter - aimlineX) <= 20 * ratio) {
                  if (baguniList[i].isFull()) {
                     aimed = !false;
                  } else {
                     aimed = true;
                     break;
                  }
               } else {
                  aimed = false;
               }
            }
            await pixics.sleep(16);
         }
      })();

      let json1 = { "layers": [{ "dots": { "polygon": [], "circle": [], "rect": [{ "x": 300, "y": 210 }, { "x": 810, "y": 270 }] }, "color": "ffffff", "friction": 0, "density": 0, "restitution": 0, "class": "rect" }, { "dots": { "polygon": [], "circle": [{ "x": 810, "y": 240 }, { "x": 810, "y": 270 }], "rect": [] }, "color": "ffffff", "friction": 0, "density": 0, "restitution": 0, "class": "circle" }, { "dots": { "polygon": [], "circle": [], "rect": [{ "x": 750, "y": 240 }, { "x": 840, "y": 330 }] }, "color": "ffffff", "friction": 0, "density": 0, "restitution": 0, "class": "rect" }, { "dots": { "polygon": [], "circle": [{ "x": 300, "y": 240 }, { "x": 330, "y": 240 }], "rect": [] }, "color": "ffffff", "friction": 0, "density": 0, "restitution": 0, "class": "circle" }], "pivotpoint": { "x": 960, "y": 450 }, "scale": 30 }
      let faucetObject = new PIXICS.PhysicsGraphics({ world });
      faucetObject.drawJSON({ scale: 30, json: json1 })  // scale을 30에서 15로 줄임
      faucetObject.setFriction(0);
      faucetObject.setGravityScale(0);
      faucetObject.setSensor(true);
      faucetObject.setPosition(-150 * ratio, 240 * ratio);
      faucetObject.getGraphic().interactive = true;
      faucetObject.getGraphic().on('click', () => {
      });
      app.stage.addChild(faucetObject.getGraphic());

      // 수도꼭지 이동 관련 변수들
      let isMoving = false;
      let moveDirection = 0; // -1: 왼쪽, 0: 정지, 1: 오른쪽
      let currentProcess;

      // 수도꼭지 이동 함수 
      async function moveFaucet(direction, moveDistance) {
         let pointer = new Object();
         currentProcess = pointer;
         if (isMoving && moveDirection === direction) return;
         if (isMoving && moveDirection !== direction) {
            moveDirection = 0;
            isMoving = false;
         }
         moveDirection = direction;
         isMoving = direction !== 0;
         if (direction !== 0) {
            while (isMoving) {
               if (currentProcess !== pointer) break;
               move(direction, moveDistance);
               await pixics.sleep(16);
            }
         }
      }
      function move(direction, moveDistance = 1) {
         if (currentOil === 0) return false;
         moveDistance = moveDistance * ratio;
         if (currentOil >= moveDistance) {
            currentOil -= moveDistance;
         } else {
            moveDistance = currentOil;
            currentOil = 0;
         }
         faucetObject.setPosition(faucetObject.getPosition().x + (direction * moveDistance), faucetObject.getPosition().y);
         faucetWaterPanLeft.setPosition(faucetWaterPanLeft.getPosition().x + (direction * moveDistance), faucetWaterPanLeft.getPosition().y);
         faucetWaterPanRight.setPosition(faucetWaterPanRight.getPosition().x + (direction * moveDistance), faucetWaterPanRight.getPosition().y);
         faucetWaterButton.setPosition(faucetWaterButton.getPosition().x + (direction * moveDistance), faucetWaterButton.getPosition().y);
         faucetWaterStartPoint.setPosition(faucetWaterStartPoint.getPosition().x + (direction * moveDistance), faucetWaterStartPoint.getPosition().y);
         faucetOilIndicatorBack.setPosition(faucetOilIndicatorBack.getPosition().x + (direction * moveDistance), faucetOilIndicatorBack.getPosition().y);
         faucetOilIndicator.setPosition(faucetOilIndicator.getPosition().x + (direction * moveDistance), faucetOilIndicator.getPosition().y);
         aimline.setPosition(aimline.getPosition().x + (direction * moveDistance), aimline.getPosition().y);
         panBox.setPosition(panBox.getPosition().x + (direction * moveDistance), panBox.getPosition().y);
         return true;
      }

      // 전역 스코프에서 접근할 수 있도록 window 객체에 할당
      faucet.getLeftFuel = () => getOilPercent();
      faucet.moveLeft = () => move(-1, 3);
      faucet.moveRight = () => move(1, 3);
      faucet.moveLeftByAnimation = (moveDistance = 2) => moveFaucet(-1, moveDistance * ratio);
      faucet.moveRightByAnimation = (moveDistance = 2) => moveFaucet(1, moveDistance * ratio);
      faucet.stopMovingAnimation = (moveDistance = 2) => moveFaucet(0, moveDistance * ratio);

      let faucetWaterPanLeft = new PIXICS.PhysicsGraphics({ world });
      faucetWaterPanLeft.drawCircle(0, 0, faucetWaterStartPointAreaSize / 4, 0xDDDDDD);
      faucetWaterPanLeft.setPosition(-808 * ratio, (427 * ratio) + (faucetWaterStartPointAreaSize / 2 / 2));
      app.stage.addChild(faucetWaterPanLeft.getGraphic());

      let faucetWaterPanRight = new PIXICS.PhysicsGraphics({ world });
      faucetWaterPanRight.drawCircle(0, 0, faucetWaterStartPointAreaSize / 4, 0xDDDDDD);
      faucetWaterPanRight.setPosition(-768 * ratio, (427 * ratio) + (faucetWaterStartPointAreaSize / 2 / 2));
      app.stage.addChild(faucetWaterPanRight.getGraphic());

      let panBox = new PIXICS.PhysicsGraphics({ world });
      panBox.drawRect(0, 0, 38 * ratio, 46.8 * ratio, 0xDDDDDD);
      panBox.setPosition(-788 * ratio, (427 * ratio) + (faucetWaterStartPointAreaSize / 2 / 2));
      app.stage.addChild(panBox.getGraphic());

      let faucetWaterButton = new PIXICS.PhysicsGraphics({ world });
      faucetWaterButton.getGraphic().tint = 0xffffff;
      faucetWaterButton.drawCircle(0, 0, faucetWaterStartPointAreaSize / 6, 0xffffff);
      faucetWaterButton.setPosition(faucetWaterPanLeft.getPosition().x, faucetWaterPanLeft.getPosition().y);
      faucetWaterButton.setSensor(true);
      app.stage.addChild(faucetWaterButton.getGraphic());

      let faucetOilIndicatorBack = new PIXICS.PhysicsGraphics({ world });
      faucetOilIndicatorBack.getGraphic().tint = 0xdddddd;
      faucetOilIndicatorBack.drawRect(0, 0, 100 * ratio, 40 * ratio, 0xffffff);
      faucetOilIndicatorBack.setPosition(faucetWaterPanLeft.getPosition().x + (120 * ratio), faucetWaterPanLeft.getPosition().y);
      app.stage.addChild(faucetOilIndicatorBack.getGraphic());

      let totalOil = 470 * ratio;
      let currentOil = totalOil;
      // let width = 100 * ratio;
      // let offset = (width - (width * percent)) / 2;
      let faucetOilIndicator = new PIXICS.PhysicsGraphics({ world });
      faucetOilIndicator.getGraphic().tint = 0xff00dd;
      faucetOilIndicator.drawRect(0, 0, 10 * ratio, 40 * ratio, 0xffffff);
      // faucetOilIndicator.setPosition(faucetWaterPanLeft.getPosition().x + (120 * ratio) - (offset), faucetWaterPanLeft.getPosition().y);
      app.stage.addChild(faucetOilIndicator.getGraphic());
      const setIndicateValue = () => {
         let percent = getOilPercent();
         faucetOilIndicator.removeDraw(0);
         if (percent > 1) percent = 1;
         if (percent < 0) percent = 0;
         let width = 100 * ratio;
         let offset = (width - (width * percent)) / 2;
         faucetOilIndicator.setPosition(faucetWaterPanLeft.getPosition().x + (120 * ratio) - (offset), faucetWaterPanLeft.getPosition().y);
         faucetOilIndicator.drawRect(0, 0, width * percent, 40 * ratio, 0xffffff);
      }
      faucetOilIndicator.setUpdate(setIndicateValue);
      const getOilPercent = () => {
         return currentOil / totalOil;
      }

      // faucetOilIndicator.getDraw(0).color = 0xff00dd;
      // {
      //    let faucetOilIndicator = new PIXICS.PhysicsGraphics({ world });
      //    faucetOilIndicator.getGraphic().tint = 0xdddddd;
      //    faucetOilIndicator.drawRect(0, 0, 100 * ratio, 40 * ratio, 0xffffff);
      //    faucetOilIndicator.setPosition(faucetWaterPanLeft.getPosition().x + (120 * ratio), faucetWaterPanLeft.getPosition().y);
      //    faucetOilIndicator.setSensor(true);
      //    app.stage.addChild(faucetOilIndicator.getGraphic());
      // }

      faucetWaterButton.getGraphic().interactive = true;
      async function turn() {
         turningState = !turningState;
         let startX = faucetWaterButton.getPosition().x;
         let duration = 200; // 0.5초
         let startTime = Date.now();

         // 색상 변경
         faucetWaterButton.getGraphic().tint = !turningState ? 0xff5500 : 0x00aa00;

         while (Date.now() - startTime < duration) {
            let progress = (Date.now() - startTime) / duration;
            progress = Math.min(1, progress);
            // easeInOutQuad 이징 함수 적용
            progress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

            // 매 프레임마다 목표 위치 재계산
            let targetX = turningState ? faucetWaterPanRight.getPosition().x : faucetWaterPanLeft.getPosition().x;
            let currentX = startX + (targetX - startX) * progress;

            faucetWaterButton.setPosition(
               currentX,
               faucetWaterPanLeft.getPosition().y
            );
            await pixics.sleep(16); // 약 60fps
         }

         // 최종 위치도 재계산하여 설정
         let finalTargetX = turningState ? faucetWaterPanRight.getPosition().x : faucetWaterPanLeft.getPosition().x;
         faucetWaterButton.setPosition(
            finalTargetX,
            faucetWaterPanLeft.getPosition().y
         );
      }
      faucetWaterButton.getGraphic().on('click', turn);

      return {
         getFaucetObject: () => faucetObject,
         faucetWaterButton,
         faucetWaterStartPoint,
         faucetWaterPanLeft,
         faucetWaterPanRight,
         turn: () => turn(),
         isTurnOn: () => {
            return turningState;
         },
         isAimed: () => {
            return aimed;
         },
         getPosition() {
            return aimline.getPosition().x;
         },
         distanceTo: (baguni) => {
            if (aimed) {
               // console.log('aimed2', aimed,baguni.isFull());
               return 0;
            }
            let baguniCenter = baguni.getCenter();
            let aimlineX = aimline.getPosition().x;
            if (Math.abs(baguniCenter - aimlineX) <= 20 * ratio) {
               return 0;
            }
            return baguniCenter - aimlineX;
         }
      };
   }

   const faucetWaterElements = createFaucetWater();
   const { faucetWaterButton } = faucetWaterElements;

   faucet.switch = () => faucetWaterElements.turn();
   faucet.isTurnedOn = () => faucetWaterElements.isTurnOn();
   faucet.isAimed = () => faucetWaterElements.isAimed();
   faucet.getPosition = () => faucetWaterElements.getPosition();
   faucet.distanceTo = (baguni) => faucetWaterElements.distanceTo(baguni);
   faucet.object = () => faucetWaterElements.getFaucetObject();
   let sensorBar;
   async function waterFlow() {
      while (true) {
         let turningState = faucet.isTurnedOn();
         if (turningState) {
            let ballSize = (1080 / 50) * ratio;
            let ball = new PIXICS.PhysicsGraphics({ world });
            ball.drawCircle(0, 0, ballSize / 2, 0x0077ff);
            ball.setGravityScale(1.3);
            let center = faucetWaterElements.faucetWaterStartPoint.getPosition().x;
            center += (Math.random() - 0.5) * (faucetWaterStartPointAreaSize * 0.6); // 좌우로 랜덤하게 ±faucetWaterStartPointAreaSize/2 만큼 위치 변경
            ball.setPosition(center, faucetWaterElements.faucetWaterStartPoint.getPosition().y);
            app.stage.addChild(ball.getGraphic());

            ball.setDynamic();
            ball.setFriction(0);
            ball.setDensity(0);
            sensorBar?.addEvent('contact', ball, function (ball) {
               (async () => {
                  let scale = 1;
                  while (scale > 0) {
                     scale -= 0.05;
                     ball.getGraphic().scale.set(scale);
                     if (scale <= 0) {
                        ball.destroy();
                     }
                     await pixics.sleep(16);
                  }
                  await pixics.sleep(16);
               })();
               if (!turningState) return;
               if (!true) {
                  faucet.switch();
               }
            });
         }
         await pixics.sleep(30);
      }
   }
   waterFlow();

   // faucetSwitch();
   // faucetSwitch();
   faucet.switch();
   faucet.switch();
   window.sleep = async (num) => pixics.sleep(num);
   window.tick = async (num = 16) => pixics.sleep(num);

   //-------------------
   if (false) {
      let baguniJson = { "layers": [{ "dots": { "polygon": [{ "x": 330, "y": 180 }, { "x": 420, "y": 780 }, { "x": 450, "y": 780 }, { "x": 450, "y": 750 }, { "x": 360, "y": 180 }], "circle": [], "rect": [] }, "color": "ffffff", "friction": 0, "density": 0, "restitution": 0, "class": "polygon" }, { "dots": { "polygon": [{ "x": 960, "y": 180 }, { "x": 870, "y": 780 }, { "x": 840, "y": 780 }, { "x": 840, "y": 750 }, { "x": 930, "y": 180 }], "circle": [], "rect": [] }, "color": "ffffff", "friction": 0, "density": 0, "restitution": 0, "class": "polygon" }, { "dots": { "polygon": [{ "x": 450, "y": 750 }, { "x": 840, "y": 750 }, { "x": 840, "y": 780 }, { "x": 450, "y": 780 }], "circle": [], "rect": [] }, "color": "ffffff", "friction": 0, "density": 0, "restitution": 0, "class": "polygon" }], "pivotpoint": { "x": 960, "y": 450 }, "scale": 30 }
      let baguni = new PIXICS.PhysicsGraphics({ world });
      baguni.drawJSON({ scale: 10, json: baguniJson })  // scale을 30에서 15로 줄임
      baguni.setFriction(0);
      baguni.setGravityScale(0);
      baguni.setPosition(-200 * ratio, 100 * ratio);
      app.stage.addChild(baguni.getGraphic());

      let baguni2 = new PIXICS.PhysicsGraphics({ world });
      baguni2.drawJSON({ scale: 10, json: baguniJson })  // scale을 30에서 15로 줄임
      baguni2.setFriction(0);
      baguni2.setGravityScale(0);
      baguni2.setPosition(50 * ratio, -100 * ratio);
      app.stage.addChild(baguni2.getGraphic());

      let baguni3 = new PIXICS.PhysicsGraphics({ world });
      baguni3.drawJSON({ scale: 10, json: baguniJson })  // scale을 30에서 15로 줄임
      baguni3.setFriction(0);
      baguni3.setGravityScale(0);
      baguni3.setPosition(-450 * ratio, -100 * ratio);
      app.stage.addChild(baguni3.getGraphic());
   }
   // let jangaemulJson = { "layers": [{ "dots": { "polygon": [{ "x": 1140, "y": 90 }, { "x": 1200, "y": 330 }, { "x": 1710, "y": 330 }, { "x": 1680, "y": 30 }], "circle": [], "rect": [] }, "color": "448866", "friction": 0, "density": 0, "restitution": 0, "class": "polygon" }, { "dots": { "polygon": [{ "x": 1320, "y": 450 }, { "x": 1350, "y": 330 }, { "x": 1650, "y": 330 }, { "x": 1560, "y": 480 }], "circle": [], "rect": [] }, "color": "448866", "friction": 0, "density": 0, "restitution": 0, "class": "polygon" }, { "dots": { "polygon": [{ "x": 1560, "y": 480 }, { "x": 1590, "y": 690 }, { "x": 1680, "y": 690 }, { "x": 1680, "y": 330 }, { "x": 1650, "y": 330 }], "circle": [], "rect": [] }, "color": "448866", "friction": 0, "density": 0, "restitution": 0, "class": "polygon" }, { "dots": { "polygon": [{ "x": 1890, "y": 720 }, { "x": 0, "y": 720 }, { "x": 0, "y": 690 }, { "x": 1890, "y": 690 }], "circle": [], "rect": [] }, "color": "003300", "friction": 1, "density": 50, "restitution": 0, "class": "polygon" }, { "dots": { "polygon": [], "circle": [], "rect": [{ "x": 0, "y": 30 }, { "x": 90, "y": 690 }] }, "color": "ffffff", "friction": 0, "density": 0, "restitution": 0, "class": "rect" }], "pivotpoint": { "x": 960, "y": 390 }, "scale": 30 }
   // //{"layers":[{"dots":{"polygon":[{"x":1140,"y":90},{"x":1200,"y":330},{"x":1710,"y":330},{"x":1680,"y":30}],"circle":[],"rect":[]},"color":"448866","friction":0,"density":0,"restitution":0,"class":"polygon"},{"dots":{"polygon":[{"x":1320,"y":450},{"x":1350,"y":330},{"x":1650,"y":330},{"x":1560,"y":480}],"circle":[],"rect":[]},"color":"448866","friction":0,"density":0,"restitution":0,"class":"polygon"},{"dots":{"polygon":[{"x":1560,"y":480},{"x":1590,"y":690},{"x":1680,"y":690},{"x":1680,"y":330},{"x":1650,"y":330}],"circle":[],"rect":[]},"color":"448866","friction":0,"density":0,"restitution":0,"class":"polygon"},{"dots":{"polygon":[{"x":1890,"y":720},{"x":0,"y":720},{"x":0,"y":690},{"x":1890,"y":690}],"circle":[],"rect":[]},"color":"003300","friction":1,"density":30,"restitution":0,"class":"polygon"}],"pivotpoint":{"x":960,"y":390},"scale":30};
   // let jangaemul = new PIXICS.PhysicsGraphics({ world });
   // jangaemul.drawJSON({ scale: 40, json: jangaemulJson });  // scale을 30에서 15로 줄임
   // jangaemul.setGravityScale(0)
   // jangaemul.setDynamic()
   // jangaemul.setPosition(-50 * ratio, 190 * ratio);
   // app.stage.addChild(jangaemul.getGraphic());
   // let faucetObject = faucet.object();
   // console.log(faucetObject);
   // console.log(jangaemul);
   // faucetObject.addEvent('contact', jangaemul, function (jangaemul) {
   //    // faucetObject.stop
   // });
   // 0 && faucetObject.setUpdate(() => {
   //    console.log('getContactCount', faucetObject.getContactCount());
   // });
   // sensorBar?.addEvent('contact', ball, function (ball) {

   const createBaguni = (x, y, color) => {
      let baguniJson = { "layers": [{ "dots": { "polygon": [{ "x": 600, "y": 0 }, { "x": 720, "y": 780 }, { "x": 750, "y": 690 }, { "x": 630, "y": 0 }], "circle": [], "rect": [] }, "color": "ffffff", "friction": 0, "density": 0, "restitution": 0, "class": "polygon" }, { "dots": { "polygon": [{ "x": 1320, "y": 0 }, { "x": 1200, "y": 780 }, { "x": 1170, "y": 690 }, { "x": 1290, "y": 0 }], "circle": [], "rect": [] }, "color": "ffffff", "friction": 0, "density": 0, "restitution": 0, "class": "polygon" }, { "dots": { "polygon": [{ "x": 750, "y": 690 }, { "x": 1170, "y": 690 }, { "x": 1200, "y": 780 }, { "x": 720, "y": 780 }], "circle": [], "rect": [] }, "color": "ffffff", "friction": 0, "density": 0, "restitution": 0, "class": "polygon" }], "pivotpoint": { "x": 960, "y": 450 }, "scale": 30 }
      baguniJson.layers.forEach(s => {
         // s.color = color.toString(16).padStart(6, '0');
      });
      let baguni = new PIXICS.PhysicsGraphics({ world });
      baguni.drawJSON({ scale: 10, json: baguniJson });  // scale을 30에서 15로 줄임
      baguni.setFriction(1);
      baguni.setGravityScale(1);
      baguni.setPosition(x * ratio, y * ratio);
      baguni.setDynamic();
      baguni.setDensity(100);
      baguni.setContactable(true);
      app.stage.addChild(baguni.getGraphic());


      let sensorBox = new PIXICS.PhysicsGraphics({ world });
      sensorBox.drawRect(0, 130 * ratio, 170 * ratio, 60 * ratio, 0x00ff00);
      sensorBox.setSensor(true);
      sensorBox.getGraphic().alpha = 0;//.4;
      sensorBox.setContactable(true);
      app.stage.addChild(sensorBox.getGraphic());
      let full = false;
      let fullStartTime = null;
      const detect = function () {
         if (sensorBox.isRelatedTo(baguni)) {
            if (!fullStartTime) {
               fullStartTime = Date.now();
            } else if (Date.now() - fullStartTime >= 500) {
               full = true;
            }
         } else {
            full = false;
            fullStartTime = null;
         }
      };
      sensorBox.setUpdate(detect); // ball.isUpdating(detect) 와 ball.remUpdate(detect) 사용가능
      sensorBox.setUpdate(() => baguni.getGraphic().alpha = full ? 1 : 0.5); // ball.isUpdating(detect) 와 ball.remUpdate(detect) 사용가능


      let sensorBoxLine = new PIXICS.PhysicsGraphics({ world });
      sensorBoxLine.drawRect(0, 100 * ratio, 210 * ratio, 2 * ratio, 0xff0000);
      sensorBoxLine.setSensor(true);
      sensorBoxLine.getGraphic().alpha = 0.4;
      sensorBoxLine.setContactable(false);
      app.stage.addChild(sensorBoxLine.getGraphic());
      sensorBox.setUpdate(() => {
         sensorBox.setPosition(baguni.getPosition().x, baguni.getPosition().y);
         sensorBox.setAngle(baguni.getAngle());
         sensorBoxLine.setPosition(baguni.getPosition().x, baguni.getPosition().y);
         sensorBoxLine.setAngle(baguni.getAngle());
      });


      // pixics.setJoint(
      //    { body: baguni, x: center, y: -105 * ratio },
      //    { body: sensorBox },
      //    { collideConnected: false, enableLimit: true, lowerAngle: 0, upperAngle: 0 },
      //    { app, color: 0x00aaff, thickness: 1.0 * ratio }
      // );

      baguni.drawRect(0, -105 * ratio, 30 * ratio, 8 * ratio, 0xffffff, 1);
      setInterval(() => {
         baguni.getDraw(3).color = baguni.getDraw(3).color === 0x000000 ? 0xffffff : 0x000000;
      }, 100);
      // baguni.drawRect(center, 50 * ratio, 230 * ratio, 8 * ratio, 0x00ff00);
      // console.log(baguni.getDraw(4))

      if (!true) {
         baguni.drawRect(180 * ratio, 80 * ratio, 5 * ratio, 350 * ratio, 0xffdd00, 0);
         baguni.drawRect(-180 * ratio, 80 * ratio, 5 * ratio, 350 * ratio, 0xffdd00, 0);
      }
      baguni.setFriction(1);

      // 바구니 이동 관련 변수들
      let isMoving = false;
      let moveDirection = 0;
      let currentProcess;

      // 바구니 이동 함수
      async function moveBaguni(direction, moveDistance) {
         let pointer = new Object();
         currentProcess = pointer;
         if (isMoving && moveDirection === direction) return;
         if (isMoving && moveDirection !== direction) {
            moveDirection = 0;
            isMoving = false;
         }
         moveDirection = direction;
         isMoving = direction !== 0;
         if (direction !== 0) {
            while (isMoving) {
               if (currentProcess !== pointer) break;
               move(direction, moveDistance);
               await pixics.sleep(16);
            }
         }
      }
      function move(direction, moveDistance) {
         baguni.setPosition(baguni.getPosition().x + (direction * (moveDistance * ratio)), baguni.getPosition().y);
      }
      let collided = false;
      baguni.setUpdate(() => {
         for (let i = 0; i < baguniList.length; i++) {
            if (baguniList[i].baguni === baguni) continue;
            let contactList = baguni.getContactList();
            for (let j = 0; j < contactList.length; j++) {
               if (contactList[j] === baguniList[i].baguni) {
                  baguni.getGraphic().tint = 0xff0000;
                  collided = true;
                  return;
               }
            }
         }
         baguni.getGraphic().tint = color;
         collided = false;
      });
      if (false) {
         let limitDistanceBetweenBaguni = 181;
         baguni.setUpdate(() => {
            for (let i = 0; i < baguniList.length; i++) {
               if (baguniList[i].baguni === baguni) continue;
               let distance = Math.abs(baguni.getPosition().x - baguniList[i].baguni.getPosition().x);
               if (distance > limitDistanceBetweenBaguni) {
                  // baguni.setPosition(baguni.getPosition().x - (distance - limitDistanceBetweenBaguni), baguni.getPosition().y);
                  console.log('너무 멀어요', distance);
               } else {
                  console.log('멀지 않아요', distance);
               }
            }
         });
      }

      return {
         baguni,
         isCollided: () => collided,
         getSensorBox: () => sensorBox,
         isFull: () => full,
         getCenter: () => baguni.getPosition().x,
         getPosition: () => baguni.getPosition().x,
         moveRightByAnimation: (distance = 4) => moveBaguni(1, distance),
         moveLeftByAnimation: (distance = 4) => moveBaguni(-1, distance),
         stopMovingAnimation: () => moveBaguni(0, 0),
         move: (direction, moveDistance) => move(direction, moveDistance),
         moveRight: () => move(1, 2),
         moveLeft: () => move(-1, 2),
      };
   };
   let baguniFirst = createBaguni(-500, -100, 0x7777ff);
   let baguniSecond = createBaguni(-200, 100, 0x00ff77);
   let baguniThird = createBaguni(100, -100, 0xff7777);
   baguniList.push(baguniFirst);
   baguniList.push(baguniSecond);
   baguniList.push(baguniThird);

   let plusPos = 230 * ratio;
   baguniFirst.baguni.setPosition(plusPos + (baguniFirst.baguni.getPosition().x - (100 * ratio)), 100 * ratio);
   baguniSecond.baguni.setPosition(plusPos + (baguniSecond.baguni.getPosition().x + (0 * ratio)), 0 * ratio);
   baguniThird.baguni.setPosition(plusPos + (baguniThird.baguni.getPosition().x + (100 * ratio)), 100 * ratio);
   if (true) {
      sensorBar = new PIXICS.PhysicsGraphics({ world });
      sensorBar.drawRect(0, 0, 1900 * 2 * ratio, ((1080 * 0.25 * 0.20) * ratio) * 3, 0x225533);
      sensorBar.setPosition(0 * ratio, -330 * ratio);
      sensorBar.setFriction(1);
      sensorBar.setDynamic();
      sensorBar.setDensity(700);
      app.stage.addChild(sensorBar.getGraphic());
   }


   // let success = false;
   // pixics.update(function (dt) {
   //    let allFull = baguniList.filter(baguni => {
   //       return baguni.isFull() && !baguni.isCollided();
   //    }).length === baguniList.length;
   //    let leftFuel = faucet.getLeftFuel();
   //    if (!success && (allFull && leftFuel === 0)) {
   //       success = true;
   //       Swal.fire({
   //          title: '성공!',
   //          text: '성공했습니다.',
   //          icon: 'success'
   //       });
   //    }
   // });


   let success = false;
   pixics.update(function (dt) {
      // 1. 모든 바구니가 물을 가득 채우고(충돌 없이) 있는지 확인
      const allFull = baguniList.every(baguni => baguni.isFull() && !baguni.isCollided());

      // 2. 수도꼭지 연료가 모두 소진되었는지 확인
      const fuelDepleted = (faucet.getLeftFuel() === 0);

      // 3. 수도꼭지가 두번째 바구니에 조준되어 있는지 확인
      //    두번째 바구니에 대해 faucet.distanceTo() 값이 0이면 조준된 것으로 판단
      const aimedAtSecond = (faucet.distanceTo(baguniList[1]) === 0);

      // 4. 첫번째와 두번째 바구니의 거리보다 두번째와 세번째 바구니의 거리가 2배 이상 멀어야 함
      const d1 = Math.abs(baguniList[1].getPosition() - baguniList[0].getPosition());
      const d2 = Math.abs(baguniList[2].getPosition() - baguniList[1].getPosition());
      const distanceCondition = (d2 >= 2 * d1);

      // 5. 수도꼭지가 어떤 바구니와도 충돌 중이면 안 됨
      const faucetColliding = faucet.object().getContactList().some(contact => {
         return baguniList.some(b => contact === b.baguni);
      });
      const faucetNotColliding = !faucetColliding;

      // 모든 조건이 만족되면 성공 처리
      if (!success && allFull && fuelDepleted && aimedAtSecond && distanceCondition && faucetNotColliding) {
         success = true;
         Swal.fire({
            title: '성공!',
            text: '성공했습니다.',
            icon: 'success'
         });
      }
   });











   // while (typeof window.solve !== 'function') {
   //    console.log('wait solve');
   //    await sleep(100);
   // }
   // solve();






















































   window._loadState = true;





});


