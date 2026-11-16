import { describe, expect, it } from "vitest";
import { TestDriver } from "testdriverai/vitest/hooks";

describe("The Millions - Admin Authentication", () => {
  it("should display invalid credentials error on failed login attempt", async (context) => {
    const testdriver = TestDriver(context);

    await testdriver.provision.chrome({ url: "https://www.the-millions.co.uk/admin/login" });

    const emailInput = await testdriver.find("Access Identity input field");
    await emailInput.click();
    await testdriver.type("admin@themillions.com");

    const passwordInput = await testdriver.find("Security Key password input field");
    await passwordInput.click();
    await testdriver.type("invalid-key-test");

    const submitBtn = await testdriver.find("ENTER CONTROL CENTER button");
    await submitBtn.click();

    const assertResult = await testdriver.assert("An error message indicating invalid credentials is displayed");
    expect(assertResult).toBeTruthy();
  });
});
