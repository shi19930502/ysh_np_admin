export default {
	api: ROOT_API + '/api',
	rootAPI: ROOT_API + '/api/trade/', //接口根路径
	settleAPI: ROOT_API + '/api/settle/', //电子结算接口根路径
    userAPI: ROOT_API + '/api/user/',
    loginAPI: ROOT_API + '/login/login', 
    prefix: 'jz_admin_ycadmin', //本地存储key前缀
    // imgURL: 'http://10.2.15.82/',
    // uploadURL: 'http://10.2.15.82:8080/api/comm/fileUpload/file',
    imgURL: ROOT_API + '/',
    excelUrl:ROOT_API + '/excel/buyerAndMerchatExcel',
    uploadURL: ROOT_API + '/api/comm/fileUpload/file',
    sysID: 7,
    frontEndId: 2,  //前端系统Id 1:一批 2：电子结算
    city: '农鲜汇'
}