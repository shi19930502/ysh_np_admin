<template>
	<el-dialog custom-class="jz-modal" :title="categoryModalType === 'add' ? '新增分类' : '分类编辑'" :visible="modal" :before-close="beforeClose" :close-on-click-modal="false" :width="modalWidth">
            <el-form class="modal-form" v-if="modal" :model="form" ref="form" :inline="true" :rules="rules" label-width="100px">
                <el-row>
                	<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="categoryModalType === 'add'">
                        <el-form-item label="父级分类" prop="parentCategoryId">
                            <cascaderItem :propss="propss" :options="categoryList" @handleItemChange="handleItemChange" @change="categoryChange" :value.sync="parentCategory"></cascaderItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="商品编码" :prop="categoryModalType !== 'add' ? '' : 'code'">
                            <inputItem :value.sync="form.code" :disabled="categoryModalType !== 'add'"></inputItem>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                	<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="分类名称" :prop="categoryModalType !== 'add' ? '' : 'name'">
                            <inputItem :value.sync="form.name" :disabled="categoryModalType !== 'add'"></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="国标码" :prop="categoryModalType !== 'add' ? '' : 'gbgoodsId'">
                            <inputItem :value.sync="form.gbgoodsId" :disabled="categoryModalType !== 'add'"></inputItem>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="别名" prop="vulgo">
                            <inputItem :value.sync="form.vulgo"></inputItem>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="是否启用" prop="enabled">
                            <switchItem :value.sync="form.enabled"></switchItem>
                        </el-form-item>
                    </el-col>
                </el-row> 
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="描述" prop="remark">
                            <inputItem type="textarea" :autosize="true" :value.sync="form.remark"></inputItem>
                        </el-form-item>
                    </el-col>
<!--                     <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="上传图片">
                            <uploadItem @success="uploadSuccess" :uploadData="uploadData" 
                            @remove="uploadRemove" :fileList="uploadList"></uploadItem>
                        </el-form-item>                        
                    </el-col> -->
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
                    gbgoodsId: '',
                    vulgo: '',
                    parentCategoryId: '',
                    enabled: 1,
                    remark: '',
                    categoryPicUrl: ''
                },
                categoryList: [],
                parentCategory: [],
                parentName: '',
                rules: {
                    code: [{required: true, message: '商品编码不能为空' }, this._ruleLength(50), this._ruleExist(configs.rootAPI + 'category/listByEntity', '商品编码')],
                    name: [{required: true, message: '分类名称不能为空' }, this._ruleLength(50), this._ruleExist(configs.rootAPI + 'category/listByEntity', '分类名称')],
                    gbgoodsId: [{required: true, message: '国标码不能为空' }, this._ruleLength(50), this._ruleExist(configs.rootAPI + 'category/listByEntity', '国标码')],
                    remark: [this._ruleLength(200)]
                },
                propss: {
                    label: 'name',
                    value: 'code',
                    children: 'childList',
                },
                uploadData: {
                    savePath: 'productCategory'
                },
                uploadList: [],
                flag: true
			}
		},
		props: {
			modal: {
				default: false
			},
            categoryModalType: {
                default: 'add'
            },
            category: {
                default: function() {
                    return {}
                }
            }
		},
		mounted() {  
            Object.assign(this.form, this.category)
            if(this.form.categoryPicUrl) {
                this.uploadList = [{url: configs.imgURL + this.form.categoryPicUrl}]
            }
            this.parentName = this.category.parentName
            this._ajax({url: this.rootAPI, name: 'category/childList', param: {parentCategoryId: 'top', filteEnabled: 1, filteDeleted: 0}})
            .then((function(d) {
                this.categoryList = d.aaData      
            }).bind(this))
            .then((function() {
                if(this.form.parentCategoryId.length > 0) {
                    this._ajax({url: this.rootAPI, name: 'category/queryParents', param: {parentCategoryId: this.form.parentCategoryId}})
                    .then((function(d) {
                        if(d.aaData.length > 0) {
                            this.parentCategory = d.aaData
                        }                        
                    }).bind(this))
                }
            }).bind(this))

		},
		methods: {
			cancel() {
				this.$emit('close')
			},
			valideSubmit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let o = {}, method = 'category/update';
                        if(this.categoryModalType === 'add') {  
                            method = 'category/create'
                        }
                        Object.assign(o, this.form)
                        if(this.categoryModalType !== 'add') {
                            this._ajax({url: this.rootAPI, name: 'category/childList', param: {code: o.code}})
                            .then((function(d) {
                                if(d.aaData.length > 0) {
                                    this.queryChilds(d.aaData, o.parentCategoryId)
                                }
                                if(this.flag) {
                                    // 判断是停用还是启用
                                    if(o.enabled===0) {
                                        // 停用,校验商品中是否包含该商品分类-若包含则该商品分类不能删除
                                        this._ajax({url: this.rootAPI, name: 'category/validateProductByGbgoodsId', param: {gbgoodsid: o.gbgoodsId}})
                                        .then((function(d) {
                                            if (d.aaData.id != null) {
                                                this.$message({type: 'warning', message: '不能停用,该分类或其子分类下有商品正在使用中'});
                                            } else {
                                                this.submit(method, o);
                                            }
                                        }).bind(this))
                                    }else {
                                        // 启用,查询父级是否有停用的
                                        if(o.parentCategoryId.length > 0) {
                                            this._ajax({url: this.rootAPI, name: 'category/listByEntity', param: {code: o.parentCategoryId, enabled: 0}})
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
                                    this.$message({type: 'warning', message: '不能选取子类或者自身作为该分类的父类'});
                                    this.flag = true
                                }
                            }).bind(this))
                        }else {
                            this.submit(method, o)
                        }                        
                    }
                })
			},
            beforeClose(done) {
                this.cancel()
                done()
            },
            categoryChange(val) {
                if(val.length > 0) {
                    Object.assign(this.form, {
                    	parentCategoryId: val[val.length - 1],
                    	gbgoodsId : val[val.length - 1],
                    	code : val[val.length - 1],
                    })
                }else {
                    Object.assign(this.form, {
                    	parentCategoryId: '',
                    	gbgoodsId : '',
                    	code : '',
                    })
                }
            },
            uploadSuccess(response, file, fileList) {
                Object.assign(this.form, {
                    categoryPicUrl: this._uploadPath(response)
                })
            },
            uploadRemove(file, fileList) {
                Object.assign(this.form, {
                    categoryPicUrl: ''
                })
            },
            queryChilds(childlist, parentcode) {
                for(var i = 0, l = childlist.length; i < l; i++) {
                    var el = childlist[i]
                    if(parentcode === el.code) {
                        this.flag = false   
                        return                                         
                    }else if(el.childs !== null && el.childs > 0) {
                        this.queryChilds(el.childList, parentcode)
                    }
                }
            },
            submit(method, o) {
                this._ajax({url: this.rootAPI + method, param: o})
                    .then((function(d) { 
                        this.$message({ type: 'success', message: '操作成功' }); 
                        this.$emit('submit')
                    }).bind(this))
            }
		}
	}
</script>