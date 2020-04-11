<template>
  <div class="music">
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
    <div style="border-bottom: 1px solid rgb(243,243,243)"><p style="margin-left: 15px;margin-bottom: 10px">全部音频:</p></div>
    <div class="list_type_name1" style="border-bottom: 1px solid rgb(243,243,243)">
      <div class="list_type_name" style="width: 60%"><span style="padding-left: 30px;display: inline-block;height: 40px;line-height: 40px">文件名</span></div>
      <div class="list_type_name" style="width: 10%"><span style="padding-left: 15px;display: inline-block;height: 40px;line-height: 40px">大小</span></div>
      <div class="list_type_name" style="width: 15%"><span style="padding-left: 15px;display: inline-block;height: 40px;line-height: 40px">上传日期</span></div>
      <div class="list_type_name" style="width: 15%"><span style="padding-left: 15px;display: inline-block;height: 40px;line-height: 40px">作者</span></div>
    </div>
    <div v-if="displayMusicImg" style="width: 350px;height:400px;background-color: rgba(0,0,0,0.6);position: absolute;z-index: 9999;left: 40%;top: 30%">
      <div class="block">
        <el-image
          class="img"
          :src="'http://47.112.132.177:8092/qrcode/createCommonQRCode?id='+musicId"
          style="height: 300px;width: 300px;margin-left: 25px;margin-top: 25px"
        >
        </el-image>
        <span style="color: white;margin-left: 130px;margin-top: 15px;display: inline-block" class="erweima">扫码下载文件</span>
      </div>
    </div>
    <div v-loading="musicLoding" style="height: 700px" class="main_list">
      <div v-if="!musicLoding">
        <div v-if="musics.length>0">
          <div v-for="(music,index) in musics" :key="index">
            <li :id="'music'+music.id" class="music_lists" @mouseover="()=>showP(music.id)" @mouseout="()=>hideP(music.id)">
              <i class="el-icon-headset" style="float: left;font-size: 26px!important;color: rgb(77,151,255);"/>
              <span style="display: inline-block;width: 15%;float:right;font-size: 14px;margin-top: 13px;text-indent: 1em;overflow: hidden">{{music.createBy}}</span>
              <span style="display: inline-block;width: 15%;float:right;font-size: 14px;margin-top: 13px;text-indent: 1em;overflow: hidden">{{music.fileUrlTime.split("T")[0]}}</span>
              <span style="display: inline-block;width: 10%;float:right;font-size: 14px;margin-top: 13px;text-indent: 1em;overflow: hidden">{{countSize(music.fileSize)}}</span>
              <span class="list_name" style="display: inline-block;width: 45%;margin-top: 13px;overflow: hidden" @click="()=>clickMusic(music.id)">{{music.fileRealName}}</span>
              <span :id="'mp'+music.id" style="display: inline-block;position: absolute;left: 50%;margin: 0;" v-show="false">
                <i class="el-icon-download list_hover down_list" style="font-size: 20px!important;cursor: pointer;margin: 0px 10px;color: rgb(77,151,255);" @click="()=>downloadMusic(music.id)"/>
                <i class="el-icon-delete list_hover" style="font-size: 20px!important;cursor: pointer;margin: 0px 10px;color: rgb(77,151,255);" @click="()=>deleteMusic(music.id)"/>
              </span>
            </li>
          </div>
        </div>
        <div v-else>
          <p style="margin:0;margin-top: 20%;margin-left: 38%;display: inline-block;font-size: 28px;">还未上传任何音乐</p>
        </div>
      </div>
    </div>
    <div class="block" v-if="musicPage">
      <el-pagination
        layout="prev, pager, next"
        :total="musicPage.totalSize"
        :current-page="musicPage.pageNum"
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
        musics:[],
        musicPage:[],
        enable:1,
        musicId:0,
        musicLoding:false,
        page:1,
        pageSize:17,
        type:4,
        enable:1,
        displayMusicImg:false
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
          this.displayMusicImg = false
      }
    },
    methods:{
      showP(e){
        $('#mp'+e).show()
      },
      hideP(e){
        $('#mp'+e).hide()
      },
      downloadMusic(id){
        this.musicId = id
        this.displayMusicImg = true
      },
      deleteMusic(id){
        this.musicId = id
        this.$confirm('确定删除选中的文件吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          var result = await ChangeEnable(0,this.musicId)
          if(result.status==200){
            this.musicLoding = true
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
      clickMusic(id){
        this.musicId = id
        this.displayMusicImg = true
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
      async reqMessages(page){
        this.musicLoding = true
        var result = await RewYearTypeEnable(this.enable,this.type,page,this.pageSize)
        if(result.status){
          if(result.status == 200){
            result = result.obj
            this.musics = result.content
            this.musicPage = result
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
        this.musicLoding = false
      },
      handleChange (file, fileList) {
        this.$emit('myUpload',file.raw)
      },
      beforeUpload (file) {
        return true
      },
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
  .music_lists span,.list_type_name,.erweima{
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .music_lists{
    height: 40px;
    position: relative;
    border-bottom: 1px solid rgb(243,243,243);
  }
  .music_lists:hover,.list_type_name:hover{
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
  .music_lists .list_name{
    font-size: 14px;
    margin-left: 10px;
    position: relative;
    cursor: pointer;
  }
  .music_lists .list_name:hover{
    color: rgb(64,158,254);
    text-decoration: underline;
  }
  .music_lists i{
    line-height: 40px;
    height: 40px;
    margin-left: 30px;
  }
</style>
