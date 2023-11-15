import { MissionUtils } from "@woowacourse/mission-utils";
import MENUS from "./Menus.js";

const OutputView = {
  GIFT: "샴페인",
  printResult(visitDay, priceBeforeDiscount, benefits, menuAndCount) {
    MissionUtils.Console.print(
      `12월 ${visitDay}일에 우테코 식당에서 받을 이벤트 혜택 미리 보기!\n`
    );
    this.printMenuAndPriceBeforeDiscount(menuAndCount, priceBeforeDiscount);
    let isGiftGiven = this.printIsGiftGiven(priceBeforeDiscount);
    MissionUtils.Console.print(`\n<혜택 내역>`);
    this.printBenefitLog(benefits, isGiftGiven, visitDay);
    this.printPriceAfterDiscount(priceBeforeDiscount, benefits);
    this.printEventBadge(benefits.totalDiscount, isGiftGiven);
  },
  /**주중,주말 출력 결정*/
  setDicountName(visitDay) {
    let isAWeekDay;
    let date = new Date(`2023-12-${visitDay}`).getDay();
    date === 5 || date === 6 ? (isAWeekDay = false) : (isAWeekDay = true);
    let names = [
      "크리스마스 디데이 할인",
      isAWeekDay ? "평일 할인" : "주말 할인",
      "특별 할인",
    ];
    return names;
  },
  /**주문메뉴와 할인 전 총주문 금액 출력 */
  printMenuAndPriceBeforeDiscount(menuAndCount, priceBeforeDiscount) {
    MissionUtils.Console.print("<주문 메뉴>");
    for (let key in menuAndCount) {
      MissionUtils.Console.print(`${key} ${menuAndCount[key]}개`);
    }
    MissionUtils.Console.print(`\n<할인 전 총주문 금액>`);
    MissionUtils.Console.print(
      priceBeforeDiscount.toLocaleString("ko-KR") + "원"
    );
  },
  /**증정 이벤트 출력 */
  printIsGiftGiven(priceBeforeDiscount) {
    let gift;
    priceBeforeDiscount > 120000
      ? (gift = `${this.GIFT} 1개`)
      : (gift = "없음");
    MissionUtils.Console.print("\n<증정 메뉴>");
    MissionUtils.Console.print(gift);
    return gift !== "없음" ? true : false;
  },
  /**혜택내역 출력*/
  printBenefitLog(benefits, isGiftGiven, visitDay) {
    const discountName = this.setDicountName(visitDay);
    if (benefits.totalDiscount > 0) {
      for (let i = 0; i < discountName.length; i += 1) {
        let dNum = Object.values(benefits)[i];
        MissionUtils.Console.print(
          `${discountName[i]}: ${
            dNum > 0 ? "-" + dNum.toLocaleString("ko-KR") : dNum
          }원`
        );
      }
      this.printGiftPriceLog(isGiftGiven);
    } else {
      MissionUtils.Console.print("없음");
    }
    this.printTotalBenefit(benefits, isGiftGiven);
  },
  /**증정이벤트 혜택 금액 출력*/
  printGiftPriceLog(isGiftGiven) {
    MissionUtils.Console.print(
      `증정 이벤트: ${
        isGiftGiven ? "-" + MENUS[this.GIFT][1].toLocaleString("ko-KR") : 0
      }원`
    );
  },
  /**총혜택 금액 출력*/
  printTotalBenefit(benefits, isGiftGiven) {
    let total = isGiftGiven
      ? benefits.totalDiscount + MENUS[this.GIFT][1]
      : benefits.totalDiscount;
    MissionUtils.Console.print(`\n<총혜택 금액>`);
    MissionUtils.Console.print(
      `${total > 0 ? "-" + total.toLocaleString("ko-KR") : total}원`
    );
  },
  /**할인 후 예상 결제 금액 출력 */
  printPriceAfterDiscount(priceBeforeDiscount, benefits) {
    MissionUtils.Console.print(`\n<할인 후 예상 결제 금액>`);
    let price = priceBeforeDiscount - benefits.totalDiscount;
    MissionUtils.Console.print(`${price.toLocaleString("ko-KR")}원`);
  },
  /**12월 이벤트 배지 출력 */
  printEventBadge(totalBenefits, isGiftGiven) {
    let badge = "없음";
    if (totalBenefits >= 5000) badge = "별";
    if (totalBenefits >= 10000) badge = "트리";
    if (totalBenefits >= 20000) badge = "산타";
    if (isGiftGiven) badge = "산타";
    MissionUtils.Console.print("\n<12월 이벤트 배지>");
    MissionUtils.Console.print(badge);
  },
};

export default OutputView;
