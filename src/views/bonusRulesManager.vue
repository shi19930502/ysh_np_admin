<template>
	<el-tabs v-model="activeName" @tab-click="handleClick" class="marginClass">
		<el-tab-pane :key="item.key"
		    v-for="(item, index) in tabList"
		    :label="item.value"
		    :name="item.key">
			<!-- 查询条件 -->
			<searchInputItems>
				<searchInputItem name="奖金规格名称">
					<inputItem :value.sync="searchForm.title" placeHolder="请输入奖金规格名称"></inputItem>
				</searchInputItem>
				<searchInputItem name="规则使用日期">
		          <dateEditorDaterange :dateValue.sync="dateRange"></dateEditorDaterange>
		        </searchInputItem>
			</searchInputItems>
			<!-- 操作按钮 -->
			<optionItems>
				<template slot="right">
					<el-button-group>
						<iconBtn iconClass="el-icon-plus" content="新增" type="success" @click="addBonusRules">新增</iconBtn>
						<iconBtn iconClass="el-icon-search" content="查询" type="primary" @click="searchTable">查询</iconBtn>
						<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
					</el-button-group>
				</template>
			</optionItems>
			<!-- 表格 -->
			<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
				<!--<el-table-column type="selection" width="55"></el-table-column>-->
			    <el-table-column prop="title" label="奖金规格名称">
			    	<template slot-scope="scope">
			    		<toolTip :content="scope.row.title">
			    			<span>{{scope.row.title}}</span>
			    		</toolTip>
			      	</template>
			    </el-table-column>
			    <el-table-column prop="odds" label="中奖概率">
			    	<template slot-scope="scope">
			    		<toolTip :content="scope.row.odds">
			    			<span>{{scope.row.odds}}%</span>
			    		</toolTip>
			      	</template>
			    </el-table-column>
			    <el-table-column prop="bonusPool" label="总资金池">
			    	<template slot-scope="scope">
			    		<toolTip :content="scope.row.bonusPool">
			    			<span>{{scope.row.bonusPool}}</span>
			    		</toolTip>
			      	</template>
			    </el-table-column>
			    <el-table-column prop="bonusPerDay" label="每日资金池">
			    	<template slot-scope="scope">
			    		<toolTip :content="scope.row.bonusPerDay">
			    			<span>{{scope.row.bonusPerDay}}</span>
			    		</toolTip>
			      	</template>
			    </el-table-column>
			    <el-table-column prop="startTime" label="使用时间" width="140px">
			    	<template slot-scope="scope">
			    		<span>{{scope.row.startTime}}~{{scope.row.endTime}}</span>
			      	</template>
			    </el-table-column>
			    <el-table-column prop="bonusPerMerchant" label="单个经营户每天可中奖总额" width="170px">
			    	<template slot-scope="scope">
			    		<toolTip :content="scope.row.bonusPerMerchant">
			    			<span>{{scope.row.bonusPerMerchant}}</span>
			    		</toolTip>
			      	</template>
			    </el-table-column>
			    <el-table-column prop="startBonusAmount" label="参与活动的订单最低金额">
			    	<template slot-scope="scope">
			    		<toolTip :content="scope.row.startBonusAmount">
			    			<span>{{scope.row.startBonusAmount}}</span>
			    		</toolTip>
			      	</template>
			    </el-table-column>
			    <el-table-column prop="minBonus" label="最低中奖金额">
			    	<template slot-scope="scope">
			    		<toolTip :content="scope.row.minBonus">
			    			<span>{{scope.row.minBonus}}</span>
			    		</toolTip>
			      	</template>
			    </el-table-column>
			    <el-table-column prop="maxBonus" label="最高中奖金额">
			    	<template slot-scope="scope">
			    		<toolTip :content="scope.row.maxBonus">
			    			<span>{{scope.row.maxBonus}}</span>
			    		</toolTip>
			      	</template>
			    </el-table-column>
			    <el-table-column label="操作" width="270" fixed="right">
			    	<template slot-scope="scope">
			    		<el-button-group v-if="activeName == '1'">
			    			<iconBtn iconClass="el-icon-edit" type="info" content="编辑" @click="modalEdit(scope.row)" v-if="scope.row.status == 0 || scope.row.status == null">编辑</iconBtn>
			    			<iconBtn iconClass="el-icon-edit" type="primary" content="提交" @click="updateStatus(scope.row.id, 1)" v-if="scope.row.status == 0 || scope.row.status == null">提交</iconBtn>
			    			<iconBtn iconClass="el-icon-edit" type="warning" content="作废" @click="updateStatus(scope.row.id, 2)" v-if="scope.row.status == 1">作废</iconBtn>
			    		</el-button-group>
			    	</template>
			    </el-table-column>
			</elemTable>
		</el-tab-pane>
		<bonusRulesModal v-if="bonusRulesModalShow" :modal="bonusRulesModalShow" :bonusRulesModalType="modalType" @close="bonusRulesModalClose" :bonusRules="modalObj" @submit="modalSubmit"></bonusRulesModal>
	</el-tabs>
</template>
<script>
	import mixin from '../mixin/mixin.js'
	import bonusRulesModal from './component/modal/bonusRulesModal.vue'
	export default {
		mixins: [mixin],
		components: {bonusRulesModal},
		data() {
			return {
				dateRange:[],
				searchForm: {
					title : '',
					type: 1
				},
				dataList: [],
				rowOBJ: {},
				activeName: '1',
				tabList:[],
				measuremethodList:[],
				bonusRulesModalShow: false,
			}
		},
		mounted() {
			this.tabList.push({'key' : "1" + '', 'value' : "在用奖金规格"});
			this.tabList.push({'key' : "2" + '', 'value' : "历史奖金规格"});
			this.searchTable();
		},
		methods: {
			handleClick(tab, event) {
//		        console.log(tab, event);
				this.pageNum = 1
		        let status = this.activeName;
		        if(status == '1') {
		        	Object.assign(this.searchForm, {
		        		type : 1
	        		})
		        } else {
		        	Object.assign(this.searchForm, {
		        		type : 2
	        		})
		        }
		        this.searchTable();
		    },
			searchTable() {
				Object.assign(this.searchForm, {
					pageNum: this.pageNum, 
					pageSize: this.pageSize
				})
				if(this.dateRange && this.dateRange.length != 0) {
					Object.assign(this.searchForm, {
						startTime: this.dateRange[0],
						endTime: this.dateRange[1] + " 23:59:59",
					})
				} else {
					Object.assign(this.searchForm, {
						startTime: '',
						endTime: '',
					})
				}
				return this._ajax({name: 'bonusRules/list', param: this.searchForm, loading: 'dataLoading'}).then(this.renderTable)
			},
			reset() {
				Object.assign(this.searchForm, {
					title: '',
					startTime: '',
					endTime: '',
				})
				this.handleCurrentChange(1)
			},
			addBonusRules() {
				this.modalObj = '';
				this.modalType = 'add';
				this.bonusRulesModalShow = true;
			},
			modalEdit(row) {
				this.modalObj = row;
				this.modalType = 'edit';
				this.bonusRulesModalShow = true;
			},
			bonusRulesModalClose() {
				this.bonusRulesModalShow = false;
				this.searchTable();
			},
			updateStatus(id, status) {
				this._ajax({url: this.rootAPI + "bonusRules/update", param: {
					id : id,
					status : status,
				}})
                .then((function(d) {
                	if(d.state == 0) {
                		this.$message({ type: 'success', message: '操作成功' }); 
                    	this.handleCurrentChange(1)
                	} else {
                		this.$message({ type: 'error', message: '操作失败：'+d.msg }); 
                	}
                }).bind(this))
			},
		}
	}
</script>