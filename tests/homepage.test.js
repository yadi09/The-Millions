import { describe, expect, it } from "vitest";
import { TestDriver } from "testdriverai/vitest/hooks";

describe("The Millions - Public Site", () => {
  it("should load the site and display the brand and update announcement", async (context) => {
    const testdriver = TestDriver(context);

    await testdriver.provision.chrome({ url: "https://www.the-millions.co.uk" });

    const assertResult = await testdriver.assert("The Millions brand or update notice is displayed with a Back to Home button");
    expect(assertResult).toBeTruthy();

    const homeBtn = await testdriver.find("BACK TO HOME button");
    await homeBtn.click();

    const verified = await testdriver.assert("The page remains on The Millions site");
    expect(verified).toBeTruthy();
  });
});
