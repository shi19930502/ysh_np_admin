<template>
	<div class="page-gradeManager"><br/>
		<!-- 查询条件 -->
		<searchInputItems>
			<!--<searchInputItem name="渠道" >
				<selectInput :value.sync="searchForm.channelCode" @selectChange="searchTable" :disabled="isChannel">
					<el-option label="全部" value=""></el-option>
					<el-option v-for="item in channelList" :key="item.code" :label="item.name" :value="item.code">
					</el-option>
				</selectInput>
			</searchInputItem >-->
			<searchInputItem name="渠道" v-if="!isChannel">
				<cascaderItem :options="channeSearchlList" @change="channelChange" :value.sync="channelName"></cascaderItem>
			</searchInputItem>
			<searchInputItem name="状态">
				<selectInput :value.sync="searchForm.state" @selectChange="searchTable">
					<el-option v-for="item in dataDic.isState" :key="item.key" :label="item.value" :value="item.key">
					</el-option>
				</selectInput>
			</searchInputItem>
		</searchInputItems>
		<!-- 操作按钮 -->
		<optionItems>
			<template slot="left">
				<el-button-group>
					<iconBtn iconClass="el-icon-plus" content="新增" @click="modalAdd">新增</iconBtn>
					<!--<iconBtn iconClass="el-icon-minus" content="删除" @click="dele"></iconBtn>-->
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
				</el-button-group>
			</template>
		</optionItems>
		<!-- 表格 -->
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="channelCode" label="渠道">
				<template slot-scope="scope">
					<selectInput :value.sync="scope.row.channelCode" v-if="scope.row.rowEditable">
						<el-option v-for="item in channelList" :key="item.name" :label="item.name" :value="item.code">
						</el-option>
					</selectInput>
					<span v-if="!scope.row.rowEditable">{{renderCommon(channelList, scope.row.channelCode)}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="effectiveDate" label="生效日期">
				<template slot-scope="scope">
					<toolTip :content="scope.row.effectiveDate">
						<span>{{scope.row.effectiveDate}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="state" label="状态">
				<template slot-scope="scope">
					<selectInput :value.sync="scope.row.state" v-if="scope.row.rowEditable">
						<el-option v-for="item in dataDic.isState" :key="item.value" :label="item.value" :value="item.key">
						</el-option>
					</selectInput>
					<span v-if="!scope.row.rowEditable">{{renderDic(dataDic.isState, scope.row.state)}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="authPersonName" label="创建人">
				<template slot-scope="scope">
					<toolTip :content="scope.row.createdPersonName">
						<span>{{scope.row.createdPersonName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="authDate" label="创建时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.createdDate">
						<span>{{scope.row.createdDate}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="authPersonName" label="审核人">
				<template slot-scope="scope">
					<toolTip :content="scope.row.authPersonName">
						<span>{{scope.row.authPersonName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="authDate" label="审核时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.authDate">
						<span>{{scope.row.authDate}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button-group>
						<iconBtn iconClass="el-icon-view" content="查看" @click="lookOver(scope.row)"></iconBtn>
						<iconBtn iconClass="el-icon-edit" content="审核" @click="auth(scope.row)" v-if="scope.row.state != 1 && scope.row.state != 2 &&scope.row.state != 3"></iconBtn>
					</el-button-group>
				</template>
			</el-table-column>
		</elemTable>
		<gradeAddModal v-if="modalShow" :modal="modalShow" :modalTitle='modalTitle' islookup='islookup' :gradeModalType="gradeModalType" @close="modalClose" :dataDic="dataDic" :channelList="channelList" :reputationList="reputationList" @submit="modalSubmit"></gradeAddModal>
		<gradeSeeViewModal :modal='gradeSeeViewModal' v-if='gradeSeeViewModal' @close='gradeSeeViewModalClose' :tableRow='tableRow'></gradeSeeViewModal>
	</div>
</template>
<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js' // 公共方法，包括主要的ajax
	import selectAreaModal from './component/modal/selectAreaModal.vue'
	import gradeAddModal from './component/modal/gradeAddModal.vue'
	import gradeSeeViewModal from './component/modal/gradeSeeViewModal.vue'
	export default {
		mixins: [mixin],
		components: {
			selectAreaModal,
			gradeAddModal,
			gradeSeeViewModal,
		},
		data() {
			return {
				searchForm: {
					channelCode: '',
					state: ''
				},
				dataDic: {
					isState: [],
					reputationList: [],
					reputationconfigList: []
				},
				dataList: [],
				channelList: [],
				channeSearchlList:[],
				//弹出框
				modalTitle: '',
				modalShow: false,
				islookup: false,
				gradeModalType: '',
				//实体数据
				reputationconfigmain: '',
				mainId: '',
				gradeSeeViewModal: false,
				authPersonId: '',
				authPersonName: '',
				channelCode: '',
				isChannel: '',
				loginName: '',
				channelName: [],

			}
		},
		mounted() {
			this.getInitData().then(this.searchTable)
		},
		methods: {
			getInitData() {
				this._ajax({
						url: this.rootAPI,
						name: 'channel/listByParent',
						param: {
							parentChannelCode: ''
						}
					})
					.then((function(d) {
						this.channeSearchlList = d.aaData
					}).bind(this))
				return this._ajax({
						name: 'channel/list',
						param: {
							enabled:1,
							deleted:0
						}
					})
					.then((function(d) {
						this.channelList=d.aaData
						//Object.assign()
					}).bind(this))

					.then((function() {
						return this._searchDic('GRADE_STATE')
					}).bind(this))
					.then((function(d) {
						this.dicEnabled = this._dicKey(d)
						Object.assign(this.dataDic, {
							isState: this._dicKey(d)
						})
					}).bind(this))
					.then((function() {
						return this._searchDic('REPUTATION_LEVEL')
					}).bind(this))
					.then((function(d) {
						this.dicEnabled = this._dicKey(d)
						Object.assign(this.dataDic, {
							reputationList: this._dicKey(d)
						})
					}).bind(this))
			},
			channelChange(val) {
				if(val.length > 0) {
					Object.assign(this.searchForm, {
						channelCode: val[val.length - 1]
					})
				} else {
					Object.assign(this.searchForm, {
						channelCode: ''
					})
				}
				// this.searchTable()
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
			renderCommon(dataList, code) {
				let dataShow = '';
				$.each(dataList, function(i, obj) {
					if(obj.code === code) {
						dataShow = obj.name;
					}
				});
				return dataShow;
			},
			searchTable() {
				let user = local.get('sessionUser');
				this.loginName = user.loginName
				this.channelCode = user.typeCode
				let typeId = user.typeId;
				if(this.loginName == 'admin' || typeId == '0' || this.channelCode == '' || this.channelCode == '0' || this.channelCode.length == 0) {
					//超级管理员
					this.isChannel = false;
				} else {
					//各渠道管理员
					this.searchForm.channelCode = this.channelCode;
					this.isChannel = true;
				}
				Object.assign(this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize
				})
				return this._ajax({
					url: this.rootAPI,
					name: 'reputationconfigmain/list',
					param: this.searchForm,
					loading: 'dataLoading'
				}).then(this.renderTable)
			},
			reset() {
				Object.assign(this.searchForm, {
					channelCode: '',
					state: ''
				})
				this.handleCurrentChange(1);
				this.channelName =[]
			},
			auth(row) {
				this.confirm('确定审核？', (function() {
					//获取当前用户的登录信息，设置问审核人员的信息
					let user = local.get('sessionUser');
					var o = {
						id: [row.id],
						state: 1, //设置审核状态
						authPersonId: user.userId,
						authPersonName: user.nickName
					}
					this._ajax({
							url: this.rootAPI + 'reputationconfigmain/auth',
							param: o,
							arr: true
						})
						.then((function(d) {
							this.$message({
								type: 'success',
								message: '审核成功'
							});
							this.handleCurrentChange(1)
						}).bind(this))
					row = "";
				}).bind(this))
			},
			modalEdit(o) {
				if(!this.rowOBJ[o.id]) {
					this.rowOBJ[o.id] = {}
				}
				Object.assign(this.rowOBJ[o.id], o)
				o.rowEditable = true
			},
			cancelEdit(o) {
				Object.assign(o, this.rowOBJ[o.id])
			},
			dele() {
				if(this.delSelection.length === 0) {
					this.$message({
						type: 'info',
						message: '请选择行'
					});
				} else {
					let selection = this.delSelection
					this.confirm('确定删除？', (function() {
						var arr = [],
							o = {}
						selection.forEach(function(el) {
							arr.push(el.id)
						})
						o.id = arr
						this._ajax({
								url: this.rootAPI + 'reputationconfigmain/delete',
								param: o,
								arr: true
							})
							.then((function(d) {
								this.$message({
									type: 'success',
									message: '删除成功'
								});
								this.handleCurrentChange(1)
							}).bind(this))
					}).bind(this))
				}
			},
			modalSearch(o) {
				var param = {
					mainId: this.mainId
				};
				this._ajax({
						url: this.rootAPI + 'reputationconfig/list',
						param: param,
						arr: true
					})
					.then((function(d) {
						let data = d.aaData;
						Object.assign(this.dataDic, {
							reputationconfigList: data
						})
					}).bind(this));

				this.modalShow2 = true;
				this.gradeModalType = 'search';
				this.islookup = true;
				this.messageRow = o;

			},
			gradeSeeViewModalClose() {
				this.gradeSeeViewModal = false;
			},
			lookOver(row) {
				this.tableRow = row;
				this.gradeSeeViewModal = true;
			}
		}
	}
</script>