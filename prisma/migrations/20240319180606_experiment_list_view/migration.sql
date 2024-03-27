CREATE VIEW "ExperimentWeekView" AS
(
    WITH with_owners AS (
        SELECT e.*, u.username as owner, u."displayName" as "ownerDisplayName", CAST(ROUND((CAST(CURRENT_DATE AS DATE) - e."startDate") / 7.0) AS INT) as week
        FROM public."Experiment" e
        INNER JOIN public."User" u ON e."ownerId" = u.id
    ),
    with_technicians AS (
        SELECT w.*, a."technicianId"
        FROM with_owners w LEFT OUTER JOIN public."AssayTypeForExperiment" a ON w.id = a."experimentId"
    )
    SELECT id, title, description, "ownerId", "isCanceled", "startDate", owner, "ownerDisplayName", week, COALESCE(STRING_AGG(w."technicianId"::TEXT, ','), '') AS "technicianIds"
    FROM with_technicians w
    GROUP BY id, title, description, "ownerId", "isCanceled", "startDate", owner, "ownerDisplayName", week
);
