<template>
  <div class="zhong">
    <el-row style="padding-bottom: 10px;margin-left: 15px;margin-top: 10px">
      <el-upload
        class="avatar-uploader"
        ref="upload"
        :show-file-list="false"
        action=""
        :before-upload="beforeUpload"
        :on-change="handleChange"
        :auto-upload="false"
      >
        <el-button size="small" type="primary" icon="el-icon-upload2" style="height: 30px;font-size: 16px;">上传</el-button>
      </el-upload>
    </el-row>
    <div style="border-bottom: 1px solid rgb(243,243,243)"><p style="margin-left: 15px;margin-bottom: 10px">全部种子:</p></div>
    <div class="list_type_name1" style="border-bottom: 1px solid rgb(243,243,243)">
      <div class="list_type_name" style="width: 60%"><span style="padding-left: 30px;display: inline-block;height: 40px;line-height: 40px">文件名</span></div>
      <div class="list_type_name" style="width: 10%"><span style="padding-left: 15px;display: inline-block;height: 40px;line-height: 40px">大小</span></div>
      <div class="list_type_name" style="width: 15%"><span style="padding-left: 15px;display: inline-block;height: 40px;line-height: 40px">上传日期</span></div>
      <div class="list_type_name" style="width: 15%"><span style="padding-left: 15px;display: inline-block;height: 40px;line-height: 40px">作者</span></div>
    </div>
    <div v-if="displayFileImg" style="width: 350px;height:400px;background-color: rgba(0,0,0,0.6);position: absolute;z-index: 9999;left: 40%;top: 30%">
      <div class="block">
        <el-image
          class="img"
          :src="'http://47.112.132.177:8092/qrcode/createCommonQRCode?id='+fileId"
          style="height: 300px;width: 300px;margin-left: 25px;margin-top: 25px"
        >
        </el-image>
        <span style="color: white;margin-left: 130px;margin-top: 15px;display: inline-block" class="erweima">扫码下载文件</span>
      </div>
    </div>
    <div v-loading="fileLoding" class="main_list" style="height: 700px">
      <div v-if="!fileLoding">
        <div v-if="files.length>0">
          <div v-for="(file,index) in files" :key="index">
            <li :id="'zhong'+file.id" class="zhong_lists" @mouseover="()=>showP(file.id)" @mouseout="()=>hideP(file.id)">
              <i class="el-icon-folder" style="float: left;font-size: 26px!important;color: rgb(77,151,255);"/>
              <span style="display: inline-block;width: 15%;float:right;font-size: 14px;margin-top: 13px;text-indent: 1em;overflow: hidden">{{file.createBy}}</span>
              <span style="display: inline-block;width: 15%;float:right;font-size: 14px;margin-top: 13px;text-indent: 1em;overflow: hidden">{{file.fileUrlTime.split("T")[0]}}</span>
              <span style="display: inline-block;width: 10%;float:right;font-size: 14px;margin-top: 13px;text-indent: 1em;overflow: hidden">{{countSize(file.fileSize)}}</span>
              <span class="list_name" style="display: inline-block;width: 45%;margin-top: 13px;overflow: hidden" @click="()=>clickFile(file.id)">{{file.fileRealName}}</span>
              <span :id="'zp'+file.id" style="display: inline-block;position: absolute;left: 50%;margin: 0;" v-show="false">
                <i class="el-icon-download list_hover down_list" style="font-size: 20px!important;cursor: pointer;margin: 0px 10px;color: rgb(77,151,255);" @click="()=>downloadFile(file.id)"/>
                <i class="el-icon-delete list_hover" style="font-size: 20px!important;cursor: pointer;margin: 0px 10px;color: rgb(77,151,255);" @click="()=>deleteFile(file.id)"/>
              </span>
            </li>
          </div>
        </div>
        <div v-else>
          <p style="margin:0;margin-top: 20%;margin-left: 38%;display: inline-block;font-size: 28px;">还未上传任何其他种子</p>
        </div>
      </div>
    </div>
    <div class="block" v-if="filePage">
      <el-pagination
        layout="prev, pager, next"
        :total="filePage.totalSize"
        :current-page="filePage.pageNum"
        :page-size="17"
        :hide-on-single-page="false"
        @current-change="(currentPage)=>reqMessages(currentPage)"
        style="margin-left: 40%"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {RewYearTypeEnable,ChangeEnable} from '../api/types'
  export default {
    data(){
      return {
        fileLoding:false,
        files:[],
        enable:1,
        fileId:0,
        filePage:[],
        page:1,
        pageSize:17,
        type:5,
        enable:1,
        displayFileImg:false
      }
    },
    props:{
      reReq:{
      }
    },
    async mounted () {
      this.reqMessages(1)
      document.documentElement.onclick=(e)=>{     //点击其他的地方收起表情或者修改文字大小
        if($(e.target).attr('class')!='el-icon-download list_hover down_list')
          this.displayFileImg = false
      }
    },
    methods:{
      showP(e){
        $('#zp'+e).show()
      },
      hideP(e){
        $('#zp'+e).hide()
      },
      downloadFile(id){
        this.fileId = id
        this.displayFileImg = true
      },
      deleteFile(id){
        this.fileId = id
        this.$confirm('确定删除选中的文件吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          var result = await ChangeEnable(0,this.fileId)
          if(result.status==200){
            this.fileLoding = true
            this.reqMessages(1)
          }else{
            this.$message(
              {
                type: 'error',
                message: '删除失败，请重试',
                duration: 1000,
              }
            )
          }
        }).catch(() => {
          return false
        });
      },
      clickFile(id){
        this.fileId = id
        this.displayFileImg = true
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
      handleChange (file, fileList) {
        this.$emit('myUpload',file.raw)
      },
      beforeUpload (file) {
        return true
      },
      async reqMessages(page){
        this.fileLoding = true
        var result = await RewYearTypeEnable(this.enable,this.type,page,this.pageSize)
        if(result.status){
          if(result.status == 200){
            result = result.obj
            this.files = result.content
            this.filePage = result
          }
        }else{
          this.$message(
            {
              type: 'error',
              message: '暂时无法获取数据，请刷新重试',
              duration: 2000,
            }
          )
        }
        this.fileLoding = false
      }
    },
    watch:{
      reReq(newval){
        if(newval&&newval==this.type){
          this.reqMessages(1)
          this.$emit('noreReq',false)
        }
      }
    }
  }
</script>

<style scoped>
  .zhong_lists span,.list_type_name,.erweima{
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .zhong_lists{
    height: 40px;
    position: relative;
    border-bottom: 1px solid rgb(243,243,243);
  }
  .zhong_lists:hover,.list_type_name:hover{
    background-color: rgb(244,251,255);
  }
  .list_type_name{
    float: left;
    height: 40px;
    color: gray;
    cursor: pointer;
  }
  .main_list{
    height: 782px
  }
  .list_type_name1:after,.list_type_name1:before{
    display: table;
    content: '';
    clear: both;
  }
  .zhong_lists .list_name{
    font-size: 14px;
    margin-left: 10px;
    position: relative;
    cursor: pointer;
  }
  .zhong_lists .list_name:hover{
    color: rgb(64,158,254);
    text-decoration: underline;
  }
  .zhong_lists i{
    line-height: 40px;
    height: 40px;
    margin-left: 30px;
  }
</style>
