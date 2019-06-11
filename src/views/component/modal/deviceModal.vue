<template>
	<el-dialog  custom-class="jz-modal" :title="deviceModalType === 'add' ? '新增设备' : '设备编辑'" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
        <el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="140px">
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="渠道" prop="channelCode" >
                        <selectInput :value.sync="form.channelCode" :disabled="channelCodeDisabled">
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
                    <el-form-item label="设备类型" prop="deviceType">
					    <selectInput :value.sync="form.deviceType" >
							<el-option
						      v-for="item in dataDic.deviceType"
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
                    <el-form-item label="设备型号" prop="deviceModel">
                        <inputItem :value.sync="form.deviceModel"></inputItem>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="设备编号" prop="sn" >
                        <inputItem :value.sync="form.sn"></inputItem>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="软件版本" prop="softwareVersion">
                        <inputItem :value.sync="form.softwareVersion"></inputItem>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="硬件版本" prop="hardwareVersion">
                        <inputItem :value.sync="form.hardwareVersion"></inputItem>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="生产厂家" prop="manufacturer" >
                        <inputItem :value.sync="form.manufacturer"></inputItem>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="领用人" prop="userdName">
					    <inputItem :value.sync="form.userdName" :append="true" :readonly="true">
					    	<elBtn @click="used()" text="选择" type="primary" slot="append"></elBtn>
					    </inputItem>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="是否删除" prop="deleted">
					    <selectInput :value.sync="form.deleted" >
							<el-option
						      v-for="item in dataDic.isDelete"
						      :key="item.value"
						      :label="item.value"
						      :value="item.key">
						    </el-option>
						</selectInput>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="是否启用" prop="enabled">
					    <selectInput :value.sync="form.enabled" >
							<el-option
						      v-for="item in dataDic.isEnable"
						      :key="item.value"
						      :label="item.value"
						      :value="item.key">
						    </el-option>
						</selectInput>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
            	<el-form-item label="POS机商户号" prop="merchantNum" >
                    <inputItem :value.sync="form.merchantNum"></inputItem>
                </el-form-item>
            </el-row>
        </el-form>              
        <div slot="footer" class="dialog-footer flex-x-end">
            <elBtn @click="cancel" text="取消"></elBtn>
            <elBtn @click="submit" text="提交" type="primary"></elBtn>
        </div>
        <usedModal v-if="usedModalVisible" :modal="usedModalVisible" @close="usedModalClose1" :dataDic="dataDic1" 
        	:channelList="channelList1" :channelCode="channelCode1" @submit="modalSubmit" ></usedModal>
    </el-dialog>
</template>
<script>
	import local from '../../../local.js'
	import mixin from '../../../mixin/mixin.js'
	import usedModal from '../../component/modal/usedModal.vue'
	export default {
        mixins: [mixin],
        components: {usedModal},
		data() {
            var vm = this
			return {
				form: {
					sn : '',
					deviceType : '',
					deviceModel : '', 
					manufacturer : '',
					softwareVersion : '',
					hardwareVersion : '',
					channelCode : '',
					enabled : 1,
					deleted : 0,
					userdName : '',
					deviceCustomerId : '',
					merchantNum:''
                },
                rules: {
                	channelCode: [{required: true, message: '渠道为必选项' }],
                	manufacturer: [{required: true, message: '生产厂家不能为空' }, this._ruleLength(100)],
                    sn: [{required: true, message: '设备编号不能为空' }, this._ruleLength(50)],
                    deviceModel: [{required: true, message: '设备型号不能为空' }, this._ruleLength(50)],
                    deviceType: [{required: true, message: '设备类型不能为空' }],
                    softwareVersion: [this._ruleLength(50)]
                },
                dateTime: [],
                dataDic1:{isEnable:[], deviceType:[], whether:[], isDelete:[]},
                channelCode1:'',
                channelList1:[],
                usedModalVisible:false,
                channelCodeDisabled : false,
			}
		},
		props: {
			modal: {
				default: false
			},
            deviceModalType: {
                default: 'add'
            },
            device: {
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
                console.log(this.userId)
                return this.userId
            }
        },
		mounted() {
            Object.assign(this.form, this.device)
            Object.assign(this.dataDic1, this.dataDic)
            Object.assign(this.channelList1, this.channelList)
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
			submit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let o = {}, method = 'device/update';
                        let id = this.form.id;
                        if(this.deviceModalType === 'add') {
                            method = 'device/create';
                            id = null;
                        }
                        o = {
                                sn : this.form.sn,
								deviceType : this.form.deviceType,
								deviceModel : this.form.deviceModel, 
								manufacturer : this.form.manufacturer,
								softwareVersion : this.form.softwareVersion,
								hardwareVersion : this.form.hardwareVersion,
								channelCode : this.form.channelCode,
								enabled : this.form.enabled,
								deleted : this.form.deleted,
								deviceCustomerId : this.form.deviceCustomerId,
								merchantNum : this.form.merchantNum,
								id : id
                            }
                        let user = local.get('sessionUser');
                        if(this.deviceModalType === 'add') {
                            o.createdPersonId = user.userId;
							o.createdPersonName = user.nickName;
                        }
                        this._ajax({url: this.rootAPI + method, param: o})
                        .then((function(d) {
                        	if(d.state == 0) {
                        		this.$message({ type: 'success', message: '操作成功' }); 
                        		this.$emit('submit')
                        	} else {
                        		this.$message({ type: 'failure', message: '操作失败:'+d.msg }); 
                        	}
                        }).bind(this))
                    }
                })
			},
            beforeClose(done) {
                this.cancel()
                done()
            },
            used() {
				if(this.form.channelCode) {
					this.channelCode1 = this.form.channelCode;
					this.usedModalVisible = true;
					
				} else {
					this.$message({type: 'info', message: '请选择渠道信息'});
				}
			},
			usedModalClose1(resultData) {
//				console.info(resultData);
				if(resultData) {
					this.form.userdName = resultData.name;
					this.form.deviceCustomerId = resultData.id;
				}
				this.usedModalVisible = false;
			}
		}
	}
</script>