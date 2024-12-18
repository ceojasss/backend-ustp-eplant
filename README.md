## CATATAN @Gunadi

    - untuk query yang digunakan di inputsearch, kolom dipisah dengan karakter #
        contoh -> vehiclecode : xx & vehicledescription : mobil xx
            object result -> vehiclecode#code : xx ; vehilecode#description : mobil xx
        - settingan form untuk komponen inputsearch ==> kolom code & description di sesuaikan dengan kolom LOVS di appscomponent
        untuk settingan accessor ada di kolom LOV_LIST_ITEM di appscomponent
        - catatan untuk kode di query data list tetap menggunakan prefix #code , tapi di LOV_LIST_ITEM disesuaikan dengan query dari api LOVS.
