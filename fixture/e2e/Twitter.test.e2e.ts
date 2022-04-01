import { assertSnapshotsEqual, assertSnapshot } from "./utils/SnapshotAsserts";
import { wipeArtifactsLocation, reference } from "./utils/SnapshotLocation";
import goBack from "./utils/goBack";

describe("Twitter", () => {
  const flashListReferenceTestName = "Twitter_with_FlashList_looks_the_same";

  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    wipeArtifactsLocation("diffs");
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("with FlashList looks the same", async () => {
    await element(by.id("Twitter Timeline")).tap();

    const testRunScreenshotPath = await element(
      by.id("FlashList")
    ).takeScreenshot(flashListReferenceTestName);

    assertSnapshot(testRunScreenshotPath, flashListReferenceTestName);
  });

  it("with FlatList looks the same as with FlashList", async () => {
    const testName = "Twitter_with_FlatList_looks_the_same_as_with_FlashList";

    await element(by.id("Twitter FlatList Timeline")).tap();

    const testRunScreenshotPath = await element(
      by.id("FlatList")
    ).takeScreenshot(testName);

    // Assert that FlatList reference is the same
    assertSnapshot(testRunScreenshotPath, testName);

    // Assert that FlatList reference is the same as with FlashList
    assertSnapshotsEqual(
      reference(flashListReferenceTestName),
      reference(testName),
      testName
    );
  });

  it("looks the same after orientation change", async () => {
    const testName = "Twitter_looks_the_same_after_orientation_change";
    const flatListTestName = `with_FlatList_${testName}`;

    // Go to Twitter with FlashList screen
    await element(by.id("Twitter Timeline")).tap();
    // Scroll 500px down and change orientation to lansdsape
    await scrollAndRotate("FlashList");
    const flashListScreenshotPath = await element(
      by.id("FlashList")
    ).takeScreenshot(testName);

    assertSnapshot(flashListScreenshotPath, testName);

    await device.setOrientation("portrait");
    await goBack();

    // Go to Twitter with FlatList screen
    await element(by.id("Twitter FlatList Timeline")).tap();
    await scrollAndRotate("FlatList");

    const flatListScreenshotPath = await element(
      by.id("FlatList")
    ).takeScreenshot(flatListTestName);

    assertSnapshotsEqual(
      flashListScreenshotPath,
      flatListScreenshotPath,
      flatListTestName
    );

    // Return device to the original state
    await device.setOrientation("portrait");
  });

  it("is updated after refreshed", async () => {
    const testName = "Twitter_is_updated_after_refreshed";
    await element(by.id("Twitter Timeline")).tap();

    const flashList = element(by.id("FlashList"));
    // Simulate pull to refresh
    await flashList.swipe("down", "fast");

    const flashListScreenshotPath = await flashList.takeScreenshot(testName);

    assertSnapshot(flashListScreenshotPath, testName);
  });
});

const scrollAndRotate = async (id: string) => {
  await element(by.id(id)).scroll(500, "down");

  await device.setOrientation("landscape");
};