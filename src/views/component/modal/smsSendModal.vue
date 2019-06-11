<template>
	<el-dialog custom-class="jz-modal xs_ddglModal" :title="type === 'add' ? '短信添加' : '短信编辑'" :close-on-click-modal='false' :visible="modal" :before-close='beforeClose' :width="modalWidth">
		<el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="130px">
			<el-row>
        		<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
	    			<el-form-item label="昵称/手机号" prop="phoneNumber">
	    				<el-autocomplete
	    				  v-model="form.phoneNumber"
						  :fetch-suggestions="querySearchAsync"
						  placeholder="请输入内容"
						  @select="handleSelect"
						></el-autocomplete>
	    			</el-form-item>
	    		</el-col>
	    	</el-row>
	    	<el-row v-if="type === 'add'">
        		<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
	    			<el-form-item label="是否使用模板：">
	    				<el-radio-group v-model="isUseTemplate" @change="radioChange">
						    <el-radio :label="1">是</el-radio>
						    <el-radio :label="0">否</el-radio>
						</el-radio-group>
	    			</el-form-item>
	    		</el-col>
	    	</el-row>
	    	<el-row v-if="isUseTemplate && type === 'add'">
        		<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
	    			<el-form-item label="模板名称">
						<selectInput :value.sync='templateName' @selectChange='templateChange'>
				    		<el-option 
						    	v-for="item in smstemplateOptions" 
						    	:key="item.id" 
						    	:label="item.smsTitle" 
						    	:value="item.id">
			   				</el-option>
				    	</selectInput>
	    			</el-form-item>
	    		</el-col>
	    	</el-row>	    	
	    	<el-row>
        		<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
	    			<el-form-item label="短信内容：" prop="comment"  class="row-block" >
	    				<inputItem
	    					type='textarea'
	    					maxlength="150"
	    					:value.sync='form.comment'
	    					class="inputStyle"></inputItem>
	    			</el-form-item>
	    		</el-col>
	    	</el-row>
	    </el-form>  
		<div slot="footer" class="dialog-footer flex-x-end">
            <elBtn @click="cancel" text="取消"></elBtn>
            <elBtn @click="submit" text="提交" type="primary"></elBtn>
        </div>
	</el-dialog>
</template>

<script>
import mixin from '../../../mixin/mixin.js' //公共方法，包括主要的ajax
import local from '../../../local.js'
export default {
	mixins: [mixin],
	data(){
		var vm = this
		var ruleTemplateName = function(rule, value, callback) {
			if(vm.isUseTemplate && $.trim(value).length <= 0) {
				callback(new Error('模板名称不能为空'))
			}else {
				callback();
			}
		}
		var ruleComment = function(rule, value, callback) {
			if(!vm.isUseTemplate && $.trim(value).length <= 0) {
				callback(new Error('短信内容不能为空'))
			}else {
				callback();
			}
		}
		return{
			customerId: null,
			querySearch: '',
			isUseTemplate: 1,
			templateName: '',
			dataList:[],
			searchInput:'',
			pageSizes:[10,20,30],//40页的时候有问题
			textarea:'',
			channelFilterable:true,
			channelClearable:true,
			activeName:'first',
			templateComment:'',//显示模板的内容
			selectArr:[],
			datadicOptions:[],
			customerOptions:[],
			smstemplateOptions:[],
			merchantList:[],
			customerIdList:[],
			form:{
				phoneNumber: '',
				comment: ''
			},
			rules: {
				phoneNumber: [{required: true, message: '短信内容不能为空', trigger: 'blur'}, this._ruleExist()],
                comment: [{required: true, message: '短信内容不能为空', trigger: 'blur'}, this._ruleLength(500)]
            },
		}
	},
	props: {
		modal: {
			type: Boolean,
			default: false
		},
		messageRow:{
			default:function(){
				return {}
			},
		},
		type: {
			default:'add'
		}
	},
	mounted(){
		Object.assign(this.form, this.messageRow);
		console.log(this.form)
		if(this.type == 'add') {
			this.init()
		}		
	},
	methods:{
		init(){
			this.smstemplate()
		},
		//根据渠道id查询商户信息
		searchTable(val){
			
		},
		//模板名称
		smstemplate(){
			var user = local.get('sessionUser')
			this.customerId = user.typeCode
			var o = {}
			if(this.customerId) {
				o.createdPersonId = this.customerId
			}
			this._ajax({url:this.tootAPI,name:'smstemplate/list',param:o})
				.then((d)=>{
					this.smstemplateOptions = d.aaData
					if(this.smstemplateOptions.length > 0) {
						this.templateName = this.smstemplateOptions[0].id
						Object.assign(this.form, {
							comment: this.smstemplateOptions[0].comment
						})
					}					
				})
		},
		beforeClose(done) {
			this.$emit('close')
			done()
		},
		cancel(){
			this.$emit('close')
		},
		submit(){
			this.$refs['form'].validate((valid) => {
				if (valid) {
					if(this.type === 'add') {
						Object.assign(this.form, {
							sendStatus: 0,
							createdPersonId: this.customerId || 0
						})
						this._ajax({name:'sendsms/create',param: this.form})
							.then((function(d) {
								if(d.state === 0) {
									this.$message({ type: 'success', message: '操作成功' }); 
								}
								this.$emit('submit')
							}).bind(this))
					}else if(this.type === 'edit') {
						this._ajax({name:'sendsms/update',param: this.form})
							.then((function(d) {
								if(d.state === 0) {
									this.$message({ type: 'success', message: '操作成功' }); 
								}
								this.$emit('submit')
							}).bind(this))
					}
				}
			})
		},
		_ruleExist() {
			return {
				validator: (function(rule, value, callback) {
					let obj = {}
					obj[rule.field] = value
					this._ajax({name: 'customer/listByEqauls', param: {
						tel: $.trim(value)
					}})
					.then(function(d) {
						if(d.state === 0 && d.aaData && d.aaData.length > 0) {
							callback()
						}else {
							callback(new Error('该手机用户不存在'));
						}
					})
				}.bind(this)), trigger: 'submit'
			}
		},
		templateChange(val){
			this.smstemplateOptions.map((function(el){
				if(val==el.id){
					Object.assign(this.form, {
						comment: el.comment
					})
				}
			}).bind(this))
		},
		querySearchAsync(queryString, cb) {
			this._ajax({name: 'customer/queryLikeByTelorName', param: {
				queryString: queryString
			}})
			.then((function(d) {
				if(d.aaData.length > 0) {
					var arr = [], data = d.aaData
					data.forEach((function(el) {
						var o = {}
						var name = el.name || ''
						var tel = el.tel || ''
						var val = name + '(' + tel + ')'
						o = {
							value: val,
							tel: tel
						}
						arr.push(o)
					}).bind(this))
					cb(arr)
				}else {
					cb([])
				}
			}).bind(this))
      	},
      	handleSelect(item) {
      		console.log(item);
      		Object.assign(this.form, {
      			phoneNumber: item.tel
      		})
      	},
      	radioChange(val) {
      		console.log(val)
      		if(val == 0) {
      			Object.assign(this.form, {
					comment: ''
				})
      		}else {
      			if(this.smstemplateOptions.length > 0) {
					this.templateName = this.smstemplateOptions[0].id
					Object.assign(this.form, {
						comment: this.smstemplateOptions[0].comment
					})
				}
      		}
      	}
	},
}
</script>
<style scoped>
	
</style>
<style lang="sass">
	/*scoped表示  CSS 只作用于当前组件中的元素*/
	/*lang="sass"表示  可以使用sass写法*/
	.xs_ddglModal{
        .row-block{
            .el-form-item__content {
                width: calc(100% - 130px);
                &>div{
                    width: 100%;
                }
            }
        }
        .inputStyle{
			width:532px;
			white-space: normal;
            word-break: break-all;
		}
    }
</style>