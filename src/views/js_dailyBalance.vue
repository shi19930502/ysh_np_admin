<template>
	<div class="clear_batch">
		<searchInputItems>
			<searchInputItem name="账户名称">
				<inputItem :value.sync='searchForm.accountName'></inputItem>
			</searchInputItem>
			<searchInputItem name="客户名称">
				<inputItem :value.sync='searchForm.customerName'></inputItem>
			</searchInputItem>
			<searchInputItem name="收支类型">
				<selectItem :selectValue.sync='searchForm.inoutTye'>
					<el-option v-for="item in inoutTypeOptions" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</selectItem>
			</searchInputItem>
			<searchInputItem name="日期范围">
				<dateEditorDaterange 
					:dateValue.sync='searchForm.dateValue'
					>
				</dateeditordaterange>
			</searchInputItem>
		</searchInputItems>
		<optionItems>
			<template slot="left">
				<el-button-group>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
					<iconBtn iconClass="el-icon-download" content="导出所选行的Excel" @click="exportSelectExcel">导出所选行的Excel</iconBtn>
					<iconBtn iconClass="el-icon-download" content="查询并导出满足条件的所有Excel" @click="exportSearchExcel">查询并导出满足条件的所有Excel</iconBtn>
				</el-button-group>				
			</template>
		</optionItems>
		<elemTable 
			:dataList="dataList"
			@sizeChange="handleSizeChange"
	        @currentChange="handleCurrentChange"
	        @selectionChange="selectionChange"
	        @cellClick='cellClick'
	        :currentPage="pageNum"
	        :pageSize="pageSize"
	        :pageTotal="pageTotal"
	        :loading='dataLoading'
			>
		    <el-table-column type="selection" width="55"></el-table-column>
		    <el-table-column prop="accountId" show-overflow-tooltip min-width="100" label="账户号">
		    	<template slot-scope='scope'>
		    		<toolTip :content="toolTipContent" :placement='placement' :effect='effect'>	
		    			<elBtn type='text' :text='scope.row.accountId'></elBtn>
		    		</toolTip>
		    	</template>
		    </el-table-column>
		    <el-table-column prop="accountName" show-overflow-tooltip min-width="120" label="账户名称"></el-table-column>
		    <el-table-column prop="customertNo" show-overflow-tooltip min-width="120" label="客户号"></el-table-column>
		    <el-table-column prop="customerName" show-overflow-tooltip min-width="120" label="客户名称"></el-table-column>
		    <el-table-column prop="balance" show-overflow-tooltip min-width="150" label="金额(元)"></el-table-column>
		    <el-table-column prop="inoutTye" show-overflow-tooltip min-width="100" label="余额类型">
		    	<template scope="scope">
					<el-tag type="info" v-if="scope.row.inoutTye==='收款'">收&nbsp;&nbsp;&nbsp;款</el-tag>
					<el-tag type="primary"  v-if="scope.row.inoutTye==='支付'">支&nbsp;&nbsp;&nbsp;付</el-tag>
				</template>
		    </el-table-column>
		    <el-table-column prop="recAmount" show-overflow-tooltip min-width="130" label="当日收款金额(元)"></el-table-column>
		    <el-table-column prop="payAmount" show-overflow-tooltip min-width="130" label="当日付款金额(元)"></el-table-column>
			<el-table-column prop="createDate" show-overflow-tooltip min-width="140" label="创建时间"></el-table-column>
		    <el-table-column prop="endDate" show-overflow-tooltip min-width="140" label="截止时间"></el-table-column>
		    <el-table-column prop="updateDate" show-overflow-tooltip min-width="140" label="修改日期"></el-table-column>
		</elemTable>
		<accountingModal
			v-if="modalShow"
			:modal="modalShow" 
			@close="modalClose"
			:rowList='rowList'
			:title='modalTitle'
		>
		</accountingModal>
	</div>
</template>

<script>
import mixin from '../mixin/mixin.js' //公共方法，包括主要的ajax
import accountingModal from './component/modal/js_accountingWaterModal.vue' 
export default {
	mixins: [mixin],
	components:{accountingModal},
	data(){
		return{
			searchForm:{
				accountName:'',
				customerName:'',
				inoutTye:'',
				dateValue:[],
			},
			fields: ['accountId', 'accountName', 'customertNo','customerName','balance','inoutTye','recAmount','payAmount','endDate','createDate','updateDate'],
			filedsName: ['账户号', '账户名称', '客户号','客户名称','金额','余额类型','当日收款金额','当日付款金额','截止时间','创建时间','修改时间'],
			fileName: '每日余额',
			placeHolderCcmc:'场次名称',
			dataList:[],
			inoutTypeOptions: [
				{ label: "收款", value: 0 },
				{ label: "支付", value: 1 }
			],
			effect:'light',
			placement:'left',
			placementR:'right',
			toolTipContent:'点击查看账户详情',
			rowList:{},
			modalTitle:'',
		}
	},
	mounted(){
		this.searchTable();
	},
	methods:{
		handleDataList(d){
			this.dataList = this.computeFloat(d)
			return d.aaData
		},
		computeFloat(d){
			for(let a=0;a<d.aaData.length;a++){
				if(d.aaData[a].balance != undefined){ 
					d.aaData[a].balance= (d.aaData[a].balance/100).toFixed(2);
				}
				if(d.aaData[a].recAmount != undefined){ 
					d.aaData[a].recAmount= (d.aaData[a].recAmount/100).toFixed(2);
				}
				if(d.aaData[a].payAmount != undefined){ 
					d.aaData[a].payAmount= (d.aaData[a].payAmount/100).toFixed(2);
				}
				d.aaData[a].inoutTye=this._filterData(d.aaData[a].inoutTye,this.inoutTypeOptions)
			}
			return d.aaData
		},
		searchTable(){
			this._ajax({url:this.settleAPI,name:'accountDailyBalance/list',loading:'dataLoading',
				param:{
					accountName:this.searchForm.accountName,
					customerName:this.searchForm.customerName,
					inoutTye:this.searchForm.inoutTye,
					pageNum:this.pageNum,
					pageSize:this.pageSize,
					startTime:this.searchForm.dateValue[0]?this.searchForm.dateValue[0]:'',
					endTime:this.searchForm.dateValue[1]?this.searchForm.dateValue[1]:'',
					orderField:'f_create_date',
				}
			})
			//.then(这里是函数字符串，不执行函数，所以不加())
			.then(this.renderTable)
		},
		cellClick(arr){
			if(arr[1].label=='账户号'){
				this.modalTitle='账户详情'
				Object.assign(this.rowList,arr[0])
				this.modalShow=true;
			}
		},
		modalClose(){
			this.modalShow=false;
			this.rowList={};
		},
		reset(){
			this.pageNum=1;
			this.pageSize=10;
			Object.assign(this.searchForm,{
				accountName:'',
				customerName:'',
				inoutTye:'',
				dateValue:[],
			})
			this.searchTable();
		},
		exportSearchExcel(){
			this.searchTable();
			this._ajax({url:this.settleAPI,name:'accountDailyBalance/list',loading:'dataLoading',
				param:{
					accountName:this.searchForm.accountName,
					customerName:this.searchForm.customerName,
					inoutTye:this.searchForm.inoutTye,
					startTime:this.searchForm.dateValue[0]?this.searchForm.dateValue[0]:'',
					endTime:this.searchForm.dateValue[1]?this.searchForm.dateValue[1]:'',
					orderField:'f_create_date',
				}
			}).then(d=>{
				if(d.aaData.length>0){
					this._csvExport(this.computeFloat(d), this.fields, this.filedsName, this.fileName)
				}else{
					this.$message({ type: 'info', message: '无导出数据' });
				}
			})
		},
		exportSelectExcel(){
			this.$exportExcelBySelect(this.fields, this.filedsName, this.fileName)
		}
	},
}
</script>
<style scoped>
	
</style>
<style lang="sass">
	/*scoped表示  CSS 只作用于当前组件中的元素*/
	/*lang="sass"表示  可以使用sass写法*/
</style>