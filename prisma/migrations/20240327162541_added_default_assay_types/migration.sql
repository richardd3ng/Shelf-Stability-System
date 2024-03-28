WITH defaults AS (
    SELECT 'Sensory' AS name, false AS "isCustom", 'similarity' AS units, 'Default sensory assay type' AS description
    UNION ALL
    SELECT 'Moisture', false, '% moisture', 'Default moisture assay type'
    UNION ALL
    SELECT 'Hexanal', false, 'ppm hexanal', 'Default hexanal assay type'
    UNION ALL
    SELECT 'Peroxide value (PV)', false, 'PV', 'Default peroxide value assay type'
    UNION ALL
    SELECT 'Anisidine', false, 'AV', 'Default moisture assay type'
    UNION ALL
    SELECT 'Free fatty acid (FFA)', false, '% FFA', 'Default free fatty acid assay type'
)
INSERT INTO public."AssayType" (name, "isCustom", units, description)
SELECT name, "isCustom", units, description
FROM defaults
WHERE NOT EXISTS (SELECT 1 FROM public."AssayType");