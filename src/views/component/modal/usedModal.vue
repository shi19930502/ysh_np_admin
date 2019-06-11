<template>
	<el-dialog custom-class="jz-modal" title="领用人选择" :visible="modal" :modal='false' :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
		<div class="toubu_A">
			<span class="tliel_name">
				<searchInputItems>
					<searchInputItem name="供应商名称">
						<inputItem :value.sync="searchForm.name" ref="nameInput"></inputItem>
					</searchInputItem>
					<searchInputItem name="电话号码">
						<inputItem :value.sync="searchForm.tel" ref="nameInput"></inputItem>
					</searchInputItem>
				</searchInputItems>
			</span>
			<span class="addanniu">
				<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
			</span>
		</div>
		<!-- 表格 -->
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange" @selectChange="selectChange" :highlightCurrentRow="true">
			<!-- <el-table-column type="selection" width="55"></el-table-column> -->
			<el-table-column prop="channelName" label="渠道">
				<template slot-scope="scope">
					<toolTip :content="scope.row.channelName">
						<span>{{scope.row.channelName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="用户名称">
				<template slot-scope="scope">
					<toolTip :content="scope.row.name">
						<span>{{scope.row.name}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="regId" label="身份证号或营业执照号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.regId">
						<span>{{scope.row.regId}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="tel" label="手机号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.tel">
						<span>{{scope.row.tel}}</span>
					</toolTip>
				</template>
			</el-table-column>
		</elemTable>
		<div slot="footer" class="dialog-footer flex-x-end">
			<elBtn @click="cancel" text="取消"></elBtn>
			<elBtn @click="submit" text="提交" type="primary"></elBtn>
		</div>
	</el-dialog>
</template>
<script>
	import mixin from '../../../mixin/mixin.js'
	export default {
		mixins: [mixin],
		data() {
			return {
				searchForm: {
					channelCode: '',
					name: '',
					tel: ''
				},
				dataList: [],
				selectVal: 1,
				selectOptions: [{
					label: 'a',
					value: 1
				}, {
					label: 'b',
					value: 2
				}],
				rowOBJ: {},
				rowData: "",
				//modalWidth: '70%'
			}
		},
		props: {
			modal: {
				default: false
			},
			dataDic: {
				default: {}
			},
			channelList: {
				default: {}
			},
			channelCode: {
				default: {}
			}
		},
		mounted() {
			//this.channelCode
			this.searchTable();
		},
		methods: {
			searchTable() {
				Object.assign(this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					channelCode: this.channelCode
				}) //				console.info(this.searchForm);
				return this._ajax({
					url: this.rootAPI,
					name: 'customer/queryPageByChannelCode',
					param: this.searchForm,
					loading: 'dataLoading'
				}).then(this.renderTable)
			},
			cancel() {
				this.$emit('close', '');
			},
			submit() {
				if(!this.rowData) {
					this.$message({
						type: 'info',
						message: '请选择数据'
					});
				} else {
					this.$emit('close', this.rowData);
				}
			},
			beforeClose(done) {
				this.cancel()
				done()
			},
			selectChange(val) {
				this.rowData = val;
			},
			reset() {
				this.searchForm.name = "";
				this.searchForm.tel = "";
				this.searchTable();
			},
		}
	}
</script>
<style lang="sass">
	.jz-modal {
		.toubu_B {
			height: 45px;
			border-bottom: 1px solid #D1D1D1;
			margin: 10px;
			.tliel_name {
				float: left;
				font-size: 22px;
			}
			.addanniu {
				float: right;
			}
		}
		.toubu_A {
			height: 80px;
			padding: 10px;
			.tliel_name {
				float: left
			}
			.addanniu {
				float: right;
			}
		}
	}
</style>