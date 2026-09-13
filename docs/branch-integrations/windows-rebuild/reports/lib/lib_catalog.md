# Lib.zip — machine inventory

Files analyzed: 42

## `64-bit-dll/NN60.DLL`
- Size: 172032 bytes; strings: 1353; SQL-like: 1
- Procedure-like names: LPM_LIB
- Binary references: CA60.dll, CORE40.dll, DE60.dll, KERNEL32.dll, NLSRTL33.dll, UIW60.DLL, USER32.dll, kernel32.dll, mmc60.dll, nn60.dll, user32.dll
- Risk categories: destructive, windows_native, error_handling, network

## `64-bit-dll/NNB60.DLL`
- Size: 172032 bytes; strings: 1353; SQL-like: 1
- Procedure-like names: LPM_LIB
- Binary references: CA60.dll, CORE40.dll, DEB60.dll, KERNEL32.dll, NLSRTL33.dll, UIW60.DLL, USER32.dll, kernel32.dll, mmc60.dll, nnb60.dll, user32.dll
- Risk categories: destructive, windows_native, error_handling, network

## `AMSLIB.plx`
- Size: 364544 bytes; strings: 2052; SQL-like: 305
- Procedure-like names: AMS_COMMENT_PKG, AMS_CONSTRAINT_PKG, AMS_FUNCTION_PKG, AMS_GET_PKG, AMS_INDEX_PKG, AMS_INSRT_DATA_PKG, AMS_INSRT_FORM_DTL_PKG, AMS_PACKAGE_PKG, AMS_PROCEDURE_PKG, AMS_SEQUENCE_PKG, AMS_SYNONYM_PKG, AMS_TABLE_FILED_PKG, AMS_TABLE_PKG, AMS_TRIGGER_PKG, AMS_TRNS_PKG, AMS_VIEW_PKG, COMMENT_COLUMNS_PRC, COMMENT_TABELS_PRC, CONSTRAINT_PRC, FAS_GNR_PKG, FUNCTION_PRC, IAS_GEN_PKG, INDEX_PRC, INSERT_FLG_PRC, INSERT_LIST_PRC, INSERT_LOV_PRC, INSRT_DEF_DATA_PRC, INSRT_FORM_DTL_PRC, INSRT_FORM_PRIV_PRC, INSRT_FRM_FLD_PRC
- Binary references: none detected
- Risk categories: ddl_privilege, destructive, dynamic_sql, windows_native, error_handling, network

## `APSI009.fmx`
- Size: 251196 bytes; strings: 880; SQL-like: 30
- Procedure-like names: ADD_PROC, B4SAVE_PRC, CHK_B4SAVE_DTL_PRC, CHK_B4SAVE_MST_PRC, DELETE_PROC, DEL_DET_REC_PRC, ENA_DIS_ITM_PRC, EXIT_PROC, FILL_ALL_LIST_PRC, GEN_PKG, IAS_CHECK_SYS_PKG, IAS_GEN_PKG, IAS_GET_ENC_PASS_FNC, IAS_GET_ENC_PASS_FNCIAS20142IAS_GET_ENC_PASS_FNC, IAS_PRMTR_PKG, IAS_USR_PKG, LIST_PROC, LOV_TRG, LYSERP_LIB, POST_FORMS_COMMIT_PRC, PRE_FORM_PRC, PRINT_PMAN_MOV_PRC, PRINT_PROC, SAVE_PROC, SET_POS_PRC, SYS_SCREEN, UPDATE_PROC, WHEN_NEW_FORM_INSTANCE_PRC, WHEN_TAB_PAGE_CHANGED_PRC, WHEN_TIMER_EXPIRED_PRC
- Binary references: YSERP_MNU.MMX
- Risk categories: credentials, ddl_privilege, destructive, windows_native

## `APST015.fmx`
- Size: 725020 bytes; strings: 2413; SQL-like: 100
- Procedure-like names: ADD_PROC, B4SAVE_PRC, CHECK_PRV_APRVD_FNC, CHK_B4SAVE_DTL_PRC, CHK_B4SAVE_MST_PRC, DELETE_PROC, DEL_DET_REC_PRC, ENA_DIS_ITM_PRC, EXIT_PROC, FILL_ALL_LIST_PRC, GEN_PKG, IAS_ACTV_PKG, IAS_DBS_SYS_PKG, IAS_FETCH_DATA_PKG, IAS_GEN_PKG, IAS_GET_ENC_PASS_FNC, IAS_GET_ENC_PASS_FNCIAS20142IAS_GET_ENC_PASS_FNC, IAS_ITM_PKG, IAS_PRMTR_PKG, IAS_USR_PKG, IAS_WEIGHT_SYS_PKG, IAS_WEIGHT_SYS_PKGIAS20142CALC_AREA_SIZE_PRC, IAS_WT_PKG, LIST_PROC, LOV_TRG, LYSERP_LIB, POST_FORMS_COMMIT_PRC, PREQ_AVG_SALES_AUTO_LMT_PRC, PREQ_AVREGE_FROM_SALES_PRC, PREQ_PRCNT_NET_SALES_PRC
- Binary references: YSERP_MNU.MMX, Ys_Itm_Trns.Fmx
- Risk categories: credentials, ddl_privilege, destructive, windows_native

## `DTSLIB.plx`
- Size: 425984 bytes; strings: 2601; SQL-like: 407
- Procedure-like names: COMMENT_COLUMNS_PRC, COMMENT_TABELS_PRC, CONSTRAINT_PRC, DEX_PKG, DTS_COMMENT_PKG, DTS_CONSTRAINT_PKG, DTS_FUNCTION_PKG, DTS_INDEX_PKG, DTS_INSRT_DATA_PKG, DTS_INSRT_FORM_DTL_PKG, DTS_OUT_P, DTS_PACKAGE_PKG, DTS_PROCEDURE_PKG, DTS_SEQUENCE_PKG, DTS_SYNONYM_PKG, DTS_TABLE_FILED_PKG, DTS_TABLE_PKG, DTS_TRIGGER_PKG, DTS_VIEW_PKG, FUNCTION_PRC, IAS_DBS_SYS_PKG, IAS_GEN_PKG, INDEX_PRC, INSERT_FLG_PRC, INSERT_LIST_PRC, INSERT_LOV_PRC, INSRT_DEF_DATA_PRC, INSRT_FORM_DTL_PRC, INSRT_FORM_PRIV_PRC, INSRT_FRM_FLD_PRC
- Binary references: none detected
- Risk categories: ddl_privilege, destructive, windows_native, error_handling, network

## `ERPSTPLIB.plx`
- Size: 9994240 bytes; strings: 74057; SQL-like: 29288
- Procedure-like names: CALL_DOC_ALRT_PRC, CHK_CST_CR_LMT_PRC, CHK_DUP_FLD_FNC, DATE_CNVRTR_PKG, DBA_CREATE_LGHT_PKG, FAS_POSTING_PKG, GET_DCML_RPRT_FNC, GET_FRMT_FLD_FNC, GET_FRMT_MSK_RPRT_FNC, GET_MSG_TXT_FNC, HRS_POSTING_PKG, IAS_AC_CC_LMT_PKG, IAS_AUDIT_OTHR_PKG, IAS_AUDIT_PKG, IAS_AUD_SYS_PKG, IAS_BRN_PKG, IAS_CC_CODE_PKG, IAS_CHECK_DBS_PKG, IAS_CHECK_SYS_PKG, IAS_CSHBNK_PKG, IAS_DBS_SYS_PKG, IAS_DRTMP_TRG, IAS_GEN_PKG, IAS_GL_LMT_PKG, IAS_GL_TRNS_PKG, IAS_ITM_PKG, IAS_LGHT_DP_TRG, IAS_LGHT_SFLGS_TRG, IAS_LGHT_WCODE_TRG, IAS_MEASURMENTS_PKG
- Binary references: none detected
- Risk categories: credentials, ddl_privilege, destructive, dynamic_sql, windows_native, error_handling, network

## `ERPSTPLIB_TRK.plx`
- Size: 8073216 bytes; strings: 66108; SQL-like: 23077
- Procedure-like names: CALL_DOC_ALRT_PRC, CHK_CST_CR_LMT_PRC, CHK_DUP_FLD_FNC, DBA_CREATE_LGHT_PKG, EXTERNAL_P, FAS_POSTING_PKG, GET_DCML_RPRT_FNC, GET_FRMT_FLD_FNC, GET_MSG_TXT_FNC, HRS_POSTING_PKG, IAS_AC_CC_LMT_PKG, IAS_AUDIT_OTHR_PKG, IAS_AUDIT_PKG, IAS_AUD_SYS_PKG, IAS_BRN_PKG, IAS_CHECK_DBS_PKG, IAS_CHECK_SYS_PKG, IAS_CSHBNK_PKG, IAS_DBS_SYS_PKG, IAS_DRTMP_TRG, IAS_GEN_PKG, IAS_GL_LMT_PKG, IAS_GL_TRNS_PKG, IAS_INSRT_LABELS1_PRC, IAS_INSRT_LABELS2_PRC, IAS_INSRT_LABELS3_PRC, IAS_INSRT_LABELS4_PRC, IAS_INSRT_LABELS5_PRC, IAS_INSRT_LABELS6_PRC, IAS_INSRT_LABELS7_PRC
- Binary references: none detected
- Risk categories: credentials, ddl_privilege, destructive, dynamic_sql, windows_native, error_handling, network

## `FASLIB.plx`
- Size: 630784 bytes; strings: 4050; SQL-like: 528
- Procedure-like names: ALTER_QTY_SIZE_PRC, COMMENT_COLUMNS_PRC, COMMENT_TABELS_PRC, CONSTRAINT_PRC, CRT_FAS_DEPR_PKG, CRT_FAS_GNR_PKG, CRT_FAS_POSTING_PKG, CRT_FAS_TRNS_PKG, CRT_GNR_CMNT_PRC, FAS_CHECK_DATA_PRC, FAS_COMMENT_PKG, FAS_CONSTRAINT_PKG, FAS_DEPR_PKG, FAS_FUNCTION_PKG, FAS_GNR_PKG, FAS_INDEX_PKG, FAS_INSERT_FLG_PRC, FAS_INSERT_LOV_PRC, FAS_INSERT_LST_PRC, FAS_INSRT_DATA_PKG, FAS_INSRT_FORM_DTL_PKG, FAS_PACKAGE_PKG, FAS_POSTING_PKG, FAS_PROCEDURE_PKG, FAS_SEQUENCE_PKG, FAS_SYNONYM_PKG, FAS_TABLE_FILED_PKG, FAS_TABLE_PKG, FAS_TRIGGER_PKG, FAS_TRNS_PKG
- Binary references: none detected
- Risk categories: ddl_privilege, destructive, dynamic_sql, windows_native, error_handling, network

## `FMRUSW.RES`
- Size: 86020 bytes; strings: 677; SQL-like: 15
- Procedure-like names: none detected
- Binary references: none detected
- Risk categories: destructive, windows_native, network

## `FMSLIB.plx`
- Size: 221184 bytes; strings: 1197; SQL-like: 225
- Procedure-like names: COMMENT_COLUMNS_PRC, COMMENT_TABELS_PRC, CONSTRAINT_PRC, FMS_COMMENT_PKG, FMS_CONSTRAINT_PKG, FMS_FUNCTION_PKG, FMS_INDEX_PKG, FMS_INSRT_DATA_PKG, FMS_INSRT_FORM_DTL_PKG, FMS_PACKAGE_PKG, FMS_PROCEDURE_PKG, FMS_SEQUENCE_PKG, FMS_SYNONYM_PKG, FMS_TABLE_FILED_PKG, FMS_TABLE_PKG, FMS_TRIGGER_PKG, FMS_VIEW_PKG, FUNCTION_PRC, IAS_AUD_SYS_PKG, IAS_DBS_SYS_PKG, INDEX_PRC, INSERT_FLG_PRC, INSERT_LIST_PRC, INSERT_LOV_PRC, INSRT_DEF_DATA_PRC, INSRT_FORM_DTL_PRC, INSRT_FORM_PRIV_PRC, INSRT_FRM_FLD_PRC, MOVE_DATA_PRC, MOVE_TRNS_PRC
- Binary references: none detected
- Risk categories: destructive, windows_native, error_handling, network

## `FNGLIB.plx`
- Size: 3731456 bytes; strings: 11031; SQL-like: 1021
- Procedure-like names: BLE_PKG, CHRTIME_FNC, COMMENT_COLUMNS_PRC, COMMENT_TABELS_PRC, CONSTRAINTS_PRC, CONSTRAINT_PRC, DATE_CONVERTER_PKG, FNG_ACTL_CLC_PKG, FNG_COMMENT_PKG, FNG_CONSTRAINT_PKG, FNG_FUNCTION_PKG, FNG_GRN_PKG, FNG_INDEX_PKG, FNG_INSRT_DATA_PKG, FNG_INSRT_FORM_DTL_PKG, FNG_PACKAGE_PKG, FNG_PROCEDURE_PKG, FNG_SEQUENCE_PKG, FNG_STNDR_CLC_PKG, FNG_SYNONYM_PKG, FNG_TABLE_FILED_PKG, FNG_TABLE_PKG, FNG_TRIGGER_PKG, FNG_VIEW_PKG, FUNCTION_PRC, GET_GRP_BY_FLD_FNC, HRS_GNR_PKG, HRS_SLRY_CALC_PKG, HRS_TRNS_PKG, IAS_DBS_SYS_PKG
- Binary references: none detected
- Risk categories: ddl_privilege, destructive, dynamic_sql, windows_native, error_handling, network

## `GLSLIB.plx`
- Size: 860160 bytes; strings: 5360; SQL-like: 260
- Procedure-like names: ALTER_QTY_SIZE_PRC, CHK_BDGT_BLNC_PRC, CHK_UPD_CHQNO_PRC, COMMENT_COLUMNS_PRC, COMMENT_TABELS_PRC, CONSTRAINT_PRC, CREATE_VIEW_MULTI_YEAR_PRC, CRT_GNR_CMNT_PRC, FUNCTION_PRC, GEN_PKG, GLS_CHECK_DATA_PRC, GLS_COMMENT_PKG, GLS_CONSTRAINT_PKG, GLS_FUNCTION_PKG, GLS_INDEX_PKG, GLS_INSERT_FLG_PRC, GLS_INSERT_LOV_PRC, GLS_INSERT_LST_PRC, GLS_INSRT_DATA_PKG, GLS_INSRT_FORM_DTL_PKG, GLS_PACKAGE_PKG, GLS_PROCEDURE_PKG, GLS_SEQUENCE_PKG, GLS_SYNONYM_PKG, GLS_S_SCR_LBL_PKG, GLS_S_SCR_LBL_PRC, GLS_TABLE_FILED_PKG, GLS_TABLE_PKG, GLS_TRIGGER_PKG, GLS_VIEW_PKG
- Binary references: none detected
- Risk categories: ddl_privilege, destructive, dynamic_sql, windows_native, error_handling, network

## `HRSLIB.plx`
- Size: 3203072 bytes; strings: 20548; SQL-like: 3169
- Procedure-like names: BS_SYS_PKG, COMMENT_COLUMNS_PRC, COMMENT_TABELS_PRC, CONSTRAINT_PRC, FLG_P, FUNCTION_PRC, HRS_AFR_PKG, HRS_ALRT_PKG, HRS_ARTCL_PKG, HRS_COMMENT_PKG, HRS_CONSTRAINT_PKG, HRS_EMP_MOVMNT_DEL_TRG, HRS_EMP_MOVMNT_INSRT_TRG, HRS_EVL_PKG, HRS_FUNCTION_PKG, HRS_GNR_PKG, HRS_INDEX_PKG, HRS_INSRT_DATA_PKG, HRS_INSRT_FORM_DTL_PKG, HRS_LAW_PKG, HRS_PACKAGE_PKG, HRS_POSTING_PKG, HRS_PROCEDURE_PKG, HRS_SEQUENCE_PKG, HRS_SLRY_CALC_PKG, HRS_SLRY_RPRT_PKG, HRS_SNCTN_PKG, HRS_SYNONYM_PKG, HRS_TABLE_FILED_PKG, HRS_TABLE_PKG
- Binary references: none detected
- Risk categories: credentials, ddl_privilege, destructive, dynamic_sql, windows_native, error_handling, network

## `HRSS031.fmx`
- Size: 390428 bytes; strings: 1096; SQL-like: 24
- Procedure-like names: ADD_PROC, B4SAVE_PRC, CHK_B4SAVE_DTL_PRC, CHK_B4SAVE_MST_PRC, DELETE_PROC, DEL_DET_REC_PRC, DMY_EXEC_TRG, ENA_DIS_ITM_PRC, EXIT_PROC, FILL_ALL_LIST_PRC, GEN_PKG, HRS_ARTCL_PKG, HRS_GNR_PKG, IAS_GEN_PKG, IAS_GET_ENC_PASS_FNC, IAS_GET_ENC_PASS_FNCIAS20142IAS_GET_ENC_PASS_FNC, IAS_USR_PKG, KEY_LISTVAL_PRC, LIST_PROC, LOV_PKG, LOV_TRG, LYSERP_LIB, POST_FORMS_COMMIT_PRC, PRE_FORM_PRC, PRINT_PROC, SAVE_PROC, SET_POS_PRC, SYS_SCREEN, UPDATE_PROC, WHEN_NEW_FORM_INSTANCE_PRC
- Binary references: YSERP_MNU.MMX
- Risk categories: credentials, ddl_privilege, destructive, windows_native

## `IASLIBSEC.plx`
- Size: 208896 bytes; strings: 1200; SQL-like: 16
- Procedure-like names: CALL_ACTIVATION_SCREEN, CALL_LOGON_SCREEN, COMM_PKG, INIT_PKG, SEC_CHECK_CURR_FORM, SETUP_PKG, SETUP_PRE_FORM, SETUP_WHEN_NEW_FORM, UNIQUE_ID_PKG, WIN_API, YS_DONGLE_PKG
- Binary references: HardDiskSerial.exe, IASLIBSEC.plx, crc.fmx, md5.fmx
- Risk categories: credentials, ddl_privilege, windows_native, session_control, network

## `IBSLIB.plx`
- Size: 258048 bytes; strings: 1521; SQL-like: 147
- Procedure-like names: COMMENT_COLUMNS_PRC, COMMENT_TABELS_PRC, CONSTRAINT_PRC, FUNCTION_PRC, IAS_GEN_PKG, IBS_COMMENT_PKG, IBS_CONSTRAINT_PKG, IBS_FUNCTION_PKG, IBS_INDEX_PKG, IBS_INSRT_DATA_PKG, IBS_INSRT_FORM_DTL_PKG, IBS_PACKAGE_PKG, IBS_PROCEDURE_PKG, IBS_SEQUENCE_PKG, IBS_SYNONYM_PKG, IBS_TABLE_FILED_PKG, IBS_TABLE_PKG, IBS_TRIGGER_PKG, IBS_VIEW_PKG, INDEX_PRC, INSERT_FLG_PRC, INSERT_LIST_PRC, INSERT_LOV_PRC, INSRT_DEF_DATA_PRC, INSRT_FORM_DTL_PRC, INSRT_FORM_MSG_PRC, INSRT_FORM_PRIV_PRC, INSRT_FRM_FLD_PRC, MOVE_DATA_PRC, MOVE_TRNS_PRC
- Binary references: none detected
- Risk categories: destructive, dynamic_sql, windows_native, error_handling, network

## `MRPDBA.plx`
- Size: 4796416 bytes; strings: 33235; SQL-like: 14080
- Procedure-like names: ACTUAL_PRODUCTIVITY_FNC, ATT_PKG, AVALIVALE_TIME_FNC, BOM_PKG, COMMENT_COLUMNS_PRC, COMMENT_TABELS_PRC, CONSTRAINT_PRC, CREATE_ATT_PKG, CREATE_BOM_PKG, CREATE_FORMULA_PKG, CREATE_GNR_PKG, CREATE_MPS_PKG, CREATE_MRPSFC_PKG, CREATE_MRP_FNC_PKG, CREATE_MRP_PKG, CREATE_MRP_PRC_PKG, CREATE_PCM_PKG, CREATE_REP_PKG, CREATE_RPS_PKG, CREATE_TRAC_PKG, CREATE_WEIGHT_PKG, CRT_DATE_P, CRT_USR_P, EXPECTED_PRODUCTION_FNC, FUNCTION_PRC, GEN_PKG, GNR_PKG, IAS_DBS_SYS_PKG, IAS_GEN_PKG, IAS_ITM_PKG
- Binary references: MRPSFC025.FMX
- Risk categories: credentials, ddl_privilege, destructive, dynamic_sql, windows_native, error_handling, network

## `MRPLIB.plx`
- Size: 151552 bytes; strings: 611; SQL-like: 18
- Procedure-like names: ATT_PKG, CALL_SCREEN, CURRENT_FORM, GNR_PKG, LIB_ATT_PKG, LIB_GNR_PKG, LIB_SFC_PKG, MRPSFC_PKG
- Binary references: none detected
- Risk categories: ddl_privilege, dynamic_sql, windows_native, error_handling, network

## `MRPOG.plx`
- Size: 28672 bytes; strings: 118; SQL-like: 0
- Procedure-like names: none detected
- Binary references: none detected
- Risk categories: windows_native, network

## `MRPSYSTEM.mmx`
- Size: 21204 bytes; strings: 73; SQL-like: 0
- Procedure-like names: COMMIT_FORM, EXIT_FORM
- Binary references: none detected
- Risk categories: destructive, windows_native

## `MTXLIB.plx`
- Size: 5488640 bytes; strings: 37244; SQL-like: 2329
- Procedure-like names: AMT_DIFF_P, CNCL_WEB_BRN_REM_PRC, COMMENT_TABELS_PRC, CONSTRAINT_PRC, DATE_CONVERTER_PKG, FUNCTION_PRC, INDEX_PRC, INSERT_FLG_PRC, INSERT_LIST_PRC, INSERT_LOV_PRC, INSERT_MSGS_PRC, INSRT_DEF_DATA_PRC, INSRT_FORM_DTL_PRC, INSRT_FORM_PRIV_PRC, INSRT_FRM_FLD_PRC, LEGAL_STRING_PKG, MOVE_DATA_PRC, MOVE_TRNS_PRC, MOV_IN_TO_WEB_PKG, MOV_IN_TO_WEB_PRC, MOV_OUT_TO_WEB_PKG, MOV_OUT_TO_WEB_PRC, MTX_COMMENT_PKG, MTX_CONSTRAINT_PKG, MTX_FUNCTION_PKG, MTX_INDEX_PKG, MTX_INSRT_CITIES_PRC, MTX_INSRT_DATA_PKG, MTX_INSRT_FORM_DTL_PKG, MTX_PACKAGE_PKG
- Binary references: none detected
- Risk categories: credentials, ddl_privilege, destructive, dynamic_sql, windows_native, error_handling, network

## `PMSLIB.plx`
- Size: 790528 bytes; strings: 4321; SQL-like: 342
- Procedure-like names: COMMENT_COLUMNS_PRC, COMMENT_TABELS_PRC, CONSTRAINT_PRC, FUNCTION_PRC, IAS_DBS_SYS_PKG, IAS_GEN_PKG, IAS_POSTING_PKG, IAS_VNDR_PKG, INDEX_PRC, INSERT_FLG_PRC, INSERT_LIST_PRC, INSERT_LOV_PRC, INSRT_DEF_DATA_PRC, INSRT_FORM_DTL_PRC, INSRT_FORM_PRIV_PRC, INSRT_FRM_FLD_PRC, MOVE_DATA_PRC, MOVE_TRNS_PRC, PACKAGE_PRC, PMS_COMMENT_PKG, PMS_CONSTRAINT_PKG, PMS_FUNCTION_PKG, PMS_GEN_PKG, PMS_INDEX_PKG, PMS_INSRT_DATA_PKG, PMS_INSRT_FORM_DTL_PKG, PMS_PACKAGE_PKG, PMS_POSTING_PKG, PMS_PROCEDURE_PKG, PMS_SEQUENCE_PKG
- Binary references: none detected
- Risk categories: destructive, dynamic_sql, windows_native, error_handling, network

## `POSSTP_LIB.plx`
- Size: 610304 bytes; strings: 5986; SQL-like: 650
- Procedure-like names: FUNCTION_PRC, GET_MSG_TXT_FNC, IAS_AUD_SYS_PKG, IAS_DBS_SYS_PKG, IAS_GEN_PKG, IAS_ITM_PKG, IAS_PRMTR_PKG, IAS_SMS_MAIL_PKG, INDEX_PRC, INSERT_FLG_PRC, INSERT_LIST_PRC, INSERT_LOV_PRC, INSRT_DEF_DATA_PRC, INSRT_FORM_DTL_PRC, INSRT_FORM_PRIV_PRC, INSRT_LBL_PRC, INSRT_MSG_ALRT_PRC, INSRT_MSG_PRC, MV_VIEW_PRC, NONYMS_PKG, PACKAGE_BRN_PRC, PACKAGE_PRC, POS_FILEDS_PKG, POS_FILEDS_PRC, POS_INDEX_PKG, POS_INSRT_DATA_PKG, POS_INSRT_FORM_DTL_PKG, POS_PACKAGE_PKG, POS_PROCDRE_FUNC_PKG, POS_SYNONYMS_4ONYX_PKG
- Binary references: none detected
- Risk categories: credentials, ddl_privilege, destructive, dynamic_sql, windows_native, error_handling, network

## `REMLIB.plx`
- Size: 1077248 bytes; strings: 3962; SQL-like: 673
- Procedure-like names: COMMENT_COLUMNS_PRC, COMMENT_TABELS_PRC, CONSTRAINT_PRC, FUNCTION_PRC, IAS_CST_PKG, IAS_DBS_SYS_PKG, IAS_GEN_PKG, IAS_POSTING_PKG, IAS_SMS_MAIL_PKG, IAS_VNDR_PKG, INDEX_PRC, INSERT_FLG_PRC, INSERT_LIST_PRC, INSERT_LOV_PRC, INSRT_DEF_DATA_PRC, INSRT_FORM_DTL_PRC, INSRT_FORM_PRIV_PRC, INSRT_FRM_FLD_PRC, INSRT_MSG_ALRT_PRC, MOVE_DATA_PRC, MOVE_TRNS_PRC, NYM_PRC, PACKAGE_PRC, PROCEDURE_PRC, REM_ALRT_PKG, REM_COMMENT_PKG, REM_CONSTRAINT_PKG, REM_FUNCTION_PKG, REM_GEN_PKG, REM_INDEX_PKG
- Binary references: none detected
- Risk categories: destructive, dynamic_sql, windows_native, error_handling, network

## `SHLLIB.plx`
- Size: 385024 bytes; strings: 2283; SQL-like: 281
- Procedure-like names: COMMENT_COLUMNS_PRC, COMMENT_TABELS_PRC, CONSTRAINT_PRC, FUNCTION_PRC, IAS_GEN_PKG, INDEX_PRC, INSERT_FLG_PRC, INSERT_LIST_PRC, INSERT_LOV_PRC, INSRT_DEF_DATA_PRC, INSRT_FORM_DTL_PRC, INSRT_FORM_PRIV_PRC, INSRT_FRM_FLD_PRC, MOVE_DATA_PRC, MOVE_TRNS_PRC, NYM_PRC, PACKAGE_PRC, PROCEDURE_PRC, SEQUENCES_PRC, SHL_COMMENT_PKG, SHL_CONSTRAINT_PKG, SHL_FUNCTION_PKG, SHL_GEN_PKG, SHL_INDEX_PKG, SHL_INSRT_DATA_PKG, SHL_INSRT_FORM_DTL_PKG, SHL_PACKAGE_PKG, SHL_PROCEDURE_PKG, SHL_SEQUENCE_PKG, SHL_SYNONYM_PKG
- Binary references: none detected
- Risk categories: destructive, dynamic_sql, windows_native, error_handling, network

## `SHPLIB.plx`
- Size: 360448 bytes; strings: 2040; SQL-like: 255
- Procedure-like names: ALTER_QTY_SIZE_PRC, COMMENT_COLUMNS_PRC, COMMENT_TABELS_PRC, CONSTRAINT_PRC, CRT_GNR_CMNT_PRC, FUNCTION_PRC, GEN_PKG, IAS_CSHBNK_PKG, IAS_DBS_SYS_PKG, IAS_GEN_PKG, IAS_POSTING_PKG, IAS_POSTING_SHP_PKG, INDEX_PRC, INSERT_FLG_PRC, INSERT_LIST_PRC, INSERT_LOV_PRC, INSRT_DEF_DATA_PRC, INSRT_FORM_DTL_PRC, INSRT_FORM_PRIV_PRC, INSRT_FRM_FLD_PRC, LYSERP_LIB, PACKAGE_PRC, PRE_HALF_ADD_PRC, PROCEDURE_PKG, PROCEDURE_PRC, QUENCE_P, RPLC_GNR_PRMTR_FNC, SEQUENCES_PRC, SHP_CHECK_DATA_PRC, SHP_COMMENT_PKG
- Binary references: none detected
- Risk categories: ddl_privilege, destructive, dynamic_sql, windows_native, error_handling, network

## `SYS_E_LIB.plx`
- Size: 294912 bytes; strings: 838; SQL-like: 33
- Procedure-like names: CALLED_FORM, CENTER_WINDOW, CURRENT_FORM, EVENT_WINDOW, EXIT_FORM, FUNC_PKG, PRE_FORM, REP_PRE_FORM, SYS_E_LIB
- Binary references: none detected
- Risk categories: ddl_privilege, destructive, dynamic_sql, windows_native, error_handling, network

## `TransferToMTN.exe`
- Size: 23552 bytes; strings: 413; SQL-like: 6
- Procedure-like names: none detected
- Binary references: TransferToMTN.exe, mscoree.dll
- Risk categories: credentials, destructive, windows_native, error_handling, network

## `YSComUsb.dll`
- Size: 143360 bytes; strings: 1011; SQL-like: 3
- Procedure-like names: none detected
- Binary references: ADVAPI32.dll, COMCTL32.DLL, COMCTL32.dll, GDI32.dll, KERNEL32.dll, OLEAUT32.dll, SHELL32.dll, USER32.dll, YSComUsb.DLL, YSComUsb.dll, comdlg32.dll, ole32.dll, oledlg.dll, user32.dll
- Risk categories: credentials, destructive, dynamic_sql, windows_native, error_handling, network

## `YSERP_LIB.plx`
- Size: 458752 bytes; strings: 1499; SQL-like: 58
- Procedure-like names: CALL_SCR_PRC, CURRENT_FORM, ENA_DIS_BTN_PRC, EVENT_WINDOW, EXIT_FORM, FORMS_MDI_WINDOW, GEN_PKG, IAS_AUDIT_PKG, IAS_AUD_SYS_PKG, IAS_BRN_PKG, IAS_CHECK_SYS_PKG, IAS_DBS_SYS_PKG, IAS_GEN_PKG, IAS_PJ_PKG, IAS_PRMTR_PKG, IAS_USR_PKG, LOV_PKG, PRE_FORM, RPLC_GNR_PRMTR_FNC, SRCH_DTL_PKG, SYS_SCREEN, WIN_API, YS_GEN_PKG, YS_SCR_PKG
- Binary references: ADMT030.FMX, APSI002.fmx, ARSI005.fmx, ERP_APPRVD_SCR.FMX, ERP_INACTV_SCR.FMX, ERP_JOURNAL.Fmx, ERP_SCR.FMX, ERP_VRFY_SCR.FMX, FASI004.fmx, FAS_AS_TRNS.fmx, GENS012.fmx, GLSI001.fmx, GLSI003.fmx, INVI006.fmx, INVI008.fmx, YS_EMP_TRNS.fmx, Ys_ExpToxls.exe, hh.exe
- Risk categories: ddl_privilege, destructive, dynamic_sql, windows_native, network

## `YSERP_MNU.mmx`
- Size: 2308 bytes; strings: 9; SQL-like: 0
- Procedure-like names: none detected
- Binary references: none detected
- Risk categories: none detected

## `YSPOS_LIB.plx`
- Size: 499712 bytes; strings: 1580; SQL-like: 43
- Procedure-like names: ADD_DOC_MNU_PRC, ADD_PROC, CALL_SCR_PRC, CURRENT_FORM, DELETE_TIMER_PRC, DEL_ITM_PRC, DEL_RCRD_PRC, DISC_BILL_AMT_PRC, DISC_BILL_PER_PRC, ENA_DIS_BTN_PRC, EVENT_WINDOW, EXIT_FORM, EXIT_FORM_PRC, FORMS_MDI_WINDOW, GEN_PKG, HUNG_BILL_PRC, IAS_BRN_PKG, IAS_GEN_P, IAS_GEN_PKG, IAS_PRMTR_PKG, IAS_USR_PKG, MULTI_PAYMNT_BILL_PRC, NT_NORML_BILL_PRC, OPN_NEW_BILL_SCRN_PRC, PAID_MULTI_PROC, PAID_PROC, PAYMNT_BILL_PRC, POS_MNU_PKG, POS_PKG, PRE_FORM
- Binary references: ADMT030.FMX, ERP_APPRVD_SCR.FMX, ERP_INACTV_SCR.FMX, ERP_JOURNAL.Fmx, ERP_SCR.FMX, ERP_VRFY_SCR.FMX, FASI004.fmx, IASAPI002.fmx, IASARI005.fmx, IASGLI001.fmx, IASGLI003.fmx, INVI006.fmx, INVI008.fmx, POST001.FMX, Ys_ExpToxls.exe, hh.exe
- Risk categories: ddl_privilege, destructive, dynamic_sql, windows_native, error_handling, network

## `YSPOS_MNU.mmx`
- Size: 172280 bytes; strings: 717; SQL-like: 8
- Procedure-like names: ADD_DOC_PROC, GEN_PKG, IAS_GEN_PKG, LYSPOS_LIB, POS_MNU_PKG, POS_PKG, PRINT_FROM_SCR_PRC, PRINT_MINIMIZE_FORM, PRINT_NORMAL_FORM, SAVE_PROC, YSPOS_LIB
- Binary references: POST006.FMX, POST010.FMX, POST016.FMX, POST017.FMX
- Risk categories: destructive, windows_native

## `YsErpSYs.dll`
- Size: 110592 bytes; strings: 804; SQL-like: 3
- Procedure-like names: none detected
- Binary references: ADVAPI32.dll, COMCTL32.DLL, COMCTL32.dll, GDI32.dll, KERNEL32.dll, OLEAUT32.dll, SHELL32.dll, USER32.dll, WTSAPI32.dll, WtsExtn.DLL, WtsExtn.dll, comdlg32.dll, ole32.dll, user32.dll
- Risk categories: destructive, dynamic_sql, windows_native, error_handling, network

## `YsGoogleMap.ocx`
- Size: 102400 bytes; strings: 749; SQL-like: 1
- Procedure-like names: none detected
- Binary references: MSVBVM60.DLL, VBA6.DLL, YsGoogleMap.ocx, advapi32.dll, ieframe.dll
- Risk categories: destructive, windows_native, error_handling, network

## `calendar.pll`
- Size: 65536 bytes; strings: 325; SQL-like: 0
- Procedure-like names: DATE_WINDOW
- Binary references: none detected
- Risk categories: windows_native, network

## `calendar.plx`
- Size: 28672 bytes; strings: 191; SQL-like: 0
- Procedure-like names: DATE_WINDOW
- Binary references: none detected
- Risk categories: windows_native, network

## `d2kwut60.dll`
- Size: 192512 bytes; strings: 860; SQL-like: 5
- Procedure-like names: none detected
- Binary references: ADVAPI32.dll, D2KWUT60.DLL, GDI32.dll, KERNEL32.DLL, KERNEL32.dll, MPR.dll, SHELL32.dll, USER32.dll, WINMM.dll, comdlg32.dll, d2kwut60.dll, user32.dll
- Risk categories: destructive, windows_native, network

## `d2kwutil.pll`
- Size: 692224 bytes; strings: 4488; SQL-like: 39
- Procedure-like names: FORMS_MDI_WINDOW, GET_ACTIVE_WINDOW, GET_PARENT_WINDOW, WIN_API
- Binary references: D2KWUT60.DLL, D2KWUTIL.PLL, F45RUN32.EXE, WINHELP.EXE
- Risk categories: destructive, windows_native, error_handling, network

## `d2kwutil.plx`
- Size: 311296 bytes; strings: 1257; SQL-like: 9
- Procedure-like names: GET_ACTIVE_WINDOW, GET_PARENT_WINDOW, WIN_API
- Binary references: D2KWUT60.DLL, D2KWUTIL.PLL, WINHELP.EXE
- Risk categories: destructive, windows_native, error_handling, network

## `mrpslib.plx`
- Size: 303104 bytes; strings: 934; SQL-like: 28
- Procedure-like names: BTN_CLR_FORM, CURRENT_FORM, CURR_FORM, EVENT_WINDOW, EXIT_FORM, FUNC_PKG, GNR_PKG, PRC_RUN_SCREEN, PRE_FORM, REP_PRE_FORM
- Binary references: none detected
- Risk categories: destructive, dynamic_sql, windows_native, error_handling, network
