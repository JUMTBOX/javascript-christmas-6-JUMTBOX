import App from "../src/App.js";
import { MissionUtils } from "@woowacourse/mission-utils";

const mockQuestions = (inputs) => {
  MissionUtils.Console.readLineAsync = jest.fn();

  MissionUtils.Console.readLineAsync.mockImplementation(() => {
    const input = inputs.shift();

    return Promise.resolve(input);
  });
};

const getLogSpy = () => {
  const logSpy = jest.spyOn(MissionUtils.Console, "print");
  logSpy.mockClear();

  return logSpy;
};

describe("기능 테스트", () => {
  test("혜택금액 정확도 테스트", async () => {
    const logSpy = getLogSpy();
    const expectLogs = [
      "크리스마스 디데이 할인: -1,200원",
      "평일 할인: -4,046원",
      "특별 할인: -1,000원",
      "증정 이벤트: -25,000원",
      "-31,246원",
    ];
    mockQuestions(["3", "티본스테이크-1,바비큐립-1,초코케이크-2,제로콜라-1"]);

    const app = new App();
    await app.run();

    expectLogs.forEach((log) => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(log));
    });
  });

  test.each([
    [["23", "시저샐러드-1,바비큐립-1,제로콜라-2"], "별"],
    [["11", "타파스-1,티본스테이크-2,레드와인-1"], "산타"],
    [["7", "초코케이크-5"], "트리"],
  ])("이벤트 배지 판별 정확도 테스트", async (inputs, result) => {
    const logSpy = getLogSpy();

    mockQuestions(inputs);

    const app = new App();
    await app.run();

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(result));
  });
});
