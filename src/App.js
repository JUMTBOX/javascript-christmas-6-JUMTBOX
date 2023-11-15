import InputView from "./InputView.js";
import OutputView from "./OutputView.js";
import MENUS from "./Menus.js";
import { MissionUtils } from "@woowacourse/mission-utils";

class App {
  #totalOrderPrice;
  async run() {
    try {
      const DATE = await InputView.readDate();
      const MENU = await InputView.readMenu();
      let priceBeforeDiscount = this.#totalPriceBeforeGetBenefits(MENU);
      let benefits = this.#putOutTotalBenefits(DATE, MENU);
      let menuAndCount = this.#getMenuAndCount(MENU);
      OutputView.printResult(DATE, priceBeforeDiscount, benefits, menuAndCount);
    } catch (e) {
      MissionUtils.Console.print(e.message);
    }
  }
  #getMenuAndCount(menu) {
    let menuArr = menu.replaceAll(" ", "").split(",");
    let menuCounter = {};
    for (let meal of menuArr) {
      let menuName = meal.match(/[가-힣]+/g).toString();
      let menuCount = meal.match(/[0-9]+/g).toString();
      menuCounter[menuName] = Number(menuCount);
    }
    return menuCounter;
  }
  /**주문메뉴 중 에피타이저,메인,디저트,음료가 각각 몇개인지 세는 기능 (#weekdayBenefits 에서 호출)*/
  #isMainOrSide(menu) {
    let menuArr = menu.replaceAll(" ", "").split(",");
    let menuCounter = {};
    for (let meal of menuArr) {
      let mealName = meal.match(/[가-힣]+(?=-)/g).toString();
      let mealCount = meal.match(/(?<=-)\d+/g);
      let data = MENUS[mealName][0];
      menuCounter[data] = (menuCounter[data] || 0) + 1 * Number(mealCount);
    }
    return menuCounter;
  }
  #totalPriceBeforeGetBenefits(menu) {
    let counter = this.#getMenuAndCount(menu);
    let total = 0;
    for (let key in counter) {
      total += MENUS[key][1] * counter[key];
    }
    this.#totalOrderPrice = total;
    return total;
  }
  /** 크리스마스 디데이 할인*/
  #dDayBenefits(day) {
    let dDayDiscount = 0;
    if (day <= 25) {
      dDayDiscount = 1000 + (day - 1) * 100;
    }
    if (this.#totalOrderPrice < 10000) {
      dDayDiscount = 0;
    }
    return dDayDiscount;
  }
  /**이벤트 달력에 별 있으면 1,000원 할인*/
  #specialBenefit(day) {
    let specialDiscount = 0;
    const WEEKDAY = new Date(`2023-12-${day}`).getDay();
    if (WEEKDAY === 0 || Number(day) === 25) {
      specialDiscount += 1000;
    }
    if (this.#totalOrderPrice < 10000) {
      specialDiscount = 0;
    }
    return specialDiscount;
  }
  /**주말할인 기능 - 메인 메뉴 1개당 2,023원 할인 (금,토)*/
  #weekendBenefits(menu) {
    let counter = this.#isMainOrSide(menu);
    let discount = 0;
    counter["메인"] && (discount += counter["메인"] * 2023);
    if (this.#totalOrderPrice < 10000) {
      discount = 0;
    }
    return discount;
  }
  /**평일할인 기능 - 디저트 메뉴 1개당 2,023원 할인 (일~목)*/
  #weekdayBenefits(menu) {
    let counter = this.#isMainOrSide(menu);
    let discount = 0;
    counter["디저트"] && (discount += counter["디저트"] * 2023);
    if (this.#totalOrderPrice < 10000) {
      discount = 0;
    }
    return discount;
  }
  #putOutTotalBenefits(day, menu) {
    const WEEKDAY = new Date(`2023-12-${day}`).getDay();
    let weekDayDiscount = this.#weekdayBenefits(menu);
    let weekendDiscount = this.#weekendBenefits(menu);
    let dDayDiscount = this.#dDayBenefits(day);
    let specialDiscount = this.#specialBenefit(day);
    return {
      dDayDiscount: dDayDiscount,
      discount:
        WEEKDAY === 5 || WEEKDAY === 6 ? weekendDiscount : weekDayDiscount,
      specialDiscount: specialDiscount,
      totalDiscount:
        (WEEKDAY === 5 || WEEKDAY === 6 ? weekendDiscount : weekDayDiscount) +
        specialDiscount +
        dDayDiscount,
    };
  }
}
export default App;
