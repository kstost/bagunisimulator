
미션 수행을 위한 코드를 작성하세요.

## API
```javascript
/**
* tick(): 16ms 동안 대기
*/
await window.tick();

/**
* window.faucet.moveLeft(): 수도꼭지를 왼쪽으로 이동
* 연료가 없으면 이동할 수 없다
* 애니메이션 효과를 위해서 매 사용마다 await tick();를 이용해서 대기하도록 해주세요.
* @returns {boolean} 이동 성공 여부 (이동하기 위한 연료가 없으면 false)
*/
window.faucet.moveLeft();

/**
* window.faucet.moveRight(): 수도꼭지를 오른쪽으로 이동
* 연료가 없으면 이동할 수 없다
* 애니메이션 효과를 위해서 매 사용마다 await tick();를 이용해서 대기하도록 해주세요.
* @returns {boolean} 이동 성공 여부 (이동하기 위한 연료가 없으면 false)
*/
window.faucet.moveRight();

/**
* window.faucet.getLeftFuel(): 수도꼭지의 남은 이동할 수 있는 연료량 확인
* 연료가 없으면 이동할 수 없다
* @returns {number} 남은 연료량 (0~1)
*/
window.faucet.getLeftFuel();


/**
* window.baguniList[index].moveLeft(): 지정된 바구니를 왼쪽으로 이동
* 연료의 개념이 없으며 무한으로 이동할 수 있다
* 애니메이션 효과를 위해서 매 사용마다 await tick();를 이용해서 대기하도록 해주세요.
*/
window.baguniList[0].moveLeft();

/**
* window.baguniList[index].moveRight(): 지정된 바구니를 오른쪽으로 이동
* 연료의 개념이 없으며 무한으로 이동할 수 있다
* 애니메이션 효과를 위해서 매 사용마다 await tick();를 이용해서 대기하도록 해주세요.
*/
window.baguniList[0].moveRight();

/**
* window.baguniList[index].isFull(): 지정된 바구니가 물로 가득 찼는지 확인
* @returns {boolean} 바구니가 가득 찼으면 true, 아니면 false
*/
window.baguniList[0].isFull();

/**
* window.baguniList[index].isCollided(): 지정된 바구니가 다른 바구니와 충돌했는지 확인
* @returns {boolean} 바구니가 충돌했으면 true, 아니면 false
*/
window.baguniList[0].isCollided();


/**
* window.baguniList[index].getPosition(): 지정된 바구니의 위치 확인
* @returns {number} 바구니의 위치 (왼쪽으로 갈수록 숫자가 작아짐)
*/
window.baguniList[0].getPosition();

/**
* window.faucet.getPosition(): 수도꼭지에서 물이 나오는 위치 확인
* @returns {number} 수도꼭지에서 물이 나오는 위치 (왼쪽으로 갈수록 숫자가 작아짐)
*/
window.faucet.getPosition();

/**
* window.faucet.switch(): 수도꼭지 물을 켜거나 끔 (토글)
*/
window.faucet.switch();

/**
* window.faucet.isTurnedOn(): 수도꼭지의 물이 켜져있는지 확인
* @returns {boolean} 물이 켜져있으면 true, 꺼져있으면 false
*/
window.faucet.isTurnedOn();

/**
* window.faucet.isAimed(): 수도꼭지가 바구니를 향하고 있는지 확인
* @returns {boolean} 바구니를 향하고 있으면 true, 아니면 false
*/
window.faucet.isAimed();

/**
* window.faucet.distanceTo(baguni): 수도꼭지와 바구니 사이의 거리 계산
* 거리가 음수라면 window.faucet.moveLeft()를 통해서 왼쪽으로 이동해서 맞추면 됨.
* 거리 0이면 맞은거임.
* @param {Object} baguni - 바구니 객체
* @returns {number} 거리
*/
window.faucet.distanceTo(window.baguniList[0]);
```

## 코드 작성
주어진 미션을 code.js의 solve() 함수에 구현해주세요.
```javascript
async function solve(){
    // 모든 바구니에 물을 가득 채우세요.
}
```

## 다음을 미션을 완수해주세요.
수도꼭지의 이동은 연료 제한이 있어서 자유롭지 못하다는 점을 고려해서 모든 바구니에 물을 가득 채워주세요.

## 성공 조건
- 모든 바구니에 물을 가득 채워야함.
- 수도꼭지의 연료는 모두 소진해야함.
- 수도꼭지는 두번째 바구니에 조준이 되어있는 상태여야함.
- 첫번째와 두번째 바구니의 거리보다 두번째와 세번째 바구니의 거리가 2배 이상 더 멀어야한다.
- 수도꼭지가 다른 바구니와 충돌하면 안됨.