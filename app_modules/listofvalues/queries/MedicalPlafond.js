const MedicalPlafond = `
SELECT plafond
  FROM (                              -- :1 EMPCODE, :2 KATEGORI , :3 KELAS_RI
        SELECT   CASE
                     WHEN PARAMETERVALUECODE LIKE 'B%'
                     THEN
                         NVL (PLAFOND_3, 0)
                     ELSE
                         0
                 END
               + CASE
                     WHEN PARAMETERVALUECODE LIKE '%M%'
                     THEN
                         NVL (PLAFOND, 0)
                     WHEN PARAMETERVALUECODE LIKE '%F%'
                     THEN
                         NVL (PLAFOND_2, 0)
                     WHEN PARAMETERVALUECODE LIKE '%L%'
                     THEN
                         NVL (PLAFOND, 0)
                     ELSE
                         0
                 END    plafond
          FROM HR_MEDICAL_PLAFOND       P,
               EMPMASTEREPMS            E,
               EPMSAPPS.PARAMETERVALUE  V
         WHERE     P.CODE = E.GRADE1
               AND CATEGORIES = :2
               AND categories = 'KM'
               AND V.PARAMETERCODE = 'EP089'
               AND CONTROLSYSTEM = CATEGORIES
               AND EMPCODE = :1
               AND PARAMETERVALUECODE = :3
               AND P.INACTIVE IS NULL
        UNION
        SELECT PLAFOND
          FROM HR_MEDICAL_PLAFOND P, EMPMASTEREPMS E
         WHERE     CATEGORIES = 'RJ'
               AND P.CODE = E.GRADE1
               AND E.EMPCODE = :1
               AND CASE
                       WHEN NVL (E.SEX, 0) = 0 THEN 'KARYAWAN'
                       ELSE 'KARYAWATI'
                   END =
                   SUBCATEGORIES
               AND DECODE (NVL (E.MARITALSTATUS, 0),
                           0, 'LAJANG',
                           1, 'MENIKAH',
                           2, 'JANDA') =
                   DESCRIPTION
               AND DATETERMINATE IS NULL
               AND P.INACTIVE IS NULL
               AND :2 = 'RJ'
               AND NVL(:3,'RJG') = 'RJG'
        UNION
        SELECT PLAFOND
          FROM HR_MEDICAL_PLAFOND P, EMPMASTEREPMS E
         WHERE     CATEGORIES = 'RJ'
               AND :3 = 'RJM'
               AND P.SUBCATEGORIES = :3
               AND E.EMPCODE = :1
               AND DATETERMINATE IS NULL
               AND P.INACTIVE IS NULL
               AND :2 = 'RJ'
        UNION
        SELECT PLAFOND
          FROM HR_MEDICAL_PLAFOND P, EMPMASTEREPMS E
         WHERE     CATEGORIES = 'RI'
               AND P.CODE = E.GRADE1
               AND E.EMPCODE = :1
               AND DATETERMINATE IS NULL
               AND P.INACTIVE IS NULL
               AND :2 = 'RI'
        UNION
        SELECT PLAFOND
          FROM HR_MEDICAL_PLAFOND P, EMPMASTEREPMS E
         WHERE     CATEGORIES = 'LH'
               AND P.CODE = E.GRADE1
               AND E.EMPCODE = :1
               AND    CASE WHEN :3 = 'N' THEN 'NORMAL' ELSE 'CAESAR' END
                   || '-'
                   || CASE
                          WHEN NVL (E.SEX, 0) = 0 THEN 'KARYAWAN'
                          ELSE 'KARYAWATI'
                      END =
                   SUBCATEGORIES
               AND DATETERMINATE IS NULL
               AND P.INACTIVE IS NULL
               AND :2 = 'LH')
 WHERE NVL ( :0, 'X') = 'X'`

module.exports = MedicalPlafond