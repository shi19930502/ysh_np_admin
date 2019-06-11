<template>
	<div class="orders_received">
		<div class="header_four">
			<div class="header_four_item">
				<div>昨日订单金额</div>
				<p>{{everOrderSum.yesterdayTotal}}&nbsp;<span>元</span></p>
			</div>
			<div class="header_four_item">
				<div>本周订单金额</div>
				<p>{{everOrderSum.weekTotal}}&nbsp;<span>元</span></p>
			</div>
			<div class="header_four_item">
				<div>本月订单金额</div>
				<p>{{everOrderSum.monthTotal}}&nbsp;<span>元</span></p>
			</div>
			<div class="header_four_item">
				<div>总订单金额</div>
				<p>{{everOrderSum.allTotal}}&nbsp;<span>元</span></p>
			</div>
		</div>
		<searchInputItems>
			<searchInputItem name="日期范围">
				<dateEditorDaterange :dateValue.sync="dateValue" @change="searchTable" :dateRange='dateRange'></dateEditorDaterange>
			</searchInputItem>
			<searchInputItem name="渠道">
				<selectInput :value.sync="searchForm.channelCode" @selectChange="searchTable" :disabled="isChannel">
					<el-option label="全部" value=""></el-option>
					<el-option v-for="item in channelList" :key="item.code" :label="item.name" :value="item.code">
					</el-option>
				</selectInput>
			</searchInputItem>
		</searchInputItems>
		<!-- 图表 -->
		<el-row style="margin-top: 20px;">
			<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
				<div id="orderTrend" ></div>
			</el-col>
		</el-row>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column prop="orderDate" label="订单日期">
				<template slot-scope="scope">
					<toolTip :content="scope.row.orderDate">
						<span>{{scope.row.orderDate}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="orderCount" label="订单数额">
				<template slot-scope="scope">
					<toolTip :content="scope.row.orderCount">
						<span>{{scope.row.orderCount}}</span>
					</toolTip>
				</template>
			</el-table-column>
			<el-table-column prop="orderTotal" label="订单金额">
				<template slot-scope="scope">
					<toolTip :content="scope.row.orderTotal">
						<span>{{scope.row.orderTotal}}</span>
					</toolTip>
				</template>
			</el-table-column>
		</elemTable>
	</div>
</template>

<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js' //公共方法，包括主要的ajax
	import { mapState } from 'vuex'
	var orderTrend = null;
	export default {
		mixins: [mixin],
		data() {
			return {
				dataList: [],
				pieLoading: false,
				dateValue: [],
				everOrderSum: {},
				isChannel: '',
				searchForm: {
					channelCode: ''
				},
				channelList:[],
				channelCode:'',
				loginName:'',
				chartLegend: {
	                type: 'scroll',
	                orient: 'horizontal',
	                left:  'auto',
	                right: '20%',
	                top: 25,
	                bottom: 20,
	            }
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
			this._ajax({
					name: 'channel/list',
					param: {
						level: 1
					}
				})
				.then((function(d) {
					Object.assign(this.channelList, d.aaData)
				}).bind(this))

			this.dateValue = [this.beforeDay_7, this.today] //默认时间
			this.getFourData();
			//图标初始化
			orderTrend = echarts.init(document.getElementById('orderTrend'));
			this.setorderTrend([], [],[]);
			this.searchTable();
			
		},
		methods: {
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
					channelCode:this.searchForm.channelCode,
					startTime: this.dateValue[0],
					endTime: this.dateValue[1]
				})

			//以下是获取表格数据
				this._ajax({
						url: this.rootAPI,
						name: 'order/getOrderSum',
						param: {
							pageNum: this.pageNum,
							pageSize: this.pageSize,
							cateName: this.cateName,
							orderTotal: this.orderTotal,
							orderCount:this.orderCount,
							channelCode:this.searchForm.channelCode,
							startTime: this.dateValue[0],
							endTime: this.dateValue[1],
							orderBy:'DESC'
						}
				}).then(this.renderTable)
				
				this.getFourData();
				
				this._ajax({url: this.rootAPI,name: 'order/getOrderSum', param: {
					startTime: this.dateValue[0],
					endTime: this.dateValue[1],
					channelCode:this.searchForm.channelCode,
					}}).then((d) => {
					var legenddata = ['订单金额', '订单数量'], seriesdata = [], data = d.aaData, orderCount = [], orderTotal = [], xAxisData = [],
						yAxis = []
					if(data.length > 0) {
						data.forEach(function(el) {
							orderCount.push(el.orderCount)
							orderTotal.push(el.orderTotal)
							xAxisData.push(el.orderDate)
						})
						var o = {
							name: '订单金额',
							data: orderTotal,
							areaStyle: {normal: {opacity: 0.5}},
						}
						var p = {
							name: '订单数量',
							data: orderCount,
							areaStyle: {normal: {opacity: 0.5}},
							yAxisIndex: 1
						}
						seriesdata.push(o)
						seriesdata.push(p)
						if(orderCount.length >= orderTotal.length) {
							yAxis = [
								{
									name: '订单金额',
						            type: 'value',
						            splitLine: false					            
								},
								{
									name: '订单数量',
						            type: 'value',					            				
						        }
							]
						}else {
							yAxis = [
								{
									name: '订单金额',
						            type: 'value',
								},
								{
									name: '订单数量',
						            type: 'value',
						            splitLine: false					            			
						        }
							]
						}
					}
					orderTrend.setOption(this._setLine({legend: legenddata, seriesData: seriesdata, xAxisData: xAxisData,title: '订单金额/订单总数走势图', titleX: 'center', titleTextStyle: {
							color: '#455A64',fontSize: 19,fontWeight:'normal'
						}, yAxis: yAxis}));
				})
			},
			//获取四个金额数据
			getFourData() {
				this._ajax({
						url: this.rootAPI,
						name: 'order/getEveryOrderSum',
						param: {
							channelCode:this.searchForm.channelCode,
						}
					})
					.then((d) => {
						this.everOrderSum = d.aaData[0]
					})
			},
		// 渲染图表
			renderWeightPie(d) {
				var legendData = ["订单总数"],
					seriesPriceData = [],
					seriesManeyeData=[],
					xAxisData = [];
				
				d.aaData.forEach(function(el) {
					legendData.push(el.orderTotal);//订单金额
					seriesPriceData.push(el.orderTotal);//订单金额
					legendData.push(el.orderCount);//订单数量
					seriesManeyeData.push(el.orderCount);//订单数量
					xAxisData.push(el.orderDate)
				})
				// 图表设置
				this.setorderTrend(legendData,seriesPriceData,xAxisData)
				this.setorderTrends(legendData,seriesManeyeData,xAxisData)
				// 封装导出数据
				this.csvDataList = d.aaData
			},
			setorderTrend(legenddata, seriesdata, xAxisData) {
				orderTrend.setOption(this._setLine({
					legend: legenddata,
					xAxisData: xAxisData,
					seriesData: [{
						name: '订单金额',
						data: seriesdata
					}],
					title: '订单金额/订单数走势图'
				}));
			},
			setorderTrends(legenddata, seriesdata, xAxisData) {
				orderTrend.setOption(this._setLine({
					legend: legenddata,
					xAxisData: xAxisData,
					seriesData: [{
						name: '订单数',
						data: seriesdata
					}],
					title: '订单金额/订单数走势图'
				}));
			},
		},
	}
</script>

<style lang="sass">
	/*scoped表示  CSS 只作用于当前组件中的元素*/
	/*lang="sass"表示  可以使用sass写法*/
	.orders_received {
		.header_four {
			display: flex;
			.header_four_item {
				/*flex-grow: 1;*/
				width: 25%;
				text-align: center;
				padding: 20px 5px;
				box-sizing: border-box;
				margin: 0 5px 20px 20px;
				background: #83c1ac;
				color: white;
				border-radius: 10px;
				div {
					font-size: 16px;
				}
				p {
					font-size: 28px;
					span {
						font-size: 14px;
					}
				}
			}
			.header_four_item:nth-of-type(2) {
				background: #82bf95;
			}
			.header_four_item:nth-of-type(3) {
				background: #83b9c3;
			}
			.header_four_item:nth-of-type(4) {
				background: #83a5c1;
				margin-right: 20px;
			}
		}
		#orderTrend {
			height:650px;
			width: 100%;
			background: #fff;
		}
	}
</style>