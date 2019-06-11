<template>
	<div class="page-data-xiaofei">
		<h6 style="margin: 10px 10px;">重点品种量价统计分析</h6>
		<searchInputItems>
			<searchInputItem name="日期范围">
				<dateEditorDaterange :dateValue.sync="dateRange" ></dateEditorDaterange>
			</searchInputItem>
		</searchInputItems>
		<searchInputItems>
			<searchInputItem name="统计类型">
				<el-radio v-model="searchForm.typeRadio" label="1" border >按总重量统计</el-radio>
				<el-radio v-model="searchForm.typeRadio" label="2" border >按均价统计</el-radio>
			</searchInputItem>
		</searchInputItems>
		<searchInputItems>
			<searchInputItem name="重点品种">
				<el-checkbox-group v-model="searchForm.checkList">
				    <el-checkbox :label="el.key" v-for="el in checkList">{{el.value}}</el-checkbox>
			   </el-checkbox-group>
			</searchInputItem>
			<optionItems>
				<template slot="right">
					<iconBtn content="查询" text="true" type="primary" @click="searchData()" >查询</iconBtn>
				</template>
			</optionItems>
		</searchInputItems>
		<!-- 图表 -->
		<div class="flex-x-start flex-wrap" v-loading="pieLoading">
			<div id="pricePie" style="height: 400px;width: 98%;"></div>
		</div>
		<optionItems>
			<template slot="left">
				重点品种量价统计列表
			</template>
			<template slot="right">
				<el-button-group>
					<iconBtn iconClass="el-icon-download" content="导出Excel" @click="exportExcel"></iconBtn>
				</el-button-group>				
			</template>
		</optionItems>
		<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
			<el-table-column prop="productName" label="产品名称">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.productName">
		    			<span>{{scope.row.productName}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="allWeight" label="交易总量（kg）">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.allWeight">
		    			<span>{{scope.row.allWeight}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="avgPrice" label="均价（元）">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.avgPrice">
		    			<span>{{scope.row.avgPrice}}</span>
		    		</toolTip>
		      	</template>
		    </el-table-column>
		    <el-table-column prop="dayline" label="日期">
		    	<template slot-scope="scope">
		    		<toolTip :content="scope.row.dayline">
		    			<span>{{scope.row.dayline}}</span>
		    		</toolTip>
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
				dateRange: [],
				pieLoading: false,
				searchForm:{
					startTime:'',
					endTime:'',
					typeRadio:'1',
					checkList: [],
					keyWord : local.get('sessionUser').typeCode
				},
				checkList: []
			}
		},
		mounted() {
			this.getInitData();
			// 初始化图表
			pricePie = echarts.init(document.getElementById('pricePie'));
			this.setPricePie([], []);
		},
		methods: {
			getInitData() {
				var param = {
					dataType : 'PRODUCT_LEADING_VARIETY'
				};
				this._ajax({url: this.rootAPI + 'datadic/list', param: param, arr:true})
				.then((function(d) {
					let user = local.get('sessionUser');
					let dataTemp = d.aaData;
					let data = []
					$.each(dataTemp, function(i, obj) {
						if(user.typeCode == obj.extendVal) {
							data.push(obj);
						}
					});
					this.checkList = data
				}).bind(this))
			},
			searchData() {
				if(!this.dateRange || this.dateRange.length == 0) {
					this.$message({ type: 'warning', message: '请选择日期' }); 
					return;
				}
				if(this.dateRange && this.dateRange.length > 0) {
					this.searchForm.startTime = this.dateRange[0];
					this.searchForm.endTime = this.dateRange[1];
				}
				//渲染图表
				this._ajax({url: this.rootAPI, name: 'order/varietyPriceData', param: Object.assign({}, {'jsonStr' : JSON.stringify(this.searchForm)}), loading: 'pieLoading'})
				.then(this.renderWeightPie)
				this.searchTable();
			},
			searchTable() {
				//渲染列表
				var o = {}
				Object.assign(o, {
					pageNum: this.pageNum, 
					pageSize: this.pageSize,
				}, this.searchForm)
				this._ajax({url: this.rootAPI, name: 'order/varietyPriceData', param: {'jsonStr' : JSON.stringify(o)}, loading: 'dataLoading'})
				.then(this.renderTable)
			},
			reset() {
				this.dateRange = []
				this.handleCurrentChange(1)
			},
			// 渲染图表
			renderWeightPie(d) {
				var legendData = [], seriesPriceData = [], xAxisData = [], product = {}
				// 封装数据
				d.aaData.forEach(function(el) {
					if(el.productId) {
						let productId = el.productId;
						let productName = el.productName;
						product[productId] = productName;
					}
					if(xAxisData.indexOf(el.dayline) < 0)
						xAxisData.push(el.dayline)
				})
				let searchType = this.searchForm.typeRadio;
				$.each(product, function(i, obj) {
					var productData = [];
					$.each(xAxisData, function(j, o) {
						let flagTemp = true;
						d.aaData.forEach(function(el) {
							if(i == el.productId && el.dayline == o) {
								if(searchType == '1') {
									productData.push(el.allWeight);
								} else if(searchType == '2') {
									productData.push(el.avgPrice);
								}
								flagTemp = false;
							}
						})
						if(flagTemp)
							productData.push('0');
					});
					legendData.push(product[i]);
					seriesPriceData.push({
						data: productData,
						name: product[i]
					})
				});
				// 图表设置
				this.setPricePie(legendData, seriesPriceData, xAxisData)
				// 封装导出数据
				this.csvDataList = d.aaData
			},
			setPricePie(legenddata, seriesdata, xAxisData) {
//				console.info(legenddata);
//				console.info(seriesdata);
				pricePie.clear();
				pricePie.setOption(this._setLine({
					/*legend: ['邮件营销','联盟广告'], seriesData: [
			        {
			            name:'邮件营销',
			            data:[120, 132, 101, 134, 90, 230, 210]
			        },
			        {
			            name:'联盟广告',
			            data:[220, 182, 191, 234, 290, 330, 310]
			        },]*/
			    	legend : legenddata, 
			    	legengdOption: {orient: 'horizontal'},
			    	seriesData : seriesdata, 
			    	xAxisData: xAxisData,
			    	title: ''
			    }));
			},
			exportExcel() {
				var fields = ['productName', 'allWeight', 'avgPrice', 'dayline'],
					filedsName = ['产品名称', '交易总量（kg）', '均价（元）', '日期'],
					fileName = '品种量价报表';
				this._exportExcel(this.csvDataList, fields, filedsName, fileName)		
			},
		}
	}
</script>