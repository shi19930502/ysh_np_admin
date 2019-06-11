<template>
	<el-dialog custom-class="jz-modal" :title="userRoleModalType === 'add' ? '新增市场' : '市场编辑'" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
            <el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="80px">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="市场编码" prop="marketCode">
                            <inputItem :value.sync="form.marketCode" :disabled="userRoleModalType === 'edit'"></inputItem>
                        </el-form-item>
                    </el-col>
					
					<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
						<el-form-item label="市场名称" prop="marketName">
							<inputItem :value.sync="form.marketName"></inputItem>
						</el-form-item>
					</el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="所属渠道">
							<selectInput :value.sync="form.channelCode" @selectChange="channelChange">
								<el-option
										v-for="item in channelOptions"
										:key="item.code"
										:label="item.name"
										:value="item.code" >
									</el-option>
							</selectInput>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="是否启用" prop="enabled">
                            <switchItem :value.sync="form.enabled" :activeValue="1" :inactiveValue="0"></switchItem>
                        </el-form-item>
                    </el-col>
                </el-row>                          
            </el-form>              
            <div slot="footer" class="dialog-footer flex-x-end">
                <elBtn @click="cancel" text="取消"></elBtn>
                <elBtn @click="valideSubmit" text="提交" type="primary"></elBtn>
            </div>
        </el-dialog>
</template>
<script>
import mixin from '../../../mixin/mixin.js'
import local from '../../../local.js'
import configs from '../../../configs.js'
	export default {
        mixins: [mixin],
		data() {
			return {
				form: {
					marketCode:'',
					marketName:'',
					enabled:1,
					channelCode:''
                },
                rules: {
					marketCode:[this.regMarketZz(),this.regMarketCode()],
					marketName:[{required: true, message: '市场名称不能为空' }, this._ruleLength(10),this.regMarketName()],
					channelCode:[{required: true, message: '渠道不能为空' }, this._ruleLength(30)]
                },
                channelOptions:[]
			}
		},
		props: {
			modal: {
				default: false
			},
            userRoleModalType: {
                default: 'add'
            },
            userRole: {
                default: {}
            },
            defaultChecked: {
                default: function() {
                    return []
                }
            }
		},
		mounted() {
            Object.assign(this.form, this.userRole)     
			var vm=this;
			this._ajax({
				url:this.tootAPI,
				name:'channel/list',
				param:{enabled: '1'}
			}).then((d)=>{
				this.channelOptions=d.aaData
			})
		},
		methods: {  
			channelChange(key){
				let currVoucher = this.channelOptions.find((item) => {
						return item.code === key;
				});
				this.form.channelCode = key;
				this.form.channelName = currVoucher.name;
				console.log(this.form)
			},
			regMarketZz() {
				var vm = this;
				return {validator: function(rule, value, callback) {
					var val = $.trim(value);
					var re = /^[0-9]{9}$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/ 
				　　if (!re.test(val)) {
						callback(new Error('市场编码为9位数字'))
				　　}else{
						callback();
					}
				}, trigger: 'blur'}	
			},
			regMarketCode() {
				var vm = this;
				var oldCode = this.userRole.marketCode;
				return {validator: function(rule, value, callback) {
					var val = $.trim(value);
					if(val == oldCode){
						callback();
					}else{
						var method = '/market/list'
						vm._ajax({url: vm.rootAPI + method, param: {
							marketCode:val
						}})
						.then((function(d) {
							if(d.aaData.length > 0) {
								callback(new Error('该编码已经被使用,请重新输入'))
							}else {
								callback();
							}                        	
						}).bind(this))
					}
				}, trigger: 'blur'}	
			},
			regMarketName() {
				var vm = this;
				var oldName = this.userRole.marketName;
				return {validator: function(rule, value, callback) {
					var val = $.trim(value);
					if(val == oldName){
						callback();
					}else{
						var method = '/market/list'
							vm._ajax({url: vm.rootAPI + method, param: {
								marketName:val
							}})
							.then((function(d) {
								if(d.aaData.length > 0) {
									callback(new Error('该名称已经被使用,请重新输入'))
								}else {
									callback();
								}                        	
							}).bind(this))
					}
				}, trigger: 'blur'}	
			},
			cancel() {
				this.$emit('close')
			},
			valideSubmit() {
				var _this = this;
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        var o = {}, flag = true
                        Object.assign(o, _this.form)
                        var method = '/market/update'
                        if(_this.userRoleModalType === 'add') {  
                            method = '/market/create'
                            Object.assign(o, {
                                createPersonId: local.get('userinfo').userId
                            })    
                        }
                        _this._ajax({url: _this.rootAPI + method, param: o})
                        .then((function(d) {
                            if(d.state==0) {
                                _this.$message({ type: 'success', message: '操作成功' }); 
                                _this.$emit('submit')
                            }
                        }).bind(this))
                    }
                })
			},
            beforeClose(done) {
                this.cancel()
                done()
            },
		}
	}
</script>