<template>
  <div class="text">
    <el-row style="padding-bottom: 10px;margin-left: 15px;margin-top: 10px">
      <el-upload
        class="upload-demo"
        action=""
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip"></div>
      </el-upload>
    </el-row>
    <div style="border-bottom: 1px solid rgb(243,243,243)"><p style="margin-left: 15px">全部文档:</p></div>
    <div class="list_type_name1" style="border-bottom: 1px solid rgb(243,243,243)">
      <div class="list_type_name" style="width: 60%"><span style="padding-left: 30px;display: inline-block;height: 40px;line-height: 40px">文件名</span></div>
      <div class="list_type_name" style="width: 10%"><span style="padding-left: 15px;display: inline-block;height: 40px;line-height: 40px">大小</span></div>
      <div class="list_type_name" style="width: 15%"><span style="padding-left: 15px;display: inline-block;height: 40px;line-height: 40px">上传日期</span></div>
      <div class="list_type_name" style="width: 15%"><span style="padding-left: 15px;display: inline-block;height: 40px;line-height: 40px">作者</span></div>
    </div>
    <div v-loading="TextLoding" class="main_list" style="height: 700px">
      <div v-if="displayTextImg" style="width: 350px;height:400px;background-color: rgba(0,0,0,0.6);position: absolute;z-index: 9999;left: 40%;top: 30%">
        <img :src="'http://47.112.132.177:8092/qrcode/createCommonQRCode?id='+TextId" alt=""  style="height: 300px;width: 300px;margin-left: 25px;margin-top: 25px">
        <span style="color: white;margin-left: 130px;margin-top: 15px;display: inline-block" class="erweima">扫码下载文件</span>
      </div>
      <div v-if="texts.length>0&&!TextLoding">
        <div v-for="(text,index) in texts" :key="index">
          <li :id="'text'+text.id" class="text_lists">
            <i class="el-icon-document" style="float: left;font-size: 26px!important;"/>
            <span style="display: inline-block;width: 15%;float:right;font-size: 14px;margin-top: 13px;text-indent: 1em;overflow: hidden">{{text.createBy}}</span>
            <span style="display: inline-block;width: 15%;float:right;font-size: 14px;margin-top: 13px;text-indent: 1em;overflow: hidden">{{text.fileUrlTime.split("T")[0]}}</span>
            <span style="display: inline-block;width: 10%;float:right;font-size: 14px;margin-top: 13px;text-indent: 1em;overflow: hidden">{{countSize(text.fileSize)}}</span>
            <span class="list_name" style="display: inline-block;width: 45%;margin-top: 13px;overflow: hidden" @click="()=>clickText(text.id)">{{text.fileRealName}}</span>
            <p style="display: inline-block;position: absolute;left: 50%;margin: 0">
              <i class="el-icon-download list_hover down_list" style="font-size: 20px!important;cursor: pointer;margin: 0px 10px;" @click="()=>downloadText(text.id)"/>
              <i class="el-icon-delete list_hover" style="font-size: 20px!important;cursor: pointer;margin: 0px 10px;" @click="()=>deleteText(text.id)"/>
            </p>
          </li>
        </div>
      </div>
      <div v-else>
        <h2 style="position: absolute;left: 45%;top: 48%">还未上传任何文本</h2>
      </div>
    </div>
    <div class="block" v-if="textPage">
      <el-pagination
        layout="prev, pager, next"
        :total="textPage.totalSize"
        :current-page="textPage.pageNum"
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
  export default {
    data(){
      return {
        TextLoding:false,
        texts:[],
        enable:1,
        TextId:0,
        fileList:[],
        textPage:[],
        page:1,
        year:2019,
        pageSize:17,
        type:4,
        enable:1,
        displayTextImg:false
      }
    },
    async mounted () {
      this.TextLoding = true
      var result = await RewYearTypeEnable(this.enable,this.type,this.year,this.page,this.pageSize)
      if(result.status)
        this.TextLoding = false
      if(result.status == 200){
        result = result.obj
        this.textPage = result
        this.texts = result.content
        $('.apply_lists').mouseover(()=>{
          console.log('ha')
        })
      }
      document.documentElement.onclick=(e)=>{     //点击其他的地方收起表情或者修改文字大小
        if($(e.target).attr('class')!='el-icon-download list_hover down_list')
          this.displayTextImg = false
      }
    },
    methods:{
      downloadText(id){
        this.TextId = id
        this.displayTextImg = true
      },
      deleteText(id){
        this.TextId = id
        this.$confirm('确定删除选中的文件吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          var result = await ChangeEnable(0,this.TextId)
          if(result.status==200){
            this.textLoding = true
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
      clickText(id){
        this.TextId = id
        this.displayTextImg = true
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
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
        var result = await RewYearTypeEnable(this.enable,this.type,this.year,page,this.pageSize)
        if(result.status){
          this.textLoding = false
          if(result.status == 200){
            result = result.obj
            this.texts = result.content
            this.textPage = result
          }
        }else{
          this.textLoding = false
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
  .text_lists span,.list_type_name,.erweima{
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .text_lists{
    height: 40px;
    position: relative;
    border-bottom: 1px solid rgb(243,243,243);
  }
  .text_lists:hover,.list_type_name:hover{
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
  .text_lists .list_name{
    font-size: 14px;
    margin-left: 10px;
    position: relative;
    top: -4px;
    cursor: pointer;
  }
  .text_lists .list_name:hover{
    color: rgb(64,158,254);
    text-decoration: underline;
  }
  .text_lists i{
    line-height: 40px;
    height: 40px;
    margin-left: 30px;
  }
</style>
