const BankTotalTransction = `SELECT SUM (amount) "amount"
FROM (SELECT NVL (SUM (rv.totalamount), 0)     amount
        FROM receivevoucher rv, PERIODCTLMST VO
       WHERE     rv.bankcode = :1
             AND periodseq = TO_CHAR (TO_DATE ( :2, 'DD-MM-YYYY'), 'MM')
             AND accYEAR = TO_CHAR (TO_DATE ( :2, 'DD-MM-YYYY'), 'YYYY')
             AND rv.datecreated BETWEEN vo.STARTDATE
                                    AND TO_DATE ( :2, 'DD-MM-YYYY')
      UNION ALL
      SELECT NVL (SUM (pv.totalamount), 0) * -1     amount
        FROM paymentvoucher pv, PERIODCTLMST VO
       WHERE     pv.bankcode = :1
             AND periodseq = TO_CHAR (TO_DATE ( :2, 'DD-MM-YYYY'), 'MM')
             AND accYEAR = TO_CHAR (TO_DATE ( :2, 'DD-MM-YYYY'), 'YYYY')
             AND pv.datecreated BETWEEN vo.startdate
                                    AND TO_DATE ( :2, 'DD-MM-YYYY'))
                                    WHERE NVL(:0,'X') = 'X'`

module.exports = BankTotalTransction