<template>
	<el-dialog custom-class="jz-modal xs_ddglModal" :title="modalTitle" :close-on-click-modal='false' :visible="modal" :before-close='beforeClose' :width="modalWidth">
		<el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="130px">
	    	<el-row>
        		<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
	    			<el-form-item label="渠道" prop="channelCode">
						<selectInput 
							:value.sync='form.channelCode'
							:clearable='channelClearable'
						    :filterable='channelFilterable'
						    :disabled='lookup'
						    @selectChange='searchTable(form.channelCode)'>
					    		<el-option 
							    	v-for="item in channelOptions" 
							    	:key="item.code" 
							    	:label="item.name" 
							    	:value="item.code">
				   				</el-option>
				    	</selectInput>
	    			</el-form-item>
	    		</el-col>
	    		<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
	    			<el-form-item label="通知类型" prop="smsType">
						<selectInput 
							:clearable='channelClearable'
						    :filterable='channelFilterable' 
						    :value.sync='form.smsType' 
						    :disabled='lookup'
						    @selectChange='datadicChange'>
				    		<el-option 
						    	v-for="item in datadicOptions" 
						    	:key="item.key" 
						    	:label="item.value" 
						    	:value="item.key">
			   				</el-option>
				    	</selectInput>
	    			</el-form-item>
	    		</el-col>
	    	</el-row>
	    	<el-row>
        		<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
	    			<el-form-item label="模板名称" prop="templateName">
						<selectInput :value.sync='form.templateName' @selectChange='templateChange' :disabled='lookup'>
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
	    			<el-form-item label="是否使用模板：" prop="nickName">
	    				<el-radio-group v-model="form.isUseTemplate" :disabled='lookup'>
						    <el-radio :label="1">是</el-radio>
						    <el-radio :label="0">否</el-radio>
						</el-radio-group>
	    			</el-form-item>
	    		</el-col>
	    	</el-row>
	    	<el-row>
        		<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
	    			<el-form-item label="模板内容：" class="row-block">
	    				<inputItem
	    					type='textarea'
	    					:disabled='true'
	    					:value.sync='templateComment' 
	    					class="inputStyle">
	    				</inputItem>
	    			</el-form-item>
	    		</el-col>
	    	</el-row>
	    	<el-row>
        		<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
	    			<el-form-item label="短信内容：" prop="comment"  class="row-block" >
	    				<inputItem
	    					type='textarea'
	    					:disabled='lookup'
	    					maxlength="150"
	    					:value.sync='form.comment'
	    					class="inputStyle"></inputItem>
	    			</el-form-item>
	    		</el-col>
	    	</el-row>
	    </el-form>  
		<div slot="footer" class="dialog-footer flex-x-end">
            <elBtn @click="cancel" text="取消"></elBtn>
            <elBtn @click="submit" text="提交" v-if="lookup!=true" type="primary"></elBtn>
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
			channelOptions:[],
			customerOptions:[],
			smstemplateOptions:[],
			merchantList:[],
			customerIdList:[],
			form:{
				channelCode:'',
				comment:'',
				smsType:'',
				isUseTemplate:0,
				customerIds:'',
				templateName:''//用于获取短信模板的名称
			},
			rules: {
				channelCode: [{required: true, message: '渠道编码不能为空' }],
				smsType: [{required: true, message: '通知类型不能为空' }],
				templateName: [{validator: ruleTemplateName, trigger: 'blur'}],
                comment: [{validator: ruleComment, trigger: 'blur'}, this._ruleLength(500)]
            },
		}
	},
	props: {
		modal: {
			type: Boolean,
			default: false
		},
		modalTitle:{
			default:''
		},
		messageRow:{
			default:function(){
				return {}
			},
		},
		lookup:{
			type: Boolean,
			default:false
		}
	},
	computed: {
		isUseTemplate() {
			return this.form.isUseTemplate === 1 ? true : false
		}
	},
	mounted(){
		Object.assign(this.form, this.messageRow);
		this.init();
	},
	methods:{
		init(){
			var vm=this;
			this._ajax({url:this.tootAPI,name:'channel/list',
				param:{
					code:local.get('sessionUser').typeCode
				}
			}).then((d)=>{
				this.channelOptions=d.aaData
				this.searchTable(this.form.channelCode);
				this.smstemplate(this.form.smsType)
			})
			
			this._ajax({url:this.tootAPI,name:'datadic/list',
				param:{}
			}).then((d)=>{
				d.aaData.forEach((val)=>{
					if(val.dataType=='MESSAGE_TYPE'){
						this.datadicOptions.push(val)
					}
				})
				this.searchTable(this.form.channelCode);	
				this.smstemplate(this.form.smsType)
			})
			
			this._ajax({url:this.userAPI,name:'user/list',
				param:{
					typeCode:local.get('sessionUser').typeCode
				}
			}).then((d)=>{
				this.customerOptions=d.aaData
				this.searchTable(this.form.channelCode);	
				this.smstemplate(this.form.smsType)
			})
		},
		//根据渠道id查询商户信息
		searchTable(val){
			this._ajax({url:this.userAPI,name:'user/list',param:{typeCode:val}}).then(this.renderTable)
		},
		//模板名称
		smstemplate(type){
			var vm=this;
			this._ajax({url:this.tootAPI,name:'smstemplate/list',
				param:{
					smsType:type
				}
			}).then((d)=>{
				if(Array.isArray(d.aaData) && d.aaData.length > 0){
					vm.smstemplateOptions = [];
					d.aaData.forEach(temp=>{
						vm.smstemplateOptions.push({id:temp.id+"",smsTitle:temp.smsTitle,comment:temp.comment})
					})
				}
				vm.templateChange(vm.form.templateName)
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
					var vm=this;
					if(this.modalTitle=="新增"){
						this.form.sendStatus=0
						this._ajax({url:this.tootAPI,name:'batchsendsms/create',param:this.form})
						.then((d)=>{
							if(d.state==0){
								this.$emit('close')
		                        this.$message({ type: 'success', message: '操作成功' }); 
		                    }
						})
					}else{
						this._ajax({url:this.tootAPI,name:'batchsendsms/update',param:this.form})
						.then((d)=>{
							if(d.state==0){
								this.$emit('close')
		                        this.$message({ type: 'success', message: '操作成功' }); 
		                    }
						})
					}
				}
			})
		},
		handleClick(){
		
		},
		selectionChange(arr){
			var vm=this;
			vm.customerIdList=[]
			arr.map(function(el){
				vm.customerOptions.map(function(em){
					if(em.id==el.merchantId){
						vm.customerIdList.push(el.merchantId);
					}
				})
			})
			this.form.customerIds=vm.customerIdList.toString();
		},
		datadicChange(){
			this.form.templateName = null;
			this.smstemplateOptions=[]
			this.smstemplate(this.form.smsType);
		},
		templateChange(val){
			this.smstemplateOptions.map((function(el){
				if(val==el.id){
					this.templateComment=el.comment
				}
			}).bind(this))
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