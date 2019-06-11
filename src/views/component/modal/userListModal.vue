<template>
	<el-dialog custom-class="jz-modal" title="备案用户对应用户列表" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
		<div class="page-user">
			<!-- 表格 -->
			<elemTable :dataList="dataList" :currentPage='pageNum' :pageSize="pageSize" :pageTotal="pageTotal" :loading="dataLoading" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @selectionChange="selectionChange">
				<el-table-column type="selection" width="55" v-if="sysId == 0"></el-table-column>
			    <el-table-column prop="nickName" label="用户名称">
			    	<template slot-scope="scope">
			    		<toolTip :content="scope.row.nickName">
			    			<span>{{scope.row.nickName}}</span>
			    		</toolTip>
			      	</template>
			    </el-table-column>
			    <el-table-column prop="loginName" label="登录帐号">
			    	<template slot-scope="scope">
			    		<toolTip :content="scope.row.loginName">
			    			<span>{{scope.row.loginName}}</span>
			    		</toolTip>
			      	</template>
			    </el-table-column>
			    <el-table-column prop="status" label="用户状态">
			    	<template slot-scope="scope">
						<tagItem :type="scope.row.status ? 'success' : 'danger'" :text="_dicValue(scope.row.status, dicUserState)"></tagItem>
				    </template>
			    </el-table-column>
			    <el-table-column prop="mobile" label="手机号">
			    	<template slot-scope="scope">
				        <inputItem :value.sync="scope.row.mobile" @blur="changeMobile(scope.row)" v-if="scope.row.rowEditable"></inputItem>
				        <toolTip :content="scope.row.mobile" v-if="!scope.row.rowEditable">
			    			<span>{{scope.row.mobile}}</span>
			    		</toolTip>
				    </template>
			    </el-table-column>
			    <el-table-column prop="identityCard" label="身份证号">
			    	<template slot-scope="scope">
			    		<toolTip :content="scope.row.identityCard">
			    			<span>{{scope.row.identityCard}}</span>
			    		</toolTip>
			      	</template>
			    </el-table-column>
			    <el-table-column label="操作" width="200">
			    	<template slot-scope="scope">
			    		<el-button-group>
						    <iconBtn iconClass="el-icon-edit" content="注销" @click="updateStatus(scope.row, 0)" v-if="scope.row.status == 1">注销</iconBtn>
						    <iconBtn iconClass="el-icon-edit" content="激活" @click="updateStatus(scope.row, 1)" v-if="scope.row.status == 0">激活</iconBtn>
						    <iconBtn iconClass="el-icon-refresh" content="重置密码" @click="resetPWD(scope.row)">重置密码</iconBtn>
			    		</el-button-group>
			    	</template>
			    </el-table-column>
			</elemTable>
		</div>
	</el-dialog>
</template>
<script>
	import mixin from '../../../mixin/mixin.js'
	import local from '../../../local.js'
	export default {
		mixins: [mixin],
		components: {},
		data() {
			return {
				searchForm: {
					nickName: '',
					loginName: '',
					status: '',
					typeCode:this.user.id,
				},
				dataList: [],				
				rowOBJ: {},
				thisUser : local.get('userinfo')
			}
		},
		props: {
			modal: {
				default: false
			},
			user: {
                default: {}
            }
		},
		mounted() {
			this._searchDic('USER_STATE')
			.then((function(d) {
				this.dicUserState = this._dicKey(d)
			}).bind(this))
			this.searchTable()
		},
		methods: {
			searchTable() {
				Object.assign(this.searchForm, {
					pageNum: this.pageNum, 
					pageSize: this.pageSize
				})
				return this._ajax({url: this.rootAPI, name: 'customer/getUserByCustomer', param: this.searchForm, loading: 'dataLoading'}).then(this.renderTable)
			},
			reset() {
				Object.assign(this.searchForm, {
					nickName: '',
					loginName: '',
					status: '',
				})
				this.handleCurrentChange(1)
			},
			resetPWD(row) {
				var param = {
					userId: row.userId,
					password: '123456',
				}
				this._comfirm('确定重置密码？重置后的密码为123456')
					.then((function() {        			
	        			return this._ajax({url: this.userAPI + 'user/update', param})
	        		}).bind(this))
	        		.then((function(d) {
                    	if(d.state == 0) {
                    		this.$message({ type: 'success', message: '密码重置成功,重置后的密码为123456' });
                    	} else {
                    		this.$message({ type: 'failure', message: d.msg }); 
                    	}
                    }).bind(this))	
	        		.catch(this._confirmCancle);                    
			},
			beforeClose() {
				this.$emit('close')
			},
			updateStatus(row, state) {
				var param = {
					userId: row.userId,
					status: state,
				}
				this._ajax({url: this.userAPI + 'user/update', param})
				.then((function(d) {
                	if(d.state == 0) {
                		this.$message({ type: 'success', message: '操作成功' });
                		this.searchTable()
                	} else {
                		this.$message({ type: 'failure', message: d.msg }); 
                	}
                }).bind(this))	
			}
		}
	}
</script>