<template>
	<el-dialog custom-class="jz-modal" :title="channelModalType === 'add' ? '新增渠道' : '渠道编辑'" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" width="50">
            <el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="100px">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="渠道编码" :prop="channelModalType === 'add' ? 'code' : ''">
                            <inputItem :value.sync="form.code" :disabled="channelModalType !== 'add'"></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="渠道名称" :prop="channelModalType !== 'add' ? '' : 'name'">
                            <inputItem :value.sync="form.name" :disabled="channelModalType !== 'add'"></inputItem>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="父级渠道" prop="parentChannelCode" v-if="channelModalType == 'add'">
                            <cascaderItem :options="channelList" @handleItemChange="handleItemChange" @change="channelChange" :value.sync="parentChannel" :filterable="false"></cascaderItem>
                        </el-form-item>
                        <el-form-item label="父级渠道" prop="parentChannelCode" v-else>
                            <inputItem :value.sync="parentName" :disabled="channelModalType !== 'add'"></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="是否启用" prop="enabled">
                            <switchItem :value.sync="form.enabled"></switchItem>
                        </el-form-item>
                    </el-col>
                </el-row> 
                <el-row>
										<!-- <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
												<el-form-item label="主题编码" prop="dataDicValue">
														<inputItem :value.sync="form.dataDicValue"></inputItem>
												</el-form-item>
										</el-col> -->
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="是否最末级" prop="isLastChannel">
                            <switchItem :value.sync="form.isLastChannel"></switchItem>
                        </el-form-item>
                    </el-col>
                </el-row> 
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="备注" prop="comment">
                            <inputItem type="textarea" :autosize="true" :value.sync="form.comment" :maxlength="200"></inputItem>
                        </el-form-item>
                    </el-col>
                </el-row> 
            </el-form>              
            <div slot="footer" class="dialog-footer flex-x-end">
                <elBtn @click="cancel" text="取消"></elBtn>
                <elBtn @click="valideSubmit" text="提交" type="primary"></elBtn>
            </div>
        </el-dialog>
</template>
<script>
import mixin from '../../../mixin/mixin.js'
import configs from '../../../configs.js'
	export default {
        mixins: [mixin],
		data() {
			return {
				form: {
                    code: '',
                    name: '',
                    parentChannelCode: '',
                    enabled: 1,
                    isLastChannel: 0,
                    comment: '',
                },
                channelList: [],
                parentChannel: [],
                parentName: '',
                rules: {
                    code: [{required: true, message: '渠道编码不能为空' }, this._ruleLength(3),this.regNum(), this._ruleExist(configs.rootAPI + 'channel/listByEntity', '渠道编码')],
                    name: [{required: true, message: '渠道名称不能为空' }, this._ruleLength(50), this._ruleExist(configs.rootAPI + 'channel/listByEntity', '渠道名称')],
                    parentChannelCode:[{required: true, message: '父级渠道不能为空' }],
                    comment: [this._ruleLength(200)]
                },
                flag: true,
                regNumber:/^[0-9]{1,3}$/
			}
		},
		props: {
			modal: {
				default: false
			},
            channelModalType: {
                default: 'add'
            },
            channel: {
                default: function() {
                    return {}
                }
            }
		},
		mounted() {  
            Object.assign(this.form, this.channel)           
            this._ajax({url: this.rootAPI, name: 'channel/listByParentAndNotIsLastChannel', param: {parentChannelCode: '', filteEnabled: 1,level:1,isLastChannel:0}})
            .then((function(d) {
                this.channelList = d.aaData      
            }).bind(this))
            .then((function() {
                if(this.form.parentChannelCode && this.form.parentChannelCode.length > 0) {
                    this._ajax({url: this.rootAPI, name: 'channel/queryParents', param: {parentChannelCode: this.form.parentChannelCode}})
                    .then((function(d) {
                        if(d.aaData.length > 0) {
                            this.parentChannel = d.aaData
                            var childChannel = this.channelList[0];
                            var i = 0;
                            for (; i < this.parentChannel.length; i++) {
                                this.parentName += childChannel.name;
                                if (null != childChannel.childChannel) {
                                    childChannel = childChannel.childChannel[0];
                                    this.parentName += '/';
                                }
                            }
                            this.parentName = this.parentName.substr(0, this.parentName.length - 1);
                        }
                    }).bind(this))
                }
            }).bind(this))
		},
		methods: {
			regNum() {
				var vm = this;
				return {validator: function(rule, value, callback) {
					var val = $.trim(value);
					if(!vm.regNumber.test(val)) {
		              callback(new Error('编码必须全由数字组成'))
		            } else {
		              callback();
		            }
				}, trigger: 'blur'}	
			},
			cancel() {
				this.$emit('close')
			},
			valideSubmit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let o = {}, method = 'channel/update';
                        if(this.channelModalType === 'add') {  
                            method = 'channel/create'
                        }
                        if(this.form.parentChannelCode != '' && this.channelModalType === 'add') {
                            this._ajax({url: this.rootAPI, name: 'channel/listByEntity', param: {code: this.form.parentChannelCode}})
                            .then((function(d) {
                                if(d.aaData[0].isLastChannel !== 0) {
                                    this.$message({type: 'warning', message: '该父级渠道为最末级渠道'});
                                }else {
                                    Object.assign(o, this.form)
                                    this._ajax({url: this.rootAPI + method, param: o})
                                    .then((function(d) { 
                                       if(d.state == 0) {
					                		 this.$message({ type: 'success', message: '操作成功' }); 
					                   		 this.$emit('submit')
					                	}else if(d.state == 2) {
					                		this.$message({ type: 'warning', message: d.msg }); 
					                	}
                                    }).bind(this))
                                }
                            }).bind(this))
                        }else {
                            Object.assign(o, this.form)
                            if(this.channelModalType !== 'add') {
                                this._ajax({url: this.rootAPI, name: 'channel/listByParent', param: {code: o.code}})
                                .then((function(d) {
                                    if(d.aaData.length > 0) {
                                        this.queryChilds(d.aaData, o.parentChannelCode)
                                    }
                                    if(o.isLastChannel !== 0 && d.aaData.length > 1) {
                                        this.$message({type: 'warning', message: '该渠道下包含子渠道，不能设为最末级'});
                                    }else {
                                        // 判断所选父级渠道是否为该渠道下子渠道以及自身
                                        if(this.flag) {
                                            // 判断是停用还是启用
                                            if(!o.enabled) {
                                                // 停用,查询子级是否有未停用的
                                                this._ajax({url: this.rootAPI, name: 'channel/list2', param: {parentChannelCode: o.code,  enabled: 1}})
                                                .then((function(d) {
                                                    if(d.aaData.length > 0) {
                                                        this.$message({type: 'warning', message: '不能停用,该渠道下有子渠道未停用'});
                                                    }else {
                                                        this._ajax({url: this.rootAPI, name: 'channel/validatechannelIsUsingInMerchant', param: {channelCode: o.code}})
                                                            .then((function(d) {
                                                                console.log(d.aaData);
                                                                if(d.aaData.id != null) {
                                                                    this.$message({type: 'warning', message: '不能停用,存在备案用户正在使用该渠道'});
                                                                }else {
                                                                    this.submit(method, o)
                                                                }
                                                            }).bind(this))
                                                    }
                                                }).bind(this))
                                            }else {
                                                // 启用,查询父级是否有停用的
                                                if(o.parentChannelCode.length > 0) {
                                                    this._ajax({url: this.rootAPI, name: 'channel/list3', param: {code: o.parentChannelCode,enabled: 0}})
                                                    .then((function(d) {
                                                        if(d.aaData.length > 0) {
                                                            this.$message({type: 'warning', message: '不能启用,该渠道的上级渠道未启用'});
                                                        }else {
                                                            this.submit(method, o)
                                                        }
                                                    }).bind(this))
                                                }else {
                                                    this.submit(method, o)
                                                }
                                            }
                                        }else {
                                            this.$message({type: 'warning', message: '不能选取子渠道或者自身作为该渠道的父级渠道'});
                                            this.flag = true
                                        }
                                    }                                    
                                }).bind(this))
                            }else {
                                this.submit(method, o)
                            } 
                        }                      
                    }
                })
			},
            beforeClose(done) {
                this.cancel()
                done()
            },
            channelChange(val) {
                if(val.length > 0) {
                    Object.assign(this.form, {parentChannelCode: val[val.length - 1]})
                }else {
                    Object.assign(this.form, {parentChannelCode: ''})
                }
            },
            queryChilds(childlist, parentcode) {
                for(var i = 0, l = childlist.length; i < l; i++) {
                    var el = childlist[i]
                    if(parentcode === el.code) {
                        this.flag = false   
                        return                                         
                    }else if(el.childs !== null && el.childs > 0) {
                        this.queryChilds(el.childChannel, parentcode)
                    }
                }
            },
            submit(method, o) {
                // 判断是否设为最末级
                this._ajax({url: this.rootAPI + method, param: o})
                .then((function(d) { 
                	if(d.state == 0) {
                		this.$message({ type: 'success', message: '操作成功' }); 
                    	this.$emit('submit')
                	} else {
                		this.$message({ type: 'warning', message: '操作失败：'+d.msg }); 
                	}
                }).bind(this))
            }
		}
	}
</script>