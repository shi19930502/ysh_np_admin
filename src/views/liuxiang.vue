<template>
	<div class="page-data-liuxiang">
		<searchInputItems>
			<searchInputItem name="日期范围">
				<dateEditorDaterange :dateValue.sync="dateRange" @change="searchTable"></dateEditorDaterange>
			</searchInputItem>
			<searchInputItem name="渠道">
				<selectInput :value.sync="searchForm.channelCode" @selectChange="searchTable" :disabled="isChannel">
					<el-option label="全部" value=""></el-option>
					<el-option v-for="item in channelList" :key="item.code" :label="item.name" :value="item.code">
					</el-option>
				</selectInput>
			</searchInputItem>
			<searchInputItem name="分类">
				<selectInput :value.sync="searchForm.productType" @selectChange="searchTable">
					<el-option label="全部" value=""></el-option>
					<el-option v-for="item in classifyList" :key="item.code" :label="item.vulgo" :value="item.code">
					</el-option>
				</selectInput>
			</searchInputItem>
		</searchInputItems>
		<!--<div class="feileiBX" name="分类:">
			<div>分类：</div>
			<span @click="shucai" :style="{color:dianYiSe}">fullName</span>
			<span @click="roU" :style="{color:dianYiSe1}">肉</span>
		</div>-->
		<optionItems>
			<template slot="left">
				<el-button-group>
					<iconBtn iconClass="el-icon-download" content="导出Excel" @click="exportExcel">导出Excel</iconBtn>
				</el-button-group>
			</template>
		</optionItems>
		<div class="flex-x-start flex-wrap" v-loading="pieLoading">
			<div class="yuanxing_t" id="weightPie" style="height: 400px;width: 100%;"></div>
		</div>
		<p style="color: #8C8C8C;font-size：14px;margin-left: 10px;">下表中的占比换算方法：占比  = 单品销售金额  <strong>÷</strong> 销售总金额</p>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column prop="area" label="流向地">
				<template slot-scope="scope">
					<span>{{scope.row.area}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="price" label="金额">
				<template slot-scope="scope">
					<span>{{scope.row.price}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="total" label="总金额">
				<template slot-scope="scope">
					<span>{{scope.row.total}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="priceRadio" label="占比">
				<template slot-scope="scope">
					<span>{{scope.row.priceRadio}}%</span>
				</template>
			</el-table-column>
		</elemTable>
	</div>
</template>
<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js'
	import { mapState } from 'vuex'
	var weightPie = null
	export default {
		mixins: [mixin],
		data() {
			return {
				dateRange: [],
				dianYiSe:'#000000',
			    dianYiSe1:'#000000',
				pieLoading: false,
				dataList: [],
				isChannel: '',
				searchForm:{
					channelCode:'',
					productType:'',
				},
				channelList:[],
				classifyList:[],
				channelCode:'',
				loginName:''
			}
		},
		computed: {
			...mapState([
				'today',
				'beforeDay_7',
				'beforeDay_30',
			])
		},
		mounted() {
			this.dateRange = [this.beforeDay_7, this.today]
			weightPie = echarts.init(document.getElementById('weightPie'));
			this.getInitData().then(this.searchTable);
			this.setWeightPie([], [])
		},
		methods: {
			getInitData() {
				this._ajax({
						name: 'category/queryCategorylistByParentCategoryIdIsNull',
						param: {
							productType:1,
						}
					})
					.then((function(d) {
						Object.assign(this.classifyList, d.aaData)
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

				this.dianYiSe='#0BB20C';
				var dateRange = {
					startTime: '',
					endTime: '',
				}
				if(this.dateRange && this.dateRange.length > 0) {
					dateRange = {
						startTime: this.dateRange[0],
						endTime: this.dateRange[1]
					}
				}

				this._ajax({
						url: this.rootAPI,
						name: 'order/getflowAnalysis',
						param: {
							productType: this.productType,
							startTime: this.dateRange[0],
							endTime: this.dateRange[1],
							channelCode:this.searchForm.channelCode,
							productType:this.searchForm.productType
						},
						loading: 'pieLoading'
					})
					.then(this.renderPie)
				this._ajax({
						url: this.rootAPI,
						name: 'order/getflowAnalysis',
						param: Object.assign({}, dateRange, {
							productType: this.productType,
							pageNum: this.pageNum,
							pageSize: this.pageSize,
							channelCode:this.searchForm.channelCode,
							productType:this.searchForm.productType
						}),
						loading: 'dataLoading'
					})
					.then(this.renderTable)
			},
			reset() {
				this.dateRange = []
				this.handleCurrentChange(1)
			},
			renderPie(d) {
				var legendData = [],
					seriesWeightData = []
				d.aaData.forEach(function(el) {
					legendData.push(el.area)
					seriesWeightData.push({
						value: el.price,
						name: el.area,
					})
				})
				this.setWeightPie(legendData, seriesWeightData)
				this.csvDataList = d.aaData
			},
			setWeightPie(legenddata, seriesdata) {
				weightPie.setOption(this._setPie({
					legend: legenddata,
					seriesData: seriesdata,
					title: '总量占比统计'
				}));
			},
			exportExcel() {
				var fields = ['area', 'price', 'total','priceRadio'],
					filedsName = ['流向地', '金额', '总金额','占比（%）'],
					fileName = '流向分析';
				this._exportExcel(this.csvDataList, fields, filedsName, fileName)
			},
		}
	}
</script>

<style lang="sass">
	.page-data-liuxiang {
		.feileiBX {
			width: 100%;
			line-height: 45px;
			margin-left: 60px;
			button{
				background-color:#E6E6E6;
				width:80px;
				height:40px;
			}
		}
		.feileiBX div {
			width: 80px;
			line-height: 45px;
			float: left;
			text-align: center;
		}
		.feileiBX span {
			width: 120px;
			line-height: 45px;
			text-align: center;
			margin-left: 20px;
		}
		.feileiBX span:active {
			width: 80px;
			color: #04BE02;
			line-height: 45px;
			text-align: center;
		}
	}
</style>