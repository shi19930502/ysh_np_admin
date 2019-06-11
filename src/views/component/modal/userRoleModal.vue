<template>
	<el-dialog custom-class="jz-modal" :title="userRoleModalType === 'add' ? '新增角色' : '角色编辑'" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
            <el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="80px">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="角色名称" prop="name" v-if="userRoleModalType === 'add'">
                            <inputItem :value.sync="form.name"></inputItem>
                        </el-form-item>
                        <el-form-item label="角色名称" v-else>
                            <span>{{form.name}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="是否启用" prop="statu">
                            <switchItem :value.sync="form.statu" :activeValue="1" :inactiveValue="0"></switchItem>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="模块权限">
                            <treeItem :dataList="dataTree" ref="navTree" :defaultChecked="defaultChecked"></treeItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="备注 " prop="remark">
                            <inputItem type="textarea" :autosize="true" :value.sync="form.remark"></inputItem>
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
import local from '../../../local.js'
import configs from '../../../configs.js'
	export default {
        mixins: [mixin],
		data() {
			return {
				form: {
                    name: '',
                    statu: 0,
                    remark: ''
                },
                rules: {
                    name: [{required: true, message: '角色名称不能为空' }, this._ruleLength(30),this.regName()],
                    remark: [this._ruleLength(50)],
                },
                dataTree: local.get('navlist'),
                defaultProps: {
                  children: 'children',
                  label: 'name'
                },
			}
		},
		props: {
			modal: {
				default: false
			},
            userRoleModalType: {
                default: 'add'
            },
            userRole: {
                default: {}
            },
            defaultChecked: {
                default: function() {
                    return []
                }
            }
		},
		mounted() {
            Object.assign(this.form, this.userRole)     
		},
		methods: {  
			regName() {
				var vm = this;
				return {validator: function(rule, value, callback) {
					var val = $.trim(value);
					  var method = '/permission/tsysRole/list'
                        vm._ajax({url: configs.api + method, param: {
                        	name:val
                        }})
                        .then((function(d) {
                            if(d.aaData.length > 0) {
                                $.each(d.aaData, function(i, obj) {
                                    if(obj.name === val) {
                                     callback(new Error('角色名已经被使用,请重新输入'))
                                    }else {
                                        callback();
                                    }
                                });
                            }else {
                                callback();
                            }                        	
                        }).bind(this))
				}, trigger: 'blur'}	
			},
			cancel() {
				this.$emit('close')
			},
			valideSubmit() {
                var arr = this.$refs.navTree.$children[0].getCheckedNodes(), modleList = [];
                arr.forEach(function(el) {
                    modleList.push(el.id)
                })
                if (modleList.length === 0) {
                    this.$message({type: 'warning', message: '角色必须选择一个模块权限,请重新选择模块权限!'});
                    return
                }
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        var o = {}, flag = true
                        Object.assign(o, this.form)
                        var method = '/permission/tsysRole/update'
                        if(this.userRoleModalType === 'add') {  
                            method = '/permission/tsysRole/createRole'
                            Object.assign(o, {
                                createPersonId: local.get('userinfo').userId
                            })    
                        }
                        this._ajax({url: configs.api + method, param: o})
                        .then((function(d) {
                            if(d.state === 2) {
                                flag = false
                            }else {
                               if(this.userRoleModalType === 'add' && modleList.length > 0) {
                                    return this.bindModle(d.aaData.id, modleList)
                                }else {
                                    if(modleList.length > 0) {
                                        return this.bindModle(this.form.id, modleList)
                                    }else {
                                        return this.bindModle(this.form.id, ['9999'])
                                    }
                                } 
                            }
                        }).bind(this))
                        .then((function() {
                            if(flag) {
                                this.$message({ type: 'success', message: '操作成功' }); 
                                this.$emit('submit')
                            }else {
                                this.$message({ type: 'warning', message: '角色名称重复' });
                            }
                        }).bind(this))
                    }
                })
			},
            beforeClose(done) {
                this.cancel()
                done()
            },
            bindModle(id, arr) {
                return this._ajax({url: configs.api + '/permission/tsysRoleModlePermission/updateModlePermission', param: {moduIds: arr, roleId: [id], sysId: configs.sysID}, arr: true})
            },
		}
	}
</script>