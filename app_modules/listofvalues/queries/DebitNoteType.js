const DebitNoteType =
`select kode "drnotetypecode", des "description" from (
    select 'AP' kode, 'AP' des from dual
    union all
    select 'CA' kode, 'CA' des from dual
    )
    where des like  ('%'||:0||'%')`

module.exports= DebitNoteType