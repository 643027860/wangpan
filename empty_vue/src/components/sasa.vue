<template>
  <div class="video">
    <el-row style="padding-bottom: 10px;padding-left: 15px;padding-top: 10px">
      <el-upload
        class="avatar-uploader"
        ref="upload"
        style="float: left"
        :show-file-list="false"
        action=""
        :before-upload="beforeUpload"
        :on-change="handleChange"
        :auto-upload="false"
      >
        <el-button size="small" type="primary" icon="el-icon-upload2" style="height: 30px;font-size: 16px;">上传</el-button>
      </el-upload>
      <div style="width: 50%;height: 60px;overflow: auto;border: 1px rgb(200,200,200) solid;border-radius: 5px;margin-left: 150px" v-if="showLists">
        <div class="list_type_name1" style="border-bottom: 1px solid rgb(243,243,243);">
          <div class="list_type_name" style="width: 40%"><span style="padding-left:10px;display: inline-block;height: 40px;line-height: 40px">文件名</span></div>
          <div class="list_type_name" style="width: 15%"><span style="display: inline-block;height: 40px;line-height: 40px">大小</span></div>
          <div class="list_type_name" style="width: 45%"><span style="display: inline-block;height: 40px;line-height: 40px">上传进度</span></div>
        </div>
        <div v-for="(list,index) in fileList" :key="index" class="my__lists__upload">
          <p style="margin:0;line-height:30px;height:30px;display: inline-block;width: 35%;margin-right:5%;overflow: hidden;float: left;padding:0 5% 0 10px">
            {{list.fileRealName}}
          </p>
          <p style="margin:0;line-height:30px;height:30px;display: inline-block;width: 15%">
            {{countSize(list.fileSize)}}
          </p>
          <div style="margin:0;width: 35%;display: inline-block;">
            <el-progress :text-inside="true" :stroke-width="15" :percentage="list.persent" :status="!list.stop?'success':'exception'"></el-progress>
          </div>
          <div style="width: 3%;margin-right:2%;display: inline-block;float: right;margin-top: 5px">
            <i class="el-icon-upload-success el-icon-circle-check" style="color: greenyellow" v-if="list.succeed&&!list.error"/>
            <i class="el-icon-refresh-right" style="color: deepskyblue" v-if="!list.succeed&&list.error"/>
            <i class="el-icon-close" style="color: black" @click="()=>cancel(index)" v-if="!list.succeed&&!list.error"/>
          </div>
        </div>
      </div>
    </el-row>
    <div><p style="margin-left: 15px">全部视频:</p></div>
    <div class="list_type_name1" style="border-bottom: 1px solid rgb(243,243,243)">
      <div class="list_type_name" style="width: 60%"><span style="padding-left: 30px;display: inline-block;height: 40px;line-height: 40px">文件名</span></div>
      <div class="list_type_name" style="width: 10%"><span style="padding-left: 15px;display: inline-block;height: 40px;line-height: 40px">大小</span></div>
      <div class="list_type_name" style="width: 15%"><span style="padding-left: 15px;display: inline-block;height: 40px;line-height: 40px">上传日期</span></div>
      <div class="list_type_name" style="width: 15%"><span style="padding-left: 15px;display: inline-block;height: 40px;line-height: 40px">作者</span></div>
    </div>
    <div v-if="displayVideoImg" style="width: 350px;height:400px;background-color: rgba(0,0,0,0.6);position: absolute;z-index: 9999;left: 40%;top: 30%">
      <div class="block">
        <el-image
          class="img"
          :src="'http://47.112.132.177:8092/qrcode/createCommonQRCode?id='+videoId"
          style="height: 300px;width: 300px;margin-left: 25px;margin-top: 25px"
        >
        </el-image>
        <span style="color: white;margin-left: 130px;margin-top: 15px;display: inline-block" class="erweima">扫码下载文件</span>
      </div>
    </div>
    <div v-loading="videoLoding" class="main_list" style="height: 700px">
      <div v-if="!videoLoding">
        <div v-if="videos.length>0">
          <div v-for="(video,index) in videos" :key="index" class="my_div">
            <li :id="'video'+video.id" class="video_lists" @mouseover="()=>showP(video.id)" @mouseout="()=>hideP(video.id)">
              <i class="el-icon-video-camera" style="float: left;font-size: 26px!important;color: rgb(77,151,255);"/>
              <span style="display: inline-block;width: 15%;float:right;font-size: 14px;margin-top: 13px;text-indent: 1em;overflow: hidden">{{video.createBy}}</span>
              <span style="display: inline-block;width: 15%;float:right;font-size: 14px;margin-top: 13px;text-indent: 1em;overflow: hidden">{{video.fileUrlTime.split("T")[0]}}</span>
              <span style="display: inline-block;width: 10%;float:right;font-size: 14px;margin-top: 13px;text-indent: 1em;overflow: hidden">{{countSize(video.fileSize)}}</span>
              <span class="list_name" style="display: inline-block;width: 45%;margin-top: 13px;overflow: hidden" @click="()=>clickVideo(video.id)">{{video.fileRealName}}</span>
              <span :id="'vp'+video.id" style="display: inline-block;position: absolute;left: 50%;margin: 0;" v-show="false">
                  <i class="el-icon-download list_hover down_list" style="font-size: 20px!important;cursor: pointer;margin: 0px 10px;color: rgb(77,151,255);" @click="()=>downloadVideo(video.id)"/>
                  <i class="el-icon-delete list_hover" style="font-size: 20px!important;cursor: pointer;margin: 0px 10px;color: rgb(77,151,255);" @click="()=>deleteVideo(video.id)"/>
                </span>
            </li>
          </div>
        </div>
        <div v-else>
          <h2 style="margin:0;margin-top: 20%;margin-left: 38%;display: inline-block">还未上传任何视频</h2>
        </div>
      </div>
    </div>
    <div class="block" v-if="videoPage">
      <el-pagination
        layout="prev, pager, next"
        :total="videoPage.totalSize"
        :current-page="videoPage.pageNum"
        :page-size="17"
        :hide-on-single-page="true"
        @current-change="(currentPage)=>reqMessages(currentPage)"
        style="margin-left: 40%"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {RewYearTypeEnable,ChangeEnable} from '../api/types'
  import axios from 'axios'
  export default {
    data(){
      return {
        videoLoding:false,
        videos:[],
        videoPage:[],
        videoId:0,
        displayVideoImg:false,
        showI:false,
        showLists:false,
        fileList: [],
        file:'',
        page:1,
        year:2020,
        pageSize:17,
        type:2,
        enable:1,
        sources:[],//用于取消上传的标志
      }
    },
    async mounted () {
      this.videoLoding = true
      var result = await RewYearTypeEnable(this.enable,this.type,this.year,this.page,this.pageSize)
      if(result.status)
        this.videoLoding = false
      if(result.status == 200){
        result = result.obj
        this.videoPage = result
        this.videos = result.content
      }
      document.documentElement.onclick=(e)=>{
        if($(e.target).attr('class')!='el-icon-download list_hover down_list')
          this.displayVideoImg = false
      }
    },
    methods:{
      showP(e){
        $('#vp'+e).show()
      },
      hideP(e){
        $('#vp'+e).hide()
      },
      cancel(index){
        if(this.sources[index]){//我先判断soucre是否存在，因为如果我打开弹框不作任何操作，点击取消按钮没有这一层判断的话，that.source.cancel('取消上传');会报错。
          this.sources[index].cancel('取消上传');//"取消上传"这几个字，会在上面catch（）的error中输出的，可以console看一下。
          this.fileList[index].stop = true
        }
      },
      downloadVideo(id){
        this.videoId = id
        this.displayVideoImg = true
      },
      deleteVideo(id){
        this.videoId = id
        console.log(this.videoId)
        this.$confirm('确定删除选中的文件吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          var result = await ChangeEnable(0,this.videoId)
          if(result.status==200){
            this.videoLoding = true
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
      clickVideo(id){
        this.videoId = id
        this.displayVideoImg = true
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
        var url = URL.createObjectURL(file.raw)
        this.file = file.raw
        var file = this.file
        this.showLists = true
        this.fileList.push(
          {
            fileRealName:file.name,
            fileSize:file.size,
            persent:0,
            succeed:false,
            stop:false,
            error:false
          }
        )
        var index = this.fileList
        this.go(index.length-1)
      },
      beforeUpload (file) {
        return true
      },
      go (index) {
        let self = this
        let cancelToken = axios.CancelToken;
        this.sources.push(cancelToken.source())
        let param = new FormData(); //创建form对象，私有，无法直接获取，只能通过get来查看其中的元素
        param.append('uploadFile',this.file)
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
              this.videoLoding = true
              setTimeout(()=>{
                this.reqMessages(1)
              },10)
            }else{
              self.fileList[index].stop = true
              self.fileList[index].error = true
              this.videoLoding = false
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
      async reqMessages(page){
        var result = await RewYearTypeEnable(this.enable,this.type,this.year,page,this.pageSize)
        if(result.status){
          this.videoLoding = false
          if(result.status == 200){
            result = result.obj
            this.videos = result.content
            this.videoPage = result
          }
        }else{
          this.videoLoding = false
          this.$message(
            {
              type: 'error',
              message: '暂时无法获取数据，请刷新重试',
              duration: 1000,
            }
          )
        }
      }
    },
  }
</script>

<style scoped>
  .video_lists span,.list_type_name,.erweima,.my__lists__upload{
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .my__lists__upload{
    width: 100%;
    height: 30px;
    border-bottom: 1px rgb(243,243,243) solid;
  }
  .my__lists__upload:hover{
    background-color: rgb(244,251,255);
  }
  .video_lists{
    height: 40px;
    position: relative;
    border-bottom: 1px solid rgb(243,243,243);
  }
  .video_lists:hover,.list_type_name:hover{
    background-color: rgb(244,251,255);
  }
  .main_list{
    height: 782px
  }
  .list_type_name{
    float: left;
    height: 40px;
    color: gray;
    cursor: pointer;
  }
  .list_type_name1:after,.list_type_name1:before{
    display: table;
    content: '';
    clear: both;
  }
  .video_lists .list_name{
    font-size: 14px;
    margin-left: 10px;
    position: relative;
    top: -4px;
    cursor: pointer;
  }
  .video_lists .list_name:hover{
    color: rgb(64,158,254);
    text-decoration: underline;
  }
  .video_lists i{
    line-height: 40px;
    height: 40px;
    margin-left: 30px;
  }
</style>
