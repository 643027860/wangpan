<template>
  <div class="rubbish">
    <div><p style="margin-left: 15px;margin-top: 20px;margin-bottom: 10px">回收站:</p></div>
    <div class="list_type_name1" style="border-bottom: 1px solid rgb(243,243,243);border-top: 1px solid rgb(243,243,243)">
      <div class="list_type_name" style="width: 60%"><span style="padding-left: 30px;display: inline-block;height: 40px;line-height: 40px">文件名</span></div>
      <div class="list_type_name" style="width: 10%"><span style="padding-left: 15px;display: inline-block;height: 40px;line-height: 40px">大小</span></div>
      <div class="list_type_name" style="width: 15%"><span style="padding-left: 15px;display: inline-block;height: 40px;line-height: 40px">上传日期</span></div>
      <div class="list_type_name" style="width: 15%"><span style="padding-left: 15px;display: inline-block;height: 40px;line-height: 40px">作者</span></div>
    </div>
    <div v-loading="rubbishLoding" class="main_list">
      <div v-if="!rubbishLoding">
        <div v-if="rubbishs.length>0">
          <div v-for="(rubbish,index) in rubbishs" :key="index">
            <li :id="'rubbish'+rubbish.id" class="rubbish_lists" @mouseover="()=>showP(rubbish.id)" @mouseout="()=>hideP(rubbish.id)">
              <i v-if="rubbish.fileType==1" class="el-icon-picture-outline" style="float: left;font-size: 26px!important;color: rgb(77,151,255);"/>
              <i v-if="rubbish.fileType==2" class="el-icon-video-camera" style="float: left;font-size: 26px!important;color: rgb(77,151,255);"/>
              <i v-if="rubbish.fileType==3" class="el-icon-headset" style="float: left;font-size: 26px!important;color: rgb(77,151,255);"/>
              <i v-if="rubbish.fileType==4" class="el-icon-document" style="float: left;font-size: 26px!important;color: rgb(77,151,255);"/>
              <i v-if="rubbish.fileType==5" class="el-icon-folder" style="float: left;font-size: 26px!important;color: rgb(77,151,255);"/>
              <i v-if="rubbish.fileType==6" class="el-icon-folder" style="float: left;font-size: 26px!important;color: rgb(77,151,255);"/>
              <i v-if="rubbish.fileType==7" class="el-icon-folder" style="float: left;font-size: 26px!important;color: rgb(77,151,255);"/>
              <span style="display: inline-block;width: 15%;float:right;font-size: 14px;margin-top: 13px;text-indent: 1em;overflow: hidden">{{rubbish.createBy}}</span>
              <span style="display: inline-block;width: 15%;float:right;font-size: 14px;margin-top: 13px;text-indent: 1em;overflow: hidden">{{rubbish.fileUrlTime.split("T")[0]}}</span>
              <span style="display: inline-block;width: 10%;float:right;font-size: 14px;margin-top: 13px;text-indent: 1em;overflow: hidden">{{countSize(rubbish.fileSize)}}</span>
              <span class="list_name" style="display: inline-block;width: 45%;margin-top: 13px;overflow: hidden" @click="()=>clickVideo(rubbish.id)">{{rubbish.fileRealName}}</span>
              <i :id="'rp'+rubbish.id" class="el-icon-refresh-left list_hover down_list" style="font-size: 20px!important;cursor: pointer;position: absolute;left: 52%;color: rgb(77,151,255);" v-show="false" @click="()=>reUpload(rubbish.id)"/>
            </li>
          </div>
        </div>
        <div v-else>
          <p style="margin:0;margin-top: 20%;margin-left: 38%;display: inline-block;font-size: 28px;">回收站为空</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {RewYearTypeEnable,ChangeEnable,ReqTypes} from '../api/types'
  export default {
    data(){
      return {
        rubbishLoding:false,
        rubbishs:[],
        rubbishId:0,
        status:false,
      }
    },
    async mounted () {
      this.rubbishLoding = true
      var types = await ReqTypes()
      var type = types.obj
      for(var i = 1;i<=type.length;i++){
        var result = await RewYearTypeEnable(0,i,1,10000)
        if(result.status){
          if(result.status == 200){
            result = result.obj
            result = result.content
            for(var j = 0;j<result.length;j++){
              this.rubbishs.push(result[j])
            }
            this.rubbishLoding = false
          }else{
            this.rubbishLoding = false
          }
        }else{
          this.rubbishLoding = false
        }
      }
    },
    methods:{
      showP(e){
        $('#rp'+e).show()
      },
      hideP(e){
        $('#rp'+e).hide()
      },
      reUpload(id){
        this.rubbishId = id
        this.$confirm('确定还原选中的文件吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          var result = await ChangeEnable(1,this.rubbishId)
          if(result.status==200){
            this.rubbishLoding = true
            this.rubbishs = []
            var types = await ReqTypes()
            var type = types.obj
            for(var i = 1;i<=type.length;i++){
              var result = await RewYearTypeEnable(0,i,1,10000)
              if(result.status)
                this.rubbishLoding = false
              else{
                this.rubbishLoding = false
                this.$message(
                  {
                    type: 'error',
                    message: '暂时无法获取数据，请刷新重试',
                    duration: 1000,
                  }
                )
              }
              if(result.status == 200){
                result = result.obj
                result = result.content
                for(var j = 0;j<result.length;j++){
                  this.rubbishs.push(result[j])
                }
              }
            }
            if($('li.rubbish_lists'))
              $('li.rubbish_lists').mouseover(function () { $('i:last', this).show() }).mouseout(function () { $('i:last', this).hide() })
          }else{
            this.$message(
              {
                type: 'error',
                message: '还原失败，请重试',
                duration: 1000,
              }
            )
          }
        }).catch(() => {
          return false
        });
      },
      clickVideo(id){
        this.rubbishId = id
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
    },
  }
</script>

<style scoped>
  .rubbish_lists span,.list_type_name{
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .rubbish_lists{
    height: 40px;
    position: relative;
    border-bottom: 1px solid rgb(243,243,243);
  }
  .rubbish_lists:hover,.list_type_name:hover{
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
  .rubbish_lists .list_name{
    font-size: 14px;
    margin-left: 10px;
    position: relative;
    cursor: pointer;
  }
  .rubbish_lists .list_name:hover{
    color: rgb(64,158,254);
    text-decoration: underline;
  }
  .rubbish_lists i{
    line-height: 40px;
    height: 40px;
    margin-left: 30px;
  }
</style>
