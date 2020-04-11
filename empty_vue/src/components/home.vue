<template>
  <div class="wangpan">
    <el-container>
      <el-header>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
          <el-menu-item index="1"><p style="position: relative;left: -42.5px;margin: 0;font-size: 18px">海创网盘</p></el-menu-item>
          <el-drawer
            title="我嵌套了表格!"
            :visible.sync="table"
            direction="rtl"
            size="50%">
            <el-table :data="gridData">
              <el-table-column property="date" label="日期" width="150"></el-table-column>
              <el-table-column property="name" label="姓名" width="200"></el-table-column>
              <el-table-column property="address" label="地址"></el-table-column>
            </el-table>
          </el-drawer>
        </el-menu>
        <div class="line"></div>
      </el-header>
      <el-container style="height: 895px;margin-top: 3px;overflow: auto">
        <el-aside width="260px" style="background-color: rgb(247,247,247)">
          <el-row class="tac">
            <el-col >
              <el-menu
                :default-active="default_id"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                background-color=rgb(247,247,247)
                text-color=rgb(0,0,0)
                >
                <el-submenu index="1" >
                  <template slot="title">
                    <i class="el-icon-document-copy"></i>
                    <span>全部文件</span>
                  </template>
                  <el-menu-item-group >
                    <el-menu-item :index="'1-'+(index+1)" class="type_lists" style="padding-left:110px;font-size:16px;)" v-for="(type,index) in types" :key="index" :id="'type'+type.id" @click="()=>chooceType(1,index+1,type.id)">{{type.formName}}</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-menu-item index="2" text-color=rgb(0,0,0) class="type_list" style="padding-left: 20px!important;font-size: 20px" @click="()=>chooceType('2',100,100)">
                  <i class="el-icon-delete"></i>
                  <span slot="title">回收站</span>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-main style="margin: 0 10px 0 10px;background-color: white;overflow: auto;min-width: 800px;" class="main">
          <router-view @myUpload="upload" :reReq="reReq" @noreReq="noreReq"/>
          <div class="upload_lists_div" v-show="showList">
            <div class="upload_lists">
              <div style="height: 50px;border-bottom: 1px solid rgb(234,234,234)">
                <el-button type="primary" plain icon="el-icon-close" style="float: right;margin-right: 20px;margin-top: 7px" @click="showList=false"/>
                <span style="font-size: 18px;margin-top: 15px;margin-left: 20px;display: inline-block">传输列表</span>
              </div>
              <div class="list_type_name1" style="border-bottom: 1px solid rgb(243,243,243);">
                <div class="list_type_name" style="width: 40%"><span style="padding-left:10px;display: inline-block;height: 40px;line-height: 40px">文件名</span></div>
                <div class="list_type_name" style="width: 15%"><span style="display: inline-block;height: 40px;line-height: 40px">大小</span></div>
                <div class="list_type_name" style="width: 45%"><span style="display: inline-block;height: 40px;line-height: 40px">上传进度</span></div>
              </div>
              <div v-for="(list,index) in fileList" :key="index" class="my__lists__upload">
                <p style="margin:0;line-height:30px;height:30px;display: inline-block;width: 35%;margin-right:5%;overflow: hidden;float: left;font-size: 13px">
                  {{list.fileRealName}}
                </p>
                <p style="margin:0;line-height:30px;height:30px;display: inline-block;width: 15%">
                  {{countSize(list.fileSize)}}
                </p>
                <div style="margin:0;width: 35%;display: inline-block;">
                  <el-progress :text-inside="true" :stroke-width="15" :percentage="list.persent" :status="!list.stop?'success':'exception'"></el-progress>
                </div>
                <div style="width: 3%;margin-right:2%;display: inline-block;float: right;margin-top: 8px">
                  <i class="el-icon-upload-success el-icon-circle-check" style="color: greenyellow" v-if="list.succeed&&!list.error&&!list.stop"/>
                  <i class="el-icon-refresh-right" style="color: deepskyblue" v-if="!list.succeed&&list.error||list.stop" @click="()=>go(index,list.file,true)"/>
                  <i class="el-icon-close" style="color: black" @click="()=>cancel(index)" v-if="!list.succeed&&!list.error&&!list.stop"/>
                </div>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import {ReqTypes} from '../api/types'
  import axios from 'axios'
  import store from 'store'
  import '../assets/my-css.css'
  export default {
    data() {
      return {
        activeIndex: '1',
        activeIndex1: '1',
        types:[],
        default_id:'1-1',
        fileList: [],
        sources:[],//用于取消上传的标志
        showLists:false,
        reReq:false,
        showList:false,
        table: false,
        dialog: false,
        loading: false,
        gridData:[]
      }
    },
    async mounted(){
      this.default_id = store.get('WangPan_Type_Id_only')
      console.log(this.default_id)
      var result = await ReqTypes()
      this.types = result.obj
    },
    methods: {
      chooceType(header,index,id){
        if((store.get('WangPan_Type_Id_only')).split('-')[1]!=index&&index!=100){
          if(id==1)
            this.$router.push('/home/image')
          if(id==2)
            this.$router.push('/home/video')
          if(id==3)
            this.$router.push('/home/text')
          if(id==4)
            this.$router.push('/home/music')
          if(id==5)
            this.$router.push('/home/zhong')
          if(id==6)
            this.$router.push('/home/apply')
          if(id==7)
            this.$router.push('/home/file')
        }else if((store.get('WangPan_Type_Id_only'))!=header&&index==100){
          this.$router.push('/home/rubbish')
        }
        if(index==100)
          store.set('WangPan_Type_Id_only',header)
        else
          store.set('WangPan_Type_Id_only',header+'-'+index)
      },
      handleOpen(key, keyPath) {
        store.set('WangPan_Type_Id_only',key)
      },
      upload(file){
        this.fileList.push(
          {
            fileRealName: file.name,
            fileSize: file.size,
            persent: 0,
            succeed: false,
            stop: false,
            error: false,
            file:file
          }
        )
        var index = this.fileList
        this.go(index.length-1,file)
        this.showList = true
      },
      cancel(index){
        if(this.sources[index]){//我先判断soucre是否存在，因为如果我打开弹框不作任何操作，点击取消按钮没有这一层判断的话，that.source.cancel('取消上传');会报错。
          this.sources[index].cancel('取消上传');//"取消上传"这几个字，会在上面catch（）的error中输出的，可以console看一下。
          console.log(this.sources[index])
          this.fileList[index].stop = true
        }
      },
      countSize(size){
        if(size/1024/1024/1024>0.5){
          return ((size/1024/1024/1024)+'').split('.')[0]+'.'+((size/1024/1024/1024)+'').split('.')[1].slice(0,2)+'G'
        } else if(size/1024/1024>0.5){
          return ((size/1024/1024)+'').split('.')[0]+'.'+((size/1024/1024)+'').split('.')[1].slice(0,2)+'M'
        }else if(size/1024>0.5){
          return ((size/1024)+'').split('.')[0]+'.'+((size/1024)+'').split('.')[1].slice(0,2)+'KB'
        }else{
          return size + 'B'
        }
      },
      go (index,file,reload=false) {
        let self = this
        let cancelToken = axios.CancelToken;
        if(!reload)
          this.sources.push(cancelToken.source())
        else{
          this.sources.splice(index,1,cancelToken.source())
          this.fileList.splice(index,1,
            {
              fileRealName: file.name,
              fileSize: file.size,
              persent: 0,
              succeed: false,
              stop: false,
              error: false,
              file:file
            }
          )
        }
        let param = new FormData(); //创建form对象，私有，无法直接获取，只能通过get来查看其中的元素
        param.append('uploadFile',file)
        let config = {
          headers:{
            'Content-Type':'multipart/form-data',
          },
          cancelToken:this.sources[index].token,//取消事件
          transformRequest: [function (data) {
            return data
          }],
          onUploadProgress: progressEvent => {
            let persent = (progressEvent.loaded / progressEvent.total * 100 | 0)
            self.fileList[index].persent = persent
          },
        }
        axios.post('http://47.112.132.177:8092/file/upload',param,config)
          .then(response=>{
            var result = response.data
            if(result.status == 200)
            {
              self.fileList[index].succeed = true
              this.reReq = result.obj.fileType
            }else{
              self.fileList[index].stop = true
              self.fileList[index].error = true
              this.$message({
                message: '上传失败',
                type: 'error',
                duration:'1000'
              });
            }
          }).catch(err => {
          console.log(err)
        })
      },
      noreReq(){
        this.reReq = false
      },

    }
  }
</script>

<style scoped>
  .wangpan{
    background-color: rgb(247,247,247);
    height: 100%;
  }
  /*滚动条样式*/
  .main::-webkit-scrollbar {/*滚动条整体样式*/
    width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 3px;
  }
  .main::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
    border-radius: 4px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: white;
  }
  .type_lists,.type_list,.my__lists__upload{
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .upload_lists_div{
    width: 608px;
    height: 424px;
    position: absolute;
    border-radius: 6px;
    background-color: rgb(231,231,231);
    top: 49%;
    left: 67%;
  }
  .upload_lists{
    width: 600px;
    height: 420px;
    background-color: white;
    margin: 4px auto 0;
    overflow: auto;
  }
  .list_type_name1:after,.list_type_name1:before{
    display: table;
    content: '';
    clear: both;
  }
  .list_type_name{
    float: left;
    height: 40px;
    color: gray;
    cursor: pointer;
  }
  .my__lists__upload{
    width: 100%;
    height: 30px;
    border-bottom: 1px rgb(243,243,243) solid;
  }
  .my__lists__upload:hover,.list_type_name:hover{
    background-color: rgb(244,251,255);
  }

</style>
