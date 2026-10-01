-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "logo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- Seed default company
INSERT INTO "companies" ("id", "name", "created_at", "updated_at")
VALUES ('default-company', 'Dont Stuck Solutions', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- AlterTable: add loan_number as a sequence-backed column, backfilled in applied_at order
CREATE SEQUENCE IF NOT EXISTS "loan_applications_loan_number_seq";

ALTER TABLE "loan_applications" ADD COLUMN "loan_number" INTEGER;

WITH ordered AS (
    SELECT "id", row_number() OVER (ORDER BY "applied_at" ASC) AS rn
    FROM "loan_applications"
)
UPDATE "loan_applications" la
SET "loan_number" = ordered.rn
FROM ordered
WHERE la."id" = ordered."id";

SELECT setval('"loan_applications_loan_number_seq"', COALESCE((SELECT MAX("loan_number") FROM "loan_applications"), 0) + 1, false);

ALTER TABLE "loan_applications" ALTER COLUMN "loan_number" SET NOT NULL;
ALTER TABLE "loan_applications" ALTER COLUMN "loan_number" SET DEFAULT nextval('"loan_applications_loan_number_seq"');
ALTER SEQUENCE "loan_applications_loan_number_seq" OWNED BY "loan_applications"."loan_number";

-- CreateIndex
CREATE UNIQUE INDEX "loan_applications_loan_number_key" ON "loan_applications"("loan_number");
