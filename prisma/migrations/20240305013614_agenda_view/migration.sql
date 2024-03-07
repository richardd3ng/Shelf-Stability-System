CREATE VIEW "AssayAgendaView" AS
    SELECT
    a.id,
    a."experimentId" as "experimentId",
    "targetDate",
    e.title, 
    owner,
    technician,
    c.name as condition,
    type,
    a.week,
    result."resultId"

    FROM public."Assay" a,
    LATERAL (SELECT id, name as type
        FROM public."AssayType"
        WHERE a."assayTypeId" = id) t,
    LATERAL (SELECT id, title, e."startDate", CAST(e."startDate" + interval '7' day * a.week AS DATE) as "targetDate", u.username as owner, e."isCanceled"
        FROM public."Experiment" e,
        LATERAL (SELECT username FROM public."User" WHERE e."ownerId" = id) u
        WHERE a."experimentId" = id) e,
    LATERAL (SELECT MIN(u.username) as technician
        FROM public."AssayTypeForExperiment" aTFE,
        LATERAL (SELECT username FROM public."User" WHERE aTFE."technicianId" = id) u
        WHERE aTFE."assayTypeId" = t.id
        AND aTFE."experimentId" = e.id) tech,
    LATERAL (SELECT name
        FROM public."Condition"
        WHERE a."conditionId" = id) c,
    LATERAL (SELECT MIN(id) as "resultId"
        FROM public."AssayResult"
        WHERE "assayId" = a.id) result
    WHERE e."isCanceled" = FALSE;