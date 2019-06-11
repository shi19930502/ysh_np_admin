import Vue from 'vue'
//引入Vuex
import Vuex from 'vuex'
Vue.use(Vuex)
//引入VueRouter
import VueRouter from "vue-router"
Vue.use(VueRouter)
// ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css';
Vue.use(ElementUI, { size: 'mini' })
// 自定义样式
import './scss/custom.scss'
import './scss/overwrite.scss'
// 语法插件
import 'babel-polyfill'
// 自定义组件
import components from './components/index.js'
Vue.use(components)

//图片查看 放大缩小
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer);
Viewer.setDefaults({
    Options: {"inline": true, "button": true, "navbar": true, "title": true, "toolbar": true, "tooltip": true, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source" ,"zIndexInline": 3000}
});

//路由、全局状态
import routes from './router.js';
import stores from './store.js';
const router = new VueRouter({routes})
const store = new Vuex.Store(stores)
import local from './local.js'
// 全局路由拦截
router.beforeEach((to, from, next) => {
    NProgress.start();
    window.scroll(0, 0);
    var user = local.get('userinfo')
    var navlist = local.get('navlist')
    if(!user || !user.loginName) {    
        if(to.path !== '/login' && to.path !== '/customerRegist') {
            NProgress.done();
            next('/login');   
        }else {
            next()        
        }
    }else{     
        if(to.name !== 'login' && to.name !== 'customerRegist' && to.name !== 'index' && !to.meta.modal) { 
            forNavList(navlist, to.name, next)          
        }else {
            next()
        }
    }
});
router.afterEach(transition => {
    NProgress.done();
});
// 标签名
var title = '商家系统管理后台'
document.title = title

// 解决前端计算精度问题
Number.prototype.add = function (arg) {
    return accAdd(this, arg);
};
Number.prototype.sub = function (arg) {
    return accSub(this, arg);
};
Number.prototype.mul = function (arg) {
    return accMul(this, arg);
};
Number.prototype.div = function (arg) {
    return accDiv(this, arg);
};

String.prototype.add = function (arg) {
    return accAdd(this, arg);
};
String.prototype.sub = function (arg) {
    return accSub(this, arg);
};
String.prototype.mul = function (arg) {
    return accMul(this, arg);
};
String.prototype.div = function (arg) {
    return accDiv(this, arg);
};
// toFixed兼容方法
Number.prototype.toFixed = function (n) {
    if (n > 20 || n < 0) {
        throw new RangeError('toFixed() digits argument must be between 0 and 20');
    }
    const number = this;
    if (isNaN(number) || number >= Math.pow(10, 21)) {
        return number.toString();
    }
    if (typeof (n) == 'undefined' || n == 0) {
        return (Math.round(number)).toString();
    }

    let result = number.toString();
    const arr = result.split('.');

    // 整数的情况
    if (arr.length < 2) {
        result += '.';
        for (let i = 0; i < n; i += 1) {
            result += '0';
        }
        return result;
    }

    const integer = arr[0];
    const decimal = arr[1];
    if (decimal.length == n) {
        return result;
    }
    if (decimal.length < n) {
        for (let i = 0; i < n - decimal.length; i += 1) {
            result += '0';
        }
        return result;
    }
    result = integer + '.' + decimal.substr(0, n);
    const last = decimal.substr(n, 1);

    // 四舍五入，转换为整数再处理，避免浮点数精度的损失
    if (parseInt(last, 10) >= 5) {
        const x = Math.pow(10, n);
        result = (Math.round((parseFloat(result) * x)) + 1) / x;
        result = result.toFixed(n);
    }

    return result;
};
// render
import App from './App.vue'
const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


function accAdd(arg1, arg2) {
    if(!arg1) {
        arg1 = 0
    }
    if(!arg2) {
        arg2 = 0
    }
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}
function accSub(arg1, arg2) {
    if(!arg1) {
        arg1 = 0
    }
    if(!arg2) {
        arg2 = 0
    }
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return (arg1 * m - arg2 * m) / m
}
function accMul(arg1, arg2) {
    if(!arg1 || !arg2) {
        return 0
    }
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}
function accDiv(arg1, arg2) {
    if(!arg1 || !arg2) {
        return 0
    }
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    r1 = Number(arg1.toString().replace(".", ""));
    r2 = Number(arg2.toString().replace(".", ""));
    return (r1 / r2) * Math.pow(10, t2 - t1);
}

function forNavList(navlist, name, next) {
    navlist.forEach(function(el) {
        if(el.caption == name) {
            next()
        }else {
            if(el.hasChildren === 1) {
                forNavList(el.children, name, next)
            }
        }
    })
}












