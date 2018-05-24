<template>
  <div id="index-page">
    <div class="page-body">
      <div class="page-bg">
        <img src="../assets/img/apm2@2x.png" />
      </div>

      <div class="page-content">
        <div class="select-p">
          <div class="input-p">
            <img src="../assets/img/btn.png" class="arrow"/>
            <select v-model="country" @change="changeCountry">
              <option value=''>国家</option>
              <option v-for="option in countryOptions" :value="option.id">
                {{ option.name }}
              </option>
            </select>
          </div>
          <div class="input-p">
            <img src="../assets/img/btn.png" class="arrow"/>
            <select v-model="city" @change="changeCity">
              <option value=''>城市</option>
              <option v-for="option in cityOptions" v-bind:value="option.id">
                {{ option.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="store-list">
          <div class="list-title">
            门店列表
          </div>
          <ul
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10">
            <li v-for="item in list">
              <img src="../assets/img/adres-icon@2x.png" class="address-icon" @click="openWxMap(item)"/>
              <div class="store-name" @click="openWxMap(item)">
                <span class="store-item-name">{{item.name}}</span>
                <span  class="store-distance" v-if="item.distance">{{item.distance}}公里</span>
              </div>
              <div class="address" @click="openWxMap(item)">
                {{item.address}}
              </div>
              <a :href="'tel://'+item.phone.replace(/[^0-9]/ig,'')">
                <div class="phone">
                  {{item.phone}}
                </div>
              </a>
            </li>
          </ul>
         <div class="no-more-data" v-show="noMore">加载完成</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { MessageBox} from 'mint-ui';
  import wx from 'weixin-js-sdk'
export default {
  name: 'Index',
  data () {
    return {
      country: '',
      city:'',
      countryOptions: [],
      cityOptions: [],
      loading:true,
      pageNum:1,
      list:[],
      latitude:'',
      longitude:'',
      noMore:false,
      canGetPosition:false,
    }
  },
  watch:{

  },
  mounted(){
    this.getWxConfig();
    this.getCountryOption();
    this.getCityOption();
  },
  methods:{
    getCountryOption(){
      let _this=this;
      this.$http.get('/apm-monaco/h5/shop/countryList').then(function(res){
        if (res.data&&res.data.length>0){
          _this.countryOptions=res.data;
        }
      }).catch(function(err){
        console.log(err)
      });
    },
    getCityOption(){
      let _this=this;
      let postUrl='';
      if(this.country===''){
        postUrl='/apm-monaco/h5/shop/cityList'
      }
      else {
        postUrl='/apm-monaco/h5/shop/cityList?countryId='+_this.country
      }
      this.$http.get(postUrl).then(function(res){
        if (res.data&&res.data.length>0){
          _this.cityOptions=res.data;
        }
      }).catch(function(err){
        console.log(err)
      });
    },
    loadMore(){
      this.loading = true;
      let param='';
      if(this.country===''&&this.city===''){
        param='pageNum='+this.pageNum+'&lat='+this.latitude+'&lng='+this.longitude
      }else if(this.country!==''&&this.city===''){
        param='countryId='+this.country+'&pageNum='+this.pageNum+'&lat='+this.latitude+'&lng='+this.longitude
      }else {
        param='cityId='+this.city+'&lat='+this.latitude+'&lng='+this.longitude+'&pageNum='+this.pageNum
      }
      let _this=this;
      this.$http.get('/apm-monaco/h5/shop/shopList?'+param).then(function(res){
        _this.pageNum++;
        if (res.data.list&&res.data.list.length>0){
          let storeList=res.data.list;
          _this.list=_this.list.concat(storeList);
        }
        _this.loading =res.data.end?true : false;
        _this.noMore =res.data.end?true : false;
      }).catch(function(err){
        console.log(err)
      });
    },
    changeCountry(){
      this.pageNum=1;
      this.list=[];
      this.city='';
      this.cityOptions=[];
      this.loadMore();
      this.getCityOption();
    },
    changeCity(){
      this.pageNum=1;
      this.list=[];
      this.loadMore();
    },
    getWxConfig(){
      let _this=this;
      debugger;
      this.$http.get('/apm-monaco/h5/config/authConfig').then(function(res){
        let data=res;
        debugger;
        wx.config({
          debug: false,
          appId: data.appId,
          timestamp: data.timestamp,
          nonceStr: data.nonceStr,
          signature: data.signature,
          jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'translateVoice',
            'startRecord',
            'stopRecord',
            'onVoiceRecordEnd',
            'playVoice',
            'onVoicePlayEnd',
            'pauseVoice',
            'stopVoice',
            'uploadVoice',
            'downloadVoice',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'getNetworkType',
            'openLocation',
            'getLocation',
            'hideOptionMenu',
            'showOptionMenu',
            'closeWindow',
            'scanQRCode',
            'chooseWXPay',
            'openProductSpecificView',
            'addCard',
            'chooseCard',
            'openCard'
          ]
        });
        console.log(wx.config);
        wx.error(function (res) {
          MessageBox({
            title: '提示',
            message: res.errMsg,
            confirmButtonClass: 'green-confirm-btn'
          });
        });
        /*_this.loading=false;*/
        wx.ready(function(){
          wx.onMenuShareTimeline({
            title: 'APM', // 分享标题
            desc: '分享描述', // 分享描述
            link: 'http://demo.code41.me/shop/', // 分享链接
            imgUrl: 'http://dev-1255936160.cos.ap-beijing.myqcloud.com/resources/test.jpg', // 分享图标
            success: function() {
            },
            cancel: function() {
            }
          });
          //微信分享菜单测试
          wx.onMenuShareAppMessage({
            title: 'APM', // 分享标题
            desc: '分享描述', // 分享描述
            link: 'http://demo.code41.me/shop/', // 分享链接
            imgUrl: 'http://dev-1255936160.cos.ap-beijing.myqcloud.com/resources/test.jpg', // 分享图标
            success: function() {
            },
            cancel: function() {
            }
          });

          wx.onMenuShareQQ({
            title: 'APM', // 分享标题
            desc: '分享描述', // 分享描述
            link: 'http://demo.code41.me/shop/', // 分享链接
            imgUrl: 'http://dev-1255936160.cos.ap-beijing.myqcloud.com/resources/test.jpg', // 分享图标
            success: function() {
            },
            cancel: function() {
            }
          });
          wx.onMenuShareWeibo({
            title: 'APM', // 分享标题
            desc: '分享描述', // 分享描述
            link: 'http://demo.code41.me/shop/', // 分享链接
            imgUrl: 'http://dev-1255936160.cos.ap-beijing.myqcloud.com/resources/test.jpg', // 分享图标
            success: function() {
            },
            cancel: function() {
            }
          });
          wx.onMenuShareQZone({
            title: 'APM', // 分享标题
            desc: '分享描述', // 分享描述
            link: 'http://demo.code41.me/shop/', // 分享链接
            imgUrl: 'http://dev-1255936160.cos.ap-beijing.myqcloud.com/resources/test.jpg', // 分享图标
            success: function() {
            },
            cancel: function() {
            }
          });

          wx.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
              _this.loading=false;
              _this.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
              _this.longitude = res.longitude ; // 经度，浮点数，范围为180 ~ -180。
            },
            cancel: function (res) {
              _this.loading=false;
              MessageBox({
                title: '提示',
                message: '您拒绝授权获取地理位置!',
                confirmButtonClass: 'green-confirm-btn'
              });
            }
          });
        });
      }).catch(function(err){
        console.log(err)
      });
    },
    openWxMap(item){
      debugger;
      console.log(item);
      wx.openLocation({
        latitude: parseFloat(item.latitude),
        longitude: parseFloat(item.longitude),
        name: item.name,
        address: item.address,
        scale: 14,
        infoUrl: 'http://weixin.qq.com'
      });
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  a{
    text-decoration: none;
  }
  #index-page{
    min-height: 100%;
    width: 7.5rem;
    margin: 0 auto;
    background-color: #061630;
    font-size: 0.28rem;
  }
  #index-page .page-body{
    background-color: #061630;
    position: relative;
    line-height: 0.5rem;
  }
  .page-body .page-bg{
   text-align: center;
    padding-top: 0.94rem;
  }
  .page-bg img{
    width: 1.72rem;
  }
  .page-body .page-content{
    position: relative;
    z-index: 99;
    color: #999;
  }
  .select-p{
    padding: 1rem 0.3rem 1.24rem;
    overflow: hidden;
  }
  .select-p .input-p:first-child{
    padding-right: 0.34rem;
  }
  .input-p{
    text-align: right;
    position: relative;
    float: left;
  }
  .input-p .arrow{
    height: 0.2rem;
    position: absolute;
    right: 0.56rem;
    top: 0.2rem;
  }
  select {
    /*Chrome和Firefox里面的边框是不一样的，所以复写了一下*/
    border: none;
    /*很关键：将默认的select选择框样式清除*/
    appearance:none;
    -moz-appearance:none;
    -webkit-appearance:none;
    line-height: 0.6rem;
    height: 0.6rem;
    padding: 0 0.46rem 0 0.24rem;
    font-size: 0.3rem;
    width: 3.28rem;
    color: #999;
    -moz-border-radius: 0;
    -webkit-border-radius: 0;
    border-radius: 0;
    background-color: #fff;
  }
  select::-webkit-input-placeholder{
    color: #999;
  }
    /*清除ie的默认选择框样式清除，隐藏下拉箭头*/
  select::-ms-expand { display: none; }
  #index-page .store-list{
    padding: 0 0.28rem 0.5rem 0.28rem;
  }
  .store-list .list-title{
    padding-left: 0.02rem;
    padding-bottom: 0.26rem;
  }
  ul,ul li{
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .page-content ul li{
    padding: 0.28rem 0.74rem 0.28rem 1.03rem;
    background-color: #fff;
    margin-bottom: 0.26rem;
    position: relative;
  }
  .page-content li .address-icon{
    width: 0.45rem;
    position: absolute;
    top: 0.28rem;
    left: 0.42rem;
  }
  .store-name{
    overflow: hidden;
    color: #061630;
    font-size: 0.3rem;
    line-height: 0.5rem;
  }
  .store-name .store-item-name{
    width: 3.55rem;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .store-name .store-distance{
    float: right;
    color: #666;
  }
  .address{
    padding: 0.18rem 0;
  }
  .phone{
    color: #001a4a;
  }
  .no-more-data{
    text-align: center;
  }
</style>
