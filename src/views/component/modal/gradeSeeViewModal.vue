<template>
	<el-dialog custom-class="jz-modal" :width="modalWidth" title="评级详情页面" :close-on-click-modal='false' :visible="modal" :before-close='beforeClose'>
        <el-form class="modal-form" v-if="modal" :model="form"  :inline="true"  label-width="160px">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="渠道:">
						<inputItem :disabled='formDisabled' :value.sync='channel.name'></inputItem>	
			    	</el-form-item>
			    </el-col>
			    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="生效日期:">
						<inputItem :disabled='formDisabled' :value.sync='form.effectiveDate'></inputItem>	
			    	</el-form-item>
			    </el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="创建人:">
						<inputItem :disabled='formDisabled' :value.sync='form.createdPersonName'></inputItem>	
			    	</el-form-item>
			    </el-col>
			    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="创建时间:">
						<inputItem :disabled='formDisabled' :value.sync='form.createdDate'></inputItem>	
			    	</el-form-item>
			    </el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="审核人:">
						<inputItem :disabled='formDisabled' :value.sync='form.authPersonName'></inputItem>	
			    	</el-form-item>
			    </el-col>
			    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
			    	<el-form-item label="审核时间:">
						<inputItem :disabled='formDisabled' :value.sync='form.authDate'></inputItem>	
			    	</el-form-item>
			    </el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
					<el-form-item label="备注:" >
						<inputItem :disabled='formDisabled' :value.sync='form.remark' type="textarea"  ></inputItem>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		
		<elemTable 
			:dataList="dataList" 
			@sizeChange='handleSizeChange' 
			@currentChange='handleCurrentChange' 
			:currentPage='pagNum' 
			:pageSizes='pageSizes' 
			:pageSize='pageSize' 
			:pageTotal='pageTotal' >
			<el-table-column show-overflow-tooltip property="" label="" min-width="50"></el-table-column>
			<el-table-column show-overflow-tooltip property="reputation" label="信誉等级" min-width="120"></el-table-column>
			<el-table-column show-overflow-tooltip property="minScore" label="评分下限" min-width="120"></el-table-column>
			<el-table-column show-overflow-tooltip property="maxScore" label="评分上限" min-width="120"></el-table-column>
		</elemTable>
	</el-dialog>
</template>

<script>
import mixin from '../../../mixin/mixin.js' //公共方法，包括主要的ajax
export default {
	mixins: [mixin],
	props:{
		modal:{
			default:false,
		},
		tableRow:{
			default:function(){
				return {}
			},
		}
	},
	data(){
		return{
			dataList:[],
			formDisabled:true,
			form:{
				
			},
			channel:{
				name:''
			}
		}
	},
	mounted(){
		console.log(this.tableRow)
		/*this.datadicArr(()=>{
			console.log(' this.$store.state.datadicArr',this.$store.state.datadicArr)
		})*/
		this.form=this.tableRow;
		this.modalForm();
		this.searchTable();	
	},
	methods:{
		modalForm(){
			this._ajax({url:this.tootAPI,name:'reputationconfigmain/list',
				param:{
					id:this.tableRow.id
				}
			}).then((d)=>{
				this.form=d.aaData[0];
			})
			var vm = this;
			//根据渠道编码查询渠道名称
			this._ajax({url:this.tootAPI,name:'channel/list',
				param:{
					code:vm.tableRow.channelCode
				}
			}).then((d)=>{
				$.each(d.aaData, function(i, obj) {
					if(obj.code === vm.tableRow.channelCode) {
						vm.channel.name =obj.name;
					}
				});
				
			})
			
		},
		searchTable(){
			this._ajax({url:this.tootAPI,name:'reputationconfig/list',
				param:{
					mainId:this.tableRow.id
				}
			}).then(this.renderTable)
		},
		beforeClose(done) {
			this.$emit('close')
			done()
		},
	},
}
</script>
<style lang="sass">
    .grade-see-view-modal{
        .row-block{
            .el-form-item__content {
                width: calc(100% - 160px);
                &>div{
                    width: 100%;
                }
            }
        }
    }
</style>