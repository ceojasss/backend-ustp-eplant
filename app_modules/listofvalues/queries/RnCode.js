const rncode = `SELECT   receivenotecode "code", remarks "description", to_char(rndate,'dd-mm-yyyy') "rndate"
FROM   (SELECT   receivenotecode, remarks, rndate
          FROM   epms_gcm.receivenote
         WHERE   pocode = :1
        UNION ALL
        SELECT   receivenotecode, remarks, rndate
          FROM   epms_smg.receivenote
         WHERE   pocode = :1
        UNION ALL
        SELECT   receivenotecode, remarks, rndate
          FROM   epms_slm.receivenote
         WHERE   pocode = :1
        UNION ALL
        SELECT   receivenotecode, remarks, rndate
          FROM   epms_sbe.receivenote
         WHERE   pocode = :1
        UNION ALL
        SELECT   receivenotecode, remarks, rndate
          FROM   epms_sje.receivenote
         WHERE   pocode = :1)
WHERE   receivenotecode NOT IN (SELECT   NVL(rncode,'XYZ') FROM lpo_expedition_list) 
and  receivenotecode like upper ('%'||:0||'%') OR remarks like upper ('%'||:0||'%') `

module.exports = rncode