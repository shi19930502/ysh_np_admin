<template>
	<el-dialog custom-class="jz-modal xxsms-Modal" :title="modalTitle" :close-on-click-modal='false' :visible="modal" :before-close='beforeClose' :width="modalWidth">
		<el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules">
	    	<el-row>
        		<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
	    			<el-form-item label="模板类型:" :prop="lookup ? '' : 'smsType'">
						<selectInput 
							:value.sync='form.smsType'
							:clearable='smsTypeClearable'
						    :filterable='smsTypeFilterable'
						    :disabled='lookup'>
					    		<el-option 
							    	v-for="item in smsTypeOptions" 
							    	:key="item.key" 
							    	:label="item.value" 
							    	:value="item.key">
				   				</el-option>
				    	</selectInput>
	    			</el-form-item>
	    		</el-col>
	    	</el-row>
	    	<el-row>
        		<el-col :xs="48" :sm="48" :md="48" :lg="24" :xl="24">
	    			<el-form-item label="模板名称:" :prop="lookup ? '' : 'smsTitle'">
						<inputItem :value.sync="form.smsTitle" class="el_input_mbname" :disabled='lookup'>
						</inputItem>
	    			</el-form-item>
	    		</el-col>
	    	</el-row>
	    	<el-row>
        		<el-col :xs="48" :sm="48" :md="48" :lg="24" :xl="24">
	    			<el-form-item label="模板内容:" :prop="lookup ? '' : 'comment'" class="row-block">
	    				<inputItem type='textarea':value.sync="form.comment" maxlength="150" :disabled='lookup' class="inputStyle">
	    				</inputItem>
	    			</el-form-item>
	    		</el-col>
		    </el-row>
		    <el-row>
        		<el-col :xs="48" :sm="48" :md="48" :lg="24" :xl="24">
	    			<el-form-item label="模板描述:" :prop="lookup ? '' : 'remark'" class="row-block">
	    				<inputItem type='textarea' :value.sync="form.remark" maxlength="150" :disabled='lookup' class="inputStyle">
	    				</inputItem>
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
		return{
			dataList:[],
			searchInput:'',
			pageSizes:[10,20,30],//40页的时候有问题
			textarea:'',
			templateDisabled:true,
			nameDisabled:true,
			smsTypeFilterable:true,
			smsTypeClearable:true,
			activeName:'first',
			templateComment:'',//显示模板的内容
			radioValue:1, //请注意string和number类型
			selectArr:[],
			smsTypeOptions:[],
			form:{
				smsType:'',
				smsTitle:'',
				comment:'',
				remark:'',
				createdPersonId:'',
				createdPersonName:'',
				lastModifyTime:'',
				sendStatus:0,
			},
			rules: {
					smsType: [{required: true, message: '模板类型不能为空' }],
                    smsTitle: [{required: true, message: '标题不能为空，50字以内' }, this._ruleLength(50)],
                    comment: [{required: true, message: '内容不能为空，150字以内' }, this._ruleLength(150)],
                    remark: [{required: true, message: '描述不能为空，150字以内' }, this._ruleLength(150)]
            },
            isSimple:true
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
		this.form.lastModifyTime = new Date();
	},
	methods:{
		init(){
			var vm=this;
			this._ajax({url:this.tootAPI,name:'datadic/list',
				param:{}
			}).then((d)=>{
				d.aaData.forEach((val)=>{
					if(val.dataType=='MESSAGE_TYPE'){
						this.smsTypeOptions.push(val)
					}
				})
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
					this.$emit('add',this.modalTitle,this.form)
					this.cancel();
				}
			})
		},
		handleClick(){
		
		},
		templateChange(val){
			var vm=this;
			if(val ==1){
				this.smstemplateOptions.map(function(el){
					if(vm.form.templateName=el.id){
						vm.templateComment=el.comment
					}
				})
			}else{
				this.templateComment=''
			}
		},
		
	},
}
</script>
<style lang="sass">
    .xxsms-Modal{
        .row-block{
            .el-form-item__content {
                width: calc(100% - 110px);
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