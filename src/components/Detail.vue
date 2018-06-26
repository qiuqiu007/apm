<template>
  <div id="datail-page">
    <div class="shop-cover">
      <img :src="shopCover"/>
    </div>
    <div class="shop-title">{{shopInf.name}}</div>
    <div class="shop-inf">
      <ul>
        <li @click.stop="openWxMap">
          <img src="../assets/img/adres-icon@2x.png" class="shop-icon" />
          <span v-html="shopInf.address"></span>
          <img src="../assets/img/more.png" class="arrow-icon" />
        </li>
        <li @click.stop="openPhone">
          <img src="../assets/img/phone.png" class="shop-icon" />
          <span v-html="shopInf.phone"></span>
          <img src="../assets/img/more.png" class="arrow-icon" />
        </li>
        <li v-if="(shopInf.businessHours&&shopInf.businessHours!='')">
          <img src="../assets/img/time3.png" class="shop-icon" />
          <span v-html="shopInf.businessHours"></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { MessageBox} from 'mint-ui';
  import wx from 'weixin-js-sdk'
  export default {
    name: 'Detail',
    data () {
      return {
        id:'',
        shopCover:'',
        shopInf:{},
        configUrl:'https://www.code41.me/shop/'
      }
    },
    watch:{

    },
    mounted(){
      this.id=this.$route.params.id;
      this.getWxConfig();
      this.getInfDetail();
    },
    methods:{
      getInfDetail(){
        console.log(this.id);
        let _this=this;
        this.$http.get('/apm-monaco/h5/shop/detail?id='+_this.id).then(function(res){
          let data=res.data;
          _this.shopCover=data.shopCover;
          _this.shopInf=data;
         console.log(res)
        }).catch(function(err){
          console.log(err)
        });
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
            wx.ready(function(){
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
        }
      },
      openPhone(){
        let item=this.shopInf;
        window.location.href='tel://'+item.phone.replace(/[^0-9]/ig,'');
      },
      openWxMap(){
        let item=this.shopInf;
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
  #datail-page{
    padding: 0.34rem 0.28rem;
  }
  .shop-cover img{
    width: 100%;
    padding-bottom: 0.55rem;
  }
  .shop-title{
    color: #061630;
    font-size: 0.35rem;
    line-height: 0.71rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .shop-inf{
    font-size: 0.28rem;
    color: #999;
  }
  .shop-inf li{
    padding: 0.2rem 0.54rem;
    line-height: 0.4rem;
    position: relative;
  }
  .shop-inf .shop-icon{
    width: 0.4rem;
    position: absolute;
    top: 0.2rem;
    left: 0;
  }
  .shop-inf .arrow-icon{
    width: 0.4rem;
    position: absolute;
    top: 0.2rem;
    right: 0;
  }
</style>
