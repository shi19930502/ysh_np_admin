<template>
	<div class="page-user">
		<!-- 查询条件 -->
		<searchInputItems>
			<searchInputItem name="渠道" v-if="!isChannel">
				<cascaderItem :options="channelList" @change="channelChange" :value.sync="channelName"></cascaderItem>
			</searchInputItem>
			<searchInputItem name="供应商名称">
				<inputItem :value.sync="searchForm.name" ref="nameInput"></inputItem>
			</searchInputItem>
			<searchInputItem name="身份证号或营业执照号">
				<inputItem :value.sync="searchForm.regId" ref="nameInput"></inputItem>
			</searchInputItem>
			<searchInputItem name="电话号码">
				<inputItem :value.sync="searchForm.tel" ref="nameInput"></inputItem>
			</searchInputItem>
		</searchInputItems>
		<!-- 操作按钮 -->
		<optionItems>
			<template slot="left">
				<el-button-group>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				</el-button-group>
			</template>
		</optionItems>
		<!-- 表格 -->
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column prop="id" label="备案用户ID">
				<template slot-scope="scope">
					<toolTip :content="scope.row.id">
						<span>{{scope.row.id}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="channelCode" label="渠道">
				<template slot-scope="scope">
					<selectInput :value.sync="scope.row.channelCode" v-if="scope.row.rowEditable">
						<el-option v-for="item in dataDic.channelList" :key="item.name" :label="item.name" :value="item.code">
						</el-option>
					</selectInput>
					<span v-if="!scope.row.rowEditable">{{renderCommon(dataDic.channelList, scope.row.channelCode)}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="code" label="经营户编码">
				<template slot-scope="scope">
					<toolTip :content="scope.row.code">
						<span>{{scope.row.code}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="经营户名称">
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
			<el-table-column prop="updateDate" label="下载跟新时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.updateDate">
						<span>{{scope.row.updateDate}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="tel" label="联系电话">
				<template slot-scope="scope">
					<toolTip :content="scope.row.tel">
						<span>{{scope.row.tel}}</span>
					</toolTip>
				</template>
			</el-table-column>
		</elemTable>
	</div>
</template>
<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js'
	export default {
		mixins: [mixin],
		data() {
			return {
				searchForm: {
					name: '',
					regId: '',
					channelCode: '',
					tel: ''
				},
				dataDic: {
					channelList: [],
				},
				channelList: [],
				isChannel: '',
				channelName: [],
			}
		},
		mounted() {
			this.getInitData();
			this.searchTable();
		},
		methods: {
			getInitData() {
				//查询渠道数据
				this._ajax({
						url: this.rootAPI,
						name: 'channel/listByParent',
						param: {
							parentChannelCode: ''
						}
					})
					.then((function(d) {
						this.channelList = d.aaData
					}).bind(this))

				return this._ajax({
						name: 'channel/list',
						param: {
							level: 1
						}
					})
					.then((function(d) {
						Object.assign(this.dataDic.channelList, d.aaData)
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
					name: 'merchant/list',
					param: this.searchForm,
					loading: 'dataLoading'
				}).then(this.renderTable)
			},
			reset() {
				Object.assign(this.searchForm, {
					name: '',
					regId: '',
					channelCode:'',
					tel: ''
				})
				this.channelName =[]
				this.searchTable();
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
		}
	}
</script>