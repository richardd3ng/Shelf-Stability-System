SELECT
  e.id,
  e.title,
  e.description,
  e."ownerId",
  e."isCanceled",
  e."startDate",
  u.id AS ownerid,
  u.username AS owner,
  (
    round(
      (((CURRENT_DATE - e."startDate")) :: numeric / 7.0)
    )
  ) :: integer AS week
FROM
  (
    "Experiment" e
    JOIN "User" u ON ((e."ownerId" = u.id))
  );