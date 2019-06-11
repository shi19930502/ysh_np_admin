<template>
	<el-dialog custom-class="jz-modal knowledge-modal" :width="modalWidth" :title="modalTitle" :close-on-click-modal='false' :visible="modal" :before-close='beforeClose'>
		<el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="110px">
	    	<el-row>
        		<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            		<el-form-item label="渠道" :prop="lookup ? '' : 'channelCode'">
                   		<selectInput :value.sync="form.channelCode" :disabled='lookup'>
							<el-option
							  v-if='!formDisabled'
						      v-for="item in channelOptions"
						      :key="item.code"
						      :label="item.name"
						      :value="item.code"  class="inputStyle">
						    </el-option>
						</selectInput>
	                </el-form-item>
	            </el-col>
	    	</el-row>
	    	<el-row>
        		<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
	    			<el-form-item label="标题" class="row-block" :prop="lookup ? '' : 'knowledgeTitle'">
						<inputItem :value.sync='form.knowledgeTitle' :disabled='lookup'  class="inputStyle"></inputItem>
	    			</el-form-item>
	    		</el-col>
	    	</el-row>
	    	<el-row>
        		<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" >
	    			<el-form-item label="描述" :prop="lookup ? '' : 'comment'" class="row-block">
	    				<inputItem
	    					:disabled='lookup'
	    					type='textarea'
	    					maxlength="150"
	    					:value.sync='form.comment'  class="inputStyle">
	    				</inputItem>
	    			</el-form-item>
	    		</el-col>
	    	</el-row>
	    	<el-row>
        		<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
	    			<el-form-item label="是否启用"  prop="enabled">
	    				<switchItem :value.sync='form.enabled' :disabled='lookup'>
	    				</switchItem>
	    			</el-form-item>
	    		</el-col>
	    	</el-row>
	    	<el-row>
        		<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
	    			<el-form-item v-if='modalTitle == "编辑" || modalTitle == "新增"' label="附件">
	    				<uploadItem
	    					:limit='limit'
	    					:listType='listType'
	    					:multiple='multiple'
	    					:uploadTip='uploadTip'
	    					:uploadData='uploadParam'
	    					@success='uploadSuccess'
	    					@remove='onRemove'
	    					:fileList='attachmentList'
	    					></uploadItem>
	    					<span class="unpdataTS">一次性最多只能上传3个文件，且不能超过4M！！</span>
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
	    </el-form> 
		<div slot="footer" class="dialog-footer flex-x-end">
            <elBtn @click="cancel" text="取消"></elBtn>
            <elBtn @click="submit" text="提交" v-if="lookup!=true" type="primary"></elBtn>
        </div> 
	</el-dialog>
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
			dateValue:[],
			dateValue2:[],
			dataList:[],
			searchInput:'',
			pageSizes:[10,20,30],//40页的时候有问题
			textarea:'',
			channelNumber:'',
			templateDisabled:true,
			channelFilterable:true,
			channelClearable:true,
			activeName:'first',
			templateComment:'',//显示模板的内容
			selectArr:[],
			channelOptions:[],
			smstemplateOptions:[],
			userIdList:[],
			form:{
				channelCode: '',
				knowledgeTitle: '',
				enabled:'',
				comment:'',
				readingQuantity:0,
				supportQuantity:'',
				createdPersonId:'',
				createdDate:'',
				lastModifyPersonId:'',
				lastModifyTime:'',
		    },
			uploadFile:{},//上传附件文件
			uploadTip:'一次性最多只能上传3个文件，且不能超过4M',
			uploadParam:{
				savePath:'Knowledgebase',
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
			rules: {
				channelCode: [{required: true, message: '渠道不能为空' }],
                knowledgeTitle: [{required: true, message: '标题不能为空，50字以内' }, this._ruleLength(50)],
                comment: [{required: true, message: '描述不能为空，150字以内' }, this._ruleLength(150)]
            },
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
	mounted(){
		this.init();
		Object.assign(this.form,this.messageRow)
		if(this.form.supportQuantity != null && this.form.supportQuantity != ''){
			this.fileNumber=this.form.supportQuantity
		}
		if(this.modalTitle=='查看'||this.modalTitle=='编辑'||this.modalTitle=='查看消息'){
			this.editAndlookUp();
		}
		
	},
	methods:{
		//编辑和查看
		editAndlookUp(){
			let _this = this;
			var param={
					sourceObjectType:'知识库'
				}
			if(this.modalTitle=='查看消息'){
				//用于平台消息查看界面
				param.sourceObjectId=this.form.mainId
			}else{
				param.sourceObjectId=this.form.id
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
		//根据平台消息id和主体对象类型（002：公告附件）可以查询出对应的附件
		getFileList(o){
			this._ajax({url:this.tootAPI,name:'uploadfilerecode/list',
				param:{
					sourceObjectType:'知识库',//公告附件
					sourceObjectId:o.id,
					channelCode:o.channelCode
				}
		}).then((d)=>{	
				this.attachmentList=d.aaData
			})
		},
		init(){
			//查询渠道数据
			var vm=this;
			this._ajax({
				url:this.tootAPI,
				name:'channel/list',
				param:{enabled: '1'}
			}).then((d)=>{
				this.channelOptions=d.aaData
				this.searchTable(this.form.channelCode);
			})
		},
		searchTable(val){
		},
		beforeClose(done) {
			this.$emit('close')
			done()
		},
		cancel(){
			this.$emit('close')
		},
		submit(){
			this.$refs['form'].validate((valid) => {
				if(valid) {
					var vm=this;
					this.form.typeCode=vm.channelNumber
					this.form.sysId=local.get('sessionUser').sysId
					this.form.supportQuantity=this.fileNumber//附件数量
					this.channelOptions.map(function(el){
						if(el.code==vm.channelNumber){
							vm.form.channelName=el.name
							vm.form.channelCode=el.channelName
						}
					})
					if(this.modalTitle=="新增"){
						this.form.sendStatus=0
						this._ajax({url:this.tootAPI,name:'knowledgebase/create',param:this.form})
						.then((d)=>{
							if(d.state==0){
								this.uploadF(d.aaData)
								this.$emit('submit')
		                        this.$message({ type: 'success', message: '新增成功' }); 
		                    }
						})
					}else{
						this.form.lastModifyTime = new Date();
						this._ajax({url:this.tootAPI,name:'knowledgebase/update',param:this.form})
						.then((d)=>{
							if(d.state==0){
								this.uploadF(this.form)
								this.$emit('submit')
		                        this.$message({ type: 'success', message: '修改成功' }); 
		                    }
						})
					}
				}
			})
		},		
		uploadF(o){
			var tm=this
			var vm=this.uploadFile
			vm.sourceObjectType='知识库'//公告附件(从数据字典表中读取)
			vm.sourceObjectId=o.id
			vm.channelCode=tm.form.channelCode
			
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
							tm.$emit('close')
	                        tm.$message({ type: 'success', message: '操作成功' }); 
	                    }
					})
				}
			})
		},
		uploadSuccess(response,file, fileList){
			this.fileNumber=this.fileNumber+1
			this.fileList=fileList
		},
		onRemove(file, fileList){
			 if(this.fileNumber >0){
                this.fileNumber=this.fileNumber-1
            }
			this.fileList=fileList
			console.log(file)
			if(this.form.id !=  null &&  file.id != null){
				this.confirm('确定删除？', (function() {     
        			var o = {
        				id:[file.id]
        			}
					this._ajax({url: this.rootAPI + 'uploadfilerecode/delete', param:o,arr:true})
					.then((function(d) {
						this.$message({type: 'success', message: '删除成功'});
					}).bind(this))
        		}).bind(this))	
			}
		},
	}
}
</script>
<style lang="sass">
    .knowledge-modal{
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
				    /*a{
				    	width: 140px;
				    	overflow: hidden;
					    text-overflow: ellipsis;
					    white-space: nowrap;
				    }*/
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
    }
</style>