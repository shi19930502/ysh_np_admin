<template>
	<div class="page-reviewManager"><br/>
		<!-- 查询条件 -->
		<searchInputItems>
			<searchInputItem name="渠道" v-if="!isChannel">
				<cascaderItem :options="channelList" @change="channelChange" :value.sync="channelName"></cascaderItem>
			</searchInputItem> 
			
			<!--<searchInputItem name="渠道">
				<selectInput :value.sync="searchForm.channelCode" @selectChange="searchTable" :disabled="isChannel">
					<el-option label="全部" value=""></el-option>
					<el-option v-for="item in channelList" :key="item.code" :label="item.name" :value="item.code">
					</el-option>
				</selectInput>
			</searchInputItem>-->
			<searchInputItem name="评价人">
				<inputItem :value.sync="searchForm.reviewPersonName" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="订单号">
				<inputItem :value.sync="searchForm.orderUmber" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="是否审核">
				<selectInput :value.sync="searchForm.isAuthed" @selectChange="searchTable">
					<el-option v-for="item in dataDic.authed" :key="item.key" :label="item.value" :value="item.key">
					</el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="评价时间">
				<dateEditorDaterange :dateValue.sync='dateValue'>
				</dateeditordaterange>
			</searchInputItem>
		</searchInputItems>
		<!-- 操作按钮 -->
		<optionItems>
			<template slot="left">
				<el-button-group>
					<iconBtn iconClass="el-icon-edit" content="批量审核通过" @click="authMany">批量审核通过</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
				</el-button-group>
			</template>
		</optionItems>

		<!-- 表格 -->
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="orderId" label="订单号">
				<template slot-scope="scope">
					<toolTip :content="scope.row.orderUmber">
						<span>{{scope.row.orderUmber}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="reviewContent" label="评价内容">
				<template slot-scope="scope">
					<toolTip :content="scope.row.reviewContent">
						<span style=" overflow: hidden;    white-space: nowrap;    text-overflow: ellipsis;">{{scope.row.reviewContent}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="reviewPersonName" label="评价人">
				<template slot-scope="scope">
					<toolTip :content="scope.row.reviewPersonName">
						<span>{{scope.row.reviewPersonName}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="reviewDate" label="评价时间">
				<template slot-scope="scope">
					<toolTip :content="scope.row.reviewDate">
						<span>{{scope.row.reviewDate}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="authed" label="状态">
				<template slot-scope="scope">
					<selectInput :value.sync="scope.row.isAuthed" v-if="scope.row.rowEditable">
						<el-option v-for="item in dataDic.authed" :key="item.value" :label="item.value" :value="item.key">
						</el-option>
					</selectInput>
					<span v-if="!scope.row.rowEditable">{{renderDic(dataDic.authed, scope.row.isAuthed)}}</span>
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
			<el-table-column label="操作" width="250px">
				<template slot-scope="scope">
					<el-button-group>
						<iconBtn type="success" @click="auth(scope.row)" content="审核通过" v-if="scope.row.isAuthed != 1 && scope.row.isAuthed != 2">审核通过</iconBtn>
						<iconBtn type="danger" @click="danger(scope.row)" content="作废" v-if="scope.row.isAuthed != 1 && scope.row.isAuthed != 2">作废</iconBtn>
						<iconBtn type="primary" @click="lookOver(scope.row)" content="详情" >详情</iconBtn>
					</el-button-group>
				</template>
			</el-table-column>
		</elemTable>
		<reviewModal :modal='reviewModal' v-if='reviewModal' @close='reviewModalClose' :tableRow='tableRow'></reviewModal>
	</div>
</template>
<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js' // 公共方法，包括主要的ajax
	import reviewModal from './component/modal/reviewModal.vue'
	export default {
		mixins: [mixin],
		components: {
			reviewModal
		},
		data() {
			return {
				searchForm: {
					reviewPersonName: '',
					orderUmber: '',
					isAuthed: '',
					startTime: "",
					endTime: "",
					channelCode: ''
				},
				dataDic: {
					authed: [],
					orderList: []
				},
				channelName:[],
				dateValue: [],
				dataList: [],
				reviewModal: false,
				isChannel: '',
				channelList:[]
			}
		},
		mounted() {
			this.getInitData().then(this.searchTable);
		},
		methods: {
			getInitData() {
				this._ajax({url: this.rootAPI, name: 'channel/listByParent', param: {parentChannelCode: ''}})
            .then((function(d) {
                this.channelList = d.aaData      
            }).bind(this))
				//查询数据字典，是否审核
				var param = {
					dataType: 'IS_AUTHED'
				};
				this._ajax({
						url: this.rootAPI + 'datadic/list',
						param: param,
						arr: true
					})
					.then((function(d) {
						let data = d.aaData;
						$.each(data, function(i, obj) {
							obj.key = Number(obj.key);
						});
						Object.assign(this.dataDic, {
							authed: data
						})
					}).bind(this))
				 return this._ajax({
						name: 'channel/list',
						param: {
							level: 1
						}
					})
					.then((function(d) {
						Object.assign(this.channelList, d.aaData)
					}).bind(this))
			},
			channelChange(val) {
				if(val.length > 0) {
                    Object.assign(this.searchForm, {channelCode: val[val.length - 1]})
                }else {
                    Object.assign(this.searchForm, {channelCode: ''})
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
			searchTable() {
				let user = local.get('sessionUser');
				this.loginName = user.loginName
				this.channelCode = user.typeCode
				let typeId =  user.typeId;
				if(this.loginName == 'admin'|| typeId == '0' || this.channelCode == '' || this.channelCode == '0' || this.channelCode.length == 0) {
					//超级管理员
					this.isChannel = false;
				} else {
					//各渠道管理员
					this.searchForm.channelCode = this.channelCode;
					this.isChannel = true;
				}
				var param = Object.assign({}, this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					startTime: this.dateValue[0],
					endTime: this.dateValue[1]

				})
				return this._ajax({
					url: this.rootAPI,
					name: 'orderitemreview/baseList',
					param: param,
					loading: 'dataLoading'
				}).then(this.renderTable)
			},
			reset() {
				Object.assign(this.searchForm, {
					reviewPersonName: "",
					orderUmber: '',
					isAuthed: '',
					channelCode:''
				})
				this.channelName = [];
				this.dateValue = [];
				this.handleCurrentChange(1)
			},
			authMany() {
				if(this.delSelection.length === 0) {
					this.$message({
						type: 'info',
						message: '请选择行'
					});
				} else {
					let selection = this.delSelection
					this.confirm('确定审核？', (function() {
						var arr = [],
							o = {}
						selection.forEach(function(el) {
							arr.push(el.id)
						})
						o.id = arr;
						//获取当前用户的登录信息，设置问审核人员的信息
						let user = local.get('sessionUser');
						o.authPersonId = user.userId;
						o.authPersonName = user.nickName;
						this._ajax({
								url: this.rootAPI + 'orderitemreview/authMany',
								param: o,
								arr: true
							})
							.then((function(d) {
								if(d.state != 0){
									this.$message({
										type: 'warning',
										message: d.msg
									});
								}else{
									this.$message({
										type: 'success',
										message: '审核成功'
									});
								}
								this.handleCurrentChange(1)
							}).bind(this))
					}).bind(this))

					this.searchTable();
				}
			},
			auth(row) {
				this.confirm('确定审核？', (function() {
					row.isAuthed = 1; //设置审核状态
					//获取当前用户的登录信息，设置问审核人员的信息
					let user = local.get('sessionUser');
					var o = {
						id: [row.id],
						isAuthed: 1, //设置审核状态
						authPersonId: user.userId,
						authPersonName: user.nickName,
						orderId:[row.orderId]
					}
					this._ajax({
							url: this.rootAPI + 'orderitemreview/auth',
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
				}).bind(this))
				this.searchTable();
			},
			danger(row) {
				this.confirm('确定作废？', (function() {
					row.isAuthed = 2; //设置审核状态
					//获取当前用户的登录信息，设置问审核人员的信息
					let user = local.get('sessionUser');
					var o = {
						id: [row.id],
						isAuthed: 2, //设置审核状态
						authPersonId: user.userId,
						authPersonName: user.nickName
					}
					this._ajax({
							url: this.rootAPI + 'orderitemreview/auth',
							param: o,
							arr: true
						})
						.then((function(d) {
							this.$message({
								type: 'success',
								message: '作废成功'
							});
							this.handleCurrentChange(1)
						}).bind(this))
				}).bind(this))
				this.searchTable();
			},
			onChangeDate(val) {
				console.log('dateValuemodel', this.dateValue)
				console.log('onChangeDate', val)
			},
			reviewModalClose() {
				this.reviewModal = false;
			},
			lookOver(row) {
				this.tableRow = row;
				this.reviewModal = true;
			}
		}
	}
</script>