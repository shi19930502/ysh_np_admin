<template>
	<div class="page-data-xiaofei">
		<searchInputItems>
			<searchInputItem name="日期范围">
				<dateEditorDaterange :dateValue.sync="dateRange" @change="searchTable"></dateEditorDaterange>
			</searchInputItem>
		</searchInputItems>
		<optionItems>
			<template slot="left">
				<el-button-group>
					<iconBtn iconClass="el-icon-download" content="导出Excel" @click="exportExcel">导出Excel</iconBtn>
				</el-button-group>				
			</template>
		</optionItems>
		<div class="flex-x-start flex-wrap" v-loading="pieLoading">
			<div id="weightPie" style="height: 400px;width: 800px;"></div>
			<div id="pricePie" style="height: 400px;width: 800px;"></div>
		</div>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column prop="areaName" label="来源地">
		    	<template slot-scope="scope">
					<span>{{scope.row.areaName}}</span>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="weightTotal" label="总重量">
		    	<template slot-scope="scope">
	    			<span>{{scope.row.weightTotal}}</span>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="priceTotal" label="总金额">
		    	<template slot-scope="scope">
	    			<span>{{scope.row.priceTotal}}</span>
		      	</template>
		    </el-table-column>
		</elemTable>		
	</div>
</template>
<script>
import mixin from '../mixin/mixin.js'
var weightPie = null, pricePie = null
	export default {
		mixins: [mixin],
		data() {
			return {
				dateRange: [],
				pieLoading: false,
			}
		},
		mounted() {
			weightPie = echarts.init(document.getElementById('weightPie'));
			pricePie = echarts.init(document.getElementById('pricePie'));
			this.setWeightPie([], [])
			this.setPricePie([], [])
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
				this._ajax({url: this.rootAPI, name: 'inmarketdetail/listLaiyuan', param: Object.assign({}, dateRange), loading: 'pieLoading'})
				.then(this.renderPie)
				this._ajax({url: this.rootAPI, name: 'inmarketdetail/listLaiyuan', param: Object.assign({}, dateRange, {
					pageNum: this.pageNum, 
					pageSize: this.pageSize,
				}), loading: 'dataLoading'})
				.then(this.renderTable)
			},
			reset() {
				this.dateRange = []
				this.handleCurrentChange(1)
			},
			renderPie(d) {
				var legendData = [], seriesWeightData = [], seriesPriceData = []
				d.aaData.forEach(function(el) {
					legendData.push(el.areaName)
					seriesWeightData.push({
						value: el.weightTotal,
						name: el.areaName
					})
					seriesPriceData.push({
						value: el.priceTotal,
						name: el.areaName
					})
				})
				this.setWeightPie(legendData, seriesWeightData)
				this.setPricePie(legendData, seriesPriceData)
				this.csvDataList = d.aaData
			},
			setWeightPie(legenddata, seriesdata) {
				weightPie.setOption(this._setPie({legend: legenddata, seriesData: seriesdata, title: '按重量统计', labelShow: false, labelLineShow: false}));
			},
			setPricePie(legenddata, seriesdata) {
				pricePie.setOption(this._setPie({legend: legenddata, seriesData: seriesdata, title: '按金额统计', labelShow: false, labelLineShow: false}));
			},
			exportExcel() {
				var fields = ['areaName', 'weightTotal', 'priceTotal'],
					filedsName = ['来源地', '总重量', '总金额'],
					fileName = '来源分析';
				this._exportExcel(this.csvDataList, fields, filedsName, fileName)	
			},
		}
	}
</script>