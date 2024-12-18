const Bankopeningbalance = `SELECT SUM (amount)     "amount"
FROM (SELECT 0 amount FROM DUAL
      UNION ALL
      SELECT NVL (openingbalance, 0)     amount
        FROM bankbalance
       WHERE     bankcode = :1
             AND MONTH = TO_CHAR (TO_DATE ( :2, 'DD-MM-YYYY'), 'MM')
             AND YEAR = TO_CHAR (TO_DATE ( :2, 'DD-MM-YYYY'), 'YYYY')
             AND NVL ( :0, 'X') = 'X')`
 
module.exports = Bankopeningbalance