<template>
	<div class="page-data-xiaofei">
		<searchInputItems>
			<searchInputItem name="日期范围">
				<dateEditorDaterange :dateValue.sync="dateRange" @change="searchTable"></dateEditorDaterange>
			</searchInputItem>
			<searchInputItem name="所属渠道">
				<cascaderItem :options="channelList" @change="channelChange" :value.sync="channelName"></cascaderItem>
			</searchInputItem>
		</searchInputItems>
		<optionItems>
			<template slot="left">
				<el-button-group>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
					<iconBtn iconClass="el-icon-download" content="导出Excel" @click="exportExcel">导出Excel</iconBtn>
				</el-button-group>				
			</template>
		</optionItems>
		<!-- 图表 -->
		<div class="flex-x-center flex-wrap" v-loading="pieLoading">
			<!-- <div id="weightPie" style="height: 400px;width: 500px;"></div> -->
			<div id="pricePie" style="height: 400px;width: 100%;"></div>
		</div>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column prop="cateName" label="品种名称">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.cateName">
		    			<span>{{scope.row.cateName}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <!-- <el-table-column prop="weightTotal" label="总重量">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.weightTotal">
		    			<span>{{scope.row.weightTotal}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column> -->
		    <el-table-column prop="orderTotal" label="总金额">
		    	<template slot-scope="scope">
		    		<toolTip :content="_priceFormat(scope.row.orderTotal)">
		    			<span>{{_priceFormat(scope.row.orderTotal)}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		</elemTable>		
	</div>
</template>
<script>
import mixin from '../mixin/mixin.js'
import local from '../local.js'
var weightPie = null, pricePie = null
	export default {
		mixins: [mixin],
		data() {
			return {
				searchForm: {
					channelCode: '',
					startTime: '',
					endTime: ''
				},
				dateRange: [],
				channelName: [],
				pieLoading: false,
				channelList: []
			}
		},
		mounted() {
			var user = local.get('sessionUser')
			var code = user.typeCode || ''
			Object.assign(this.searchForm, {channelCode: code})
			// 初始化图表
			// weightPie = echarts.init(document.getElementById('weightPie'));
			pricePie = echarts.init(document.getElementById('pricePie'));
			// this.setWeightPie([], [])
			this.setPricePie([], [])
			this._ajax({name: 'channel/listByParent', param: {parentChannelCode: code}})
            .then((function(d) {
                this.channelList = d.aaData
                if(this.channelList.length === 0) {
                	this._ajax({name: 'channel/listByEntity', param: {code: code}})
                	.then((function(d) {
                		this.channelList = d.aaData
                	}).bind(this))
                }      
            }).bind(this))
			this.searchTable()
		},
		methods: {
			searchTable() {
				var dateRange = {
					startTime: '',
					endTime: ''
				}				
				if(this.dateRange && this.dateRange.length > 0) {
					dateRange = {
						startTime: this.dateRange[0],
						endTime: this.dateRange[1]
					}
				}
				Object.assign(this.searchForm, dateRange)
				this._ajax({url: this.rootAPI, name: 'order/xiaofeiList', param: this.searchForm, loading: 'pieLoading'})
				.then(this.renderWeightPie)
				this._ajax({url: this.rootAPI, name: 'order/xiaofeiList', param: Object.assign({}, {
					pageNum: this.pageNum, 
					pageSize: this.pageSize,
				}, this.searchForm), loading: 'dataLoading'})
				.then(this.renderTable)
			},
			reset() {
				this.dateRange = []
				this.handleCurrentChange(1)
			},
			// 渲染图表
			renderWeightPie(d) {
				var legendData = [], seriesWeightData = [], seriesPriceData = []
				// 封装数据
				d.aaData.forEach(function(el) {
					legendData.push(el.cateName)
					seriesWeightData.push({
						value: el.weightTotal,
						name: el.cateName
					})
					seriesPriceData.push({
						value: el.orderTotal.div(100),
						name: el.cateName
					})
				})
				// 图表设置
				// this.setWeightPie(legendData, seriesWeightData)
				this.setPricePie(legendData, seriesPriceData)
				// 封装导出数据
				this.csvDataList = d.aaData
				this.csvDataList.forEach(function(el) {
					el.orderTotal = el.orderTotal.div(100)
				})
			},
			setWeightPie(legenddata, seriesdata) {
				weightPie.setOption(this._setPie({legend: legenddata, seriesData: seriesdata, title: '品种重量占比'}));
			},
			setPricePie(legenddata, seriesdata) {
				pricePie.setOption(this._setPie({legend: legenddata, seriesData: seriesdata, title: '品种金额占比'}));
			},
			exportExcel() {
				var fields = ['cateName', 'orderTotal'],
					filedsName = ['品种名称', '总金额'],
					fileName = '消费结构';
				this._exportExcel(this.csvDataList, fields, filedsName, fileName)		
			},
			channelChange(val) {
				if(val.length > 0) {
                    Object.assign(this.searchForm, {channelCode: val[val.length - 1]})
                }else {
                    Object.assign(this.searchForm, {channelCode: ''})
                }
                this.searchTable()
			},
		}
	}
</script>