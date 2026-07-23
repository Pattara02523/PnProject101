-- A user may have at most one default portfolio.
CREATE UNIQUE INDEX "portfolios_one_default_per_user_key"
ON "portfolios"("user_id")
WHERE "is_default" = true;
