<template>
	<el-dialog custom-class="jz-modal" :title="deviceModalType === 'add' ? '新增系统版本' : '系统版本编辑'" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
        <el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="80px">
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="渠道" prop="channelCode" >
                        <selectInput :value.sync="form.channelCode" :disabled="channelCodeDisabled" @selectChange="channelChange">
							<el-option
						      v-for="item in channelList"
						      :key="item.name"
						      :label="item.name"
						      :value="item.code">
						    </el-option>
						</selectInput>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="版本号" prop="version" label-width="100px">
                        <inputItem :value.sync="form.version"></inputItem>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="设备类型" prop="deviceType">
					    <selectInput :value.sync="form.deviceType" @selectChange="deviceTypeChange">
							<el-option
						      v-for="item in dataDic.deviceType"
						      :key="item.value"
						      :label="item.value"
						      :value="item.key">
						    </el-option>
						</selectInput>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="生产厂家" prop="manufacturer" label-width="100px">
                        <!--<inputItem :value.sync="form.manufacturer"></inputItem>-->
                        <selectInput :value.sync="form.manufacturer" @selectChange="manufacturerChange">
							<el-option
						      v-for="item in manufacturerList"
						      :key="item"
						      :label="item"
						      :value="item">
						    </el-option>
						</selectInput>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="设备型号" prop="deviceModel">
                        <!--<inputItem :value.sync="form.deviceModel"></inputItem>-->
                        <selectInput :value.sync="form.deviceModel" >
							<el-option
						      v-for="item in deviceModelList"
						      :key="item"
						      :label="item"
						      :value="item">
						    </el-option>
						</selectInput>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="是否必须更新" prop="isNeedUpdate" label-width="100px">
					    <selectInput :value.sync="form.isNeedUpdate" >
							<el-option
						      v-for="item in dataDic.whether"
						      :key="item.value"
						      :label="item.value"
						      :value="item.key">
						    </el-option>
						</selectInput>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
            	<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="版本状态" prop="versionStatus">
					    <selectInput :value.sync="form.versionStatus" >
							<el-option
						      v-for="item in dataDic.versionStatus"
						      :key="item.value"
						      :label="item.value"
						      :value="item.key">
						    </el-option>
						</selectInput>
                    </el-form-item>
                </el-col>
            </el-row>
        	<el-row>
        		<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="版本文件" prop="versionFile">
					    <uploadItem @success="uploadSuccess" :uploadData="uploadData" @remove="uploadRemove" :fileList="uploadList" uploadTip="" list-type="text" ></uploadItem>
                    </el-form-item>
                </el-col>
    		</el-row>
        </el-form>              
        <div slot="footer" class="dialog-footer flex-x-end">
            <elBtn @click="cancel" text="取消"></elBtn>
            <elBtn @click="submit" text="提交" type="primary"></elBtn>
        </div>
    </el-dialog>
</template>
<script>
	import local from '../../../local.js'
	import mixin from '../../../mixin/mixin.js'
	export default {
        mixins: [mixin],
		data() {
            var vm = this
			return {
				form: {
					deviceType : '',
					manufacturer : '',
					deviceModel : '', 
					version : '',
					channelCode : '',
					isNeedUpdate : 1,
					versionStatus: '1'
                },
                uploadfile:{
                	id:'',
                	filePath:'',
					fileSize:'',
					fileName:'',
					fileType:''
               },
                rules: {
                    sn: [{required: true, message: '设备编号不能为空' }, this._ruleLength(50)],
                    deviceModel: [{required: true, message: '设备型号不能为空' }, this._ruleLength(50)],
                    deviceType: [{required: true, message: '设备类型不能为空' }],
                    channelCode: [{required: true, message: '渠道为必选项' }],
                    manufacturer: [{required: true, message: '生产厂家不能为空' }, this._ruleLength(100)],
                    version: [{required: true, message: '版本号不能为空' }, this._ruleLength(50)]
                },
                dateTime: [],
                uploadData: {
                    savePath: 'deviceversion'
                },
                uploadList: [],
                manufacturerList: [],
                deviceModelList: [],
                channelCodeDisabled : false,
			}
		},
		props: {
			modal: {
				default: false
			},
			deviceversionModalType: {
				default: "add"
			},
            deviceVersion: {
                default: {}
            },
            dataDic:{
            	default: {}
            },
            channelList:{
            	default: {}
            }
		},
        computed: {
            userID() {
//              console.log(this.userId)
                return this.userId
            }
        },
		mounted() {
            Object.assign(this.form, this.deviceVersion)
            this.getInitData();
            if(!this.form.id) {
				let userinfo = local.get("userinfo")
				if(userinfo.userId != 0) {
					Object.assign(this.form,{
						channelCode : userinfo.typeCode
					})
					this.channelCodeDisabled = true
				}
			}
		},
		methods: {
			cancel() {
				this.$emit('close')
			},
			getInitData() {
				if(this.deviceversionModalType === 'edit') {
					if(this.deviceVersion.fileId) {
						this._ajax({url: this.rootAPI + "uploadfilerecode/getById", param: {"id":this.deviceVersion.fileId}})
		                .then((function(response) {
		                	let fileMsg = response.aaData;
		                	if(fileMsg && fileMsg.fileName) {
		                		let fileTypeTemp = fileMsg.fileName.split('.');
			                	this.uploadfile = {
			                		id:fileMsg.id,
			                		filePath : fileMsg.filePath,
			                		fileSize : fileMsg.fileSize,
			                		fileName : fileMsg.fileName,
			                		fileType : fileTypeTemp[fileTypeTemp.length - 1]
		                		}
			                	this.uploadList.push({"name" : fileMsg.fileName, "url" : fileMsg.filePath});
		                	}
		                }).bind(this))
					}
					this.initManufacturer(this.form.deviceType);
	            }
			},
			channelChange() {
				this.clearData();
				let deviceType = this.form.deviceType;
				if(deviceType) {
					this.deviceTypeChange(deviceType);
				}
			},
			clearData() {
				this.form.manufacturer = '';
				this.form.deviceModel = '';
				this.manufacturerList = [];
				this.deviceModelList = [];
			},
			deviceTypeChange(val) {
				this.clearData();
				this.initManufacturer(val);
			},
			initManufacturer(deviceType) {
				this._ajax({url: this.rootAPI + "deviceversion/getDeviceversionInitData", param: {
					channelCode : this.form.channelCode,
					deviceType : deviceType,
				}})
				.then((function(response) {
					this.manufacturerList = response.aaData;
				}).bind(this))
			},
			manufacturerChange() {
				//生产厂商对应版本
				this.form.deviceModel = '';
				let manufacturerTemp = this.form.manufacturer;
				this._ajax({url: this.rootAPI + "deviceversion/getDeviceManufacturerData", param: {manufacturer : manufacturerTemp}})
				.then((function(response) {
					this.deviceModelList = response.aaData;
				}).bind(this))
			},
			submit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let o = {}, method = 'deviceversion/createOrUpdateUnionFile';
                        let id = this.form.id;
                        if(this.deviceversionModalType === 'add') {
                            id = null;
                        }
                        o = {
                                deviceType : this.form.deviceType,
								manufacturer : this.form.manufacturer,
								deviceModel : this.form.deviceModel,
								version : this.form.version,
								channelCode : this.form.channelCode,
								isNeedUpdate : this.form.isNeedUpdate,
								versionStatus : this.form.versionStatus,
								uploadfile : this.uploadfile,
								id : id
                        }
                        let user = local.get('sessionUser');
                        if(this.deviceversionModalType === 'add') {
                            o.id = null;
                            o.createdPersonId = user.userId;
							o.createdPersonName = user.nickName;
                        } else if(this.deviceversionModalType === 'edit') {
                        	o.lastModifyPersonId = user.userId;
							o.lastModifyPersonName = user.nickName;
                        }
                        o = JSON.stringify(o);
//                      console.info(o);
                        this._ajax({url: this.rootAPI + method, param: {"jsonStr":o}})
                        .then((function(d) {
                        	if(d.state == 0) {
                        		this.$message({ type: 'success', message: '操作成功' }); 
                        	} else {
                        		this.$message({ type: 'failure', message: '操作失败' }); 
                        	}
                            this.$emit('submit')
                        }).bind(this))
                    }
                })
			},
            beforeClose(done) {
                this.cancel()
                done()
            },
            uploadSuccess(response, file, fileList) {
//          	console.info(response);
            	if(response.state == 0) {
            		this.uploadfile.id = '';
            		this.uploadfile.filePath = response.aaData.path;
	            	this.uploadfile.fileSize = response.aaData.size;
	            	this.uploadfile.fileName = file.name;
	            	let fileTypeTemp = file.name.split('.');
	            	this.uploadfile.fileType = fileTypeTemp[fileTypeTemp.length - 1];
            	}
            },
            uploadRemove(file, fileList) {
                Object.assign(this.form, {
                    filePath: ''
                })
            },
		}
	}
</script>