<template>

	<div class="page-login" ref="loginId_id" id='loginId' :style="winSize">
		<!--新的login页面-->
		<div class="new_login">
			<div class="header">
				<img class="header_left" src="../../lib/img/loginImg/logo.png" alt="" v-if="logoPic === '临沂'"/>
				<img class="header_left" src="../../lib/img/loginImg/logo2.png" alt="" v-else-if="logoPic === '银川'"/>
				<img class="header_left" src="../../lib/img/loginImg/yuexi.png" height="59" width="417" alt="" v-else-if="logoPic === '越西'"/>
				<img class="header_left" src="../../lib/img/loginImg/logo3.png" height="59" width="332" alt="" v-else/>
				<img class="header_right" src="../../lib/img/loginImg/kh.png" alt="" />
			</div>

			<div class="content">
				<div class="login_form">
					<div class="form_content" v-loading="loading">
						<el-form id='loginform' label-position="left" label-width="0px" class="loginform demo-ruleForm card-box " :model='data' :rules="rule_data" ref='data'>
							<h1 class="title">安全登录</h1>
							<el-form-item prop='username'>
								<el-input class='userImg' type="text" auto-complete="off" placeholder="用户名" v-model='data.username' @keyup.native.enter="login('data')"></el-input>
							</el-form-item>
							<el-form-item prop='password'>
								<el-input class='pwdImg' type="password" auto-complete="off" placeholder="密码" v-model='data.password' @keyup.native.enter="login('data')"></el-input>
							</el-form-item>
							<el-form-item prop='verifiCode'>
								<el-input class="verifiImg" v-model="data.verifiCode" placeholder="请输入验证码" :maxlength="6" @keyup.enter.native="login('data')"></el-input>
								<div class="yzm">
									<img style="height: 40px;" :src="verifyCodeSRC" @click="refreshVerifyCode">
								</div>
							</el-form-item>
							<el-form-item>
								<el-button class='btn' type="primary" size='large' @click='login("data")'>登录</el-button>
							</el-form-item>
						</el-form>
					</div>
				</div>
			</div>
		</div>
		<ul class="biaoqian">
			<li></li>
			<li></li>
			<li></li>
		</ul>
		<div style='width: auto;height: 100px;'></div>
			<footer id='footer' style="line-height: 35px;">
				<span style="margin-top:10px;display: inline-block;">Copyright © 2019 成都九洲电子信息系统股份有限公司 蜀 ICP 编号09004242-1</span><br>
				<span>版本号：{{versionNumber}}</span>
			</footer>
		</div>
</template>

<script>
	import '../scss/login.scss'
	import local from '../local.js'
	import configs from '../configs.js'
	export default {
		name: 'login',
		data() {
			return {
				logoPic: '',
				city: '© 2018 成都九洲电子信息系统股份有限公司 蜀 ICP',
				versionNumber:'',
				winSize: {
					width: '',
					height: ''
				},
				verifyCodeSRC: ROOT_API + '/login/auth/code',
				data: {
					username: '',
					password: '',
					verifiCode: ''
				},

				rule_data: {
					username: [{
						required: true,
						message: '用户名不能为空！',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '密码不能为空！',
						trigger: 'blur'
					}],
				},
				loading: false
			}
		},
		computed: {
			company() {
				// return jz.Company_Name;
			}
		},
		methods: {
			register() {
				this.$router.push({ path: '/customerRegist' });
			},
			login(ref) {
				var vm = this
				this.$refs[ref].validate((valid) => {
					if(valid) {
						vm.loading = true
						console.log('000')
						$.ajax({
							type: "POST",
							url: configs.loginAPI,
							dataType: 'jsonp',
		                    jsonp: "callback",
		                    jsonpCallback:"flightHandler",
							data: {
								loginName: vm[ref].username,
								password: vm[ref].password,
								systemId: configs.sysID,
								flag: 1,
								authCode: vm[ref].verifiCode,
							},
							success: function(d) {
								vm.loading = false
								console.log(111)
		                        if(d.state === 0) {
		                        	console.log(222)
									local.set('userinfo', d.loginUser)
									local.set('token', d.token)
									local.set('navlist', d.menuItemLlist)
									local.set('sessionUser', d.sessionUser)
									local.set('loginname', vm[ref].username)
									vm.$router.push({name: 'index'})
								}else {
									console.log(333)
									vm.$message({type: 'error', message: d.msg});
									vm.refreshVerifyCode()
								}
		                    },
		                    error: function(req, error) {
		                    	vm.loading = false
		                    	console.log(444)
		                    	vm.$message({type: 'error', message: error});
		                    }
						})
// 						$.post(configs.loginAPI, {
// 							loginName: vm[ref].username,
// 							password: vm[ref].password,
// 							systemId: 4,
// 						})
// 						.then(function(d) {
// 							if(d.state === 0) {
// //									console.log(d)
// 								var menuItemLlist = d.menuItemLlist || []
// 								var buttonItemMap = d.buttonItemMap || {}
// 								var loginUser = d.loginUser || {}
// 								local.set('navlist', menuItemLlist)
// 								local.set('btnMap', buttonItemMap)
// 								local.set('userinfo', loginUser)
// 								local.set('token', d.token)
// 								vm.$router.push({ name: index });

// 							} else {

// 								vm.$message({ type: 'error', message: d.msg });  
// 							}
// 						})
// 						.fail(function() {
// 							vm.$message({ type: 'error', message: '接口异常' });  
// 						})
					}
				});
			},			
			refreshVerifyCode() {
				this.verifyCodeSRC = this.verifyCodeSRC + '?s=' + new Date().getTime()
			}
		},
		created() {
			
		},
		mounted() {
			if(configs.city === '银川' || configs.city === '农鲜汇') {
				this.city = '银川'
			}
			if(configs.city === '临沂') {
				this.city = '临沂'
			}
			if(configs.city === '银川') {
				this.logoPic = '银川'
			}
			if(configs.city === '农鲜汇') {
				this.logoPic = '农鲜汇'
			}
			if(configs.city === '临沂') {
				this.logoPic = '临沂'
			}
			if(configs.city === '越西') {
				this.logoPic = '越西'
			}
			var loginName = local.get('loginname')
			if(loginName != null) {
				Object.assign(this.data, {
					username: loginName
				})
			}
			this.refreshVerifyCode()
			var vm = this
			//版本号
			$.ajax({
					type: "POST",
					url: configs.rootAPI +'datadic/list',
					data:{
						key:'01',
						dataType:'SYSTEM_VERSION',
					},
					success: function(d) {
						vm.versionNumber = d.aaData[0].value
					}
				})
		
		},
		
	}
</script>