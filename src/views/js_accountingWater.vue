<template>
	<div class="clear_batch">
		<searchInputItems>
			<searchInputItem name="收支类型">
				<selectItem
					:selectValue.sync='searchForm.inoutType'>
					<el-option 
				    	v-for="item in inoutTypeOptions" 
				    	:key="item.value" 
				    	:label="item.label" 
				    	:value="item.value">
	   				</el-option>
				</selectItem>
			</searchInputItem>
			<searchInputItem name="状态">
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
	        @cellClick='cellClick'
	        :currentPage="pageNum"
	        :pageSize="pageSize"
	        :pageTotal="pageTotal"
	        :loading='dataLoading'
			>
		    <el-table-column type="selection" width="55"></el-table-column>
		    <el-table-column prop="inName" show-overflow-tooltip min-width="100" label="收款账户">
		    	<template slot-scope='scope'>
		    		<toolTip :content="toolTipContent" :placement='placement' :effect='effect'>	
		    			<elBtn type='text' :text='scope.row.inName'></elBtn>
		    		</toolTip>
		    	</template>
		    </el-table-column>
		    <el-table-column prop="outName" show-overflow-tooltip min-width="100" label="付款账户">
		    	<template slot-scope='scope'>
		    		<toolTip :content="toolTipContent" :placement='placementR' :effect='effect'>	
		    			<elBtn type='text' :text='scope.row.outName'></elBtn>
		    		</toolTip>
		    	</template>
		    </el-table-column>
		    <el-table-column prop="billNo" show-overflow-tooltip min-width="150" label="账单号"></el-table-column>
		    <el-table-column prop="inoutType" show-overflow-tooltip min-width="150" label="收支类型">
		    	<template scope="scope">
					<el-tag type="info" v-if="scope.row.inoutType==='收款'">收&nbsp;&nbsp;&nbsp;款</el-tag>
					<el-tag type="primary"  v-if="scope.row.inoutType==='支付'">支&nbsp;&nbsp;&nbsp;付</el-tag>
				</template>
		    </el-table-column>
		    <el-table-column prop="amount" show-overflow-tooltip min-width="150" label="金额（元）"></el-table-column>
		    <el-table-column prop="status" show-overflow-tooltip min-width="150" label="状态">
		    	<template scope="scope">
					<el-tag type="success" v-if="scope.row.status==='成功'">成&nbsp;&nbsp;&nbsp;功</el-tag>
					<el-tag type="danger"  v-else-if="scope.row.status==='作废'">作&nbsp;&nbsp;&nbsp;废</el-tag>
					<el-tag type="warning" v-else-if="scope.row.status==='失败'">失&nbsp;&nbsp;&nbsp;败</el-tag>
				</template>
		    </el-table-column>
		    <el-table-column prop="createDate" show-overflow-tooltip min-width="150" label="创建日期"></el-table-column>
		    <el-table-column prop="updateDate" show-overflow-tooltip min-width="150" label="修改日期"></el-table-column>
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
				inoutType:'',
				dateValue:[],
				status:'',
			},
			fields: ['inName', 'outName', 'billNo','inoutType','amount','status','createDate','updateDate'],
			filedsName: ['收款账户','付款账户','账单号','收支类型','金额（元）','状态','创建时间','修改日期'],
			fileName:'账务流水',
			placeHolderCcmc:'场次名称',
			dataList:[],
			inoutTypeOptions:[
				{label:"收款",value:0}, 
				{label:"支付",value:1}
			],
			statusOptions:[
				{label:"成功", value:0},
				{label:"失败", value:2},
				{label:"作废", value:9},
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
				if(d.aaData[a].amount != undefined){ 
					d.aaData[a].amount= (d.aaData[a].amount/100).toFixed(2);
				}
				d.aaData[a].inoutType=this._filterData(d.aaData[a].inoutType,this.inoutTypeOptions)
				d.aaData[a].status=this._filterData(d.aaData[a].status,this.statusOptions)
			}
			return d.aaData
		},
		searchTable(){
			this._ajax({url:this.settleAPI,name:'accountList/list',loading:'dataLoading',
				param:{
					inoutType:this.searchForm.inoutType,
					status:this.searchForm.status,
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
			if(arr[1].label=='收款账户'||arr[1].label=='付款账户'){
				if(arr[1].label=='收款账户'){
					this.modalTitle='收款账户详情'
				}else{
					this.modalTitle='付款账户详情'
				}
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
				inoutType:'',
				dateValue:[],
				status:'',
			})
			this.searchTable();
		},
		exportSearchExcel(){
			this.searchTable();
			this._ajax({url:this.settleAPI,name:'accountList/list',loading:'dataLoading',
				param:{
					inoutType:this.searchForm.inoutType,
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