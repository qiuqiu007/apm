import router from './router'
import service from './request/service'
import { MessageBox} from 'mint-ui';
router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  service.get('/apm-monaco/h5/config/list').then(function(res){
    if(res){
      for(let i in res){
        sessionStorage.setItem(res[i].key,res[i].url);
      }
    }
    next();
  })
    .catch(function(err){
      console.log(err);
    });
})

router.afterEach(() => {

})
