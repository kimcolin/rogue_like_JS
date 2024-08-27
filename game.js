import chalk from 'chalk';
import readlineSync from 'readline-sync';

// 플레이어 정보
class Player {
  constructor() {
    this.hp = 100;
    this.attackpower = 10; // 공격력
  }

  // 플레이어의 공격
  attack(monster) {
    let damage = this.attackpower;
    monster.hp -= damage; // 데미지가 몬스터 hp를 감소
    return damage;
  }

  //플레이어의 반격
  counterAttack(monster) {
    let damage = Math.floor(this.attackpower * 2); //데미지 2배 적용
    monster.hp -= damage;
    return damage;
  }
}

// 몬스터 정보
class Monster {
  constructor(stage) {
    this.hp = 100;
    this.attackpower = 10;

    //스테이지 2부터 hp와 공격력 랜덤 증가
    if (stage > 1) {
      this.hp += Math.floor(Math.random() * (stage * 20));
      this.attackpower += Math.floor(Math.random() * (stage * 5));
    }
  }

  // 몬스터의 공격
  attack(player) {
    let damage = this.attackpower;
    player.hp -= damage; // 데미지가 플레이어 hp를 감소
    return damage;
  }

  // 몬스터의 반격
  weakenedAttack(player) {
    let damage = Math.floor(this.attackpower * 0.5); // 50% 공격력으로 반격
    player.hp -= damage;
    return damage;
  }
}

// 전투창
// 스테이지, 몬스터와 플레이어의 정보
function displayStatus(stage, player, monster) {
  console.log(
    chalk.white(`\n================================ 정보 ================================`),
  );
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
      chalk.blueBright(`| 플레이어: HP ${player.hp}, 공격력 ${player.attackpower} `) +
      chalk.redBright(`| 몬스터: HP ${monster.hp}, 공격력 ${monster.attackpower} |`),
  );
  console.log(
    chalk.white(`======================================================================\n`),
  ); // 정보 구분선
}

const battle = async (stage, player, monster) => {
  let logs = [];

  while (player.hp > 0 && monster.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(chalk.white.bold(`\n1. 공격한다 2. 방어한다. 3. 도망친다.`));
    const choice = readlineSync.question('당신의 선택은? ');

    logs.push(chalk.green(`${choice}을 선택하셨습니다.`)); // ${choice} : 템플릿 리터럴

    switch (choice) {
      //플레이어의 공격
      case '1':
        const damage = player.attack(monster);
        logs.push(chalk.blue(`몬스터에게 ${damage}의 피해를 입혔습니다.`));
        break; // break는 스위치문을 탕출함

      //플레이어의 방어 및 반격
      case '2':
        if (Math.random() < 0.5) {
          logs.push(chalk.blue('방어 성공!'));
          const monsterDamage = monster.weakenedAttack(player); // 몬스터의 약화된 공격
          logs.push(chalk.blue(`플레이어가 방어 후 ${monsterDamage}의 피해를 입었습니다.`));

          const counterDamage = player.counterAttack(monster); // 반격
          logs.push(
            chalk.blue(`플레이어가 몬스터에게 반격하여 ${counterDamage}의 피해를 입혔습니다.`),
          );
        } else {
          logs.push(chalk.red('방어 실패...'));
          const monsterDamage = monster.attack(player); // 방어 실패 시 몬스터의 공격
          logs.push(chalk.red(`몬스터가 플레이어에게 ${monsterDamage}의 피해를 입혔습니다.`));
        }
        break;

      //플레이어의 도망
      case '3':
        if (Math.random() < 0.5) {
          console.log(chalk.blue('도망쳤다...!')); //logs.push를 썻었으나 도망쳤다 문구가 뜨지않고 스테이지가 넘어가는 문제가 있었음
          readlineSync.question('엔터를 누르면 다음 스테이지로 넘어갑니다.');
          return 'escape'; //return은 함수를 탈출함 escape로 이동
        } else {
          logs.push(chalk.red('도망치지 못했다...'));
        }
        break;

      //잘못된 입력시
      default:
        logs.push(chalk.red('잘못된 선택입니다.'));
    }
    //몬스터의 hp가 0이되면
    if (monster.hp <= 0) {
      console.log(chalk.blue('몬스터를 처치했습니다!'));
      readlineSync.question('다음 스테이지로 가시려면 엔터를 눌러주세요');
      return 'win';
    }
    // 플레이어의 hp가 0이되면
    else if (player.hp <= 0) {
      console.log(chalk.red('플레이어가 사망했습니다. Game Over!'));
      return 'lose';
    }
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// 게임 시작
export async function startGame() {
  console.clear();
  let stage = 1;

  //스테이지가 10까지 되는 동안
  while (stage <= 10) {
    const monster = new Monster(stage);
    const player = new Player(stage);
    const result = await battle(stage, player, monster);

    if (result === 'escape') {
      console.log('스테이지를 넘어갑니다...');
      await sleep(1000); // 1초 대기
      stage++; // 스테이지를 넘어감
    } else if (result === 'lose') {
      console.log('게임 오버!');
      break; // 게임 종료
    } else if (result === 'win') {
      console.log('스테이지 클리어!');
      stage++; // 스테이지를 넘어감
    }
  }

  // 게임클리어
  if (stage > 10) {
    console.log('Game Clear!');
  }
  console.log('게임을 종료합니다.');
}
