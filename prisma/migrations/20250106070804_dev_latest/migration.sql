/*
  Warnings:

  - You are about to alter the column `showDecimalPoints` on the `GiftSetting` table. The data in that column could be lost. The data in that column will be cast from `String` to `Boolean`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GiftSetting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "addEmailClient" TEXT,
    "giftWrapTagName" TEXT,
    "giftMessageTagName" TEXT,
    "giftReceiptTagName" TEXT,
    "refreshTheCart" TEXT NOT NULL DEFAULT '1',
    "giftLogging" TEXT NOT NULL DEFAULT '1',
    "showDecimalPoints" BOOLEAN NOT NULL DEFAULT false,
    "shop" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_GiftSetting" ("addEmailClient", "createdAt", "giftLogging", "giftMessageTagName", "giftReceiptTagName", "giftWrapTagName", "id", "refreshTheCart", "shop", "showDecimalPoints") SELECT "addEmailClient", "createdAt", "giftLogging", "giftMessageTagName", "giftReceiptTagName", "giftWrapTagName", "id", "refreshTheCart", "shop", "showDecimalPoints" FROM "GiftSetting";
DROP TABLE "GiftSetting";
ALTER TABLE "new_GiftSetting" RENAME TO "GiftSetting";
CREATE UNIQUE INDEX "GiftSetting_shop_key" ON "GiftSetting"("shop");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
