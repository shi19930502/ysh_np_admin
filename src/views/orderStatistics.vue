<template>
	<div class="orders_received">
		<div class="toubu_A">
			<span class="tliel_name">
				<searchInputItems>
					<searchInputItem name="日期范围">
						<dateEditorDaterange :dateValue.sync="dateValue" :dateRange='dateRange'></dateEditorDaterange>
					</searchInputItem>
					<searchInputItem name="买家名称">
						<selectInput :value.sync="searchForm.buyerId" :filterable="true">
							<el-option label="全部" value=""></el-option>
							<el-option v-for="item in buyerList"  :label="item.buyerName" :value="item.buyerId" :key="item.buyerId">
							</el-option>
						</selectInput>
					</searchInputItem>
					<searchInputItem name="卖家名称">
						<selectInput :value.sync="searchForm.sellerId">
							<el-option label="全部" value=""></el-option>
							<el-option v-for="item in sellerList" :label="item.sellerName" :value="item.sellerId">
							</el-option>
						</selectInput>
					</searchInputItem>
				</searchInputItems>
			</span>
			<span class="addanniu">
				<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable" type="primary">查询</iconBtn>
				<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				<iconBtn iconClass="el-icon-download" content="导出" @click="exportExcel" type="success">导出</iconBtn>
			</span>
		</div>
		<!-- 图表 -->
		<div class="flex-x-start flex-wrap" v-loading="pieLoading">
			<div id="pricePie" style="height: 400px;width: 1650px;"></div>
		</div>
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
			<el-table-column label="操作" fixed="right" width="250">
				<template slot-scope="scope">
					<!--<el-button type="primary" @click="lookOver(scope.row)">详情</el-button>-->
					<iconBtn content="查看明细" @click="lookOver(scope.row)">查看明细</iconBtn>
				</template>
			</el-table-column>
		</elemTable>
		<orderStatisticsModal ref='orderStatistics'  :tableRow='tableRow'></orderStatisticsModal>
	</div>
</template>

<script>
	import local from '../local.js'
	import mixin from '../mixin/mixin.js' //公共方法，包括主要的ajax
	import orderStatisticsModal from './component/modal/orderStatisticsModal.vue'
	var pricePie = null;
	export default {
		mixins: [mixin],
		components: {
			orderStatisticsModal
		},
		data() {
			return {
				dataList: [],
				pieLoading: false,
				dateValue: [],
				everOrderSum: {},
				channelList: [],
                buyerList:[],
                sellerList:[],
                searchForm: [],
				sellerId: '',
				orderStatisticsModal: false,
				tableRow: {}
			}
		},
		mounted() {
            this._ajax({
                name: 'order/buyerList',
                param: {
                    level: 1,
                    sellerId: ''
                }
            })
            .then((function(d) {
                Object.assign(this.buyerList, d.aaData)
            }).bind(this))
            this._ajax({
                name: 'order/sellerList',
                param: {
                    level: 1,
                    buyerId: ''
                }
            })
            .then((function(d) {
            	console.info(d.aaData)
                Object.assign(this.sellerList, d.aaData)
            }).bind(this))
			//图标初始化
			pricePie = echarts.init(document.getElementById('pricePie'));
			this.searchTable();
		},
		methods: {
			searchTable() {
				if(this.dateValue.length == 0) {
					this.dateValue = [this.getBeforeDay_7, this.getToday];
				}
				let user = local.get('sessionUser');
				this.sellerId = user.typeCode;
				var param = Object.assign({}, this.searchForm, {
					//pageNum: this.pageNum,
					//pageSize: this.pageSize,
					/*buyerId: this.searchForm.buyerId,
					sellerId: this.searchForm.sellerId,*/
					startTime: this.dateValue[0],
					endTime: this.dateValue[1],
					//orderBy:'DESC'
				})
				this._ajax({
					url: this.rootAPI + 'order/getOrderSumAfterSort',
					param: param,
					arr: true
				}).then((function(d) {
					this.renderWeightPie(d);
					
				}).bind(this))

                param = Object.assign({}, this.searchForm, {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    cateName: this.cateName,
                    orderTotal: this.orderTotal,
                    orderCount: this.orderCount,
                   /* buyerId: this.form.buyerId,
                    sellerId: this.form.sellerId,*/
                    startTime: this.dateValue[0],
                    endTime: this.dateValue[1],
                    orderBy: 'DESC'
                });
				return this._ajax({
						url: this.rootAPI,
						name: 'order/getOrderSumAfterSort',
						param: param
					})
					.then(this.renderTable)
			},
			reset(){
				this.dateValue = [this.getBeforeDay_7, this.getToday];
                this.searchForm = [];
				this.searchTable();
			},
			exportExcel() {
				var fields = ['orderDate', 'orderCount', 'orderTotal'],
					filedsName = ['订单日期', "订单数额", "订单金额"],
					fileName = '订单统计表';
					
				if(this.dateValue.length == 0) {
					this.dateValue = [this.getBeforeDay_7, this.getToday];
				}
				let user = local.get('sessionUser');
				this.sellerId = user.typeCode;
				var param = Object.assign({}, this.searchForm, {
					//pageNum: this.pageNum,
					//pageSize: this.pageSize,
					sellerId: this.sellerId,
					startTime: this.dateValue[0],
					endTime: this.dateValue[1],
					orderBy:'DESC'
				})
				this._ajax({
					url: this.rootAPI + 'order/getOrderSumAfterSort',
					param: param,
					arr: true
				}).then((data)=>{
					this._exportExcel(data.aaData, fields, filedsName, fileName)
				})
			},
			renderWeightPie(d) {
				var legendData = ['订单金额', '订单数额'],
					seriesCount = [],
					seriesPrice = [],
					xAxisData = [],
					seriesPriceData = [],
					yAxis = []
				d.aaData.forEach(function(el) {
					//进场数据
					seriesCount.push(el.orderCount)
					//销售数据
					seriesPrice.push(el.orderTotal)
					xAxisData.push(el.orderDate)
				})
				seriesPriceData = [{
					name: '订单金额',
					data: seriesPrice,
				}, {
					name: '订单数额',
					data: seriesCount,
					yAxisIndex: 1
				}]
				if(seriesCount.length >= seriesPrice.length) {
					yAxis = [{
							name: '订单金额',
							type: 'value',
						},
						{
							name: '订单数额',
							type: 'value',
							splitLine: false
						}
					]
				} else {
					yAxis = [{
							name: '订单金额',
							type: 'value',
							splitLine: false
						},
						{
							name: '订单数额',
							type: 'value',
						}
					]
				}
				// 图表设置
				this.setPricePie(legendData, seriesPriceData, xAxisData, yAxis)
				// 封装导出数据
				this.csvDataList = d.aaData

			},
			setPricePie(legenddata, seriesdata, xAxisData, yAxis) {
				pricePie.setOption(this._setBar({
					legend: legenddata,
					xAxisData: xAxisData,
					seriesData: seriesdata,
					chartLegend: {
						type: 'scroll',
						orient: 'horizontal',
						right: '50%',
						top: 20,
						bottom: 20,
					},
					yAxis
				}));
			},
			/*orderStatisticsModalClose() {
				this.orderStatisticsModal = false;
			},*/
			showOrderStatisticsWin() {

			},
			lookOver(row) {
				this.tableRow = row;
				let data = {
					'sellerId': this.searchForm.sellerId, 
					'buyerId': this.searchForm.buyerId
				}
				Object.assign(data, row)
				//this.orderStatisticsModal = true;
                this.$refs.orderStatistics.xs_orderglModal = false;
				this.$refs.orderStatistics.show(data);
			}
		},
	}
</script>
<style lang="sass">
	.orders_received {
		.toubu_A {
			height: 80px;
			padding: 10px;
			.tliel_name {
				float: left
			}
			.addanniu {
				float: right;
			}
		}
	}
</style>