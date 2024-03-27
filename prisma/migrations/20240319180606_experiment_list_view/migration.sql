CREATE VIEW "ExperimentWeekView" AS
    SELECT
    e.*,
    u.username as owner,
    u."displayName" as "ownerDisplayName",
    CAST(ROUND((CAST(CURRENT_DATE AS DATE) - e."startDate") / 7.0) AS INT) as week

    FROM public."Experiment" e
    JOIN public."User" u ON e."ownerId" = u.id;
