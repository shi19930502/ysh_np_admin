<template>
	<el-dialog custom-class="jz-modal" :width="modalWidth" :title="title" :close-on-click-modal='false' :visible="modal" :before-close='beforeClose'>
		<el-form class="modal-form" v-if="modal" :model="form"  :inline="true"  label-width="120px">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="账户号：">
						<inputItem :disabled='formDisabled' :value.sync='form.id'></inputItem>	
			    	</el-form-item>
			    </el-col>
			    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="账户名称：">
						<inputItem :disabled='formDisabled' :value.sync='form.accountName'></inputItem>	
			    	</el-form-item>
			    </el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="客户号：">
						<inputItem :disabled='formDisabled' :value.sync='form.customertNo'></inputItem>	
			    	</el-form-item>
			    </el-col>
			    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="客户名称：">
						<inputItem :disabled='formDisabled' :value.sync='form.customerName'></inputItem>	
			    	</el-form-item>
			    </el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="余额(元)：">
						<inputItem :disabled='formDisabled' :value.sync='form.balance'></inputItem>	
			    	</el-form-item>
			    </el-col>
			    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="余额类型：">
						<inputItem :disabled='formDisabled' :value.sync='form.inoutTye'></inputItem>	
			    	</el-form-item>
			    </el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="授信额度(元)：">
						<inputItem :disabled='formDisabled' :value.sync='form.creditLine'></inputItem>	
			    	</el-form-item>
			    </el-col>
			    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="冻结金额(元)：">
						<inputItem :disabled='formDisabled' :value.sync='form.freezeBalance'></inputItem>	
			    	</el-form-item>
			    </el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="创建日期：">
						<inputItem :disabled='formDisabled' :value.sync='form.createDate'></inputItem>	
			    	</el-form-item>
			    </el-col>
			    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="修改日期：">
						<inputItem :disabled='formDisabled' :value.sync='form.updateDate'></inputItem>	
			    	</el-form-item>
			    </el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="清算单元：">
						<inputItem :disabled='formDisabled' :value.sync='form.clearUnitId'></inputItem>	
			    	</el-form-item>
			   </el-col>
			</el-row>
		</el-form>
	</el-dialog>
</template>

<script>
import mixin from '../../../mixin/mixin.js' //公共方法，包括主要的ajax
export default {
	mixins: [mixin],
	data(){
		return{
			 form:{},
			 row:{},
			 formDisabled:true,
		}
	},
	props: {
		modal: {
			type: Boolean,
			default: false
		},
		title:{
			default:"账户详情"
		},
		rowList:{
			default:function(){
				return {}
			}
		}
	},
	mounted(){
		Object.assign(this.row, this.rowList)
		this.init()
	},
	methods:{
		init(){
			var id=''
			if(this.title=='收款账户详情'){
				id=this.row.inAccNo
			}else if(this.title=='付款账户详情'){
				id=this.row.outAccNo
			}else if(this.title=='账户详情'){
				id=this.row.accountId
			}
			this._ajax({url:this.tootAPI,name:'/accountInfo/queryById',
				param:{id:id}
			}).then(d=>{
				console.log(d.aaData.inoutTye)
				if(d.aaData.inoutTye==0){
					d.aaData.inoutTye='付款'
				}else if(d.aaData.inoutTye==1){
					d.aaData.inoutTye='收款'
				}
				d.aaData.balance=(d.aaData.balance/100).toFixed(2)
				d.aaData.creditLine=(d.aaData.creditLine/100).toFixed(2)
				d.aaData.freezeBalance=(d.aaData.freezeBalance/100).toFixed(2)
				this.form=d.aaData
			})
		},
		cancel(){
			this.$emit('close')
		},
		beforeClose(done) {
			this.cancel()
			done()
		},
	},
}
</script>