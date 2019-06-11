<template>
	<div class="clear_batch">
		<searchInputItems>
			<searchInputItem name="场次名称">
				<inputItem  :value.sync='searchForm.placeName'></inputItem>
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
				</el-button-group>				
			</template>
		</optionItems>
		<elemTable 
			:dataList="dataList"
			@sizeChange="handleSizeChange"
	        @currentChange="handleCurrentChange"
	        :currentPage="pageNum"
	        :pageSize="pageSize"
	        :pageTotal="pageTotal"
	        :loading='dataLoading'
			>
		    <el-table-column prop="id" show-overflow-tooltip min-width="100" label="清算批次"></el-table-column>
		    <el-table-column prop="clearPlaceId" show-overflow-tooltip min-width="100" label="清算场次"></el-table-column>
		    <el-table-column prop="placeName" show-overflow-tooltip min-width="150" label="场次名称"></el-table-column>
		    <el-table-column prop="endDate" show-overflow-tooltip min-width="150" label="结束会计日期"></el-table-column>
		    <el-table-column prop="clearCount" show-overflow-tooltip min-width="150" label="清分流水条数"></el-table-column>
		    <el-table-column prop="settleCount" show-overflow-tooltip min-width="150" label="结算单条数"></el-table-column>
		    <el-table-column prop="amount" show-overflow-tooltip min-width="150" label="金额（元）"></el-table-column>
		    <el-table-column prop="createDate" show-overflow-tooltip min-width="150" label="创建日期"></el-table-column>
		    <el-table-column prop="updateDate" show-overflow-tooltip min-width="150" label="修改日期"></el-table-column>
		</elemTable>
	</div>
</template>

<script>
import mixin from '../mixin/mixin.js' //公共方法，包括主要的ajax
export default {
	mixins: [mixin],
	data(){
		return{
			searchForm:{
				placeName:'',
				dateValue:[],
			},
			placeHolderCcmc:'场次名称',
			dataList:[],
		}
	},
	mounted(){
		this.searchTable();
	},
	methods:{
		handleDataList(d){
			for(let a=0;a<d.aaData.length;a++){
				if(d.aaData[a].amount != undefined){ 
					d.aaData[a].amount= (d.aaData[a].amount/100).toFixed(2);
				}
			}
			this.dataList=d.aaData
			return d.aaData
		},
		searchTable(){
			this._ajax({url:this.settleAPI,name:'clearBatch/list',loading:'dataLoading',
				param:{
					placeName:this.searchForm.placeName,
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
		reset(){
			this.pageNum=1;
			this.pageSize=10;
			Object.assign(this.searchForm,{
				placeName:'',
				dateValue:[]
			})
			this.searchTable();
		},
	},
}
</script>
<style scoped>
	
</style>
<style lang="sass">
	/*scoped表示  CSS 只作用于当前组件中的元素*/
	/*lang="sass"表示  可以使用sass写法*/
</style>