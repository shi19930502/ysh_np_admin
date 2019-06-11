<template>
	<div class="page-user">
		<!-- 查询条件 -->
		<searchInputItems>
			<searchInputItem name="渠道">
				<cascaderItem :options="channelSearchList" @change="channelChange" :value.sync="channelName"></cascaderItem>
			</searchInputItem>
			<searchInputItem name="设备类型">
				<selectInput :value.sync="searchForm.deviceType" @selectChange="searchTable" :clearable="searchClearable">
					<el-option
				      v-for="item in dataDic.deviceType"
				      :key="item.value"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="生产厂家">
				<inputItem :value.sync="searchForm.manufacturer" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="设备型号">
				<inputItem :value.sync="searchForm.deviceModel" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="序列号">
				<inputItem :value.sync="searchForm.sn" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="是否启用">
				<selectInput :value.sync="searchForm.enabled" @selectChange="searchTable" :clearable="searchClearable">
					<el-option
				      v-for="item in dataDic.isEnable"
				      :key="item.value"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="是否删除">
				<selectInput :value.sync="searchForm.deleted" @selectChange="searchTable" :clearable="searchClearable">
					<el-option
				      v-for="item in dataDic.isDelete"
				      :key="item.value"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="是否领用">
				<selectInput :value.sync="searchForm.deviceCustomerId" @selectChange="searchTable" :clearable="searchClearable">
					<el-option
				      v-for="item in dataDic.whether"
				      :key="item.value"
				      :label="item.value"
				      :value="item.key">
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
					<iconBtn iconClass="el-icon-download" content="导出Excel" @click="exportExcel">导出Excel</iconBtn>
					<iconBtn iconClass="el-icon-download" content="导出所选到Excel" @click="exportExcelBySelect">导出所选到Excel</iconBtn>
				</el-button-group>
			</template>
		</optionItems>
		<!-- 表格 -->
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="channelCode" label="渠道">
		    	<template slot-scope="scope">
		    		<selectInput :value.sync="scope.row.channelCode" v-if="scope.row.rowEditable">
						<el-option
					      v-for="item in channelList"
					      :key="item.name"
					      :label="item.name"
					      :value="item.code">
					    </el-option>
					</selectInput>
					<toolTip :content="renderCommon(channelList, scope.row.channelCode)" v-if="!scope.row.rowEditable">
	    				<span v-if="!scope.row.rowEditable">{{renderCommon(channelList, scope.row.channelCode)}}</span>
    				</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="deviceType" label="设备类型">
		    	<template slot-scope="scope">
		    		<selectInput :value.sync="scope.row.deviceType" v-if="scope.row.rowEditable">
						<el-option
					      v-for="item in dataDic.deviceType"
					      :key="item.value"
					      :label="item.value"
					      :value="item.key">
					    </el-option>
					</selectInput>
					<toolTip :content="_dicValue(scope.row.deviceType, dataDic.deviceType)" v-if="!scope.row.rowEditable">
	    				<span v-if="!scope.row.rowEditable">{{_dicValue(scope.row.deviceType, dataDic.deviceType)}}</span>
    				</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="manufacturer" label="生产厂家">
		    	<template slot-scope="scope">
		    		<inputItem :value.sync="scope.row.manufacturer"  v-if="scope.row.rowEditable"></inputItem>
		    		<toolTip :content="scope.row.manufacturer" v-if="!scope.row.rowEditable">
		    			<span>{{scope.row.manufacturer}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="deviceModel" label="设备型号">
		    	<template slot-scope="scope">
		    		<inputItem :value.sync="scope.row.deviceModel"  v-if="scope.row.rowEditable"></inputItem>
		    		<toolTip :content="scope.row.deviceModel" v-if="!scope.row.rowEditable">
		    			<span>{{scope.row.deviceModel}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="sn" label="设备序列号">
		    	<template slot-scope="scope">
		    		<inputItem :value.sync="scope.row.sn"  v-if="scope.row.rowEditable"></inputItem>
		    		<toolTip :content="scope.row.sn" v-if="!scope.row.rowEditable">
		    			<span>{{scope.row.sn}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="sn" label="硬件版本号">
		    	<template slot-scope="scope">
		    		<inputItem :value.sync="scope.row.hardwareVersion"  v-if="scope.row.rowEditable"></inputItem>
		    		<toolTip :content="scope.row.hardwareVersion" v-if="!scope.row.rowEditable">
		    			<span>{{scope.row.hardwareVersion}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="sn" label="软件版本号">
		    	<template slot-scope="scope">
		    		<inputItem :value.sync="scope.row.softwareVersion"  v-if="scope.row.rowEditable"></inputItem>
		    		<toolTip :content="scope.row.softwareVersion" v-if="!scope.row.rowEditable">
		    			<span>{{scope.row.softwareVersion}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="enabled" label="是否启用">
		    	<template slot-scope="scope">
		    		<selectInput :value.sync="scope.row.enabled" v-if="scope.row.rowEditable">
						<el-option
					      v-for="item in dataDic.isEnable"
					      :key="item.value"
					      :label="item.value"
					      :value="item.key">
					    </el-option>
					</selectInput>
					<toolTip :content="_dicValue(scope.row.enabled, dataDic.isEnable)" v-if="!scope.row.rowEditable">
	    				<span v-if="!scope.row.rowEditable">{{_dicValue(scope.row.enabled, dataDic.isEnable)}}</span>
    				</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="enabled" label="是否删除">
		    	<template slot-scope="scope">
		    		<selectInput :value.sync="scope.row.deleted" v-if="scope.row.rowEditable">
						<el-option
					      v-for="item in dataDic.isDelete"
					      :key="item.value"
					      :label="item.value"
					      :value="item.key">
					    </el-option>
					</selectInput>
					<toolTip :content="_dicValue(scope.row.deleted, dataDic.isDelete)" v-if="!scope.row.rowEditable">
	    				<span v-if="!scope.row.rowEditable">{{_dicValue(scope.row.deleted, dataDic.isDelete)}}</span>
	    			</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="enabled" label="是否领用">
		    	<template slot-scope="scope">
		    		<selectInput :value.sync="scope.row.isUsed" v-if="scope.row.rowEditable">
						<el-option
					      v-for="item in dataDic.whether"
					      :key="item.value"
					      :label="item.value"
					      :value="item.key">
					    </el-option>
					</selectInput>
					<toolTip :content="_dicValue(scope.row.isUsed, dataDic.whether)" v-if="!scope.row.rowEditable">
	    				<span v-if="!scope.row.rowEditable">{{_dicValue(scope.row.isUsed, dataDic.whether)}}</span>
	    			</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="userdName" label="领用人">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.userdName">
		    			<span>{{scope.row.userdName}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <!--<el-table-column prop="createdPersonName" label="创建人">
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
		    </el-table-column>-->
		    <el-table-column label="操作" width="230">
		    	<template slot-scope="scope">
		    		<el-button-group>
		    			<iconBtn content="编辑" type="primary" @click="modalEdit(scope.row)" v-if="scope.row.isUsed == 0">编辑</iconBtn>
		    			<iconBtn content="停用" type="warning" @click="stopd(scope.row)" v-if="scope.row.deleted == 0 && scope.row.enabled == 1 && scope.row.isUsed == 0">停用</iconBtn>
		    			<iconBtn content="启用" type="success" @click="rund(scope.row)" v-if="scope.row.deleted == 0 && scope.row.enabled == 0 ">启用</iconBtn>
		    			<!-- 启用且未领用才能领用 -->
		    			<iconBtn content="领用" type="primary" @click="used(scope.row)" v-if="scope.row.deleted == 0 && scope.row.isUsed == 0 && scope.row.enabled == 1">领用</iconBtn>
		    			<iconBtn content="退还" type="primary" @click="returnd(scope.row)" v-if="scope.row.deleted == 0 && scope.row.isUsed == 1">退还</iconBtn>
					    <!--<iconBtn iconClass="el-icon-edit" content="修改" @click="modalEdit(scope.row)" v-if="!scope.row.rowEditable"></iconBtn>
					    <iconBtn iconClass="el-icon-check" type="success" content="保存" @click="submitEdit(scope.row)" v-if="scope.row.rowEditable"></iconBtn>
					    <iconBtn iconClass="el-icon-close" type="info" content="取消" @click="cancelEdit(scope.row)" v-if="scope.row.rowEditable"></iconBtn>-->
					    <iconBtn content="删除" type="danger" @click="delRow(scope.row)" v-if="scope.row.deleted == 0 && scope.row.enabled == 0">删除</iconBtn>
		    		</el-button-group>
		    	</template>
		    </el-table-column>
		</elemTable>
		<deviceModal  v-if="modalShow" :modal="modalShow" :deviceModalType="modalType" @close="modalClose" :device="modalObj" :dataDic="dataDic" :channelList="channelList" @submit="modalSubmit"></deviceModal>
		<usedModal v-if="usedModalVisible" :modal="usedModalVisible" @close="usedModalClose" :dataDic="dataDic" :channelList="channelList" :channelCode="channelCode" @submit="modalSubmit"></usedModal>
	</div>
</template>
<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js'
	import deviceModal from './component/modal/deviceModal.vue'
	import usedModal from './component/modal/usedModal.vue'
	export default {
		mixins: [mixin],
		components: {deviceModal, usedModal},
		data() {
			return {
				searchForm: {
					channelCode:'',
					deviceType: '',
					manufacturer: '',
					deviceModel:'',
					sn: '',
					enabled: '',
					deleted: '',
					deviceCustomerId:''
				},
				dataDic:{isEnable:[], deviceType:[], whether:[], isDelete:[]},
				channelList:[],
				dataList: [],
				channelCode:'',
				rowOBJ: {},
				usedModalVisible:false,
				searchClearable:true,
				channelName:[],
				channelSearchList:[]
			}
		},
		mounted() {
			this.getInitData();
			this.searchTable();
		},
		methods: {
			getInitData() {
				this._ajax({url: this.rootAPI, name: 'channel/listByParent', param: {parentChannelCode: ''}})
            .then((function(d) {
                this.channelSearchList = d.aaData      
            }).bind(this))
				//查询渠道数据
//				this._ajax({url: this.rootAPI + 'channel/list', param: {deleted : 1}, arr:true})
				this._getChannelListOnUse(local.get('sessionUser').typeCode)
				.then((function(d) {
					Object.assign(this.channelList, d.aaData)
				}).bind(this))
				//查询数据字典，是否可用
				this._searchDic('IS_ENABLED')
				.then((function(d) {
					let data = d.aaData;
					$.each(data, function(i, obj) {
						obj.key = Number(obj.key);
					});
					Object.assign(this.dataDic,{
						isEnable : data
					})
				}).bind(this))
				//查询数据字典，是否判断
				this._searchDic('WHETHER')
				.then((function(d) {
					let data = d.aaData;
					Object.assign(this.dataDic,{
						whether : data
					})
				}).bind(this))
				//查询数据字典，是否删除
				this._searchDic('IS_DELETED')
				.then((function(d) {
					let data = d.aaData;
					$.each(data, function(i, obj) {
						obj.key = Number(obj.key);
					});
					Object.assign(this.dataDic,{
						isDelete : data
					})
				}).bind(this))
				//查询数据字典设备类型
				this._searchDic('DEVICE_TYPE')
				.then((function(d) {
					Object.assign(this.dataDic,{
						deviceType : d.aaData
					})
				}).bind(this))
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
				Object.assign(this.searchForm, {
					pageNum: this.pageNum, 
					pageSize: this.pageSize
				})
				return this._ajax({url: this.rootAPI, name: 'device/list', param: this.searchForm, loading: 'dataLoading'}).then(this.renderTable)
			},
			channelChange(val) {
				if(val.length > 0) {
                    Object.assign(this.searchForm, {channelCode: val[val.length - 1]})
                }else {
                    Object.assign(this.searchForm, {channelCode: ''})
                }
               // this.searchTable()
			},
			reset() {
				Object.assign(this.searchForm, {
					channelCode:'',
					deviceType: '',
					manufacturer: '',
					deviceModel:'',
					sn: '',
					enabled: '',
					deleted: '',
					deviceCustomerId:''
				})
				this.handleCurrentChange(1)
				this.channelName = []
			},			
			dele() {			
	        	if(this.delSelection.length === 0) {
	        		this.$message({type: 'info', message: '请选择行'});
	        	}else {
	        		let selection = this.delSelection
	        		this.confirm('确定删除？', (function() {     
	        			var arr = [], o = {}
						selection.forEach(function(el) {
							arr.push(el.id)
						})
						o.id = arr
						o.deleted = 1
						this._ajax({url: this.rootAPI + 'device/update', param: o, arr:true})
						.then((function(d) {
							this.$message({type: 'success', message: '删除成功'});
							this.handleCurrentChange(1)
						}).bind(this))
	        		}).bind(this))		                        		
	        	}	
			},
			delRow(row) {
				this.confirm('确定删除？', (function() {
					let data = {}
					Object.assign(data, row, {
						deleted: 1, 
					})
					this._ajax({url: this.rootAPI + 'device/update', param: data, arr:true})
					.then((function(d) {
						this.$message({type: 'success', message: '删除成功'});
						this.handleCurrentChange(1)
					}).bind(this))
        		}).bind(this))
			},
			exportExcel() {
				var fields = ['channelCode', 'deviceType', 'manufacturer', 'deviceModel', 'sn', 
				'hardwareVersion', 'softwareVersion', 'enabled', 'deleted', 'isUsed','userdName'],
					filedsName = ['设备渠道', "设备类型", "生产厂家", "设备型号", "设备序列号", "硬件版本号", "软件版本号", "是否启用", "是否删除", "是否领用", "领用人"],
					fileName = '设备';
				this.searchAll({url: this.rootAPI, name: 'device/list', param: this.searchForm})
				.then((function(d) {
					if(d.aaData.length > 0) {
						let data = [];
						let vm = this;
						$.each(d.aaData, function(i, obj) {   
							obj.channelCode = vm.renderCommon(vm.channelList, obj.channelCode)
							obj.deviceType = vm._dicValue(obj.deviceType, vm.dataDic.deviceType) 
							obj.enabled = vm._dicValue(obj.enabled, vm.dataDic.isEnable)
							obj.deleted = vm._dicValue(obj.deleted, vm.dataDic.isDelete)
							obj.isUsed = vm._dicValue(obj.isUsed, vm.dataDic.whether)
							data.push(obj);
						});
						this._csvExport(data, fields, filedsName, fileName)
					}else {
						this.$message({ type: 'info', message: '无导出数据' });
					}
				}).bind(this))		
			},
			exportExcelBySelect() {
				var fields = ['channelCode', 'deviceType', 'manufacturer', 'deviceModel', 'sn', 
				'hardwareVersion', 'softwareVersion', 'enabled', 'deleted', 'isUsed','userdName'],
					filedsName = ['设备渠道', "设备类型", "生产厂家", "设备型号", "设备序列号", "硬件版本号", "软件版本号", "是否启用", "是否删除", "是否领用", "领用人"],
					fileName = '设备';
				let selectData = this.rowSelection;
				if(selectData.length > 0) {
					let data = [];
					let vm = this;
					$.each(selectData, function(i, obj) {   
						obj.channelCode = vm.renderCommon(vm.channelList, obj.channelCode)
						obj.deviceType = vm._dicValue(obj.deviceType, vm.dataDic.deviceType) 
						obj.enabled = vm._dicValue(obj.enabled, vm.dataDic.isEnable)
						obj.deleted = vm._dicValue(obj.deleted, vm.dataDic.isDelete)
						obj.isUsed = vm._dicValue(obj.isUsed, vm.dataDic.whether)
						data.push(obj);
					});
					this._csvExport(data, fields, filedsName, fileName)
				}else {
					this.$message({ type: 'info', message: '无导出数据' });
				}
			},
			stopd(o) {
				this.confirm('确定停止设备？', (function() {
					o.enabled = 0;
					this._ajax({url: this.rootAPI + 'device/update', param: o, loading: 'dataLoading'}).then((function(d) { 
	                	this.$message({ type: 'success', message: '操作成功' }); 
	                }).bind(this))
				}).bind(this))
			},
			rund(o) {
				this.confirm('确定启用设备？', (function() {
					o.enabled = 1;
					this._ajax({url: this.rootAPI + 'device/update', param: o, loading: 'dataLoading'}).then((function(d) { 
	                	this.$message({ type: 'success', message: '操作成功' }); 
	                }).bind(this))
				}).bind(this))
			},
			used(o) {
				this.channelCode = o.channelCode;
				if(this.channelCode) {
					this.modalObj = o
					this.usedModalVisible = true;
				} else {
					this.$message({type: 'info', message: '没有渠道信息'});
				}
			},
			returnd(o) {
				this.confirm('确定退还？', (function() {
					let user = local.get('sessionUser');
					let data = {
						deviceId : o.id,
						usingStatus : "1",
						lastModifyPersonId : user.userId,
						lastModifyPersonName : user.nickName
					}
        			this._ajax({url: this.rootAPI + 'deviceusingrecode/returnd', param: data, loading: 'dataLoading'})
                    .then((function(d) { 
                    	this.$message({ type: 'success', message: '操作成功' }); 
                    	this.handleCurrentChange(1);
                    }).bind(this))
        		}).bind(this))
			},
			/*modalEdit(o) {
				if(!this.rowOBJ[o.id]) {
					this.rowOBJ[o.id] = {}
				}
				Object.assign(this.rowOBJ[o.id], o)
				o.rowEditable = true
				
			},
			cancelEdit(o) {
				Object.assign(o, this.rowOBJ[o.id])
			},
			submitEdit(o) {
				if(!o.sn) {
					this.$message({ type: 'error', message: '设备编号不能为空' }); 
					o.rowError = true
				}else {
					this._ajax({url: this.rootAPI + 'device/update', param: o, loading: 'dataLoading'})
                        .then((function(d) { 
                        	this.$message({ type: 'success', message: '操作成功' }); 
                    		o.rowEditable = false
                        }).bind(this))
				}
			},*/
			usedModalClose(resultData) {
				if(resultData) {
					let data = {
						customerId : resultData.id,
						usingStatus : "1"
					};
					this._ajax({url: this.rootAPI + "deviceusingrecode/list", param: data})
					.then((function(d) {
//						console.info(d)
						Object.assign(data, {
							deviceId : this.modalObj.id,
						})
						if(d.dataCount > 0) {
							this.confirm('该用户已领用一个设备，是否继续领用？', (function() {
								this.createDeviceusingrecode(data)
			        		}).bind(this))
						} else {
							this.createDeviceusingrecode(data)
						}
					}).bind(this))
				} else {
					this.usedModalVisible = false;
					this.handleCurrentChange(1);
				}
			},
			createDeviceusingrecode(data) {
				this._ajax({url: this.rootAPI + "deviceusingrecode/create", param: data})
                .then((function(d) {
                	if(d.state == 0) {
                		this.$message({ type: 'success', message: '领用成功' }); 
						this.usedModalVisible = false;
						this.handleCurrentChange(1);
                	} else {
                		this.$message({ type: 'failure', message: d.msg }); 
                	}
                }).bind(this))
			}
		}
	}
</script>