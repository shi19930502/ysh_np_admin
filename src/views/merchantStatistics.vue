<template>
	<div class="page-khNolice">
		<searchInputItems>
			<searchInputItem name="渠道">
				<selectInput :value.sync="searchForm.channelCode" @selectChange="searchTable" :disabled="isChannel">
					<el-option label="全部" value=""></el-option>
					<el-option v-for="item in channelList" :key="item.code" :label="item.name" :value="item.code">
					</el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="日期范围">
				<dateEditorDaterange :dateValue.sync='dateRange'>
				</dateeditordaterange>
			</searchInputItem>
		</searchInputItems>
		<optionItems>
			<template slot="left">
				<el-button-group>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
					<iconBtn iconClass="el-icon-download" content="导出Excel" @click="exportExcel">导出Excel</iconBtn>
				</el-button-group>
			</template>
		</optionItems>
		<!-- 图表 -->
		<div class="flex-x-start flex-wrap" v-loading="pieLoading">
			<div id="pricePie" style="height: 600px;width: 1750px;"></div>
		</div>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column prop="code" label="企业编码">
				<template slot-scope="scope">
					<span>{{scope.row.code}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="企业名称">
				<template slot-scope="scope">
					<span>{{scope.row.name}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="inCountTotal" label="进场条数">
				<template slot-scope="scope">
					<span>{{scope.row.inCountTotal ? _parseFloat(scope.row.inCountTotal, 2) : scope.row.inCountTotal}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="inWeightTotal" label="进场数量">
				<template slot-scope="scope">
					<span>{{scope.row.inWeightTotal ? _parseFloat(scope.row.inWeightTotal, 2) : scope.row.inWeightTotal}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="inSimplePrice" label="进场平均单价(元)">
				<template slot-scope="scope">
					<span>{{scope.row.inSimplePrice ? _parseFloat(scope.row.inSimplePrice, 2) : scope.row.inSimplePrice}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="inPriceTotal" label="进场总金额(元)">
				<template slot-scope="scope">
					<span>{{scope.row.inPriceTotal ? _parseFloat(scope.row.inPriceTotal, 2) : scope.row.inPriceTotal}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="outCountTotal" label="出场条数">
				<template slot-scope="scope">
					<span>{{scope.row.outCountTotal ? _parseFloat(scope.row.outCountTotal, 2) : scope.row.outCountTotal}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="outWeightTotal" label="销售数量">
				<template slot-scope="scope">
					<span>{{scope.row.outWeightTotal ? _parseFloat(scope.row.outWeightTotal, 2) : scope.row.outWeightTotal}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="outSimplePrice" label="销售平均单价(元)">
				<template slot-scope="scope">
					<span>{{scope.row.outSimplePrice ? _parseFloat(scope.row.outSimplePrice, 2) : scope.row.outSimplePrice}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="outPriceTotal" label="销售总金额(元)">
				<template slot-scope="scope">
					<span>{{scope.row.outPriceTotal ? _parseFloat(scope.row.outPriceTotal, 2) : scope.row.outPriceTotal}}</span>
				</template>
			</el-table-column>

		</elemTable>
	</div>
</template>
<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js'
	var pricePie = null
	export default {
		mixins: [mixin],
		data() {
			return {
				searchForm: {
					startTime: '',
					endTime: '',
					channelCode: ''
				},
				dateRange: [],
				pieLoading: false,
				dataDic: {
					productList: [],
					storeNameList: []
				},
				channelList: [],
				dataList: [],
				isChannel: ''
			}
		},
		mounted() {
			this._ajax({
					name: 'channel/list',
					param: {
						level: 1
					}
				})
				.then((function(d) {
					Object.assign(this.channelList, d.aaData)
				}).bind(this))
			pricePie = echarts.init(document.getElementById('pricePie'));
			this.searchTable();
		},
		methods: {
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
				if(this.dateRange.length == 0) {
					this.dateRange = [this.getBeforeDay_7,this.getToday];
				}
				var param = Object.assign({}, this.searchForm, {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					startTime: this.dateRange[0],
					endTime: this.dateRange[1]
				})

				this._ajax({
						url: this.rootAPI,
						name: 'customer/statisticsList',
						param: param,
						loading: 'pieLoading'
					})
					.then(this.renderWeightPie)

				this._ajax({
					url: this.rootAPI,
					name: 'customer/statisticsList',
					param: param,
					loading: 'dataLoading'
				}).then(this.renderTable)
			},
			reset() {
				this.dateRange = [];
				this.handleCurrentChange(1);
				this.searchForm.channelCode = ''
				this.searchTable();
			},
			// 渲染图表
			renderWeightPie(d) {
				var legendData = ['进场金额', '销售金额'],
					seriesInData = [],
					seriesOutData = [],
					xAxisData = [],
					seriesPriceData = []
				d.aaData.forEach(function(el) {
					//进场数据
					seriesInData.push(el.inPriceTotal.toFixed(2))
					//销售数据
					seriesOutData.push(el.outPriceTotal.toFixed(2))
					xAxisData.push(el.name)
				})
				seriesPriceData = [{
					name: '进场金额',
					data: seriesInData
				}, {
					name: '销售金额',
					data: seriesOutData
				}]
				// 图表设置
				this.setPricePie(legendData, seriesPriceData, xAxisData)
				// 封装导出数据
				this.csvDataList = d.aaData

			},
			setPricePie(legenddata, seriesdata, xAxisData) {
				pricePie.setOption(this._setBar({
					legend: legenddata,
					xAxisData: xAxisData,
					seriesData: seriesdata,
					chartLegend: {
		                type: 'scroll',
		                orient: 'horizontal',
		                left:  'auto',
		                right: '50%',
		                top: 20,
		                bottom: 20,
	            	},
	            	axisLabel: {
	            		interval: 0,
	            		rotate: 45,
                        showMinLabel: true,
                        showMaxLabel: true,
                        formatter: function(value, index) {
                          var str = value
                          if(value.length > 5) {
                            str = value.slice(0,4) + '...'
                          }
                          return str
                        }
	            	}
				}));
			},
			exportExcel() {
				this.csvDataList.forEach(function(map) {
					for(var key in map) {
						if(key == 'code') {
							map[key] = "'"+map[key];
							console.log(map[key]);
						}
					}
				})
				var fields = ['code', 'name', 'inCountTotal', 'inSimplePrice', 'inWeightTotal', 'inPriceTotal', 'outCountTotal', 'outWeightTotal', 'outSimplePrice', 'outPriceTotal'],
					filedsName = ['企业编码', '企业名称', '入场条数', '入场平均单价(元)', '入场总质量(kg)', '进场总金额(元)', '出场条数', '出场总质量(kg)', '出场平均单价(元)', '出场总金额(元)'],
					fileName = '商户销量前十数据表';
				this._exportExcel(this.csvDataList, fields, filedsName, fileName)
			}
		}
	}
</script>