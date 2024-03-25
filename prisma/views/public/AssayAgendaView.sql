SELECT
  a.id,
  a."experimentId",
  e."targetDate",
  e.title,
  e.owner,
  tech.technician,
  c.name AS condition,
  t.type,
  a.week,
  result."resultId"
FROM
  "Assay" a,
  LATERAL (
    SELECT
      "AssayType".id,
      "AssayType".name AS TYPE
    FROM
      "AssayType"
    WHERE
      (a."assayTypeId" = "AssayType".id)
  ) t,
  LATERAL (
    SELECT
      e_1.id,
      e_1.title,
      e_1."startDate",
      (
        (
          e_1."startDate" + (
            '7 days' :: INTERVAL DAY * (a.week) :: double precision
          )
        )
      ) :: date AS "targetDate",
      u.username AS owner,
      e_1."isCanceled"
    FROM
      "Experiment" e_1,
      LATERAL (
        SELECT
          "User".username
        FROM
          "User"
        WHERE
          (e_1."ownerId" = "User".id)
      ) u
    WHERE
      (a."experimentId" = e_1.id)
  ) e,
  LATERAL (
    SELECT
      min(u.username) AS technician
    FROM
      "AssayTypeForExperiment" atfe,
      LATERAL (
        SELECT
          "User".username
        FROM
          "User"
        WHERE
          (atfe."technicianId" = "User".id)
      ) u
    WHERE
      (
        (atfe."assayTypeId" = t.id)
        AND (atfe."experimentId" = e.id)
      )
  ) tech,
  LATERAL (
    SELECT
      "Condition".name
    FROM
      "Condition"
    WHERE
      (a."conditionId" = "Condition".id)
  ) c,
  LATERAL (
    SELECT
      min("AssayResult".id) AS "resultId"
    FROM
      "AssayResult"
    WHERE
      ("AssayResult"."assayId" = a.id)
  ) result
WHERE
  (e."isCanceled" = false);