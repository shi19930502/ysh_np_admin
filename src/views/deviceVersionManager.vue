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
			<searchInputItem name="型号">
				<inputItem :value.sync="searchForm.deviceModel" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="是否发布">
				<selectInput :value.sync="searchForm.versionStatus" @selectChange="searchTable" :clearable="searchClearable">
					<el-option
				      v-for="item in dataDic.versionStatus"
				      :key="item.value"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				</selectInput>
			</searchInputItem><searchInputItem name="是否必须更新">
				<selectInput :value.sync="searchForm.isNeedUpdate" @selectChange="searchTable" :clearable="searchClearable">
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
					<iconBtn iconClass="el-icon-minus" content="删除" @click="dele">删除</iconBtn>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
					<!--<iconBtn iconClass="el-icon-download" content="导出Excel" @click="exportExcel"></iconBtn>
					<iconBtn iconClass="el-icon-download" content="导出所选到Excel" @click="exportExcelBySelect"></iconBtn>-->
				</el-button-group>
			</template>
		</optionItems>
		<!-- 表格 -->
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="channelCode" label="渠道">
		    	<template slot-scope="scope">
		    		<toolTip :content="renderCommon(channelList, scope.row.channelCode)" v-if="!scope.row.rowEditable">
	    				<span v-if="!scope.row.rowEditable">{{renderCommon(channelList, scope.row.channelCode)}}</span>
	    			</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="version" label="版本号">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.version" v-if="!scope.row.rowEditable">
		    			<span>{{scope.row.version}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="deviceType" label="设备类型">
		    	<template slot-scope="scope">
		    		<toolTip :content="_dicValue(scope.row.deviceType, dataDic.deviceType)" v-if="!scope.row.rowEditable">
	    				<span v-if="!scope.row.rowEditable">{{_dicValue(scope.row.deviceType, dataDic.deviceType)}}</span>
	    			</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="manufacturer" label="生产厂家">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.manufacturer" v-if="!scope.row.rowEditable">
		    			<span>{{scope.row.manufacturer}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="deviceModel" label="设备型号">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.deviceModel" v-if="!scope.row.rowEditable">
		    			<span>{{scope.row.deviceModel}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="enabled" label="是否必须更新">
		    	<template slot-scope="scope">
		    		<toolTip :content="_dicValue(scope.row.isNeedUpdate, dataDic.whether)" v-if="!scope.row.rowEditable">
	    				<span v-if="!scope.row.rowEditable">{{_dicValue(scope.row.isNeedUpdate, dataDic.whether)}}</span>
	    			</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="versionStatus" label="是否发布">
		    	<template slot-scope="scope">
		    		<toolTip :content="_dicValue(scope.row.versionStatus, dataDic.versionStatus)" v-if="!scope.row.rowEditable">
	    				<span v-if="!scope.row.rowEditable">{{_dicValue(scope.row.versionStatus, dataDic.versionStatus)}}</span>
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
		    <el-table-column label="操作">
		    	<template slot-scope="scope">
		    		<el-button-group>
					    <iconBtn content="编辑" type="primary" @click="modalEdit(scope.row)" v-if="scope.row.versionStatus != 1">编辑</iconBtn>
					    <iconBtn content="发布" type="success" @click="publish(scope.row)" v-if="scope.row.versionStatus == null || scope.row.versionStatus == '2'">发布</iconBtn>
					    <iconBtn content="删除" type="danger" @click="delRow(scope.row)" v-if="scope.row.versionStatus != 1">删除</iconBtn>
		    		</el-button-group>		    		
		    	</template>
		    </el-table-column>
		</elemTable>
		<deviceversionModal v-if="modalShow" :modal="modalShow" :deviceversionModalType="modalType" @close="modalClose" :deviceVersion="modalObj" :dataDic="dataDic" :channelList="channelList" @submit="modalSubmit"></deviceversionModal>
	</div>
</template>
<script>
	import mixin from '../mixin/mixin.js'
	import deviceversionModal from './component/modal/deviceversionModal.vue'
	export default {
		mixins: [mixin],
		components: {deviceversionModal},
		data() {
			return {
				searchForm: { 
					channelCode: '',
					deviceType: '',
					versionStatus: '',
					manufacturer: '',
					deviceModel:'',
					versionStatus:'',
					isNeedUpdate:''
				},
				dataDic:{versionStatus:[], deviceType:[], whether:[]},
				channelList:[],
				dataList: [],
				rowOBJ: {},
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
				//查询渠道数据
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
				
				this._getChannelListOnUse()
				.then((function(d) {
//					console.info(d)
					Object.assign(this.channelList, d.aaData)
				}).bind(this))
				//查询数据字典，版本状态
				this._searchDic('VERSION_STATUS')
				.then((function(d) {
					Object.assign(this.dataDic,{
						versionStatus : d.aaData
					})
				}).bind(this))
				//查询数据字典，是否判断
				this._searchDic('WHETHER')
				.then((function(d) {
					let data = d.aaData;
					$.each(data, function(i, obj) {
						obj.key = Number(obj.key);
					});
					Object.assign(this.dataDic,{
						whether : data
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
				return this._ajax({url: this.rootAPI, name: 'deviceversion/list', param: this.searchForm, loading: 'dataLoading'}).then(this.renderTable)
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
					channelCode: '',
					deviceType: '',
					versionStatus: '',
					manufacturer: '',
					deviceModel:'',
					versionStatus:'',
					isNeedUpdate:''
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
						this._ajax({url: this.rootAPI + 'deviceversion/delete', param: o, arr:true})
						.then((function(d) {
							this.$message({type: 'success', message: '删除成功'});
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
					this._ajax({url: this.rootAPI + 'deviceversion/delete', param: o, arr:true})
					.then((function(d) {
						this.$message({type: 'success', message: '删除成功'});
						this.handleCurrentChange(1)
					}).bind(this))
        		}).bind(this))
			},
			publish(row) {
				this.confirm('确定发布该版本？', (function() {
        			var o = {
        				id: [row.id],
        				versionStatus:"1"
        			}
					this._ajax({url: this.rootAPI + 'deviceversion/update', param: o, arr:true})
					.then((function(d) {
						this.$message({type: 'success', message: '发布成功'});
						this.handleCurrentChange(1)
					}).bind(this))
        		}).bind(this))
			},
			exportExcel() {
				var fields = ['sn', 'deviceType', 'deviceModel', 'manufacturer'],
					filedsName = ['设备编号', "设备类型", "设备型号", "生产厂家"],
					fileName = '设备';
				this.searchAll({url: this.rootAPI, name: 'deviceversion/list', param: this.searchForm})
				.then((function(d) {
					if(d.aaData.length > 0) {
						this._csvExport(d.aaData, fields, filedsName, fileName)
					}else {
						this.$message({ type: 'info', message: '无导出数据' });
					}
				}).bind(this))		
			},
			exportExcelBySelect() {  
				var fields = ['sn', 'deviceType', 'deviceModel', 'manufacturer'],
					filedsName = ['设备编号', "设备类型", "设备型号", "生产厂家"],
					fileName = '设备';
				this.$exportExcelBySelect(fields, filedsName, fileName)
			},
			/*modalEdit(o) {
				if(!this.rowOBJ[o.id]) {
					this.rowOBJ[o.id] = {}
				}
				Object.assign(this.rowOBJ[o.id], o)
				o.rowEditable = true
			},*/
			cancelEdit(o) {
				Object.assign(o, this.rowOBJ[o.id])
			},
			submitEdit(o) {
				if(!o.deviceModel || !o.manufacturer) {
					this.$message({ type: 'error', message: '型号或生产厂家不能为空' });
					o.rowError = true
				} else {
					this._ajax({url: this.rootAPI + 'deviceVersion/update', param: o, loading: 'dataLoading'})
                        .then((function(d) { 
                        	this.$message({ type: 'success', message: '操作成功' }); 
                    		o.rowEditable = false
                        }).bind(this))
				}
			}
		}
	}
</script>