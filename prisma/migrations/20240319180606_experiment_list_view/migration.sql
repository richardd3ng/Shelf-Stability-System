CREATE VIEW "ExperimentWeekView" AS
    SELECT
    e.*,
    u.id as ownerId,
    u.username as owner,
    CAST(ROUND((CAST(CURRENT_DATE AS DATE) - e."startDate") / 7.0) AS INT) as week

    FROM public."Experiment" e
    JOIN public."User" u ON e."ownerId" = u.id;
