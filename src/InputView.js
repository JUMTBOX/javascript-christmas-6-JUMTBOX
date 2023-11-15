import { MissionUtils } from "@woowacourse/mission-utils";
import MENUS from "./Menus.js";

const InputView = {
  async readDate() {
    MissionUtils.Console.print(
      "안녕하세요! 우테코 식당 12월 이벤트 플래너입니다."
    );
    const input = await MissionUtils.Console.readLineAsync(
      "12월 중 식당 예상 방문 날짜는 언제인가요? (숫자만 입력해 주세요!)\n"
    );
    this.visitDayValidation(input);
    return input;
  },
  async readMenu() {
    const input = await MissionUtils.Console.readLineAsync(
      "주문하실 메뉴를 메뉴와 개수를 알려 주세요. (e.g. 해산물파스타-2,레드와인-1,초코케이크-1)\n"
    );
    this.orderValidation(input);
    this.isOrderedOnlyDrink(input);
    return input;
  },
  /**방문 날짜 유효성 검사*/
  visitDayValidation(day) {
    if (day.match(/\D/g)) {
      throw new Error("[ERROR] 유효하지 않은 날짜입니다. 다시 입력해 주세요.");
    }
    if (Number(day) < 1 || Number(day) > 31) {
      throw new Error("[ERROR] 유효하지 않은 날짜입니다. 다시 입력해 주세요.");
    }
  },
  /**주문 유효성 검사*/
  orderValidation(menu) {
    this.orderFormInspection(menu);
    this.orderNumberInspection(menu);
    let menuArr = menu.replaceAll(" ", "").split(",");
    for (let meal of menuArr) {
      let menuName = meal.match(/[가-힣]+/g).toString();
      let menuCount = meal.match(/(?<=-)\d{1,2}/g).toString();
      if (!MENUS[menuName] || Number(menuCount) < 1) {
        throw new Error(
          "[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요."
        );
      }
    }
  },
  /**음료만 주문하지 않았는지 검사 */
  isOrderedOnlyDrink(menu) {
    let menuArr = menu
      .replaceAll(" ", "")
      .split(",")
      .map((food) => (food = food.match(/[가-힣]+/g)));
    let filteredFood = menuArr.filter((food) => MENUS[food][0] !== "음료");
    if (filteredFood.length === 0) {
      throw new Error("[ERROR] 음료만 주문 시, 주문할 수 없습니다.");
    }
  },
  /**주문 음식 갯수 검사 (orderValidation에서 호출)*/
  orderNumberInspection(menu) {
    let menuArr = menu.replaceAll(" ", "").split(",");
    let menuTotalCount = 0;
    for (let meal of menuArr) {
      let menuCount = meal.match(/(?<=-)\d{1,2}/g).toString();
      menuTotalCount += Number(menuCount);
    }
    if (menuTotalCount > 20) {
      throw new Error(
        "[ERROR] 메뉴는 한 번에 최대 20개까지만 주문할 수 있습니다."
      );
    }
  },
  /**주문 형식 검사 (orderValidation에서 호출)*/
  orderFormInspection(menu) {
    menu = menu.replaceAll(" ", "");
    let forInspection = menu.split(",");
    for (let meal of forInspection) {
      if (
        !meal.match(/(?<=[가-힣]+-)\d{1,2}/g) ||
        meal.match(/(?<=[가-힣]+-)\d\D/g)
      ) {
        throw new Error(
          "[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요."
        );
      }
    }
  },
};
export default InputView;
