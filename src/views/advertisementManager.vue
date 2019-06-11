<template>
	<div>
		<searchInputItems>
			<searchInputItem name="广告投放者名称">
				<inputItem :value.sync="searchForm.customerName"></inputItem>
			</searchInputItem>
			<searchInputItem name="广告位名称">
				<selectInput :value.sync="searchForm.posId" :filterable="filterable">
					<!-- <el-option label="全部" value=""></el-option>-->
					<el-option v-for="item in advertPosList" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="广告状态">
				<selectInput :value.sync="searchForm.status" @selectChange="searchTable">
					<el-option v-for="item in dataDic.statusList" :key="item.key" :label="item.value" :value="item.key">
					</el-option>
				</selectInput>
			</searchInputItem>
		</searchInputItems>
		<optionItems>
			<template slot="right">
				<el-button-group>
					<iconBtn iconClass="el-icon-plus" content="新增" @click="addTable" type="success">新增</iconBtn>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
					<!--<iconBtn iconClass="el-icon-minus" content="批量删除" @click="deleteTable" type="danger">批量删除</iconBtn>-->
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				</el-button-group>
			</template>
		</optionItems>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<!--<el-table-column type="selection" width="55"></el-table-column>-->
			<el-table-column type="index" width="80" label="序号" />
			<el-table-column prop="customerName" label="广告投放者名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.customerName">
						<div>{{scope.row.customerName}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="title" label="标题">
				<template slot-scope="scope">
					<toolTip :content="scope.row.title">
						<div>{{scope.row.title}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="posId" label="广告位名称">
				<template slot-scope="scope">
					<selectInput :value.sync="scope.row.posId" v-if="scope.row.rowEditable">
						<el-option v-for="item in advertPosList" :key="item.name" :label="item.name" :value="item.id">
						</el-option>
					</selectInput>
					<span v-if="!scope.row.rowEditable">{{renderPosId(advertPosList, scope.row.posId)}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="状态">
				<template slot-scope="scope">
					<selectInput :value.sync="scope.row.status" v-if="scope.row.rowEditable">
						<el-option v-for="item in dataDic.statusList" :key="item.value" :label="item.value" :value="item.key">
						</el-option>
					</selectInput>
					<span v-if="!scope.row.rowEditable">{{renderDic(dataDic.statusList, scope.row.status)}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="startTime" label="开始时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.startTime">
						<span>{{scope.row.startTime}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="endTime" label="结束时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.endTime">
						<span>{{scope.row.endTime}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="createdPersonName" label="创建人">
				<template slot-scope="scope">
					<toolTip :content="scope.row.createdPersonName">
						<span>{{scope.row.createdPersonName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="createdDate" label="创建时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.createdDate">
						<span>{{scope.row.createdDate}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column label="操作"width="240px">
				<template slot-scope="scope" >
					<iconBtn type="success" v-if="scope.row.status==='0'" content="确认" @click="updateStatus(scope.row,1)">确认</iconBtn>
					<iconBtn type="danger" v-if="scope.row.status==='0'|| scope.row.status==='1' || scope.row.status==='2'" content="停止" @click="updateStatus(scope.row,3)">停止</iconBtn>
					<iconBtn iconClass="el-icon-edit" content="编辑" v-if="scope.row.status==='0'" @click="lookOver(scope.row)">编辑</iconBtn>
					<iconBtn  content="查看" v-if="scope.row.status!=='0' && scope.row.status!==''" @click="lookOver(scope.row)">查看</iconBtn>
				</template>
			</el-table-column>
		</elemTable>
		<advertisementModal :modal='advertisementModal' :advertisementModalType="modalType" @add='modalAdd' v-if='advertisementModal' @close='advertisementModalClose' :tableRow='tableRow'></advertisementModal>
	</div>
</template>
<script>
	import local from "../local.js";
	import mixin from "../mixin/mixin.js";
	import advertisementModal from "./component/modal/advertisementModal.vue";
	export default {
		mixins: [mixin],
		components: {
			advertisementModal
		},
		data() {
			return {
				dataList: [],
				searchForm: {
					customerName: "",
					posId: "",
					status: ""
				},
				advertisementModal: false,
				modalType: "",
				dataDic: {
					statusList: []
				},
				advertPosList: []
			};
		},
		mounted() {
			this.getInitData().then(this.searchTable);
		},
		methods: {
			getInitData() {
				var vm = this;
				this._ajax({
					url: this.rootAPI + 'advertisementPosition/list',
					param: {

					},
					arr: true
				}).then((function(d) {
					let data = d.aaData;
					vm.advertPosList = data
				}).bind(this))

				return this._ajax({
					url: this.rootAPI + 'datadic/list',
					param: {
						dataType: "ADVERTISEMENT_STATUS"
					},
					arr: true
				}).then((function(d) {
					let data = d.aaData;
					Object.assign(vm.dataDic, {
						statusList: data
					})
				}).bind(this))
			},
			searchTable() {
				var vm = this;
				Object.assign(this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize
				});
				return this._ajax({
					url: this.rootAPI + 'advertisement/list',
					param: this.searchForm,
					loading: 'dataLoading'
				}).then(this.renderTable)
			},
			updateStatus(row, status) {
				this.confirm(
					"确定确认该条广告？",
					function() {
						this._ajax({
							url: this.rootAPI + "advertisement/update",
							param: {
								id: row.id,
								status: status
							},
							arr: true
						}).then(this.searchTable)
					}.bind(this)
				);

			},
			addTable() {
				this.modalType = "add";
				this.tableRow = {};
				this.advertisementModal = true;
			},
			reset() {
				this.searchForm.customerName = "";
				this.searchForm.posId = "";
				this.searchForm.status = "";
				this.searchTable()
			},
			lookOver(o) {
				this.tableRow = o;
				this.modalType = "edit";
				this.advertisementModal = true;
			},
			modalAdd(o) {
				var method = o.id > 0 ? "advertisement/update" : "advertisement/create";
				this._ajax({
						url: this.rootAPI + method,
						param: o,
						arr: true
					})
					.then(
						function(d) {
							if(d.state == 0) {
								this.$message({
									type: "success",
									message: "操作成功"
								});
							} else {
								this.$message({
									type: "failure",
									message: d.msg
								});
							}
							//this.$emit("submit");
						}.bind(this)
					)
					.then(this.searchTable);
			},
			advertisementModalClose() {
				this.advertisementModal = false;
			},
			renderDic(dic, dicKey) {
				let dicShow = '';
				$.each(dic, function(i, obj) {
					if(obj.key == dicKey) {
						dicShow = obj.value;
					}
				});
				return dicShow;
			},
			renderPosId(dic, dicKey) {
				let dicShow = '';
				$.each(dic, function(i, obj) {
					if(obj.id == dicKey) {
						dicShow = obj.name;
					}
				});
				return dicShow;
			}
		}
	};
</script>