<template>
  <div id="index-page">
    <div class="page-body">
      <div class="page-bg">
        <img src="../assets/img/apm@2x.png" />
      </div>

      <div class="page-content">
        <div class="select-p">
          <div class="input-p">
            <img src="../assets/img/btn.png" class="arrow"/>
            <select v-model="country" @change="changeStore" placeholder="国家">
              <option v-for="option in options" v-bind:value="option.id">
                {{ option.name }}
              </option>
            </select>
          </div>
          <div class="input-p">
            <img src="../assets/img/btn.png" class="arrow"/>
            <select v-model="city" @change="changeStore" placeholder="城市">
              <option value='' disabled  style='display:none;'>城市</option>
              <option v-for="option in options" v-bind:value="option.id">
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
              <img src="../assets/img/adres-icon@2x.png" class="address-icon"/>
              <div class="store-name">
                <span class="store-item-name">{{item.name}}</span>
                <span  class="store-distance">13.5公里</span>
              </div>
              <div class="address">
                {{item.address}}
              </div>
              <div class="phone">
                <a :href="'wtai://wp//mc;'+item.phone.replace(/[^0-9]/ig,'')">{{item.phone}}</a>
              </div>
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
export default {
  name: 'Index',
  data () {
    return {
      country: '-1',
      city:'',
      options: [],
      loading:true,
      pageNum:1,
      list:[],
      noMore:false
    }
  },
  watch:{

  },
  mounted(){
    this.getOption();
    this.loading=false;
  },
  methods:{
    getOption(){
      let _this=this;
      this.$http.get('/apm-monaco/h5/shop/cityList').then(function(res){
        if (res.data&&res.data.length>0){
          _this.options=res.data;
        }
        let option={
          id: "-1",
          name: "所有店铺"
        };
        _this.options.unshift(option);
      }).catch(function(err){
        console.log(err)
      });
    },
    loadMore(){
      this.loading = true;
      let param='';
      if(this.country=='-1'){
        param='pageNum='+this.pageNum
      }else {
        param='cityId='+this.country+'&pageNum='+this.pageNum
      }
      let _this=this;
      this.$http.get('/apm-monaco/h5/shop/shopList?'+param).then(function(res){
        _this.pageNum++;
        if (res.data.list&&res.data.list.length>0){
          let storeList=res.data.list;
          for(let i=0;i<storeList.length;i++){
            _this.list.push(storeList[i]);
          }
        }
        _this.loading =res.data.end?true : false;
        _this.noMore =res.data.end?true : false;
      }).catch(function(err){
        console.log(err)
      });
    },
    changeStore(){
      console.log(this.country);
      this.pageNum=1;
      this.list=[];
      this.loadMore();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
    width: 3.85rem;
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
