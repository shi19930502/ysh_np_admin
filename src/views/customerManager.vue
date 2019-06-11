<template>
	<div class="page-user">
		<!-- 查询条件 -->
		<searchInputItems>
			<searchInputItem name="渠道" v-if="thisUser.userId == 0">
				<selectInput :value.sync="searchForm.searchChannelCode" @selectChange="channelChange" :clearable="searchClearable">
					<el-option v-for="item in channelList" :key="item.name" :label="item.name" :value="item.code">
					</el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="所属市场" >
				<selectInput :value.sync="searchForm.marketId" @selectChange="searchTable" :clearable="searchClearable">
					<el-option v-for="item in marketList" :key="item.marketName" :label="item.marketName" :value="item.marketCode">
					</el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="用户类型">
				<selectInput :value.sync="searchForm.key" @selectChange="searchTable" :clearable="searchClearable">
					<el-option v-for="item in keyList" :key="item.name" :label="item.name" :value="item.code">
					</el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="经营户名称">
				<inputItem :value.sync="searchForm.name" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="联系电话">
				<inputItem :value.sync="searchForm.tel" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="法人代表">
				<inputItem :value.sync="searchForm.legalpepresent" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="用户状态">
				<selectInput :value.sync="searchForm.enabled" @selectChange="searchTable" :clearable="false">
					<el-option v-for="item in enabledList" :key="item.name" :label="item.name" :value="item.code">
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
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
					<!--<iconBtn iconClass="el-icon-search" content="系统全局数据校验" @click="dataCheck">系统全局数据校验</iconBtn>-->
					<!--<iconBtn iconClass="el-icon-refresh" content="同步数据" @click="customerSyn" v-if="customerSynSwitch">同步数据</iconBtn>-->
				</el-button-group>
			</template>
		</optionItems>
		<!-- 表格 -->
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55" v-if="sysId == 0"></el-table-column>
			<!--<el-table-column prop="channelName" label="渠道">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.channelName">
	    				<span v-if="!scope.row.rowEditable">{{scope.row.channelName}}</span>
    				</toolTip>
		      	</template>
		    </el-table-column>-->
			<el-table-column prop="id" label="备案用户ID" width="70px">
				<template slot-scope="scope">
					<toolTip :content="scope.row.id">
						<span>{{scope.row.id}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="marketName" label="所属市场">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.marketName">
	    				<span >{{scope.row.marketName}}</span>
    				</toolTip>
		      	</template>
		    </el-table-column>
			<el-table-column prop="code" label="经营户编码" width="120px">
				<template slot-scope="scope">
					<toolTip :content="scope.row.code">
						<span>{{scope.row.code}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="经营户名称" width="200">
				<template slot-scope="scope">
					<toolTip :content="scope.row.name">
						<span>{{scope.row.name}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="regId" label="工商注册号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.regId">
						<span>{{scope.row.regId}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="property" label="经营者性质">
				<template slot-scope="scope">
					<toolTip :content="_dicValue(scope.row.property, dataDic.customerProperty)">
						<span>{{_dicValue(scope.row.property, dataDic.customerProperty)}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="type" label="经营类型" width="200">
				<template slot-scope="scope">
					<toolTip :content="_dicValue(scope.row.type, dataDic.customerType)">
						<span>{{_dicValue(scope.row.type, dataDic.customerType)}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="versionStatus" label="备案时间" width="170">
				<template slot-scope="scope">
					<toolTip :content="scope.row.recordDate">
						<span>{{scope.row.recordDate}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="legalpepresent" label="法人代表">
				<template slot-scope="scope">
					<toolTip :content="scope.row.legalpepresent">
						<span>{{scope.row.legalpepresent}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="tel" label="是否分拣">
				<template slot-scope="scope">
					<toolTip :content="scope.row.isSorter == null ? '否' : _dicValue(scope.row.isSorter, dataDic.whether)">
						<span>{{scope.row.isSorter == null ? '否' : _dicValue(scope.row.isSorter, dataDic.whether)}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="tel" label="是否配送">
				<template slot-scope="scope">
					<toolTip :content="scope.row.isDistribution == null ? '否' : _dicValue(scope.row.isDistribution, dataDic.whether)">
						<span>{{scope.row.isDistribution == null ? '否' : _dicValue(scope.row.isDistribution, dataDic.whether)}}</span>
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
			<!--<el-table-column prop="remark" label="备注">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.remark">
	    				<span>{{scope.row.remark}}</span>
	    			</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="enabled" label="用户状态">
		    	<template slot-scope="scope">
		    		<toolTip :content="_dicValue(scope.row.enabled, dataDic.userStatus)">
		    			<tagItem :type="scope.row.enabled ? 'success' : 'danger'" :text="_dicValue(scope.row.enabled, dataDic.userStatus)"></tagItem>
		      		</toolTip>
		    	</template>
		    </el-table-column> -->
			<el-table-column label="操作" width="220" fixed="right">
				<template slot-scope="scope">
					<el-button-group>
						<iconBtn content="编辑" type="primary" @click="modalEdit(scope.row)">编辑</iconBtn>
						<iconBtn content="激活" type="success" @click="activateOrLogout(scope.row, 1)" v-if="scope.row.enabled == 0">激活</iconBtn>
						<iconBtn content="注销" type="warning" @click="activateOrLogout(scope.row, 0)" v-if="scope.row.enabled == 1">注销</iconBtn>
						<!--<iconBtn content="关联城市平台" plain @click="relationMerchant(scope.row)" v-if="scope.row.relationId == null">关联城市平台</iconBtn>
						<iconBtn content="取消城市平台关联" type="danger" @click="cannelMerchant(scope.row)" v-if="scope.row.relationId != null">取消城市平台关联</iconBtn>
						--><iconBtn content="用户列表" type="info" @click="showUserListDialog(scope.row)">用户列表</iconBtn>
					</el-button-group>
				</template>
			</el-table-column>
		</elemTable>
		<customerModal v-if="modalShow" :modal="modalShow" :customerModalType="modalType" @close="modalClose" :customer="modalObj" :dataDic="dataDic" :channelList="channelList" @submit="modalSubmit"></customerModal>
		<userListModal v-if="userListModalShow" :modal="userListModalShow" :userListModalType="userListModalType" @close="userListModalClose" :user="userObj" @submit="modalSubmit"></userListModal>
		<dataCheckModal v-if="dataCheckModalShow" :modal="dataCheckModalShow" @close="dataCheckModalClose"></dataCheckModal>
		<merchantModal v-if="merchantModalShow" :modal="merchantModalShow" :tableRow="tableRow" @close="merchantModalClose" @submit="merchantSubmit"></merchantModal>
	</div>
</template>
<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js'
	import customerModal from './component/modal/customerModal.vue'
	import userListModal from './component/modal/userListModal.vue'
	import dataCheckModal from './component/modal/dataCheckModal.vue'
	import merchantModal from './component/modal/merchantModal.vue'
	export default {
		mixins: [mixin],
		components: {
			customerModal,
			userListModal,
			dataCheckModal,
			merchantModal
		},
		data() {
			return {
				searchForm: {
					tel: '',
					legalpepresent: '',
					marketId: '',
					searchMarketCode: '',
					key: '',
					enabled: null
				},
				dataDic: {
					userStatus: [],
					customerProperty: [],
					customerType: []
				},
				channelList: [],
				marketList: [],
				dataList: [],
				rowOBJ: {},
				searchClearable: true,
				thisUser: local.get('userinfo'),
				userListModalShow: false,
				userObj: '',
				customerSynSwitch: false,
				keyList: [{
					name: '供应商',
					code: 'merchant'
				}, {
					name: '采购商',
					code: 'buyer'
				}/*, {
					name: '配送商',
					code: 'distribution'
				}*/],
				enabledList: [{
					name: '激活',
					code: 1
				},{
					name: '未激活',
					code: 0
				},{
					name: '全部',
					code: null
				}],
				dataCheckModalShow: false,
				merchantModalShow: false
			}
		},
		mounted() {
			this._ajax({
					url: this.rootAPI,
					name: 'customer/getCustomerSynSwitch',
					param: {}
				})
				.then((function(d) {
					if(d.aaData == 'true') {
						this.customerSynSwitch = true
					}
				}).bind(this))
			this.getInitData();
			this.searchTable();
		},
		methods: {
			getInitData() {
				//查询数据字典，用户状态
				this._searchDic('USER_STATE')
					.then((function(d) {
						let data = d.aaData;
						$.each(data, function(i, obj) {
							obj.key = Number(obj.key);
						});
						Object.assign(this.dataDic, {
							userStatus: data
						})
					}).bind(this))
				//查询数据字典，经营者类型
				this._searchDic('CUSTOMER_TYPE')
					.then((function(d) {
						let data = d.aaData;
						$.each(data, function(i, obj) {
							obj.key = Number(obj.key);
						});
						Object.assign(this.dataDic, {
							customerType: data
						})
					}).bind(this))
				this._searchDic('WHETHER')
					.then((function(d) {
						let data = d.aaData;
						$.each(data, function(i, obj) {
							obj.key = Number(obj.key);
						});
						Object.assign(this.dataDic, {
							whether: data
						})
					}).bind(this))
				//查询数据字典,经营者性质
				this._searchDic('CUSTOMER_PROPERTY')
					.then((function(d) {
						Object.assign(this.dataDic, {
							customerProperty: d.aaData
						})
					}).bind(this))
				//查询渠道数据
				this._getChannelListOnUse(local.get("sessionUser").typeCode)
					.then((function(d) {
						Object.assign(this.channelList, d.aaData)
					}).bind(this))
					
				this.initMarket();
			},
			channelChange(val) {
				this.searchForm.marketId = ''
				this.initMarket(val);
				this.searchTable();
			},
			initMarket(val) {
				this._ajax({
					url: this.rootAPI + 'market/list',
					param: {
						channelCode : val,
						enabled: "1"
					},
					arr: true
				}).then((function(d) {
					let data = d.aaData;
					this.marketList = data;
				}).bind(this))
			},
			searchTable() {
				Object.assign(this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize
				})
				return this._ajax({
					url: this.rootAPI,
					name: 'customer/queryPageByChannelCode',
					param: this.searchForm,
					loading: 'dataLoading'
				}).then(this.renderTable)
			},
			reset() {
				Object.assign(this.searchForm, {
					tel: '',
					legalpepresent: '',
					searchChannelCode: '',
					marketId: '',
					name: '',
					key: '',
					enabled: null
				})
				this.handleCurrentChange(1)
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
								url: this.rootAPI + 'customer/delete',
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
			delRow(row) {
				this.confirm('确定删除？', (function() {
					var o = {
						id: [row.id]
					}
					this._ajax({
							url: this.rootAPI + 'customer/delete',
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
			},
			activateOrLogout(row, type) {
				let user = local.get('userinfo');
				let msg = '确定激活该账户？';
				if(type == 0) msg = '确定注销该账户？';
				this.confirm(msg, (function() {
					var o = {
						id: [row.id],
						enabled: type
					}
					this._ajax({
							url: this.rootAPI + 'customer/update',
							param: o,
							arr: true
						})
						.then((function(d) {
							if(d.state != 0) this.$message({
								type: 'warning',
								message: d.msg
							});
							else this.$message({
								type: 'success',
								message: '操作成功'
							});
							this.handleCurrentChange(1)
						}).bind(this))
				}).bind(this))
			},
			cancelEdit(o) {
				Object.assign(o, this.rowOBJ[o.id])
			},
			submitEdit(o) {
				if(!o.deviceModel || !o.manufacturer) {
					this.$message({
						type: 'error',
						message: '型号或生产厂家不能为空'
					});
					o.rowError = true
				} else {
					this._ajax({
							url: this.rootAPI + 'customer/update',
							param: o,
							loading: 'dataLoading'
						})
						.then((function(d) {
							this.$message({
								type: 'success',
								message: '操作成功'
							});
							o.rowEditable = false
						}).bind(this))
				}
			},
			showUserListDialog(obj) {
				this.userObj = obj
				this.userListModalShow = true
			},
			userListModalClose() {
				this.userListModalShow = false
			},
			customerSyn() {
				this._ajax({
						url: this.rootAPI + 'customer/customerSyn',
						param: {},
						loading: 'dataLoading'
					})
					.then((function(d) {
						this.$message({
							type: 'success',
							message: '操作成功'
						});
						this.handleCurrentChange(1)
					}).bind(this))
			},
			dataCheck() {
				this.dataCheckModalShow = true;
			},
			dataCheckModalClose() {
				this.dataCheckModalShow = false;
			},
			merchantModalClose() {
				this.merchantModalShow = false;
			},
			modalClose() {
				this.modalObj = {}
				this.modalShow = false;
				this.searchTable();
			},
			relationMerchant(row) {
				this.tableRow = row;
				this.merchantModalShow = true;
			},
			merchantSubmit(row) {
				this.merchantModalShow = false;
				this._ajax({
					url: this.rootAPI + 'customer/relationMerchant',
					param: {
						id: row.id,
						relationId: row.relationId
					},
					loading: 'dataLoading'
				}).then(this.searchTable)
			},
			cannelMerchant(row) {
				this.confirm('确定取消关联？', (function() {
					this._ajax({
						url: this.rootAPI + 'customer/cannelMerchant',
						param: row,
						loading: 'dataLoading'
					}).then(this.searchTable)
				}).bind(this))

			}
		}
	}
</script>