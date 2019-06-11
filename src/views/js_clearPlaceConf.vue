<template>
	<div class="js_clearPlaceConf">
		<searchInputItems>
			<searchInputItem name="账单类型">
				<selectItem :selectValue.sync='searchForm.billTypeId'>
					<el-option v-for="item in billTypeIdOptions" :key="item.id" :label="item.billTypeName" :value="item.id">
					</el-option>
				</selectItem>
			</searchInputItem>
			<searchInputItem name="清算场次名称">
				<inputItem :value.sync='searchForm.placeName'></inputItem>
			</searchInputItem>
			<searchInputItem name="场次间隔时间">
				<inputItem :value.sync='searchForm.settleSpace'></inputItem>
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
			<el-table-column prop="id" show-overflow-tooltip min-width="100" label="清算场次"></el-table-column>
			<el-table-column prop="placeName" show-overflow-tooltip min-width="100" label="清算场次名称"></el-table-column>
			<el-table-column :formatter='formatterBillTypeId' prop="billTypeId" show-overflow-tooltip min-width="100" label="账单类型"></el-table-column>
			<el-table-column prop="customertNo" show-overflow-tooltip min-width="100" label="客户号"></el-table-column>
			<el-table-column prop="clearUnitId" show-overflow-tooltip min-width="100" label="清算单元"></el-table-column>
			<el-table-column prop="settleSpace" show-overflow-tooltip min-width="120" label="场次间隔时间(天)"></el-table-column>
			<el-table-column prop="settlePeriod" show-overflow-tooltip min-width="100" label="结算周期(天)"></el-table-column>
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
		<clearPlaceConfModal
			v-if="modalShow"
			:modal="modalShow" 
			@close="modalClose"
			@submit='submit'
			:rowList='rowList'
			:title='modalTitle'
			>
		</clearPlaceConfModal>
	</div>
</template>

<script>
	import mixin from '../mixin/mixin.js' //公共方法，包括主要的ajax
	import clearPlaceConfModal from './component/modal/js_clearPlaceConfModal.vue' 
	export default {
		mixins: [mixin],
		components:{clearPlaceConfModal},
		data() {
			return {
				searchForm: {
					billTypeId:'',
					placeName: '',
					settleSpace:'',
					dateValue: [],
				},
				modalShow:false,
				rowList:{},
				dataList: [],
				billTypeIdOptions:[],
				modalTitle:'',
			}
		},
		mounted() {
			this.init();
			this.searchTable();
		},
		methods: {
			init(){
				this._ajax({
					url: this.settleAPI,
					name: 'billTypeConf/list',
					loading: 'dataLoading',
					arr: true,
					param: {},
				}).then(d => {
					if(d.state === 0) {
						this.billTypeIdOptions=d.aaData
					}
				})
			},
			formatterBillTypeId(row, column, cellValue){
				for(let a=0;a<this.billTypeIdOptions.length;a++){
					if(cellValue==this.billTypeIdOptions[a].id){
						return this.billTypeIdOptions[a].billTypeName;
						break
					}
				}
			},
			submit(){
				this.searchTable();
			},
			add(){
				this.modalTitle='添加'
				this.modalShow=true;
//				clearPlaceConf/create
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
						name: 'clearPlaceConf/delete',
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
				this._delSelection({name:'clearPlaceConf/delete'},'id',(d)=>{
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
						name: 'clearPlaceConf/list',
						loading: 'dataLoading',
						param: {
							billTypeId: this.searchForm.billTypeId,
							placeName: this.searchForm.placeName,
							settleSpace: this.searchForm.settleSpace,
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
					billTypeId:'',
					placeName: '',
					settleSpace:'',
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