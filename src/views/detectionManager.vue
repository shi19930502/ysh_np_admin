<template>
	<div class="page-user">
		<!-- 查询条件 -->
		<searchInputItems>
			<searchInputItem name="检验单号">
				<inputItem :value.sync="searchForm.detecNum" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="检验员">
				<inputItem :value.sync="searchForm.checkUser" @enter="searchTable"></inputItem>
			</searchInputItem>
			<searchInputItem name="检验时间">
				<div class="block">
					<el-date-picker v-model="searchForm.checkDate" type="date" valueFormat="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
				</div>
			</searchInputItem>
		</searchInputItems>
		<!-- 操作按钮 -->
		<optionItems>
			<template slot="left">
				<el-button-group>
					<iconBtn iconClass="el-icon-plus" content="新增" @click="lookOver">新增</iconBtn>
					<!--<iconBtn iconClass="el-icon-minus" content="删除" @click="dele"></iconBtn>-->
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				</el-button-group>
			</template>
		</optionItems>
		<!-- 表格 -->
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="detecNum" label="检验单号">
		    	<template slot-scope="scope">
	    			<toolTip :content="scope.row.detecNum">
		    			<span>{{scope.row.detecNum}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="checkDate" label="检验时间">
		    	<template slot-scope="scope">
		    		<toolTip :content="_dateFormat({date: scope.row.checkDate})">
		    			<span>{{_dateFormat({date: scope.row.checkDate})}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="checkNum" label="检验数量">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.checkNum">
		    			<span>{{scope.row.checkNum}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="checkUser" label="检验员">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.checkUser">
		    			<span>{{scope.row.checkUser}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="state" label="状态">
		    	<template slot-scope="scope">
		    		<toolTip :content="_dicValue(scope.row.state, dataDic.auditorStatus)">
		    			<span>{{_dicValue(scope.row.state, dataDic.auditorStatus)}}</span>
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
		    <el-table-column prop="auditorName" label="审核人" >
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.auditorName">
	    				<span>{{scope.row.auditorName}}</span>
	    			</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column label="操作" width="230">
		    	<template slot-scope="scope">
		    		<el-button-group>
					    <iconBtn content="编辑" type="primary" @click="lookOver(scope.row)" v-if="scope.row.state == 1">编辑</iconBtn>
					    <iconBtn content="审核" type="warning" @click="auditor(scope.row)" v-if="scope.row.state == 1 && scope.row.canCheck != 0">审核</iconBtn>
					    <iconBtn content="打印" type="warning" @click="print(scope.row)">打印</iconBtn>
		    		</el-button-group>
		    	</template>
		    </el-table-column>
		</elemTable>
		<detectionModal ref='detectionManager' @close="modalClose" :detection="modalObj" :dataDic="dataDic" @submit="modalSubmit"></detectionModal>
		<div id="printDiv">		</div>
	</div>
</template>
<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js'
	import detectionModal from './component/modal/detectionModal.vue'
	export default {
		mixins: [mixin],
		components: {detectionModal},
		data() {
			return {
				searchForm: {
					detecNum : '',
					checkUser : '',
					checkDate : ''
				},
				dataDic:{auditorStatus:[], detectionResult:[]},
				channelList:[],
				dataList: [],
				rowOBJ: {},
				searchClearable:true
			}
		},
		mounted() {
			this.getInitData();
			this.searchTable();
		},
		methods: {
			getInitData() {
				//查询数据字典，审核状态
				var param = {
					dataType : 'AUDITOR_STATUS'
				};
				this._ajax({url: this.rootAPI + 'datadic/list', param: param, arr:true})
				.then((function(d) {
					let data = d.aaData;
					$.each(data, function(i, obj) {
						obj.key = Number(obj.key);
					});
					Object.assign(this.dataDic,{
						auditorStatus : data
					})
				}).bind(this))
				param.dataType = 'DETECTION_RESULT';
				this._ajax({url: this.rootAPI + 'datadic/list', param: param, arr:true})
				.then((function(d) {
					let data = d.aaData;
					$.each(data, function(i, obj) {
						obj.key = Number(obj.key);
					});
					Object.assign(this.dataDic,{
						detectionResult : data
					})
				}).bind(this))
			},
			searchTable() {
				Object.assign(this.searchForm, {
					pageNum: this.pageNum, 
					pageSize: this.pageSize
				})
				return this._ajax({url: this.rootAPI, name: 'detectionmain/listByCheckDetail', param: this.searchForm, loading: 'dataLoading'}).then(this.renderTable)
			},
			reset() {
				Object.assign(this.searchForm, {
					detecNum : '',
					checkUser : '',
					checkDate : ''
				})
				this.handleCurrentChange(1)
			},			
			auditor(row, type) {
				this.confirm("审核之后，该数据不能继续操作，确定审核？", (function() {
					let user = local.get('sessionUser');
        			var o = {
        				id: [row.id],
        				state : 2,
        				auditorId : user.userId,
						auditDate : this._getDate(),
        				auditorName : user.nickName
        			}
					this._ajax({url: this.rootAPI + 'detectionmain/update', param: o, arr:true})
					.then((function(d) {
						if(d.state != 0) this.$message({type: 'success', message: d.msg});
						else this.$message({type: 'success', message: '操作成功'});
						this.handleCurrentChange(1)
					}).bind(this))
        		}).bind(this))
			},
			lookOver(row) {
				this.tableRow = row;
				this.$refs.detectionManager.show(row);
			},
			modalClose() {
				this.$refs.detectionManager.closeModal()
			},
			print(row) {
				var detecNum = row.detecNum
				var title = row.title || ''
				var checkDate = this._dateFormat({date: row.checkDate}) || ''
				var checkUser = row.checkUser || ''
				var checkNum = row.checkNum || ''
				var checkDescription = row.checkDescription || ''
				var checkDescriptionHeight = (Math.floor(checkDescription.length / 50) + 1) * 50 + 'px';
				var auditorName = row.auditorName || ''
				var auditDate = row.auditDate || ''
				var mainId = row.id
				var state = row.state == 1 ? '新建' : row.state == 2 ? '审核' : '作废'
				var list = ''
				this._ajax({name: 'detectioninfo/list', param: {mainId}})
					.then((function(d) {
						if(d.aaData.length > 0) {
							var listtd = '', data = d.aaData
							data.forEach((function(el, index) {
								let productName = el.productName || ''
								let quarantineId = el.quarantineId || ''
								let checkResult;
								this.dataDic.detectionResult.forEach(function (d) {
									if(d.key===el.checkResult){
										checkResult = d.value
									}
								})
								let checkDate = this._dateFormat({date: el.checkDate}) || ''
								let checkDescription = checkDescription || ''
								let remark = el.remark || ''
								let html = `
								<tr>
									<td style="text-align: center; border: solid 1px black;word-break:break-word;">${index + 1}</td>
							        <td style="text-align: center; border: solid 1px black;word-break:break-word;">${productName}</td>
							        <td style="text-align: center; border: solid 1px black;word-break:break-word;">${quarantineId}</td>
							        <td style="text-align: center; border: solid 1px black;word-break:break-word;">${checkDate}</td>
							        <td style="text-align: center; border: solid 1px black;word-break:break-word;">${checkResult}</td>
							        <td style="text-align: center; border: solid 1px black;word-break:break-word;">${remark}</td>							  </tr>
								`
								listtd = listtd + html
							}).bind(this))
							list = `
								<tbody>
						        	<tr>
								        ${listtd}
								    </tr>
						        </tbody>
							`
						}
						var printHtml = `
							<div style="height: 70px;line-height: 70px;text-align: center;font-size: 20px;font-weight: bolder;">
								检测报告
							</div>
							<div style="text-align: right;height: 50px;line-height: 50px;font-size: 14px;">
								检验单号: ${detecNum}
							</div>
							<div style="position: relative;height: 50px;line-height: 50px;font-size: 16px;">
								<span style="position: absolute;left: 0;">检验单名称: ${title}</span>
				                <span style="position: absolute;right: 0;">检测时间: ${checkDate}</span>
							</div>
							<div style="position: relative;height: 50px;line-height: 50px;font-size: 16px;">
								<span style="position: absolute;left: 0;">检测员: ${checkUser}</span>
				                <span style="position: absolute;right: 0;">检测数量: ${checkNum}</span>
							</div>
							<div style="position: relative;height: ${checkDescriptionHeight};line-height: 50px;font-size: 16px;">
								<span style="position: absolute;left: 0;">备注: ${checkDescription}</span>
							</div>
							<div style="position: relative;height: 50px;line-height: 50px;font-size: 16px;">
								<span style="position: absolute;left: 0;">审核人: ${auditorName}</span>
				                <span style="position: absolute;right: 0;">审核时间: ${auditDate}</span>
							</div>
							<div style="position: relative;height: 50px;line-height: 50px;font-size: 16px;">
								<span style="position: absolute;left: 0;">审核状态: ${state}</span>
							</div>
							<div style="font-size: 16px;font-weight: bolder;">
								检测结果
							</div>
							<table style="text-align: center; border-collapse: collapse; width: 100%">
						        <thead style="font-size:18px;">
						            <tr>
						                <th style="text-align: center; border: solid 1px black;word-break:break-word;">序号</th>
						                <th style="text-align: center; border: solid 1px black;word-break:break-word;">商品</th>
						                <th style="text-align: center; border: solid 1px black;word-break:break-word;">检疫证号</th>
						                <th style="text-align: center; border: solid 1px black;word-break:break-word;">检测时间</th>
						                <th style="text-align: center; border: solid 1px black;word-break:break-word;">检疫结果</th>
						                <th style="text-align: center; border: solid 1px black;word-break:break-word;">备注</th>
						            </tr>
						        </thead>
						        ${list}
						    </table>
						`
						var div = document.getElementById('printDiv')
						div.innerHTML = printHtml
						$("#printDiv").jqprint();
						div.innerHTML = ''
					}).bind(this))
			}
		}
	}
</script>
<style media="print">
	@page {
		size: auto;  /* auto is the initial value */
		margin: 0mm; /* this affects the margin in the printer settings */
	}
</style>