<template>
  <div id="index-page">
    <div class="page-body">
      <div class="page-bg">
        <img src="../assets/img/apm2@2x.png" />
      </div>

      <div class="page-content">
        <div class="nearby-p">
          <img src="../assets/img/nearby-btn.png" @click.stop="nearShop"/>
        </div>
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
              <router-link tag="div"  :to="'/detail/'+item.id">
                <div class="store-name">
                  <span class="store-item-name">{{item.name}}</span>
                  <!--<span  class="store-distance">50.68公里</span>-->
                  <span  class="store-distance" v-if="item.distance">{{item.distance}}公里</span>
                </div>
                <div class="o-hidden address-p">
                  <div class="address">
                    {{item.address}}
                  </div>
                  <div class="icon-phon-address">
                    <span @click.stop="openPhone(item)">
                      <img src="../assets/img/phone.png" class="address-icon" />
                    </span>
                    <img src="../assets/img/adres-icon@2x.png" class="address-icon" @click.stop="openWxMap(item)"/>
                  </div>
                </div>
              </router-link>
            </li>
          </ul>
         <div class="no-more-data" v-show="noMore">加载完成</div>
          <div class="no-data" v-show="noData">该城市暂无门店</div>
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
      noData:false,
      canGetPosition:false,
      configUrl:'https://www.code41.me/shop/'
    }
  },
  watch:{

  },
  mounted(){
    if(sessionStorage.getItem('shopCountryId')){
      this.country=sessionStorage.getItem('shopCountryId')
    }
    if(sessionStorage.getItem('shopCityId')){
      this.city=sessionStorage.getItem('shopCityId')
    }
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
        param='pageNum='+this.pageNum+'&lat='+this.latitude+'&lng='+this.longitude+'&pageSize=10'
      }else if(this.country!==''&&this.city===''){
        param='countryId='+this.country+'&pageNum='+this.pageNum+'&lat='+this.latitude+'&lng='+this.longitude+'&pageSize=10'
      }else {
        param='cityId='+this.city+'&lat='+this.latitude+'&lng='+this.longitude+'&pageNum='+this.pageNum+'&pageSize=10'
      }
      this.getDataList(param)
    },
    nearShop(){
      if(this.latitude&&this.longitude){
        this.pageNum=1;
        this.list=[];
        this.country='';
        this.city='';
        let param='pageNum='+this.pageNum+'&lat='+this.latitude+'&lng='+this.longitude+'&nearShop=1';
        this.getDataList(param);
        this.getCityOption();
      }
    },
    getDataList(param){
      sessionStorage.setItem('shopCountryId',this.country);
      sessionStorage.setItem('shopCityId',this.city);
      let _this=this;
      this.$http.get('/apm-monaco/h5/shop/shopList?'+param).then(function(res){
        _this.pageNum++;
        if (res.data.list&&res.data.list.length>0){
          let storeList=res.data.list;
          _this.list=_this.list.concat(storeList);
        }
        _this.loading =res.data.end?true : false;
        if(_this.list.length===0){
          _this.noMore=false;
          _this.noData=true;
        }
        else {
          _this.noData=false;
          _this.noMore =res.data.end?true : false;
        }
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
      let ua = navigator.userAgent.toLowerCase();
      let isWeixin = ua.indexOf('micromessenger') != -1;
      if (isWeixin) {
        this.$http.get('/apm-monaco/h5/config/authConfig').then(function(res){
          let data=res;
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
            //微信分享
            let shareImg=sessionStorage.getItem('shoplist_share_img');
            let shareDesc=sessionStorage.getItem('shoplist_share_desc');
            let shareTitle=sessionStorage.getItem('shoplist_share_title');
            if(shareImg&&shareDesc&&shareTitle){
              wx.onMenuShareTimeline({
                title: shareTitle, // 分享标题
                desc: shareDesc, // 分享描述
                link:_this.configUrl, // 分享链接
                imgUrl: shareImg, // 分享图标
                success: function() {
                },
                cancel: function() {
                }
              });
              wx.onMenuShareAppMessage({
                title: shareTitle, // 分享标题
                desc: shareDesc, // 分享描述
                link:_this.configUrl, // 分享链接
                imgUrl: shareImg, // 分享图标
                success: function() {
                },
                cancel: function() {
                }
              });
              wx.onMenuShareQQ({
                title: shareTitle, // 分享标题
                desc: shareDesc, // 分享描述
                link:_this.configUrl, // 分享链接
                imgUrl: shareImg, // 分享图标
                success: function() {
                },
                cancel: function() {
                }
              });
              wx.onMenuShareWeibo({
                title: shareTitle, // 分享标题
                desc: shareDesc, // 分享描述
                link:_this.configUrl, // 分享链接
                imgUrl: shareImg, // 分享图标
                success: function() {
                },
                cancel: function() {
                }
              });
              wx.onMenuShareQZone({
                title: shareTitle, // 分享标题
                desc: shareDesc, // 分享描述
                link:_this.configUrl, // 分享链接
                imgUrl: shareImg, // 分享图标
                success: function() {
                },
                cancel: function() {
                }
              });
            }
          });
        }).catch(function(err){
          console.log(err)
        });
      }else{
        _this.loading=false;
      }
    },
    openPhone(item){
      window.location.href='tel://'+item.phone.replace(/[^0-9]/ig,'');
    },
    openWxMap(item){
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
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
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
  .nearby-p{
    padding: 1.24rem 0.3rem 0.4rem;
  }
  .nearby-p img{
    width: 100%;
  }
  .select-p{
    padding: 0 0.3rem 1.24rem;
    overflow: hidden;
  }
  .select-p .input-p:first-child{
  }
  .input-p{
    text-align: right;
    position: relative;
    float: left;
  }
  .select-p .input-p:last-child{
    float: right;
  }
  .input-p .arrow{
    height: 0.2rem;
    position: absolute;
    right: 0.1rem;
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
  .page-content ul li{
    padding: 0.28rem 0.38rem;
    background-color: #fff;
    margin-bottom: 0.26rem;
    position: relative;
  }
  .store-name{
    overflow: hidden;
    color: #061630;
    font-size: 0.3rem;
    line-height: 0.5rem;
  }
  .store-name .store-item-name{
    width: 3.95rem;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .store-name .store-distance{
    float: right;
    color: #666;
  }
  .address-p{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .address{
    padding: 0.18rem 0;
    width: 4.8rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .icon-phon-address{
    width: 1.3rem;
    text-align: right;
  }
  .icon-phon-address .address-icon{
    height: 0.42rem;
  }
  .phone{
    color: #001a4a;
  }
  .no-more-data,.no-data{
    text-align: center;
  }
  .no-data{
    padding-top: 2rem;
  }
</style>
