<template>
	<div class="clear_batch">
		<searchInputItems>
			<searchInputItem name="客户名称">
				<inputItem  :value.sync='searchForm.customerName'></inputItem>
			</searchInputItem>
			<searchInputItem name="账单类型">
				<selectItem
					:selectValue.sync='searchForm.billTypeId'>
					<el-option 
				    	v-for="item in billTypeIdOptions" 
				    	:key="item.id" 
				    	:label="item.billTypeName" 
				    	:value="item.id">
	   				</el-option>
				</selectItem>
			</searchInputItem>
			<searchInputItem name="对公对私">
				<selectItem
					:selectValue.sync='searchForm.perOrEnt'>
					<el-option 
				    	v-for="item in perOrEntOptions" 
				    	:key="item.value" 
				    	:label="item.label" 
				    	:value="item.value">
	   				</el-option>
				</selectItem>
			</searchInputItem>
			<searchInputItem name="结算状态">
				<selectItem
					:selectValue.sync='searchForm.status'>
					<el-option 
				    	v-for="item in statusOptions" 
				    	:key="item.value" 
				    	:label="item.label" 
				    	:value="item.value">
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
	        :currentPage="pageNum"
	        :pageSize="pageSize"
	        :pageTotal="pageTotal"
	        :loading='dataLoading'
			>
			<el-table-column type="expand">
				<template slot-scope="props">
					<elemTable
						:tableBorder="tableBorder"
						:dataList='[props.row]'
						:isShowPage="isShowPage">
		   				<el-table-column prop="billNo" show-overflow-tooltip min-width="140" label="账单号"></el-table-column>
		   				<el-table-column prop="customertNo" show-overflow-tooltip min-width="140" label="客户号"></el-table-column>
		   				<el-table-column prop="clearUnitId" show-overflow-tooltip min-width="140" label="清算单元"></el-table-column>
		   				<el-table-column prop="recAccountNo" show-overflow-tooltip min-width="140" label="付款方银行账号"></el-table-column>
		   				<el-table-column prop="recAccountName" show-overflow-tooltip min-width="140" label="付款方银行账户名"></el-table-column>
		   				<el-table-column prop="recBankCode" show-overflow-tooltip min-width="140" label="付款方银行行号"></el-table-column>
		   				<el-table-column prop="recBankName" show-overflow-tooltip min-width="140" label="付款方银行行名"></el-table-column>
		   				<el-table-column prop="summary" show-overflow-tooltip min-width="140" label="付款详情说明"></el-table-column>
					</elemTable>
				</template>
			</el-table-column>
		    <el-table-column type="selection" width="55"></el-table-column>
		    <el-table-column prop="billTypeName" show-overflow-tooltip min-width="100" label="账单类型"></el-table-column>
		    <el-table-column prop="customerName" show-overflow-tooltip min-width="100" label="客户名称"></el-table-column>
		    <el-table-column prop="perOrEnt" show-overflow-tooltip min-width="150" label="对公对私">
		    	<template scope="scope">
					<el-tag type="info" v-if="scope.row.perOrEnt==0">对私</el-tag>
					<el-tag type="" v-else-if="scope.row.perOrEnt==1">对公</el-tag>
				</template>
		    </el-table-column>
		    <el-table-column prop="status" show-overflow-tooltip min-width="120" label="结算状态">
		    	<template scope="scope">
					<el-tag type="success" v-if="scope.row.status==='结算成功'">结算成功</el-tag>
					<el-tag type="" v-else-if="scope.row.status==='结算中'">结算中</el-tag>
					<el-tag type="warning"  v-else-if="scope.row.status==='结算失败'">结算失败</el-tag>
					<el-tag type="jsz"  v-else-if="scope.row.status==='待结算'">待结算</el-tag>
					<el-tag type="info"  v-else-if="scope.row.status==='待支付'">待支付</el-tag>
					<el-tag type="danger"  v-else-if="scope.row.status==='作废'">作废</el-tag>
				</template>
		    </el-table-column>
		    <el-table-column prop="inName" show-overflow-tooltip min-width="120" label="收款账户"></el-table-column>
		    <el-table-column prop="outName" show-overflow-tooltip min-width="150" label="付款账户"></el-table-column>
		    <el-table-column prop="amount" show-overflow-tooltip min-width="150" label="金额（元）"></el-table-column>
		    <el-table-column prop="settleNo" show-overflow-tooltip min-width="150" label="结算单号"></el-table-column>
		    <el-table-column prop="createDate" show-overflow-tooltip min-width="150" label="创建日期"></el-table-column>
		</elemTable>
	</div>
</template>

<script>
import mixin from '../mixin/mixin.js' //公共方法，包括主要的ajax
export default {
	mixins: [mixin],
	data(){
		return{
			dataList:[],
			billTypeIdOptions:[],
			perOrEntOptions:[
				{label:"对公",value:1},
				{label:"对私",value:0},
			],
			statusOptions:[
				{label:"结算成功",value:0},
				{label:"结算中",value:1},
			  	{label:"结算失败",value:2},
				{label:"待结算",value:3},
			    {label:"待支付",value:4},
			    {label:"作废",value:9},
			],
			searchForm:{
				billTypeId:'',
				customerName:'',
				perOrEnt:'',
				status:'',
				dateValue:[],
			},
			fields:['billNo', 'billTypeName', 'customertNo','customerName','clearUnitId','perOrEnt','status','inName','outName','amount','settleNo','createDate',
					'recAccountNo','recAccountName','recBankCode','recBankName','summary',],
			filedsName:['账单号', '账单类型', '客户号','客户名称','清算单元','对公对私','结算状态','收款账户','付款账户','金额','结算单号','创建时间',
						'付款方银行账号','付款方银行账户名','付款方银行行号','付款方银行行名','付款详情说明'],
			fileName:'清分流水',
			placeHolderCcmc:'场次名称',
			isShowPage:false,
			tableBorder:true,
		}
	},
	computed:{
		
	},
	mounted(){
		this.searchTable();
		this.getBillTypeIdOptions();
	},
	methods:{
		getBillTypeIdOptions(){
			this._ajax({url:this.settleAPI,name:'billTypeConf/list',loading:'dataLoading',
				param:{}
			}).then(d=>{
				this.billTypeIdOptions = d.aaData;
			})
		},
		filterData(val,options){
			for(let a=0;a<options.length;a++){
				if(val==options[a].value){
					return options[a].label
					break
				}
			}
		},
		handleDataList(d){
			this.dataList = this.computeFloat(d)
			return d.aaData
		},
		computeFloat(d){
			for(let a=0;a<d.aaData.length;a++){
				if(d.aaData[a].amount != undefined){ 
					d.aaData[a].amount= (d.aaData[a].amount/100).toFixed(2);
				}
				d.aaData[a].perOrEnt=this._filterData(d.aaData[a].perOrEnt,this.perOrEntOptions)
				d.aaData[a].status=this._filterData(d.aaData[a].status,this.statusOptions)
			}
			return d.aaData
		},
		searchTable(){
			this._ajax({url:this.settleAPI,name:'clearInfo/list',loading:'dataLoading',
				param:{
					billTypeId: this.searchForm.billTypeId,
					customerName: this.searchForm.customerName,
					perOrEnt: this.searchForm.perOrEnt,
					status:this.searchForm.status,
					startTime:this.searchForm.dateValue[0]?this.searchForm.dateValue[0]:'',
					endTime:this.searchForm.dateValue[1]?this.searchForm.dateValue[1]:'',
					pageNum:this.pageNum,
					pageSize:this.pageSize,
					orderField:'f_create_date',
				}
			})
			//.then(这里是函数字符串，不执行函数，所以不加())
			.then(this.renderTable)
		},
		reset(){
			this.pageNum=1;
			this.pageSize=10;
			Object.assign(this.searchForm,{
				billTypeId:'',
				customerName:'',
				perOrEnt:'',
				status:'',
				dateValue:[],
			})
			this.searchTable();
		},
		exportSearchExcel(){
			this.searchTable();
			this._ajax({url:this.settleAPI,name:'clearInfo/list',loading:'dataLoading',
				param:{
					billTypeId: this.searchForm.billTypeId,
					customerName: this.searchForm.customerName,
					perOrEnt: this.searchForm.perOrEnt,
					status:this.searchForm.status,
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