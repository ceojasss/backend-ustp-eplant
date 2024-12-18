const TglAtk = `SELECT   DISTINCT
ID_REQ,
inputdate,
DIV_ID,
KETERANGAN,
   DECODE (NVL (ITEM1, 'X'), 'X', NULL, GET_PURCHASEITEMNAME (ITEM1))
|| DECODE (NVL (ITEM2, 'X'), 'X', NULL, ', ' || GET_PURCHASEITEMNAME (ITEM2))
|| DECODE (NVL (ITEM3, 'X'), 'X', NULL, ', ' || GET_PURCHASEITEMNAME (ITEM3))
|| DECODE (NVL (ITEM4, 'X'), 'X', NULL, ', ' || GET_PURCHASEITEMNAME (ITEM4))
|| DECODE (NVL (ITEM5, 'X'), 'X', NULL, ', ' || GET_PURCHASEITEMNAME (ITEM5))
|| DECODE (NVL (ITEM6, 'X'), 'X', NULL, ', ' || GET_PURCHASEITEMNAME (ITEM6))
|| DECODE (NVL (ITEM7, 'X'), 'X', NULL, ', ' || GET_PURCHASEITEMNAME (ITEM7))
|| DECODE (NVL (ITEM8, 'X'), 'X', NULL, ', ' || GET_PURCHASEITEMNAME (ITEM8))
|| DECODE (NVL (ITEM9, 'X'), 'X', NULL, ', ' || GET_PURCHASEITEMNAME (ITEM9))
|| DECODE (NVL (ITEM10, 'X'), 'X', NULL, ', ' || GET_PURCHASEITEMNAME (ITEM10))
|| DECODE (NVL (ITEM11, 'X'), 'X', NULL, ', ' || GET_PURCHASEITEMNAME (ITEM11))
|| DECODE (NVL (ITEM12, 'X'), 'X', NULL, ', ' || GET_PURCHASEITEMNAME (ITEM12))
|| DECODE (NVL (ITEM13, 'X'), 'X', NULL, ', ' || GET_PURCHASEITEMNAME (ITEM13))
|| DECODE (NVL (ITEM14, 'X'), 'X', NULL, ', ' || GET_PURCHASEITEMNAME (ITEM14))
|| DECODE (NVL (ITEM15, 'X'), 'X', NULL, ', ' || GET_PURCHASEITEMNAME (ITEM15))
   ITEMLIST
FROM   (SELECT   ID_REQ,
          inputdate,
          div_id,
          NVL (remarks, 'N/A') KETERANGAN,
          SUBSTR (kode1, 0, INSTR (kode1, '|') - 1) ITEM1,
          SUBSTR (kode2, 0, INSTR (kode2, '|') - 1) ITEM2,
          SUBSTR (kode3, 0, INSTR (kode3, '|') - 1) ITEM3,
          SUBSTR (kode4, 0, INSTR (kode4, '|') - 1) ITEM4,
          SUBSTR (kode5, 0, INSTR (kode5, '|') - 1) ITEM5,
          SUBSTR (kode6, 0, INSTR (kode6, '|') - 1) ITEM6,
          SUBSTR (kode7, 0, INSTR (kode7, '|') - 1) ITEM7,
          SUBSTR (kode8, 0, INSTR (kode8, '|') - 1) ITEM8,
          SUBSTR (kode9, 0, INSTR (kode9, '|') - 1) item9,
          SUBSTR (kode10, 0, INSTR (kode10, '|') - 1) item10,
          SUBSTR (kode11, 0, INSTR (kode11, '|') - 1) item11,
          SUBSTR (kode12, 0, INSTR (kode12, '|') - 1) item12,
          SUBSTR (kode13, 0, INSTR (kode13, '|') - 1) item13,
          SUBSTR (kode14, 0, INSTR (kode14, '|') - 1) item14,
          SUBSTR (kode15, 0, INSTR (kode15, '|') - 1) item15,
          ''
   FROM   HR_ATK
  WHERE   empcode = :1 AND STATUS_REQ = 'APPROVED'
 UNION ALL
 SELECT   TO_NUMBER (TO_CHAR (SYSDATE, 'DDMMYYY')) ID_REQ,
          TRUNC (SYSDATE) INPUTDATE,
          'GS' DIV_ID,
          'Pengeluaran ATK GS Tanggal ( ' || TO_CHAR (SYSDATE, 'dd mon yyyy') || ') - System Generated' keterangan,
          get_parametervalue ('Stores', 'STGS01', 'STGS001'),
          get_parametervalue ('Stores', 'STGS01', 'STGS002'),
          get_parametervalue ('Stores', 'STGS01', 'STGS003'),
          get_parametervalue ('Stores', 'STGS01', 'STGS004'),
          get_parametervalue ('Stores', 'STGS01', 'STGS005'),
          get_parametervalue ('Stores', 'STGS01', 'STGS006'),
          get_parametervalue ('Stores', 'STGS01', 'STGS007'),
          get_parametervalue ('Stores', 'STGS01', 'STGS008'),
          get_parametervalue ('Stores', 'STGS01', 'STGS009'),
          get_parametervalue ('Stores', 'STGS01', 'STGS010'),
          get_parametervalue ('Stores', 'STGS01', 'STGS011'),
          get_parametervalue ('Stores', 'STGS01', 'STGS012'),
          get_parametervalue ('Stores', 'STGS01', 'STGS013'),
          get_parametervalue ('Stores', 'STGS01', 'STGS014'),
          get_parametervalue ('Stores', 'STGS01', 'STGS015'),
          ''
   FROM   DUAL
  WHERE   app_security_pkg.GET_SESSIONINFO_F@appsdblink ('LOGINID') IN (SELECT   loginid
                                                                          FROM   userprofile
                                                                         WHERE   positionjob = 'GS' AND email = :1)
          AND (TRUNC (SYSDATE), :V_EMPCODE) NOT IN (SELECT  TRUNC( INPUTDATE), EMPCODE FROM HR_ATK)) A
ORDER BY   INPUTDATE`

module.exports = TglAtk