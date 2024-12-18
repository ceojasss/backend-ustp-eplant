const UrlPreview = `SELECT    v_url_preview_site (
    :1                                                  /*DOC_TYPE*/
      ,
    CASE WHEN :2                                    /*PROCESS_FLAG*/
                 IS NULL THEN 'DRAFT' ELSE 'APPROVED' END)
|| :3                                                      /*DOC_CODE*/
      "v_url_preview"
FROM DUAL`

module.exports = UrlPreview