import { CalculatorService } from "./calculator.service";
import { TestBed } from "@angular/core/testing";
import { LoggerService } from "./logger.service";

describe("CalculatorService", () => {
  let calculatorService: CalculatorService, loggerServiceSpy: any;

  beforeEach(() => {
    loggerServiceSpy = jasmine.createSpyObj("LoggerService", [
      "log",
      "testMethodToReturnValue",
    ]);
    loggerServiceSpy.testMethodToReturnValue.and.returnValue(2);


   TestBed.configureTestingModule({
    providers:[
        CalculatorService,
        {provide:LoggerService, useValue:loggerServiceSpy}
    ]
   });
   calculatorService = TestBed.inject(CalculatorService);

  });

  it("should adding two numbers and return the result", () => {
    const result = calculatorService.add(1, 1);
    expect(result).toBe(2);
    expect(loggerServiceSpy.log).toHaveBeenCalledTimes(1);
  });

  it("should subtract two numbers and return the result", () => {
    const result = calculatorService.subtract(2, 1);
    expect(result).toBe(1);
    expect(loggerServiceSpy.log).toHaveBeenCalledTimes(1);
  });
});
