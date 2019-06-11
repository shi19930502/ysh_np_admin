<template>
	<div class="js_billTypeConf">
		<searchInputItems>
			<searchInputItem name="账单类型名称">
				<inputItem :value.sync='searchForm.billTypeName'></inputItem>
			</searchInputItem>
			<searchInputItem name="收支类型">
				<selectItem :selectValue.sync='searchForm.inoutType'>
					<el-option v-for="item in inoutTypeOptions" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</selectItem>
			</searchInputItem>
			<searchInputItem name="结算方式">
				<selectItem :selectValue.sync='searchForm.settleType'>
					<el-option v-for="item in settleTypeOptions" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</selectItem>
			</searchInputItem>
			<searchInputItem name="日期范围">
				<dateEditorDaterange :dateValue.sync='searchForm.dateValue'>
				</dateeditordaterange>
			</searchInputItem>
		</searchInputItems>
		<optionItems>
			<template slot="left">
				<el-button-group>
					<iconBtn iconClass="el-icon-plus" content="添加" @click="add">添加</iconBtn>
					<iconBtn iconClass="el-icon-delete" content="删除" @click="selectDel">删除</iconBtn>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				</el-button-group>
			</template>
		</optionItems>
		<elemTable :dataList="dataList" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange" :currentPage="pageNum" :pageSize="pageSize" :pageTotal="pageTotal" :loading='dataLoading'>
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="id" show-overflow-tooltip min-width="100" label="账单类型"></el-table-column>
			<el-table-column prop="billTypeName" show-overflow-tooltip min-width="100" label="账单类型名称"></el-table-column>
			<el-table-column prop="inoutType" show-overflow-tooltip min-width="150" label="收支类型">
				<template slot-scope="scope">
					<el-tag type="info" v-if="scope.row.inoutType=='0'">收&nbsp;&nbsp;&nbsp;款</el-tag>
					<el-tag type="primary" v-if="scope.row.inoutType=='1'">支&nbsp;&nbsp;&nbsp;付</el-tag>
			    </template>
			</el-table-column>
			<el-table-column prop="settleType" show-overflow-tooltip min-width="150" label="结算方式">
				<template scope="scope">
					<el-tag type="" v-if="scope.row.settleType=='1'">实时收款</el-tag>
					<el-tag type="df" v-else-if="scope.row.settleType=='2'">实时付款</el-tag>
					<el-tag type="qf" v-else-if="scope.row.settleType=='3'">清&nbsp;&nbsp;&nbsp;分</el-tag>
					<el-tag type="pos" v-else-if="scope.row.settleType=='9'">线下结算</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="isAudit" show-overflow-tooltip min-width="150" label="是否需要审核">
				<template scope="scope">
					<el-tag type="success" v-if="scope.row.isAudit=='0'">是</el-tag>
					<el-tag type="" v-else-if="scope.row.isAudit=='1'">否</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="createDate" show-overflow-tooltip min-width="150" label="创建日期"></el-table-column>
			<el-table-column prop="updateDate" show-overflow-tooltip min-width="150" label="修改日期"></el-table-column>
			<el-table-column label="操作" align="left" min-width="150" fixed="right">
				<template slot-scope="scope">
			        <el-button-group>
					    <iconBtn iconClass="el-icon-edit" @click="edit(scope.row)" content="编辑" ></iconBtn>
					    <iconBtn iconClass="el-icon-minus" @click="del(scope.row)" content="删除" ></iconBtn>
			    	</el-button-group>
			    </template>
			</el-table-column>
		</elemTable>
		<accountingModal
			v-if="modalShow"
			:modal="modalShow" 
			@close="modalClose"
			@submit='submit'
			:rowList='rowList'
			:title='modalTitle'
			>
		</accountingModal>
	</div>
</template>

<script>
	import mixin from '../mixin/mixin.js' //公共方法，包括主要的ajax
	import accountingModal from './component/modal/js_billTypeConf.vue' 
	export default {
		mixins: [mixin],
		components:{accountingModal},
		data() {
			return {
				searchForm: {
					billTypeName: '',
					inoutType:'',
					settleType:'',
					dateValue: [],
				},
				inoutTypeOptions: [
					{ label: "收款", value: 0 },
					{ label: "支付", value: 1 },
				],
				settleTypeOptions: [
					{ label: "实时收款", value: 1 },
					{ label: "实时付款", value: 2 },
					{ label: "清分", value: 3 },
					{ label: "线下结算", value: 9 },
				],
				modalShow:false,
				placeHolderCcmc: '场次名称',
				rowList:{},
				dataList: [],
				modalTitle:'',
			}
		},
		mounted() {
			this.searchTable();
		},
		methods: {
			submit(){
				this.searchTable();
			},
			add(){
				this.modalTitle='添加'
				this.modalShow=true;
//				billTypeConf/create
			},
			edit(row){
				console.log(row)
				Object.assign(this.rowList,row)
				this.modalTitle='编辑'
				this.modalShow=true;
			},
			modalClose(){
				this.modalShow=false;
				this.rowList={};
			},
			del(row){
				console.log(row)
				this.confirm('确认删除？',()=>{
					this._ajax({
						url: this.settleAPI,
						name: 'billTypeConf/delete',
						loading: 'dataLoading',
						arr:true,
						param: {
							id:[row.id]
						}
					}).then(d=>{
						if(d.state===0){
							this.$message({
					            type: 'success',
					            message: '操作成功'
					        });  
							this.searchTable();
						}
					})
				})
			},
			selectDel(){
				this._delSelection({name:'billTypeConf/delete'},'id',(d)=>{
					if(d.state===0){
						this.$message({
					           type: 'success',
				         message: '操作成功'
					        });  
							this.searchTable();
						}
				})
			},
			handleDataList(d) {
				for(let a = 0; a < d.aaData.length; a++) {
					if(d.aaData[a].amount != undefined) {
						d.aaData[a].amount = (d.aaData[a].amount / 100).toFixed(2);
					}
				}
				this.dataList = d.aaData
				return d.aaData
			},
			searchTable() {
				this._ajax({
						url: this.settleAPI,
						name: 'billTypeConf/list',
						loading: 'dataLoading',
						param: {
							billTypeName: this.searchForm.billTypeName,
							inoutType: this.searchForm.inoutType,
							settleType: this.searchForm.settleType,
							pageNum: this.pageNum,
							pageSize: this.pageSize,
							startTime: this.searchForm.dateValue[0] ? this.searchForm.dateValue[0] : '',
							endTime: this.searchForm.dateValue[1] ? this.searchForm.dateValue[1] : '',
//							orderField: 'f_create_date',
						}
					})
					//.then(这里是函数字符串，不执行函数，所以不加())
					.then(this.renderTable)
			},
			reset() {
				this.pageNum = 1;
				this.pageSize = 10;
				Object.assign(this.searchForm, {
					billTypeName: '',
					inoutType:'',
					settleType:'',
					dateValue: [],
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