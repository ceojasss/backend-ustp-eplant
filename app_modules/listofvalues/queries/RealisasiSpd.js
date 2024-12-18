const RealisasiSpd = `select distinct no_spd "no_spd",empcode "empcode",empname "empname",to_char(date_dep,'dd-mm-yyyy') "date_dep",to_char(date_arr, 'dd-mm-yyyy') "date_arr",
destination "destination"
from hr_dec_spd_header
where status_pd = 'APPROVED'  and  (no_spd like upper('%'||:0||'%') or empname like upper('%'||:0||'%'))
order by no_spd ASC`

module.exports = RealisasiSpd