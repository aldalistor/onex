# ARSR041.fmx

Total extracted strings: 4737

## Procedure-like names

- `ADD_PROC`
- `CLEAR_PROC`
- `DELETE_PROC`
- `EXIT_PROC`
- `FILL_ALL_LIST_PRC`
- `GEN_PKG`
- `GET_INC_PRC`
- `GET_SALES_PRC`
- `IAS_ACTV_PKG`
- `IAS_AR_GET_DATA_REP_PKG`
- `IAS_CHECK_SYS_PKG`
- `IAS_GEN_PKG`
- `IAS_GET_ENC_PASS_FNC`
- `IAS_GET_ENC_PASS_FNCIAS20142IAS_GET_ENC_PASS_FNC`
- `IAS_INV_MNGMNT_PKG`
- `IAS_ITM_PKG`
- `IAS_PJ_PKG`
- `IAS_USR_PKG`
- `IAS_VNDR_PKG`
- `IMP_F_XLS_PRC`
- `INSERT_DATA_PRC`
- `LIST_PROC`
- `LOV_TRG`
- `LYSERP_LIB`
- `PRE_FORM_PRC`
- `PRINT_PROC`
- `SAVE_PROC`
- `SHOW_SUM_PRC`
- `SYS_SCREEN`
- `S_GEN_PKG`
- `UPDATE_PROC`
- `WIN_API`
- `YSERP_LIB`
- `YSERP_MNU`
- `YS_GEN_PKG`

## Referenced components

- `Excel.exe`
- `YSERP_MNU.MMX`

## SQL-like strings

```sql
Select Ias_Gen_Pkg.Get_Prompt(
```
```sql
And Comments In (Select To_Char(Label_No) From Ias_Labels)
```
```sql
Select to_char(lev_no)||'- '||
```
```sql
Or (EXISTS (SELECT lev_no
```
```sql
Create -
```
```sql
Delete -
```
```sql
SELECT PATH_EXCEL,CONN_ITM_ACT_BY_USR_PRIV,NVL(YS_GEN_PKG.CHK_ACTV_SYSTEM(80,:b1),0) CONN_POS_SYSTEM,COSTING_TYPE,WTAVG_TYPE,SALES_DISC_TYPE,COSTING_TYPE,WTAVG_TYPE,AR_AC_LINK_TYPE,AP_AC_LINK_TYPE,NO_OF_DECIMAL_AR,USE_BATCH_NO,NVL(BATCHNO_COL_NO,0) FROM IAS_PARA_GEN,IAS_PARA_INV,IAS_PARA_AR,IAS_PARA_AP"SELECT NVL(AR_SHOW_STK_CST_REP,0),NVL(SHW_AMT_QTY_STATC_AR_REP,3) FROM PRIVILEGE_FIXED WHERE U_ID = :b1"SELECT CUR_CODE FROM EX_RATE WHERE NVL(STOCK_CUR,0) = 1"
```
```sql
SELECT BATCH_NM_COL1,BATCH_NM_COL2,BATCH_NM_COL3,BATCH_NM_COL4,BATCH_NM_COL5,SIZE_COL1,SIZE_COL2,SIZE_COL3,SIZE_COL4,SIZE_COL5,1,SIZE_COL1 + 1 ,SIZE_COL1 + SIZE_COL2 + 1 ,SIZE_COL1 + SIZE_COL2 + SIZE_COL3 + 1 ,SIZE_COL1 + SIZE_COL2 + SIZE_COL3 + SIZE_COL4 + 1 FROM IAS_PARA_INV"
```
```sql
INSERT INTO Ias_Itm_Wcode ( i_code, Itm_Unt, p_size, w_code, avl_qty)
```
```sql
SELECT DISTINCT a.i_code, b.Itm_Unt, b.p_size, a.w_code, 0
```
```sql
ANd (a.i_code, b.Itm_Unt, a.w_code) IN ( SELECT i_code, Itm_Unt, w_code FROM ias_pos_bill_dtl
```
```sql
SELECT i_code, Itm_Unt, w_code FROM Ias_Itm_Wcode)
```
```sql
COMMIT
```
```sql
Select C_Group_Code||' - '||Decode(
```
```sql
Exists(Select 1 From Priv_Acc Where A_Code=Customer_Group.C_A_Code
```
```sql
Select To_Char(TYPE_OF_ITEM)||'-'|| Decode(
```
```sql
Select To_Char(w_code)||'- '||Decode(
```
```sql
Where Exists (Select privilege_wh.w_code
```
```sql
Select Measure ,
```
```sql
Select To_Char(activity_no)||'- '||Decode(
```
```sql
Select To_Char(Whg_Code)||'- '||Decode(
```
```sql
Delete IAS_AR_ITM_DISC_AGE_TMP where Rep_No=
```
```sql
Commit
```
```sql
')-Nvl((Select Max(Gr_Date) From Gr_Detail
```
```sql
Delete Ias_Ar_Itm_Disc_Age_Tmp Where (Fld_Code,W_Code) Not In
```
```sql
(Select Fld_Code,W_Code From Ias_Ar_Itm_Disc_Age_Tmp
```
```sql
Where Fld_Code In (Select Fld_Code From Ias_Ar_Itm_Disc_Age_Tmp Where
```
```sql
And Fld_Code In (Select Fld_Code From Ias_Ar_Itm_Disc_Age_Tmp Where
```
```sql
SELECT SUM(((NVL(CP_QTY,0) * NVL(STK_COST,0) ) / NVL(P_SIZE,1) )) / SUM(NVL(CP_QTY,0)) FROM GR_DETAIL WHERE I_CODE = :b1 AND GR_DATE <= :b2 AND W_CODE IN (SELECT W_CODE FROM IAS_AR_WH_TMP ) AND CP_QTY != 0"SELECT SUM(((NVL(CP_QTY,0) * NVL(STK_COST,0) ) / NVL(P_SIZE,1) )) / SUM(NVL(CP_QTY,0)) FROM GR_DETAIL WHERE I_CODE = :b1 AND W_CODE = :b2 AND GR_DATE <= :b3 AND CP_QTY != 0"SELECT SUM(((((NVL(P_QTY,0) + NVL(PF_QTY,0) ) * IN_OUT ) * NVL(STK_COST,0) ) / NVL(P_SIZE,1) )) / SUM((NVL(P_QTY,0) + NVL(PF_QTY,0) ) * IN_OUT ) FROM ITEM_MOVEMENT WHERE I_CODE = :b1 AND W_CODE IN (SELECT W_CODE FROM IAS_AR_WH_TMP ) AND I_DATE <= :b2"SELECT SUM(((((NVL(P_QTY,0) + NVL(PF_QTY,0) ) * IN_OUT ) * NVL(STK_COST,0) ) / NVL(P_SIZE,1) )) / SUM((NVL(P_QTY,0) + NVL(PF_QTY,0) ) * IN_OUT ) FROM ITEM_MOVEMENT WHERE I_CODE = :b1 AND W_CODE = :b2 AND I_DATE <= :b3"
```
```sql
SELECT DISTINCT BILL_DATE,ROUND(NVL(IAS_BILL_DTL.DIS_PER,0),NVL(:b1,20)) DIS_PER FROM IAS_BILL_MST,IAS_BILL_DTL WHERE IAS_BILL_MST.BILL_SER = IAS_BILL_DTL.BILL_SER AND BILL_DATE BETWEEN :b2 AND :b3 AND IAS_BILL_DTL.I_CODE = :b4 AND NVL(IAS_BILL_DTL.W_CODE,0) = NVL(:b5,NVL(IAS_BILL_DTL.W_CODE,0)) ORDER BY BILL_DATE"SELECT DISTINCT BILL_DATE,DIS_PER FROM IAS_BILL_MST,IAS_BILL_DTL WHERE IAS_BILL_MST.BILL_SER = IAS_BILL_DTL.BILL_SER AND BILL_DATE BETWEEN :b1 AND :b2 AND EXISTS (SELECT 1 FROM IAS_AR_ITM_DISC_TMP_NW WHERE I_CODE = IAS_BILL_DTL.I_CODE AND ROWNUM <= 1 ) AND IAS_BILL_DTL.W_CODE = NVL(:b3,IAS_BILL_DTL.W_CODE)"SELECT ROUND(:b1 / COUNT(1) ,2) FROM IAS_AR_ITM_DISC_TMP_NW"
```
```sql
SELECT NVL(SUM(CP_QTY),0) FROM GR_DETAIL WHERE DOC_SEQUENCE < (SELECT DOC_SEQUENCE FROM GR_DETAIL WHERE G_SER = :b1 AND I_CODE = :b2 AND ROWNUM < 2 )"
```
```sql
SELECT SUM(GET_COST(:b1,2,:b2,W_CODE,:b3,:b3) * GET_ICODE_AVLQTY(:b2,:b6,W_CODE) ) / SUM(GET_ICODE_AVLQTY(:b2,:b6,W_CODE)) FROM IAS_AR_WH_TMP"SELECT SUM(GET_COST(:b1,2,:b2,W_CODE,:b3,:b3) * GET_ICODE_AVLQTY(:b2,:b6,W_CODE, NULL , NULL ,:b3) ) / SUM(GET_ICODE_AVLQTY(:b2,:b6,W_CODE, NULL , NULL ,:b3)) FROM IAS_AR_WH_TMP"
```
```sql
Insert Into Ias_Grp_Itm_Lvl_Tree ( Grp_Code,Grp_Code_Tree,Grp_Name,Grp_Lvl )
```
```sql
Select Grp_Code,Grp_Code_Tree,Grp_L_Name,Rownum From
```
```sql
(Select '
```
```sql
SELECT GRP_CODE FROM IAS_GRP_ITM_LVL WHERE AFFECTED_BY_TRANS = 1 ORDER BY GRP_CODE"
```
```sql
SELECT Round(i_price ,2)
```
```sql
FROM (SELECT Nvl(b.i_price,0)*Nvl(a.bill_Rate,1)/Nvl(a.Stock_rate,1) i_Price
```
```sql
SELECT Round(AVG(I_Cwtavg),2) FROM Ias_Itm_Wcode a,Gr_Detail b
```
```sql
SELECT Round(AVG(I_Cwtavg),2) FROM Ias_Itm_Wcode
```
```sql
And (I_Code,W_Code) In (Select I_Code,W_Code From Gr_Detail)
```
```sql
SELECT Count(Distinct a.Bill_Date)
```
```sql
Select To_Date('
```
```sql
SELECT I_PRICE FROM IAS_ITEM_PRICE WHERE I_CODE = :b1 AND LEV_NO = :b2 AND ROWNUM <= 1"SELECT ROUND(AVG(I_PRICE),2) FROM IAS_ITEM_PRICE WHERE I_CODE = :b1"SELECT V_CODE FROM IAS_V_VNDR_ITM WHERE I_CODE = :b1 AND ROWNUM <= 1"SELECT DECODE(:b1,1,NVL(V_A_NAME,V_E_NAME),NVL(V_E_NAME,V_A_NAME)) FROM IAS_V_VNDR_ITM,V_DETAILS WHERE IAS_V_VNDR_ITM.V_CODE = V_DETAILS.V_CODE AND IAS_V_VNDR_ITM.I_CODE = :b2 AND ROWNUM <= 1"SELECT BARCODE FROM IAS_ITM_UNT_BARCODE WHERE I_CODE = :b1 AND ITM_UNT = :b2 AND ROWNUM <= 1"SELECT DECODE(:b1,1,NVL(GRP_L_NAME,GRP_F_NAME),NVL(GRP_F_NAME,GRP_L_NAME)) FROM IAS_ITM_MST,IAS_GRP_ITM_LVL WHERE IAS_ITM_MST.I_CODE = :b2 AND IAS_GRP_ITM_LVL.GRP_CODE = IAS_ITM_MST.GRP_CLASS_CODE AND ROWNUM <= 1"SELECT DECODE(:b1,1,NVL(SUBG_A_NAME,SUBG_E_NAME),NVL(SUBG_E_NAME,SUBG_A_NAME)) FROM IAS_ITM_MST A,IAS_SUB_GRP_DTL B WHERE A.I_CODE = :b2 AND A.SUBG_CODE = B.SUBG_CODE AND A.MNG_CODE = B.MNG_CODE AND A.G_CODE = B.G_CODE"SELECT DECODE(:b1,1,NVL(SUBG_A_NAME,SUBG_E_NAME),NVL(SUBG_E_NAME,SUBG_A_NAME)) FROM IAS_ITM_MST A,IAS_SUB_GRP_DTL B WHERE A.I_CODE = :b2 AND A.SUBG_CODE = B.SUBG_CODE"SELECT AMT FROM SALES_DISC WHERE I_CODE = :b1 AND ROWNUM <= 1"SELECT AMT FROM SALES_DISC WHERE I_CODE = :b1 AND LEV_NO = :b2 AND ROWNUM <= 1"SELECT ROUND(I_CWTAVG,2) FROM IAS_ITM_MST WHERE I_CODE = :b1 AND ROWNUM <= 1"SELECT SUBSTR(INCOME_DATE,7,4) FROM IAS_ITM_MST WHERE I_CODE = :b1 AND ROWNUM <= 1"SELECT I_PRICE FROM IAS_ITEM_PRICE WHERE I_CODE = :b1 AND LEV_NO = :b2 AND ROWNUM <= 1"SELECT ROUND(AVG(I_PRICE),2) FROM IAS_ITEM_PRICE WHERE I_CODE = :b1"SELECT ROUND(I_CWTAVG,2) FROM IAS_ITM_MST WHERE I_CODE = :b1 AND ROWNUM <= 1"SELECT DECODE(:b1,1,NVL(SUB_L_NAME,SUB_F_NAME),NVL(SUB_F_NAME,SUB_L_NAME)) FROM IAS_GNR_CODE_DTL WHERE SUB_NO = TO_NUMBER(:b2)"
```
```sql
SELECT MAX(NVL(REP_NO,0)) + 1 FROM IAS_AR_ITM_DISC_AGE_TMP"UPDATE IAS_AR_ITM_DISC_AGE_TMP SET REP_NO=:b1,REP_DATE=TO_CHAR(SYSDATE,''dd/mm/yyyy'') WHERE REP_NO IS NULL"
```
```sql
And Exists ( Select 1 From Ias_Grp_Itm_Lvl_Tree A
```
```sql
.Batch_No In (Select Batch_No From Ias_Batch_No Where Col
```
```sql
.W_Code In (Select W_Code From Ias_Ar_Wh_Tmp Where Trmnl_Name='
```
```sql
SELECT
```
```sql
Select Excel(.Xls) File
```
```sql
Insert into Ias_Ar_Itm_Disc_Xls_Tmp (i_code,Trmnl_Name) values ('
```
```sql
Select G_Code,
```
```sql
Where Exists (select 1 from privilege_gc
```
```sql
SELECT c_group_code ,
```
```sql
SELECT 1
```
```sql
select city_no,
```
```sql
select cntry_no,
```
```sql
select prov_no,decode(:Parameter.Lang_No,1,nvl(prov_a_name,prov_e_name),nvl(prov_e_name,prov_a_name)) prov_name
```
```sql
select r_code,decode(:Parameter.Lang_No,1,nvl(r_a_name,r_e_name),nvl(r_e_name,r_a_name)) r_a_name ,
```
```sql
Select I_Code,Decode(:Parameter.Lang_No,1,nvl(I_name,I_e_name),nvl(I_e_name,I_name) )I_name,I_desc
```
```sql
Exists (select 1 from privilege_gc where u_id=:Parameter.User_no and g_code=Ias_Itm_Mst.g_code and add_flag=1 and RowNum<=1)
```
```sql
select decode(:Parameter.Lang_No,1,nvl(i_name,i_e_name),nvl(i_e_name,i_name)) i_name,i_code,i_desc from Ias_Itm_Mst
```
```sql
where Exists (select 1 from privilege_gc where u_id=:Parameter.User_no and g_code=Ias_Itm_Mst.g_code and add_flag=1 and RowNum<=1)
```
```sql
Select MNG_Code,G_Code ,
```
```sql
Select Subg_Code,Mng_Code,
```
```sql
Select Group_NO,
```
```sql
Select type_of_item ,Decode(:Parameter.lang_no ,1,Nvl(it_a_Name , it_e_name)
```
```sql
Select ILEV_NO,
```
```sql
Select warehouse_details.w_code,
```
```sql
where Exists (select 1 from PRIVILEGE_WH
```
```sql
Select measure_code,
```
```sql
Select BARCODE
```
```sql
Select Type_Of_Item,
```
```sql
Select Assistant_No,
```
```sql
Select Distinct Income_date
```
```sql
Select Detail_No,
```
```sql
select decode(:Parameter.Lang_No,1,nvl(i_name,i_e_name),nvl(i_e_name,i_name)) i_name,i_code,i_desc
```
```sql
and Exists (select 1 from privilege_gc where u_id=:Parameter.User_no and g_code=Ias_Itm_Mst.g_code and add_flag=1 and RowNum<=1)
```
```sql
SELECT activity_no,
```
```sql
Select Distinct Season_Itm From Ias_Itm_Mst Where Season_Itm Is Not Null
```
```sql
Select Distinct Ore_Itm From Ias_Itm_Mst Where Ore_Itm Is Not Null
```
```sql
Select Distinct Mark_Itm From Ias_Itm_Mst Where Mark_Itm Is not Null
```
```sql
Select Distinct Company_Itm From Ias_Itm_Mst Where Company_Itm Is not Null
```
```sql
SELECT Doc_No,
```
```sql
Select Distinct Country_Itm From Ias_Itm_Mst Where Country_Itm Is not Null
```
```sql
select reprs_code,decode(:parameter.Lang_No,1,nvl(reprs_a_name,reprs_e_name), reprs_e_name) rep_name from sales_man
```
```sql
(Exists (Select 1 From IAS_PRIV_SMAN
```
```sql
Select Customer.C_Code,
```
```sql
Select 1
```
```sql
Select V_Details.V_Code,
```
```sql
SELECT EMP_NO,
```
```sql
Select distinct rep_no, rep_date
```
```sql
select distinct doc_no,doc_type,doc_date
```
```sql
SELECT Gr_No,
```
```sql
SELECT Bill_No,
```
```sql
And Round(Nvl((Select Sum((Nvl(P_Qty,0)+Nvl(Pf_Qty,0))*In_Out)
```
```sql
And Round(Nvl((Select Sum((Nvl(P_Qty,0)+Nvl(Pf_Qty,0))*In_Out*Nvl(Ias_Itm_Mst.I_Cwtavg,0))
```
```sql
And Abs(Round(Nvl((Select Sum((Nvl(P_Qty,0)+Nvl(Pf_Qty,0))*In_Out)
```
```sql
Nvl((Select Sum((Nvl(P_Qty,0)+Nvl(Pf_Qty,0))*In_Out)
```
```sql
And Round(Nvl((Select Nvl(Sum(Nvl(
```
```sql
And Round(((Select Nvl(Sum(Nvl(
```
```sql
(Select Nvl(Sum(Nvl(Ias_Pos_Bill_Dtl.P_Qty,0)),0) Iqty
```
```sql
And Round(Nvl((Select Nvl(Sum((Nvl(
```
```sql
And Round(((Select Nvl(Sum((Nvl(
```
```sql
(Select Nvl(Sum((Nvl(Ias_Pos_Bill_Dtl.i_Price,0)-Nvl(Ias_Pos_Bill_Dtl.Dis_Amt,0))*Nvl(Ias_Pos_Bill_Mst.Bill_Rate,1)*Nvl(Ias_Pos_Bill_Dtl.I_Qty,0)),0)
```
```sql
IN (SELECT w_code
```
```sql
.C_Code IN (SELECT C_CODE FROM CUSTOMER
```
```sql
And Ias_Pos_Bill_Mst.C_Code IN (SELECT C_CODE FROM CUSTOMER
```
```sql
And Ias_Pos_Bill_Dtl.Batch_No In (Select Batch_No From Ias_Batch_No Where Col
```
```sql
In (Select Activity_No,W_Code From Ias_Conn_Wcode_By_Activity Where Pj_No Between '
```
```sql
In (Select Activity_No,W_Code From Ias_Conn_Wcode_By_Activity Where Pj_No='
```
```sql
In (Select Activity_No,W_Code From Ias_Conn_Wcode_By_Activity Where Actv_No Between '
```
```sql
In (Select Activity_No,W_Code From Ias_Conn_Wcode_By_Activity Where Actv_No='
```
```sql
And Sale_Cost.G_Ser in (select g_ser from gr_detail where doc_ser=
```
```sql
Select Nvl(Sum(Case When Bill_Date Between '
```
```sql
Select Count(1) From Ias_Ar_Itm_Disc_Tmp Where Trmnl_Name='
```
```sql
And Ias_Whtrns_Dtl.F_W_Code In (Select W_Code From Ias_Ar_Wh_Tmp Where Trmnl_Name='
```
```sql
Select Nvl(Sum(P_Qty),0),Sum(Nvl(I_Qty,0)*Nvl(Stk_Cost,0)*Nvl(Stk_Rate,1))
```
```sql
(Select Fld_Code From Ias_Ar_Itm_Disc_Tmp Where Trmnl_Name='
```
```sql
Err In Insert InTo Ias_Ar_Itm_Disc_Age_Tmp Table
```
```sql
SELECT FLD_CODE,FLD_NAME,W_CODE,BATCH_NO,FLD_CODE2,GRP_LVL FROM IAS_AR_ITM_DISC_TMP WHERE TRMNL_NAME = :b1 ORDER BY FLD_CODE"SELECT DIS_PER,ROWNUM RNUM FROM (SELECT DISTINCT ROUND(NVL(IAS_BILL_DTL.DIS_PER,0),NVL(:b1,20)) DIS_PER FROM IAS_BILL_DTL,IAS_AR_ITM_DISC_TMP_NW WHERE IAS_BILL_DTL.I_CODE = IAS_AR_ITM_DISC_TMP_NW.I_CODE AND IAS_BILL_DTL.W_CODE = NVL(IAS_AR_ITM_DISC_TMP_NW.W_CODE,IAS_BILL_DTL.W_CODE) AND IAS_AR_ITM_DISC_TMP_NW.TRMNL_NAME = :b2 ) WHERE ROWNUM <= 5 ORDER BY DIS_PER"SELECT MIN(GRP_LVL) FROM IAS_AR_ITM_DISC_TMP WHERE TRMNL_NAME = :b1"INSERT INTO IAS_AR_ITM_DISC_AGE_TMP ( RCRD_NO,FLD_CODE,FLD_CODE2,FLD_NAME,FLD_NAME2,ITM_UNT,W_CODE,BATCH_NO,AVL_QTY,AVL_QTY_AMT,OPEN_BAL_QTY,OPEN_BAL_AMT,NET_INC_QTY,NET_INC_AMT,TOT_NET_INC_QTY,TOT_NET_INC_AMT,INC_QTY,INC_AMT,OUT_QTY,OUT_AMT,TR_QTY,TR_AMT,ADJ_QTY,ADJ_AMT,SALES_QTY,
```
```sql
SELECT DISTINCT IAS_GEN_PKG.GET_PROMPT(:b1,COMMENTS) FROM USER_COL_COMMENTS,USER_TAB_COLUMNS WHERE USER_COL_COMMENTS.TABLE_NAME = USER_TAB_COLUMNS.TABLE_NAME AND USER_COL_COMMENTS.TABLE_NAME = ''IAS_ITM_MST'' AND USER_COL_COMMENTS.COLUMN_NAME = :b2 AND USER_COL_COMMENTS.COMMENTS IS NOT NULL"SELECT COUN
```
```sql
T(1) FROM (SELECT DISTINCT ROUND(NVL(IAS_BILL_DTL.DIS_PER,0),NVL(:b1,20)) DIS_PER FROM IAS_BILL_DTL,IAS_AR_ITM_DISC_TMP_NW WHERE IAS_BILL_DTL.I_CODE = IAS_AR_ITM_DISC_TMP_NW.I_CODE AND IAS_BILL_DTL.W_CODE = NVL(IAS_AR_ITM_DISC_TMP_NW.W_CODE,IAS_BILL_DTL.W_CODE) AND IAS_AR_ITM_DISC_TMP_NW.TRMNL_NAME = :b2 )"
```
```sql
SELECT DISTINCT
```
```sql
Or Exists ( Select 1 From Ias_V_Vndr_Itm
```
```sql
SELECT PO_NO,
```
```sql
Select Quot_No,F_Date,T_Date,Brn_No ,Quot_ser
```
```sql
(Select 1
```
```sql
Or Exists (select 1 From S_Brn_Usr_Priv
```
```sql
Select Distinct col1,
```
```sql
Select Distinct col2,
```
```sql
Select Distinct col3,
```
```sql
Select Distinct col4,
```
```sql
Select Distinct col5,
```
```sql
Select Distinct Batch_No
```
```sql
Select Pj_No,Decode(:Parameter.Lang_no,1,pj_a_name,nvl(pj_e_name,pj_a_name)) pj_name ,
```
```sql
and Exists (select 1 from IAS_PRIV_PROJECTS
```
```sql
SELECT Actv_No,
```
```sql
Select Grp_Code,
```
```sql
Select Brn_No,
```
```sql
Select u_id,Decode(:Parameter.Lang_no,1,U_a_Name,nvl(U_e_Name,U_a_Name)) U_name From User_r Order by U_id
```
```sql
DELETE
```
```sql
And Exists(Select 1
```
```sql
And I_Code In (Select I_Code
```
```sql
And Exists ( Select 1 From Ias_Grp_Itm_Lvl
```
```sql
And Ias_Itm_Mst.i_code in (select i_code from Ias_Itm_Unt_Barcode where Barcode between
```
```sql
And Ias_Itm_Mst.I_Code In (Select I_Code From IAS_V_VNDR_ITM Where v_code Between '
```
```sql
=(select max(
```
```sql
=(select min(
```
```sql
And Ias_Itm_Mst.I_Code In (Select I_Code From Ias_Itm_Dtl Where Itm_Unt='
```
```sql
And Exists ( Select 1 From Sales_Disc
```
```sql
And Not Exists ( Select 1 From Sales_Disc
```
```sql
And Exists ( Select 1 From Ias_Bill_Mst,Ias_Bill_Dtl
```
```sql
And Not Exists ( Select 1 From Ias_Bill_Mst,Ias_Bill_Dtl
```
```sql
And Exists ( Select 1 From Ias_Pi_Bill_Mst,Ias_Pi_Bill_Dtl
```
```sql
And Not Exists ( Select 1 From Ias_Pi_Bill_Mst,Ias_Pi_Bill_Dtl
```
```sql
And Exists ( Select 1 From Ias_Pi_Bill_Mst_Add_Disc,Ias_Pi_Bill_Dtl_Add_Disc
```
```sql
And Not Exists ( Select 1 From Ias_Pi_Bill_Mst_Add_Disc,Ias_Pi_Bill_Dtl_Add_Disc
```
```sql
And Exists ( Select 1 From Ias_Item_Price
```
```sql
And Ias_Itm_Mst.I_Code In ( Select I_Code From Ias_Itm_Wcode
```
```sql
Where (I_Code,w_code) in ( Select I_Code,w_code From Gr_Detail)
```
```sql
And Exists ( Select 1 From ias_item_price
```
```sql
And Ias_Itm_Mst.I_Code ( Select Ias_Item_Price.I_Code From ias_item_price,Ias_Itm_Wcode
```
```sql
And (Ias_Itm_Wcode.i_code,Ias_Itm_Wcode.w_code) In ( Select i_code,w_code From Gr_Detail)
```
```sql
And Ias_Itm_Mst.I_Code In ( Select I_Code From Gr_Detail
```
```sql
And Exists(Select 1 From Ias_Batch_No Where Batch_No=Gr_Detail.Batch_No And Col
```
```sql
And Ias_Itm_Mst.I_Code In ( Select I_Code From Gr_Detail,Ias_Batch_No
```
```sql
And Exists ( Select W_Code
```
```sql
Delete Ias_Ar_Wh_Tmp Where Trmnl_Name Is Null Or Trmnl_Name='
```
```sql
Insert Into Ias_Ar_Wh_Tmp (W_Code,Main_Wcode,Trmnl_Name) Select W_Code,Nvl(Main_Wcode,0) Main_Wcode,'
```
```sql
And Exists ( Select 1 From Privilege_Gc
```
```sql
And Exists ( Select 1
```
```sql
And (SELECT Count(Distinct Bill_Ser)
```
```sql
Delete Ias_Ar_Itm_Disc_Tmp Where Trmnl_Name='
```
```sql
Delete Ias_Ar_Itm_Disc_Tmp_Nw Where Trmnl_Name='
```
```sql
DROP SNAPSHOT IAS_V_PRD_REP
```
```sql
DROP SNAPSHOT IAS_V_AR_Dt_REP
```
```sql
CREATE MATERIALIZED VIEW IAS_V_PRD_REP AS SELECT DISTINCT
```
```sql
CREATE MATERIALIZED VIEW IAS_V_AR_Dt_REP AS SELECT DISTINCT I_Date Doc_Date FROM
```
```sql
UNION SELECT DISTINCT Bill_Date FROM
```
```sql
UNION SELECT DISTINCT Rt_Bill_Date FROM
```
```sql
UNION SELECT DISTINCT Bill_Date FROM Ias_Pos_Bill_Mst WHERE Bill_Date Between '
```
```sql
UNION SELECT DISTINCT Rt_Bill_Date FROM Ias_Pos_Rt_Bill_Mst WHERE Rt_Bill_Date Between '
```
```sql
And Exists(Select 1 From IAS_AR_ITM_DISC_XLS_TMP Where I_Code=Ias_Itm_Mst.I_Code And Trmnl_Name='
```
```sql
And EXISTS (SELECT lev_no
```
```sql
Insert Into Ias_Ar_Itm_Disc_Tmp (Fld_Code,W_Code,Fld_Name,Trmnl_Name)
```
```sql
Select Distinct Ias_Item_Price.I_Price Fld_Code,Ias_Itm_Wcode.W_Code W_Code,'
```
```sql
Insert Into Ias_Ar_Itm_Disc_Tmp (Fld_Code,W_Code,Fld_Name,Trmnl_Name) Select Distinct Ias_Item_Price.I_Price Fld_Code,Null W_Code,'
```
```sql
Insert Into Ias_Ar_Itm_Disc_Tmp ( Fld_Code,W_Code,Fld_Name,Trmnl_Name)
```
```sql
Select Distinct Round(Ias_Itm_Mst.I_Cwtavg,1) Fld_Code,
```
```sql
Select Distinct Round(Itm_Wcode.I_Cwtavg,1) Fld_Code,
```
```sql
From Ias_Itm_Mst,Ias_Itm_Wcode,(SELECT DISTINCT I_CODE,AVG(I_Cwtavg) I_Cwtavg FROM Ias_Itm_Wcode
```
```sql
Where I_Code In ( Select I_Code From Gr_Detail Where I_Code=Ias_Itm_Wcode.I_Code And W_Code=Ias_Itm_Wcode.W_Code)
```
```sql
And Exists ( Select 1 From Gr_Detail
```
```sql
From Ias_Itm_Mst,(SELECT DISTINCT I_CODE,AVG(I_Cwtavg) I_Cwtavg FROM Ias_Itm_Wcode
```
```sql
Select Distinct 0 Fld_Code,Ias_Itm_Wcode.W_Code W_Code,'
```
```sql
Union
```
```sql
Select Distinct Round(Sales_Disc.Amt) Fld_Code,Ias_Itm_Wcode.W_Code W_Code,'
```
```sql
Select Distinct 0 Fld_Code,Null W_Code,'
```
```sql
Select Distinct Round(Sales_Disc.Amt) Fld_Code,Null W_Code,'
```
```sql
Select Distinct Round(Ias_Item_Price.I_Price/Ias_Itm_Mst.I_Cwtavg,1) Fld_Code,
```
```sql
Select Distinct Round(Ias_Item_Price.I_Price/Itm_Wcode.I_Cwtavg,1) Fld_Code,
```
```sql
From Ias_Itm_Mst,Ias_Itm_Wcode,Ias_Item_Price,(SELECT DISTINCT I_CODE,AVG(I_Cwtavg) I_Cwtavg FROM Ias_Itm_Wcode
```
```sql
Where (I_Code,w_code) In ( Select I_Code,w_code From Gr_Detail)
```
```sql
Select Distinct Round(Ias_Item_Price.I_Pri
```
```sql
From Ias_Itm_Mst,Ias_Item_Price,(SELECT DISTINCT I_CODE,Round(AVG(I_Cwtavg),1) I_Cwtavg FROM Ias_Itm_Wcode
```
```sql
Insert Into Ias_Ar_Itm_Disc_Tmp (Fld_Code,W_Code,Batch_No,Fld_Name,Trmnl_Name)
```
```sql
Select Distinct Gr_Detail.Batch_No Fld_Code,Ias_Itm_Wcode.W_Code W_Code,Gr_Detail.Batch_No,'
```
```sql
Insert Into Ias_Ar_Itm_Disc_Tmp (Fld_Code,W_Code,Batch_No,Fld_Name,Trmnl_Name) Select Distinct Gr_Detail.Batch_No Fld_Code,Null W_Code,Gr_Detail.Batch_No,'
```
```sql
Select Distinct Ias_Itm_Mst.I_Code Fld_Code,Ias_Itm_Wcode.W_Code W_Code,Gr_Detail.Batch_No,'
```
```sql
Insert Into Ias_Ar_Itm_Disc_Tmp (Fld_Code,W_Code,Batch_No,Fld_Name,Trmnl_Name) Select Distinct Ias_Itm_Mst.I_Code Fld_Code,Null W_Code,Gr_Detail.Batch_No,'
```
```sql
Insert Into Ias_Ar_Itm_Disc_Tmp (Fld_Code,Fld_Code2,W_Code,Fld_Name,Trmnl_Name)
```
```sql
Select Distinct Ias_Batch_No.Col
```
```sql
Select Distinct Ias_V_Vndr_Itm.V_Code Fld_Code,Ias_Itm_Wcode.W_Code W_Code,'
```
```sql
Select Distinct Ias_V_Vndr_Itm.V_Code Fld_Code,Null W_Code,'
```
```sql
Select Distinct Ias_Projects.Pj_No Fld_Code,Ias_Itm_Wcode.W_Code W_Code,'
```
```sql
Select Distinct Ias_Projects.Pj_No Fld_Code,Null W_Code,'
```
```sql
Select Distinct Ias_Actvty.Actv_No Fld_Code,Ias_Itm_Wcode.W_Code W_Code,'
```
```sql
Select Distinct Ias_Actvty.Actv_No Fld_Code,Null W_Code,'
```
```sql
Select Distinct Ias_Gen_Pkg.Get_Cnt('SELECT Count(Distinct a.Bill_Date)
```
```sql
Select Distinct Ias_V_Prd_Rep.Prd Fld_Code,
```
```sql
Insert Into Ias_Ar_Itm_Disc_Tmp (Fld_Code,Fld_Code2,W_Code,Grp_Lvl,Fld_Name,Trmnl_Name)
```
```sql
Select Distinct GrI_Code_Tree Fld_Code,
```
```sql
Insert Into Ias_Ar_Itm_Disc_Tmp (Fld_Code,Fld_Code2,W_Code,Fld_Name,Trmnl_Name) Select Distinct Ias_Itm_Mst.
```
```sql
Insert Into Ias_Ar_Itm_Disc_Tmp (Fld_Code,W_Code,Fld_Name,Trmnl_Name) Select Distinct
```
```sql
Insert Into Ias_Ar_Itm_Disc_Tmp (Fld_Code,Fld_Code2,W_Code,Fld_Name,Trmnl_Name) Select Distinct
```
```sql
And Exists (Select Cc_Code
```
```sql
Insert Into Ias_Ar_Itm_Disc_Tmp (Fld_Code,W_Code,Fld_Name,Trmnl_Name) Select Distinct Warehouse_Details.
```
```sql
And Warehouse_Details.W_Code In (Select W_Code From Ias_Ar_Wh_Tmp Where Trmnl_Name='
```
```sql
Insert Into Ias_Ar_Itm_Disc_Tmp_Nw (I_Code,W_Code,Trmnl_Name,Fld_Value)
```
```sql
Select Ias_Itm_Mst.I_Code,Ias_Itm_Wcode.W_Code W_Code,'
```
```sql
Select Distinct Ias_Itm_Mst.I_Code,Ias_Itm_Wcode.W_Code W_Code,'
```
```sql
And Bill_Ser In (Select Bill_Ser From Ias_Bill_Mst Where Bill_Date Between '
```
```sql
And Exists(Select 1 From Ias_Item_Price Where I_Code=Ias_Itm_Mst.I_Code And Lev_No=
```
```sql
From Ias_Itm_Mst,Ias_Itm_Wcode,(SELECT DISTINCT I_CODE,Round(AVG(I_Cwtavg),1) Fld_Value FROM Ias_Itm_Wcode
```
```sql
From Ias_Itm_Mst,Ias_Itm_Wcode,ias_item_price,(SELECT DISTINCT I_CODE,AVG(I_Cwtavg) Fld_Value FROM Ias_Itm_Wcode
```
```sql
Where (I_Code,W_code) In ( Select I_Code,w_code From Gr_Detail)
```
```sql
Insert Into Ias_Ar_Itm_Disc_Tmp_Nw (I_Code,W_Code,Batch_No,Trmnl_Name)
```
```sql
Select Distinct Ias_Itm_Mst.I_Code,Ias_Itm_Wcode.W_Code W_Code,Gr_Detail.Batch_No,'
```
```sql
Insert Into Ias_Ar_Itm_Disc_Tmp_Nw (I_Code,Fld_Value2,W_Code,Batch_No,Batch_Col,Trmnl_Name)
```

## Other extracted strings (first 180)

- `ARSR041`
- `YSERP_MNU.MMX`
- `AMERICAN_AMERICA.AR8MSWIN1256`
- `P1_09_DEC_201417_41_52`
- `SQLFORMS`
- `"PKG INIT"<anonymous>""`
- `P0_09_DEC_201417_41_52`
- `P0_10_SEP_201409_25_27`
- `P26_07_JAN_201411_38_51`
- `/NSPC11/PRE_FORM_PRC`
- `P195_14_FEB_201416_33_37`
- `STANDARD`
- `IAS_GEN_PKG`
- `IAS20142`
- `/LYSERP_LIB`
- `GEN_PKG`
- `FORMS4W`
- `FORMS40`
- `/NSPC11/POS_NEW`
- `"PKG INIT"<anonymous>"I"STM""`
- `IAS_GEN_PKGIAS20142GET_PROMPTIAS`
- `Paramtrs.Slice_Disc`
- `Select Ias_Gen_Pkg.Get_Prompt(`
- `,Comments) Comments,Column_Name`
- `From User_Col_Comments`
- `Where Table_Name ='IAS_ITM_MST'`
- `And Comments In (Select To_Char(Label_No) From Ias_Labels)`
- `and Column_Name not in('I_CODE','I_NAME','I_E_NAME','ITM_UNT','BRN_YEAR','BRN_USR','BRN_NO','MSUR_UNT_REP','CMP_NO','AD_U_ID','AD_DATE','UP_U_ID','UP_DATE')`
- `And Column_Name not in ('PRIMARY_COST','I_CWTAVG')`
- `PARAMTRS.LIST_I_CODE`
- `PER_PRICE_COST`
- `I_COST`
- `PUR_PRICE`
- `I_PRICE`
- `DIS_AMT`
- `I_YEAR`
- `PUR_CNT`
- `V_NAME`
- `V_CODE`
- `BARCODE`
- `GRP_CLASS_CODE_NM`
- `SUB_GRP_NM`
- `PARAMTRS.Fill_data_Type`
- `Paramtrs.Dis_Per_Add_Minus`
- `IAS_AR_ITM_DISC_AGE_TMP`
- `IAS_AR_ITM_DISC_AGE_TMP.F_CODE`
- `TERMINAL`
- `Select to_char(lev_no)||'- '||`
- `DECODE (`
- `,1, NVL (lev_a_name, lev_e_name),`
- `NVL (lev_e_name, lev_a_name)),to_char(lev_no)`
- `FROM ias_pricing_levels`
- `WHERE ((`
- `Or (EXISTS (SELECT lev_no`
- `FROM ias_priv_price`
- `WHERE u_id =`
- `AND lev_no = ias_pricing_levels.lev_no`
- `AND NVL (View_flag,0)=1`
- `AND RowNum<=1)))`
- `ORDER BY lev_no`
- `Paramtrs.Lev_No`
- `PUR_`
- `P25_07_JAN_201411_38_51`
- `P24_07_JAN_201411_38_51`
- `P23_07_JAN_201411_38_51`
- `P22_07_JAN_201411_38_51`
- `P21_07_JAN_201411_38_51`
- `P20_07_JAN_201411_38_51`
- `P19_07_JAN_201411_38_51`
- `/NSPC11/EXIT_PROC`
- `P18_07_JAN_201411_38_51`
- `P17_07_JAN_201411_38_51`
- `VIEW_BTN`
- `SCREEN_BTN`
- `PRINT_DOC_BTN`
- `CANCEL_BTN`
- `PRINT_ST`
- `P16_07_JAN_201411_38_51`
- `Create -`
- `P15_07_JAN_201411_38_51`
- `Delete -`
- `P14_07_JAN_201411_38_51`
- `Accept -`
- `P13_07_JAN_201411_38_51`
- `List -`
- `P12_07_JAN_201411_38_51`
- `Search_`
- `P11_07_JAN_201411_38_51`
- `Exceute -`
- `P10_07_JAN_201411_38_51`
- `Print -`
- `P9_07_JAN_201411_38_51`
- `P8_07_JAN_201411_38_51`
- `FORMS4C`
- `"PKG INIT"<anonymous>"TIM""`
- `MSG_TMR`
- `FTR.ERR`
- `P7_07_JAN_201411_38_51`
- `Win1`
- `Main1`
- `Main12`
- `P196_14_FEB_201416_33_37`
- `TAB4`
- `I_CODE`
- `F_WC`
- `T_WC`
- `Paramtrs.F_INC_LAST_DAYs`
- `TAB5`
- `Paramtrs_Wh`
- `Paramtrs.F_Cntry_No`
- `P6_07_JAN_201411_38_51`
- `P5_07_JAN_201411_38_51`
- `P4_07_JAN_201411_38_51`
- `Ias_Bill_Mst.Dummy`
- `P3_07_JAN_201411_38_51`
- `EXIT_PROC`
- `"PKG INIT"EXIT_PROC""`
- `VA_FLD`
- `MS Sans Serif`
- `VA_LOV`
- `VA_FLD_USR`
- `VA_BAR`
- `VA_RPRT_BAR`
- `VA_CURREC`
- `VA_MAIN`
- `VA_RCRD_MOV`
- `tahoma`
- `VA_DNT_MODFY`
- `VA_FRM_NL_CLR`
- `VA_NO_COLOR`
- `VA_FRM_CLR`
- `VA_HNTTXT`
- `VA_HDR`
- `VA_TREE`
- `VA_VER`
- `VA_PRG`
- `VA_HNT`
- `VA_FTR`
- `VA_PRNT`
- `VA_ERR`
- `VA_MNDTRY_FLD`
- `VA_CHK`
- `VA_DSPLY`
- `VA_PRMPT`
- `CLEAR_PROC`
- `"PKG INIT"CLEAR_PROC""`
- `Paramtrs.F_Brn_No`
- `Paramtrs.T_Brn_No`
- `LOAD_PARAMETERS`
- `IAS_PARA_GEN`
- `IAS_PARA_INV`
- `IAS_PARA_AR`
- `IAS_PARA_AP`
- `YS_GEN_PKG`
- `PRIVILEGE_FIXED`
- `EX_RATE`
- `"PKG INIT"LOAD_PARAMETERS"V_STM"<cursor ptr>"<SQL statement. Line 5>"<SQL statement. Line 41>"<SQL statement. Line 45>""`
- `IAS_GEN_PKGIAS20142GET_CUR_RATEI`
- `Paramtrs.Avl_Qty_Amt`
- `Paramtrs.Net_Inc_Amt`
- `Paramtrs.Stk_Cost`
- `Paramtrs.Profit_Per`
- `Paramtrs.Profit_Amt`
- `Paramtrs.Stk_Cost_Disc`
- `Paramtrs.Profit_Per_Disc`
- `Paramtrs.Profit_Amt_Disc`
- `Paramtrs.Sales_Amt`
- `Paramtrs.Rt_Sales_Amt`
- `Paramtrs.Net_Amt`
- `Paramtrs.Sales_Qty`
- `Paramtrs.Rt_Sales_Qty`
- `Paramtrs.Net_Qty`
- `Paramtrs.CALC_UNPOST_QTY_POS`
- `SELECT PATH_EXCEL,CONN_ITM_ACT_BY_USR_PRIV,NVL(YS_GEN_PKG.CHK_ACTV_SYSTEM(80,:b1),0) CONN_POS_SYSTEM,COSTING_TYPE,WTAVG_TYPE,SALES_DISC_TYPE,COSTING_TYPE,WTAVG_TYPE,AR_AC_LINK_TYPE,AP_AC_LINK_TYPE,NO_OF_DECIMAL_AR,USE_BATCH_NO,NVL(BATCHNO_COL_NO,0) FROM IAS_PARA_GEN,IAS_PARA_INV,IAS_PARA_AR,IAS_PARA_AP"SELECT NVL(AR_SHOW_STK_CST_REP,0),NVL(SHW_AMT_QTY_STATC_AR_REP,3) FROM PRIVILEGE_FIXED WHERE U_ID = :b1"SELECT CUR_CODE FROM EX_RATE WHERE NVL(STOCK_CUR,0) = 1"`
- `PRE_FORM_PRC`
- `/NSPC11/LOAD_PARAMETERS`
- `/NSPC11/FILL_ALL_LIST_PRC`
- `"PKG INIT"PRE_FORM_PRC"V_BATCH_NM_COL1"V_BATCH_NM_COL2"V_BATCH_NM_COL3"V_BATCH_NM_COL4"V_BATCH_NM_COL5"<cursor ptr>"<SQL statement. Line 114>""`
- `V6.1.2016.12.14`
- `Paramtrs`