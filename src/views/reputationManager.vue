<template>
	<div class="page-reputationManager"><br/>
		<!-- 查询条件 -->
		<searchInputItems>
			<searchInputItem name="渠道" v-if="!isChannel" >
				<cascaderItem  :options="channelSearchList" @change="channelChange" :value.sync="channelName"></cascaderItem>
			</searchInputItem>
			<searchInputItem name="商户名称">
				<inputItem :value.sync="searchForm.customerName" @enter="searchTable"></inputItem>
			</searchInputItem>
			<!--<searchInputItem name="商户名称">
				<selectInput :value.sync="searchForm.customerId" @selectChange="searchTable">
					<el-option label="全部" value=""></el-option>
					<el-option v-for="item in customerList" :key="item.id" :label="item.NAME" :value="item.id">
					</el-option>
				</selectInput>
			</searchInputItem>-->
			<searchInputItem name="信誉等级">
				<selectInput :value.sync="searchForm.reputationLevel" @selectChange="searchTable">
					<el-option v-for="item in dataDic.Level" :key="item.value" :label="item.value" :value="item.value">
					</el-option>
				</selectInput>
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
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
				</el-button-group>
			</template>
		</optionItems>

		<!-- 表格 -->
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="reputationLevel" label="供应商">
				<template slot-scope="scope">
					<toolTip :content="scope.row.customerName">
						<span>{{scope.row.customerName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="reputationLevel" label="信誉等级">
				<template slot-scope="scope">
					<toolTip :content="scope.row.reputationLevel">
						<span>{{scope.row.reputationLevel}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="beginCalDate" label="评价周期开始时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.beginCalDate">
						<span>{{scope.row.beginCalDate}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="endCalDate" label="评价周期截止时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.endCalDate">
						<span>{{scope.row.endCalDate}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="state" label="状态">
				<template slot-scope="scope">
					<selectInput :value.sync="scope.row.state" v-if="scope.row.rowEditable">
						<el-option v-for="item in dataDic.isState" :key="item.key" :label="item.label" :value="item.value">
						</el-option>
					</selectInput>
					<span v-if="!scope.row.rowEditable">{{renderDic(dataDic.isState, scope.row.state)}}</span>
				</template>
			</el-table-column>
		</elemTable>
	</div>
</template>
<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js' // 公共方法，包括主要的ajax
	export default {
		mixins: [mixin],
		data() {
			return {
				searchForm: {
					customerName: '',
					reputationLevel: '',
					state: '',
					channelCode: ''
				},
				dataDic: {
					Level: [],
					isState: []
				},
				customerList: [],
				isChannel: '',
				channelList: [],
				channelName: [],
				channelSearchList: []
			}
		},
		mounted() {
			this.init().then(this.searchTable)
		},
		methods: {
			init() {
				this._ajax({
						url: this.rootAPI,
						name: 'channel/listByParent',
						param: {
							parentChannelCode: ''
						}
					})
					.then((function(d) {
						this.channelSearchList = d.aaData
					}).bind(this))

				this._ajax({
						url: this.rootAPI + 'channel/list',
						param: {

						},
						arr: true
					})
					.then((function(d) {
						Object.assign(this.channelList, d.aaData)
					}).bind(this))

				return this._ajax({
						url: this.rootAPI + 'customer/queryIdAndNameList',
						param: {},
						arr: true
					})
					.then((function(d) {
						Object.assign(this.customerList, d.aaData)
					}).bind(this))

					.then((function() {
						return this._searchDic('REPUTATION_STATE')
					}).bind(this))
					.then((function(d) {
						Object.assign(this.dataDic, {
							isState: this._dicKey(d)
						})
					}).bind(this))
					.then((function() {
						return this._searchDic('REPUTATION_LEVEL')
					}).bind(this))
					.then((function(d) {
						Object.assign(this.dataDic, {
							Level: this._dicKey(d)
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
					if(obj.code == code) {
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
					name: 'reputation/baseList',
					param: this.searchForm,
					loading: 'dataLoading'
				}).then(this.renderTable)
			},
			reset() {
				Object.assign(this.searchForm, {
					customerName: '',
					reputationLevel: '',
					channelCode: '',
					state: ''
				})
				this.channelName = []
				this.handleCurrentChange(1)
			}
		}
	}
</script>