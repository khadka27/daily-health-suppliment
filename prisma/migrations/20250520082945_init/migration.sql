/*
  Warnings:

  - You are about to drop the column `benefits` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `brandHighlights` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `conclusion` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `cons` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `ctaButtons` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `customerReviews` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `effectiveness` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `faqs` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `howItWorks` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `howToTake` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `ingredients` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `ingredientsRating` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `keyIngredients` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `manufacturerInfo` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `manufacturerRating` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `officialWebsite` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `overallRating` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `overview` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `pricing` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `productImage` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `pros` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `safety` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `safetyRating` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `valueRating` on the `Article` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Article` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `author` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "benefits",
DROP COLUMN "brandHighlights",
DROP COLUMN "conclusion",
DROP COLUMN "cons",
DROP COLUMN "ctaButtons",
DROP COLUMN "customerReviews",
DROP COLUMN "description",
DROP COLUMN "effectiveness",
DROP COLUMN "faqs",
DROP COLUMN "howItWorks",
DROP COLUMN "howToTake",
DROP COLUMN "ingredients",
DROP COLUMN "ingredientsRating",
DROP COLUMN "keyIngredients",
DROP COLUMN "manufacturerInfo",
DROP COLUMN "manufacturerRating",
DROP COLUMN "officialWebsite",
DROP COLUMN "overallRating",
DROP COLUMN "overview",
DROP COLUMN "pricing",
DROP COLUMN "productImage",
DROP COLUMN "pros",
DROP COLUMN "safety",
DROP COLUMN "safetyRating",
DROP COLUMN "valueRating",
ADD COLUMN     "author" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "publishDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Block" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT,
    "level" INTEGER,
    "listType" TEXT,
    "imageUrl" TEXT,
    "language" TEXT,
    "ctaText" TEXT,
    "ctaLink" TEXT,
    "productName" TEXT,
    "overallRating" DOUBLE PRECISION,
    "ingredientsIntroduction" TEXT,
    "howToUse" TEXT,
    "price" TEXT,
    "verdict" TEXT,
    "author" TEXT,
    "reviewDate" TEXT,
    "medicallyReviewed" BOOLEAN,
    "factChecked" BOOLEAN,
    "ctaButtonText" TEXT,
    "ctaButtonLink" TEXT,
    "backgroundColor" TEXT,
    "order" INTEGER NOT NULL,
    "articleId" TEXT NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "ingredients" DOUBLE PRECISION,
    "value" DOUBLE PRECISION,
    "manufacturer" DOUBLE PRECISION,
    "safety" DOUBLE PRECISION,
    "effectiveness" DOUBLE PRECISION,
    "blockId" TEXT NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pros" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "blockId" TEXT NOT NULL,

    CONSTRAINT "Pros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cons" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "blockId" TEXT NOT NULL,

    CONSTRAINT "Cons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "blockId" TEXT NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Highlight" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "blockId" TEXT NOT NULL,

    CONSTRAINT "Highlight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomField" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,

    CONSTRAINT "CustomField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngredientItem" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "studyYear" TEXT,
    "studySource" TEXT,
    "studyDescription" TEXT,
    "blockId" TEXT NOT NULL,

    CONSTRAINT "IngredientItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rating_blockId_key" ON "Rating"("blockId");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pros" ADD CONSTRAINT "Pros_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cons" ADD CONSTRAINT "Cons_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomField" ADD CONSTRAINT "CustomField_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientItem" ADD CONSTRAINT "IngredientItem_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;
