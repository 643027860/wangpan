import ajax from './ajax'


export const ReqTypes = () => ajax("http://47.112.132.177:8092/form/find/all",{},'POST')  //获取分类类型
export const RewYearTypeEnable = (fileEnable,fileType,pageNum,pageSize) => ajax("http://47.112.132.177:8092/file/find/yte",{fileEnable,fileType,pageNum,pageSize},'POST')  //找时间类型分页资源
export const ChangeEnable = (fileEnable,id) => ajax("http://47.112.132.177:8092/file/update/enable",{fileEnable,id},'POST')  //更改资源可用性
export const login = (username,password) => ajax("http://47.112.132.177:8092/login",{username,password},'POST')  //登录
export const DownLoad = (id) => ajax("http://47.112.132.177:8092/file/download",{id},'GET')  //登录

