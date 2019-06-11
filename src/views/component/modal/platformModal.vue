<template>
	<div class="platformModal">
		<el-dialog :width='eWidth' :title="modalTitle" :close-on-click-modal='false' :visible="modal" :before-close='beforeClose'>
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			    <el-tab-pane label="平台公告消息" name="first">
            		<el-form class="modal-form" v-if="modal" :model="formComputed" ref="form" :inline="true" :rules="rules" label-width="110px">
				    	<el-row>
                    		<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
				    			<el-form-item  label="渠道" prop="channelName" class="row-block">
									<selectInput 
										:disabled='formDisabled'
										:value.sync='formComputed.channelName'
									    :filterable='channelFilterable'
									    @selectChange="changeChannel"
									    >
								    	<el-option 
										    	v-for="item in channelOptions" 
										    	:key="item.code" 
										    	:label="item.name" 
										    	:value="item.code">
							   				</el-option>
							    	</selectInput>
									<!--<inputItem  v-else :disabled='formDisabled' :value.sync='formComputed.channelName'  class="inputStyle"></inputItem>	
									-->
				    			</el-form-item>
				    		</el-col>
				    	</el-row>
				    	<el-row>
                    		<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
				    			<el-form-item label="用户类型"  prop="userType" v-if='ptxxck' class="row-block">
									<selectInput  :disabled='formDisabled'
										:value.sync='formComputed.userType'
									    :filterable='channelFilterable'
									    @selectChange="changeUserType"
									    >
								    		<el-option 
										    	v-for="item in userTypeList" 
										    	:key="item.key" 
										    	:label="item.value" 
										    	:value="item.key"
										    	>
							   				</el-option>
							    	</selectInput>
									<!--<inputItem  v-else  :disabled='formDisabled' :value.sync="formComputed.userType"  class="inputStyle"></inputItem>	
				    			--></el-form-item>
				    		</el-col>
				    	</el-row>
				    	<el-row>
                    		<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
				    			<el-form-item label="标题"  prop="title" class="row-block">
									<inputItem :value.sync='formComputed.title' :disabled='lookup' maxlength="50"  class="inputStyle"></inputItem>
				    			</el-form-item>
				    		</el-col>
				    	</el-row>
				    	<el-row>
                    		<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
				    			<el-form-item label="内容" prop="comment" class="row-block">
				    				<inputItem
				    					:disabled='lookup'
				    					type='textarea'
				    					maxlength="150"
				    					:value.sync='formComputed.comment'  class="inputStyle">
				    				</inputItem>
				    			</el-form-item>
				    		</el-col>
				    	</el-row>
				    	
				    	<el-row>
                    		<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
				    			<el-form-item v-if='modalTitle == "编辑" || modalTitle == "新增"' label="附件" label-width='130px' >
				    				<uploadItem
				    					:limit='limit'
				    					:listType='listType'
				    					:multiple='multiple'
				    					:uploadTip='uploadTip'
				    					:uploadData='uploadParam'
				    					@success='uploadSuccess'
				    					@remove='onRemove'
				    					:fileList='attachmentList'
				    					:on-exceed="handleExceed"
				    					></uploadItem>
				    					<span class="unpdataTS">一次性最多只能上传3个文件，附件限制10M！</span>
				    			</el-form-item>
				    			<el-form-item class='downloadAccessoryF' v-else label="下载附件" label-width='130px' prop="comment">
				    				<div class="downloadAccessory" v-for='item in downloadAccessory'>
					    				<a  :href="item.fullFilePath"  :download="item.fileName" :title="item.fileName">
					    					{{item.fileName}}
					    				</a>
				    				</div>
				    			</el-form-item>
				    		</el-col>
				    	</el-row>
				    	 <div style="float: right;" v-if="isShowNext" class="dialog-footer flex-x-end">
			                <!--<elBtn :style="{display:xiaoshi}" @click="cancel" text="取消" ></elBtn>-->
			                <el-button @click="submit(3)" v-if="lookup!=true" type="primary">提交消息,选择发送范围</el-button>
			        	</div>
				    </el-form>
			    </el-tab-pane>
				<el-tab-pane label="发送范围" name="second" :disabled="moduleSwitch">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<div class="pepoerFREASHcss" v-if="modalTitle!='新增'">
								<searchInputItems>
									<searchInputItem name="接收人">
										<inputItem :value.sync="inNickNameSearch" placeHolder="请输入接收人查询"></inputItem>
									</searchInputItem>
									<optionItems style="padding: 0;">
										<template slot="right">
											<el-button-group>
												<iconBtn iconClass="el-icon-search" content="查询" @click="queryInUserList()" type="primary">查询</iconBtn>
											</el-button-group>
											<el-button-group>
												<iconBtn iconClass="el-icon-refresh" content="重置" @click="resetQueryInUserList()">重置</iconBtn>
											</el-button-group>
										</template>
									</optionItems>
								</searchInputItems>
							</div>
						</div>
						<optionItems>
							<template slot="left">
								<el-button-group>
									<iconBtn iconClass="el-icon-plus" content="添加接收人"   @click="queryOutUserList()" :disabled='lookup' v-if="!isModify">添加接收人</iconBtn>
								</el-button-group>
							</template>
							<template slot="right" v-if="!isModify">
								<el-button-group>
									<iconBtn iconClass="el-icon-delete" content="批量删除" @click="batchDelete" type="warning">批量删除</iconBtn>
									<iconBtn iconClass="el-icon-delete" content="一键删除所有" @click="wholeDelete" type="danger">一键删除所有</iconBtn>
								</el-button-group>
							</template>
						</optionItems>
						<elemTable :dataList="inCustomerTableData" :currentPage='customerPageNum'  :pageSize="customerPageSize" :pageTotal="customerPageTotal" :loading="dataLoading" @sizeChange="custoemrHandleSizeChange" @currentChange="custoemrHandleCurrentChange" @selectionChange="selectionChange">
							<el-table-column type="selection" width="55" v-if="!isModify"></el-table-column>
							<el-table-column prop="nickName" label="接收人名称">
								<template slot-scope="scope">
									<span>{{scope.row.nickName}}</span>
								</template>
							</el-table-column>
							<el-table-column label="操作" width="120" v-if="!isModify">
								<template slot-scope="scope">
									<el-button-group>
										<iconBtn type="info" content="删除" iconClass="el-icon-delete" @click="deleteCustomer(scope.row)" :disabled='lookup'>删除</iconBtn>
									</el-button-group>
								</template>
							</el-table-column>
						</elemTable>
					</el-card>
				</el-tab-pane>
				<div style="float: right;" v-if="!isShowNext" class="dialog-footer flex-x-end">
	               <!-- <elBtn :style="{display:xiaoshi}" @click="cancel" text="取消" ></elBtn>-->
	                <el-button @click="submit(1)" text="提交" v-if="lookup!=true" type="primary">提交</el-button>
				</div>
			</el-tabs>
			
		</el-dialog>
	<!--用户列表-->
		<el-dialog custom-class="jz-modal" title="接收人列表" :visible="customerModal" :before-close="beforeCloseTwo" :close-on-click-modal="false" :width="modalWidth">
			<searchInputItems>
				<searchInputItem name="接收人名称">
					<inputItem :value.sync="outNickNameSearch" placeHolder="请输入接收人名称"></inputItem>
				</searchInputItem>
				<!-- 操作按钮 -->
				<optionItems style="padding: 0;">
					<template slot="right">
						<el-button-group>
							<iconBtn iconClass="el-icon-plus" content="批量添加" @click="batchAdd" type="info">批量添加</iconBtn>
							<iconBtn iconClass="el-icon-search" content="查询" @click="queryOutUserList()" type="primary">查询</iconBtn>
							<iconBtn iconClass="el-icon-refresh" content="重置" @click="reSetQueryOutUserList()">重置</iconBtn>
							<iconBtn iconClass="el-icon-plus" content="一键添加所有" @click="wholeAdd" type="warning" plain>一键添加所有</iconBtn>
						</el-button-group>
					</template>
				</optionItems>
			</searchInputItems>
			<elemTable :dataList="outUserList" :currentPage='outUserPageNum' :pageSize="outUserPageSize" :pageTotal="outUserPageTotal" :loading="dataLoading" @sizeChange="outUserHandleSizeChange" @currentChange="outUserHandleCurrentChange" @selectionChange="selectionChange">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column prop="nickName" label="接收人名称">
					<template slot-scope="scope">
						<span>{{scope.row.nickName}}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button-group>
							<iconBtn type="primary" content="加入" @click="addCustomer(scope.row)">加入</iconBtn>
						</el-button-group>
					</template>
				</el-table-column>
			</elemTable>
		</el-dialog>
	</div>
</template>

<script>
import local from '../../../local.js'
import configs from '../../../configs.js'
import mixin from '../../../mixin/mixin.js' //公共方法，包括主要的ajax
export default {
	mixins: [mixin],
	data(){
		return{
			configs:configs,
			dataList:[],
			startUserList:[],
			searchInput:'',
			xiaoshi:'block',
			textarea:'',
			activeName:'first',
			channelOptions:[],
			customerOptions:[],
			userIdList:[],
			userNameList:[],
			userTypeList:[],
			form:{
				id:'',
				channelName:'',
				comment:'',
				smsType:'',
				userType:'',
				isUseTemplate:'',
				createdDate:'',
				userId:'',
			},
			formComputed:{
				id:'',
				channelCode:'',
				channelName:'',
				userType:'',
				title:'',
				comment:'',
				customerId:'',
				customerName:'',
				isUseTemplate:'',
				createdDate:'',
				userId:'',
			},
			channelNumber:'',
			uploadFile:{},//上传附件文件
			uploadTip:'一次性最多只能上传3个文件，且不能超过10M',
			uploadParam:{
				savePath:'platformNotice',
			},
			listType:'text',
			limit:3,
			multiple:true,
			formDisabled:false,
			switchValue:0, //0表示是，1表示否
			fileNumber:0,
			fileList:[],
			attachmentList:[],	//附件集合
			downloadAccessory:[],
			ptxxck:true,
			rules:{
				channelName: [{required: true, message: '渠道类型不能为空' }],
				userType: [{ required: true, message:'请选择用户类型', trigger: 'change' }],
		        title: [{ required: true,message:'请输入标题，50字以内', trigger: 'blur'},this._ruleLength(50)],
		        comment: [{ required: true,message:'请输入内容描述，150字以内',trigger: 'blur'},this._ruleLength(150)]
			},
			customerModal: false,
			customerPageNum:1,
			customerPageSize:10,
			customerPageTotal:0,
			outUserPageNum:1,
			outUserPageSize:10,
			outUserPageTotal:0,
			multipleSelectionCustomer:[],
			userTableData:[],
			userData:[],
			userTableDataList:[],
			custermerNameList:[],
			nickNameSearch:'',
			keyWord:'',
			customerIdList:[],
			customerNameList:[],
			inNickNameSearch:'',
			outNickNameSearch:'',
			inCustomerTableData:[],
			outUserList:[],
			isModify: false,
			isShowNext:true,
			moduleSwitch:true,
			tempOutUserList:[],
			tempList:[],
			tempInUserList:[],
			temp:[]
		}
	},
	props: {
		modal: {
			type: Boolean,
			default: false
		},
		modalTitle:{
			default:''
		},
		eWidth:{
			default:'774px'
		},
		messageRow:{
			default:function(){
				return {}
			},
		},
		lookup:{
			type: Boolean,
			default:false
		}
	},
	computed:{
		formCom:{
			get:function(){
				var formC={}
				Object.assign(formC,this.form)
				if(formC.userType=='admin'){
					formC.userType = '所有'
				}else if(formC.userType=='merchant'){
					formC.userType =  '供应商家'
				}else if(formC.userType=='market'){
					formC.userType =  '市场管理员'
				}else if(formC.userType=='buyer'){
					formC.userType =  '采购商家'
				}
				return formC
			},
			set:function(o){
				Object.assign(this.formComputed,o)
			}
		},
	},
	mounted(){
		Object.assign(this.form,this.messageRow)
		Object.assign(this.formComputed,this.formCom)
		if(this.modalTitle=='编辑'){
			this.formCom=this.form
			this.xiaoshi="none"
		}
		if(this.formComputed.supportNum != null && this.formComputed.supportNum != ''){
			this.fileNumber=this.formComputed.supportNum
		}
		this.init();
		if(this.modalTitle=='查看' ||this.modalTitle=='查看消息' || this.modalTitle=='编辑'){
			this.formDisabled=true
			if(this.modalTitle=='查看消息'){
				this.ptxxck=false
			}
			if(this.modalTitle=='查看') {
				this.isModify = true;
				this.moduleSwitch = false;
			}
		}
		if(this.modalTitle=='查看'||this.modalTitle=='编辑'||this.modalTitle=='查看消息'){
			this.editAndlookUp();
		}
		if(this.modalTitle=='新增') {
			//新增展示表数据
			this.userTableData =[]
		}else {
			this.queryInUserList();
		}
	},
	methods:{
		//单个删除不提交
		deleteOne(row) {
			this.temp = [];
			var vm = this;
			$.each(this.tempInUserList, function(i, obj) {
				if(row.userId != obj.userId) {
					vm.temp.push(obj); 
				}
			});
			this.tempInUserList = vm.temp;
		},
		//一键删除所有
		wholeDelete() {
			this.tempInUserList = [];
			if(this.modalTitle == "新增") {
				this.inUserListFenYe();
			}else {
				this.submit(2);
			}
		},
		//批量删除
		batchDelete() {
			this.temp = [];
			var vm = this;
			if(this.rowSelection.length === 0) {
        		this.$message({type: 'info', message: '请选择行'});
        		return;
        	}else {
        		let selection = this.rowSelection
				selection.forEach(function(el) {
					vm.deleteOne(el);
				})	
        	}
        	this.tempInUserList = []
        	this.tempInUserList= vm.temp;
        	if(this.modalTitle == "新增") {
				this.inUserListFenYe();
			}else {
				this.submit(2);
			}
		},
		//一键添加所有
		wholeAdd() {
			var vm = this;
			vm.tempOutUserList.forEach(function(el) {
				vm.addCustomer(el)
			})
			this.customerModal = false;
			this.submit(2);
		},
		//批量添加
		batchAdd() {
			if(this.rowSelection.length === 0) {
        		this.$message({type: 'info', message: '请选择行'});
        		return;
        	}else {
        		let selection = this.rowSelection
        		var vm = this;
				selection.forEach(function(el) {
					vm.addCustomer(el)
				})	
        	}
		},
		//单次添加
		addCustomer(row) {
			this.inCustomerTableData.push(row);
			this.tempInUserList.push(row);
			this.customerPageTotal = this.inCustomerTableData.length;
			this.outUserListFenYe();
		},
		//未添加用户分页
		outUserListFenYe() {
			this.tempList = [];
			var vm = this;
			$.each(this.tempOutUserList, function(i, obj1) {
				var index = vm.inCustomerTableData.indexOf(obj1); 
				if(index=== -1) {
					vm.tempList.push(obj1); 
				}
			})
			this.outUserList = []; 
			Object.assign(this.outUserList,this.tempList);
			this.outUserPageTotal = this.outUserList.length
			this.outUserList = this.outUserList.splice((this.outUserPageNum - 1) * this.outUserPageSize, this.outUserPageSize);
			this.customerModal = true;
		},
		inUserListFenYe() { 
			this.inCustomerTableData = []
			Object.assign(this.inCustomerTableData,this.tempInUserList);
			this.inCustomerTableData = this.inCustomerTableData.splice((this.customerPageNum - 1) * this.customerPageSize, this.customerPageSize);
			this.customerPageTotal = this.tempInUserList.length;
		},
		//未添加列表重置
		reSetQueryOutUserList() {
			this.outNickNameSearch = "";
			this.queryOutUserList();
		},
		//查询为加入用户列表
		queryOutUserList() {
			this.getUserIdStringByUserList();
			var vm = this;
			return this._ajax({url:this.tootAPI,name:'customer/queryUserListByChannelCodeAndType',
				param:{
					pageNum:1,
					pageSize:10000,
					nickName:vm.outNickNameSearch,
					userIds:vm.customerIdList.join(","),
					channelCode:vm.formComputed.channelCode,
					type:vm.formComputed.userType,
				}
			}).then((d)=>{
				vm.tempOutUserList = [];
				Object.assign(vm.tempOutUserList,d.aaData); 
				vm.outUserList=d.aaData;
				vm.outUserPageNum = 1;
				vm.outUserList = vm.outUserList.splice((this.outUserPageNum - 1) * this.outUserPageSize, this.outUserPageSize);
				vm.outUserPageTotal = d.dataCount;
				vm.customerModal = true;
			})
		},
		//查询已经加入用户信息
		queryInUserList() {
			//this.inCustomerTableData = [];
			//this.customerPageTotal = 0;
			var vm = this;
			this._ajax({url:this.tootAPI,name:'platformnotice/queryInUserList',
				param:{
					id:vm.messageRow.id,
					pageNum:1,
					pageSize:10000,
					nickName:vm.inNickNameSearch,
				}
			}).then((d)=>{
				Object.assign(vm.tempInUserList,d.aaData); 
				vm.inCustomerTableData=d.aaData;
				vm.customerPageNum = 1;
				vm.inCustomerTableData = vm.inCustomerTableData.splice((this.customerPageNum - 1) * this.customerPageSize, this.customerPageSize);
				vm.customerPageTotal = d.dataCount;
			})
		},
		//重置已添加已加入用户列表
		resetQueryInUserList() {
			this.inNickNameSearch = "";
			this.queryInUserList();
		},
		//根据用户列表集合拼接字符串:格式1,2,3,4...
		getUserIdStringByUserList() {
			this.customerIdList = [];
			this.customerNameList = [];
			var ts = this;
			$.each(this.tempInUserList, function(i, obj) {
				ts.customerIdList.push(obj.userId);
				ts.customerNameList.push(obj.nickName);
			})
		},
		deleteCustomer(row) {
			this.temp = [];
			var vm = this;
			$.each(this.tempInUserList, function(i, obj) {
				if(row.userId != obj.userId) {
					vm.temp.push(obj); 
				}
			});
			this.tempInUserList = vm.temp;
			if(this.modalTitle == "新增") {
				this.inUserListFenYe();
			}else {
				this.submit(2);
			}
			
		},
		//客户加入弹出框分页设置
		outUserHandleSizeChange(val) {
			this.outUserPageSize = val
			this.outUserListFenYe()
		},
		outUserHandleCurrentChange(val) {
			this.outUserPageNum =val 
			this.outUserListFenYe()
		},
		//客户加入弹出框分页设置
		custoemrHandleSizeChange(val) {
			this.customerPageSize = val
			this.inUserListFenYe()
		},
		custoemrHandleCurrentChange(val) {
			this.customerPageNum =val 
			this.inUserListFenYe()
		},
		submit(key){
			return new Promise((resolve,reject)=>{
				this.getUserIdStringByUserList();
				var vm=this;
				this.channelNumber=local.get('sessionUser').typeCode
				if(this.channelNumber == null || this.channelNumber == ''){
					this.channelNumber = '001';
				}
				this.$refs['form'].validate((valid) => {
					if(valid){
						this.formComputed.typeCode=vm.channelNumber //渠道
						this.formComputed.supportNum=this.fileNumber//附件数量
						this.formComputed.createdDate=this.CurentTime();//创建时间
						this.formComputed.customerId=this.customerIdList.join(",");//用户id
						this.formComputed.customerName=this.customerNameList.join(",");//用户名
						this.channelOptions.map(function(el){
						if(el.code==vm.formComputed.channelName){
								vm.formComputed.channelName=el.name
								vm.formComputed.channelCode=el.code
							}
						})
						this.moduleSwitch=false;
						if(key === 3 || key === 2 || key === 1) {
							this.activeName = 'second';
							this.isShowNext = false;
						}
						if(this.modalTitle=="新增"){
							/*if(this.formComputed.customerId == ''){
								this.$message({ type: 'warning', message: '请选择接收人！！' }); 
								return;
							}*/
							if(key == 1) {
								this.formComputed.noticeStatus=0
								this._ajax({url:this.tootAPI,name:'platformnotice/createEntityAndDetailEntitys',param:this.formComputed})
								.then((d)=>{
									if(d.state==0){
										if(key != 4) {
											this.uploadF(d.aaData)
										}
										this.formComputed = d.aaData
										if(key == 1) {
											this.cancel();
										}else{
											this.queryInUserList();
										}
				                       this.$message({ type: 'success', message: '操作成功' }); 
				                    }
								})
							}else {
								this.inUserListFenYe()
							}
						}else{
							if(key != 5) {
								this._ajax({url:this.tootAPI,name:'platformnotice/updateEntityAndDetailEntitys',param:this.formComputed})
								.then((d)=>{
									if(d.state==0){
										if(key != 1 && key != 4) {
											vm.uploadF(vm.form)
										}
										if(key === 1) {
											this.cancel();
										}else{
											this.queryInUserList();
										}
				                    }
								})
							}else {
								if(this.activeName === 'second' || this.modalTitle=="查看" || this.modalTitle=='查看消息') {
									this.cancel();
								}else {
									this._ajax({url:this.tootAPI,name:'platformnotice/updateEntityAndDetailEntitys',param:this.formComputed})
									.then((d)=>{
										if(d.state==0){
											if(key != 1 && key != 4) {
												vm.uploadF(vm.form)
											}
					                    }
									}).then((d) =>{
										resolve()
										vm.cancel()
									})
								}
							}
						}
					}else{
						if(key == 5) {
							this.cancel();
							return;
						}
			            this.$message({ type: 'warning', message: '请输入完整信息' }); 
					}
				})
			})
				
		},
		changeUserType(value){
			this.tempInUserList = [];
			if(value=="market"){
				this.formComputed.sysId=local.get('sessionUser').sysId;
			}else if(value=="merchant"){
				this.formComputed.sysId = 8;
			}
			this.queryInUserList();
		},
		changeChannel() {
			this.tempInUserList = [];
			this.queryInUserList();
		},
		editAndlookUp(){
			let _this=this
			var param={
					sourceObjectType:'NoticeAnnex'
				}
			if(this.modalTitle=='查看消息'){//用于平台消息查看界面
				param.sourceObjectId=this.formComputed.mainId
			}else{
				param.sourceObjectId=this.formComputed.id
			}
			this._ajax({url:this.tootAPI,name:'uploadfilerecode/list',param:param})
			.then((d)=>{
				this.downloadAccessory=d.aaData
				if(this.modalTitle=='编辑'){
					d.aaData.forEach(function(o){
						o.name=o.fileName
						o.url=o.filePath
					})
					this.attachmentList=d.aaData
				}
				this.downloadAccessory.forEach(function(el){
					el.fullFilePath =_this.configs.imgURL + el.filePath + '?' + el.fileName;
				})
			})
		},
		init(){
			var vm=this;
			this.channelNumber=local.get('sessionUser').typeCode
			this.getUserType()
			this._ajax({url:this.tootAPI,name:'channel/list',
				param:{
					code:this.channelNumber
				}
			}).then((d)=>{
				this.channelOptions=d.aaData
			})
		},
		//获取用户类型
		getUserType(){
			var vm=this;
			var typeId=local.get('sessionUser').typeId
			if(typeId != 'admin'){
				vm.userTypeList=[{key:'merchant',value:'供应商家'},{key:'market',value:'市场管理员'},{key:'buyer',value:'采购商家'}]
			}else{
				vm.userTypeList=[{key:'admin',value:'所有'}]
			}
		},
		//根据平台消息id和主体对象类型（002：公告附件）可以查询出对应的附件
		getFileList(o){
			this._ajax({url:this.tootAPI,name:'uploadfilerecode/list',
				param:{
					sourceObjectType:'NoticeAnnex',//公告附件
					sourceObjectId:o.id,
					channelCode:o.channelCode
				}
		}).then((d)=>{	
				this.attachmentList=d.aaData
			})
		},
		//触发接数据
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		/*商户弹出框*/
		showCustomerDialog() {
			this.pageNum = 1
			this.customerModal = true;
			this.refreashCustomerDialog();
		},
		customerSelectionChange(val) {
			this.multipleSelectionCustomer = val;
		},
		getUserTableDataAndstartUserList(totalUserList,UserTableData){
			var temp1 = [];
			var temp2 = [];
			$.each(totalUserList, function(i, obj1) {
				$.each(UserTableData, function(i, obj2) {
					if(obj1.userId == obj2.userId) {
						temp1.push(obj1);
						return true;
					}
				})
				
			});
			
		},
		/*刷新已加入客户*/
		refreashJoinInCustomer(modalTitle) {
			
		},
		//发送范围
		customerListPage(val) {
			this.customerPageNum = val
			this.refreashJoinInCustomer(val)
		},
		beforeCloseTwo(){
			this.inNickNameSearch = '';
			this.outNickNameSearch = '';
			this.customerModal = false;
			this.submit(2);
		},
		beforeClose(done) {
			if(this.modalTitle=="新增") {
				this.$emit('close');
				done()
			}else {
				this.submit(5).then(()=>{
					this.$emit('close');
					done()
				});
			}
		},
		cancel(){
			this.$emit('close')
		},
		//		获取时间
		CurentTime(){ 
		        var now = new Date();
		        var year = now.getFullYear();       //年
		        var month = now.getMonth() + 1;     //月
		        var day = now.getDate();            //日
		        var hh = now.getHours();            //时
		        var mm = now.getMinutes();          //分
		        var ss = now.getSeconds();           //秒
		        var clock = year + "-";
		        if(month < 10)
		            clock += "0";
		        	clock += month + "-";
		        if(day < 10)
		            clock += "0";
		       	 clock += day + " ";
		        if(hh < 10)
		            clock += "0";
		        	clock += hh + ":";
		        if (mm < 10) 
		        	clock += '0';
		        	clock += mm + ":"; 
		        if (ss < 10) 
		        	clock += '0';
		        	clock += ss; 
		        return(clock); 
		},
		//通过activeName名字取定位页面
		handleClick(tab, event) {
				let key = tab.name;
				if(key === 'first') {
					this.isShowNext = true;
				}
				if(key === 'second') {
					if(this.formComputed.id == null) {
						return 
					}
					this.isShowNext = false;
				}
		},
		//图片上传
		uploadF(o){
			var tm=this
			var vm=this.uploadFile
			vm.sourceObjectType='NoticeAnnex'//公告附件(从数据字典表中读取)
			vm.sourceObjectId=o.id
			vm.channelCode=tm.channelNumber
			this.fileList.map(function(el){
				if(el.response!=null){
					var fileTypeArr=el.name.split(".")
					vm.fileType=fileTypeArr[fileTypeArr.length-1]
					vm.fileSize=el.size
					vm.filePath=el.response.aaData.path
					vm.fileName=el.name
					vm.uploadDate=tm._getCurrentDate(0)
					tm._ajax({url:tm.tootAPI,name:'uploadfilerecode/create',param:vm})
					.then((d)=>{
						if(d.state==0){
							//tm.$emit('close')
	                        tm.$message({ type: 'success', message: '操作成功' }); 
	                    }
					})
				}
			})
		},
		uploadSuccess(response, file, fileList){
			this.fileNumber=this.fileNumber+1
			if(file.size < 1024*1024*10){
				if(fileList.length>3){
	                this.$message({ type: 'warning', message: '最多只能上传3个附件！！！' }); 
	                return;
				}else {
					this.fileList=fileList
				}
			}
		},
		onRemove(file, fileList){
		    if(this.fileNumber >0){
		    	if(file.size >= 1024*1024*10){
		    		return;
		    	}
                this.fileNumber=this.fileNumber-1
                this.fileList=fileList
				if(this.formComputed.id !=  null  && file.id != null){
	        			var o = {
	        				id:[file.id],
	        				name:[file.name]
	        			}
						this._ajax({url: this.rootAPI + 'uploadfilerecode/delete', param:o, arr:true})
						.then((function(d) {
							this.$message({type: 'success', message: '删除成功'});
						}).bind(this))
				}
			//this.fileList = [];
            }
		    this.submit(4);
		},
		handleExceed(file, fileNumber){
			 this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${file.length} 个文件，共选择了 ${file.length + fileNumber.length} 个文件`);
			 return;
		}
	},
}
</script>
<style lang="sass">
	.platformModal{
		.submitB {
			text-align: center;
		}
		.el-input-group{
			width: 260px;
			float: right;
			margin-bottom: 15px;
		}
		.row-block{
	            .el-form-item__content {
	                width: calc(100% - 110px);
	                &>div{
	                    width: 100%;
	                }
	            }
	    }
		.inputStyle{
			width:532px;
			white-space: normal;
            word-break: break-all;
		}
		.thr_money{
			display: flex;
			display: -webkit-flex;
			justify-content: space-between;
			padding: 20px 50px;
		}
		.buy_message{
			padding: 15px 20px;
			.label{
				width: 150px;
			}
			display: flex;
			display: -webkit-flex;
		}
		.el-radio{
			margin-bottom: 0;
		}
		.el-form-item__content{
			textarea{
				width: 532px;
				height: 100px;
			}
		}
		.titleClass {
			.el-input .el-input__inner[type=text]{
				width: 532px;
			}
		}
		.downloadAccessoryF{
			.el-form-item__label{
				float: left;
			}
			.el-form-item__content{
				float: left;
				width: 532px;
				display: flex;
				flex-wrap: wrap;
				.downloadAccessory{
					width: 140px;
					margin: 0 30px 0 0;
					overflow: hidden;
				    text-overflow: ellipsis;
				    white-space: nowrap;
				}
				.downloadAccessory:nth-of-type(3n){
					margin-right: 0;
				}
			}
		}
		.unpdataTS{
				position: absolute;
				top: 0;
				left: 100px;
				width:400px;
		}
		.pepoerFREASHcss {
			width: 600px;
			position: absolute;
			top: 5px;
		}
	}
</style>