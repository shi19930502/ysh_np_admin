<template>
	<div>
		<searchInputItems>
			<searchInputItem name="广告位编号">
				<inputItem :value.sync="searchForm.code"></inputItem>
			</searchInputItem>
			<searchInputItem name="广告位名称">
				<inputItem :value.sync="searchForm.name"></inputItem>
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
			<el-table-column prop="code" label="广告位编码">
				<template slot-scope="scope">
					<toolTip :content="scope.row.code">
						<div>{{scope.row.code}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="广告位名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.name">
						<div>{{scope.row.name}}</div>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="remark" label="广告位说明">
				<template slot-scope="scope">
					<toolTip :content="scope.row.remark">
						<span>{{scope.row.remark}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="状态">
				<template slot-scope="scope">
					<toolTip :content="scope.row.status==='1'?'启用' : '停用'">
						<el-tag type="success" v-if="scope.row.status==='1'">启用</el-tag>
						<el-tag type="danger" v-else>停用</el-tag>
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
			<el-table-column label="操作">
				<template slot-scope="scope">
					<iconBtn type="danger" v-if="scope.row.status==='1'" content="停用" @click="updateStatus(scope.row,0)">停用</iconBtn>
					<iconBtn type="success" v-if="scope.row.status==='0'" content="启用" @click="updateStatus(scope.row,1)">启用</iconBtn>
					<iconBtn iconClass="el-icon-edit" content="编辑" @click="lookOver(scope.row)"></iconBtn>
				</template>
			</el-table-column>
		</elemTable>
		<advertisementPositionModal :modal='advertisementPositionModal' :advertisementPositionModalType="modalType" @add='modalAdd' v-if='advertisementPositionModal' @close='advertisementPositionModalClose' :tableRow='tableRow'></advertisementPositionModal>
	</div>
</template>
<script>
	import local from "../local.js";
	import mixin from "../mixin/mixin.js";
	import advertisementPositionModal from "./component/modal/advertisementPositionModal.vue";
	export default {
		mixins: [mixin],
		components: {
			advertisementPositionModal
		},
		data() {
			return {
				dataList: [],
				searchForm: {
					code: "",
					name: "",
				},
				advertisementPositionModal: false,
				modalType: "",
			};
		},
		mounted() {
			this.searchTable();
		},
		methods: {
			searchTable() {
				Object.assign(this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize
				});
				return this._ajax({
					url: this.rootAPI,
					name: "advertisementPosition/list",
					param: this.searchForm,
					loading: "dataLoading"
				}).then(this.renderTable);
			},
			updateStatus(row, status) {
				if(status == 1) {
					this.confirm(
						"确定启用？",
						function() {
							this._ajax({
								url: this.rootAPI + "advertisementPosition/update",
								param: {
									id: row.id,
									status: status
								},
								arr: true
							}).then(this.searchTable)
						}.bind(this)
					);
				} else if(status == 0) {
					this.confirm(
						"确定停用？",
						function() {
							this._ajax({
								url: this.rootAPI + "advertisementPosition/update",
								param: {
									id: row.id,
									status: status
								},
								arr: true
							}).then(this.searchTable)
						}.bind(this)
					);
				}
			},
			addTable() {
				this.modalType = "add";
				this.tableRow = {};
				this.advertisementPositionModal = true;
			},
			reset() {
				this.searchForm.name = "";
				this.searchForm.code = "";
				this.searchTable()
			},
			lookOver(o) {
				this.tableRow = o;
				this.modalType = "edit";
				this.advertisementPositionModal = true;
			},
			modalAdd(o) {
				var method = o.id > 0 ? "advertisementPosition/update" : "advertisementPosition/create";
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
			advertisementPositionModalClose() {
				this.advertisementPositionModal = false;
			},
		}
	};
</script>