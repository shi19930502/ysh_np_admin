import co from 'co'
import json2csv from 'json2csv'
import local from '../local.js'
import configs from '../configs.js'
import paginationMixin from './mixin_pagination.js'
import tableMixin from './mixin_table.js'
import modalMixin from './mixin_modal.js'
import regMixin from './mixin_reg.js'
import echartMixin from './mixin_echart.js'
import cascaderMixin from './mixin_cascader.js'
import uploadMixin from './mixin_upload.js'
import confirmMixin from './mixin_confirm.js'
import dataMixin from './mixin_data.js'
import dateMixin from './mixin_date.js'
//ajax
function* $ajax(url, type, param, async, loading, jsonType, arr, valiToken) {
    let contentType = jsonType ? 'application/json' : 'application/x-www-form-urlencoded; charset=UTF-8'
    let token = local.get('token')
    for (var key in param) {
        if (typeof param[key] === 'string') {
            param[key] = $.trim(param[key].replace(/<\/?[^>]*>/g, ''))
        }
    }
    if (valiToken && !token) {
        this.$message({ type: 'error', message: "token过期请重新登录" });
        this.$router.push({ name: 'login' })
    } else if(valiToken) {
        param.token = token
    }
    let o = {
        url: url,
        type: type,
        data: param,
        async: async,
        contentType: contentType
    }
    let data = {}
    if (arr) {
        o.traditional = true
    }
    if (loading) {
        this[loading] = true
    }

    data = yield $.ajax(o)
        .then((function(d) {
            if (loading) {
                this[loading] = false
            }
            if (d.state !== 0) {
                if (d.state == 97 || d.state == 98) {
                    this.$message({ type: 'error', message: d.msg });
                    this.$router.push({ name: 'login' })
                } else {
                    this.$message({ type: 'error', message: d.msg });
                    // this.$router.push({ name: 'page500' ,query:{error:d.readyState}})
                    console.error(d.msg)
                    if (typeof d.aaData === 'undefined' || d.aaData === null) {
                        d.aaData = []
                    }
                    return d
                }
            } else if (typeof d.aaData === 'undefined' || d.aaData === null) {
                d.aaData = []
                return d
            } else {
                return d
            }
        }).bind(this))
        .fail((function(d) {
            if (loading) {
                this[loading] = false
            }
            if (d.readyState === 4 && d.status === 404) {
                this.$router.push({ name: 'page404', query: { error: d.readyState } })
            } else if (d.status === 403) {
                this.$router.push({ name: 'page403' })
            } else if ((d.status + '').indexOf('50') === 0) {
                this.$router.push({ name: 'page500', query: { error: d.readyState } })
            } else {
                this.$message({ type: 'error', message: '接口异常' });
            }
        }).bind(this))
    return yield new Promise((function(resolve, reject) {
        resolve(data)
    }).bind(this))
}
export default {
	mixins: [paginationMixin, dataMixin, tableMixin, modalMixin, regMixin, cascaderMixin, uploadMixin, confirmMixin, echartMixin, dateMixin],
	data(){
		return{
			api: configs.api,
			rootAPI: configs.rootAPI, //接口根路径
			settleAPI: configs.settleAPI,//电子结算接口根路径
			userAPI: configs.userAPI,
			uploadURL: configs.rootAPI + 'plantingBaseInfo/imgupload?token=' + local.get('token'),
			rowStyle:{
				height: '30px',
		        'line-height': '30px',
		        'text-align': 'center'
			},
			filterable:true,
			clearable:true,
			userStateList: [{label: '全部', value: ''}, {label: '激活', value: '1'}, {label: '注销', value: '0'}],
			dicUserState: [],
			dicEnabled: [],
			dicDeleted: [],
			dicRoleState: []			
		}
	},
	updated() {
        var routeName = this.$route.name
        if(routeName !== 'login' && routeName !== 'customerRegist') {            
            this.$nextTick((function () {
                var winH = $(window).innerHeight() - 70
                var mainH = $('.main-container').height() + 41
                if(mainH >= winH) {
                    $('.lay1').hide()
                    $('.lay2').hide()
                    $('.lay1').show()
                }else {                    
                    $('.lay1').hide()
                    $('.lay2').hide()
                    $('.lay2').show()
                }
            }).bind(this))
        }else {
            $('.lay1').hide()
            $('.lay2').hide()
        }
    },
	methods: {
		handleDataList(d) {
			return d.aaData.map(function(el) {
				el.rowEditable = false
				el.rowError = false
				return el
			})
		},
		searchAll({
		    url = this.rootAPI,
		    type = 'POST',
		    name = '',
		    param = {},
		    async = true,
		    loading = '',
		    jsonType = false,
		    arr = false
		}, fn) {
			var params = Object.assign({
				pageNum: 1, 
				pageSize: 10000
			}, param)
			var o = {
				url: url,
			    type: type,
			    name: name,
			    param: params,
			    async: async,
			    loading: loading,
			    jsonType: jsonType,
			    arr: arr
			}
			return this._ajax(o)
		},
		renderTable(d) {
			let dataList = d.aaData
			if(Array.isArray(dataList)) {
				this.dataList = this.handleDataList(d)
				console.log(this.dataList)
				if(dataList.length > 0) {
					this.pageTotal = d.dataCount
				}else {
					this.pageTotal = 0
				}
			}else {
				this.handleDataList(d)
			}
		},
		_delSelection(urlObj,delKey,cb){
			if(this.delSelection.length === 0) {
	        		this.$message({type: 'info', message: '请选择行'});
	        	}else {
	        		let selection = this.delSelection
	        		this.confirm('确定删除？', (()=>{     
	        			var arr = [], o = {url:this.rootAPI,param:{},arr:true}
						selection.forEach(function(el) {
							arr.push(el[delKey])
						})
						o.param[delKey]=arr
						o=Object.assign(o,urlObj)
						this._ajax(o)
						.then((d)=>{
							cb(d);
						})
	        		}))	
	        	}
		},
		_ajax({
		    url = this.rootAPI,
		    type = 'POST',
		    name = '',
		    param = {},
		    async = true,
		    loading = '',
		    jsonType = false,
		    arr = false,
		    valiToken = true
		} = {}) {
			if ((url === this.rootAPI || url === this.userAPI || url === this.settleAPI) && name !== '') {
		        let api = url + name
		        return co.wrap($ajax).call(this, api, type, param, async, loading, jsonType, arr, valiToken)
		    } else {
		        return co.wrap($ajax).call(this, url, type, param, async, loading, jsonType, arr, valiToken)
		    }
		},
		//获取距离当天的时间
		_getDate(n){
		    const date = moment().subtract(n, 'days').format('YYYY-MM-DD');
            return date
		},
		//获取当前时间
		_getCurrentDate(n){
		    const date = moment().subtract(n, 'days').format('YYYY-MM-DD HH:mm:ss');
            return date
		},
		//过滤
		_filterData(val,options){
			for(let a=0;a<options.length;a++){
				if(val==options[a].value){
					return options[a].label
					break
				}
			}
		},
		showMsg(msg, scs) {
			Ext.Msg.show({
				cls: 'jz-msg',
			    title:'提示信息',
			    message: msg,
			    buttons: Ext.Msg.YESNO,
			    icon: Ext.Msg.QUESTION,
			    minWidth: 500,
			    fn: function(btn) {
			        if (btn === 'yes') {
			            scs()
			        } 
			        if(btn === 'no') {
			            console.log('No pressed');
			        }
			    }
			});
		},
		confirm(msg, scs) {
			return this.$confirm(msg, '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(scs).catch(() => {
	          this.$message({
	            type: 'info',
	            message: '已取消'
	          });          
	        });
		},
		_csvExport(data, fields, fieldNames, fileName) {
            try {
                var dataList = []
                data.map(function(el) {
                    var o = {}
                    fields.map(function(oo) {
                        o[oo] = el[oo] === null ? '' : el[oo]
                    })
                    dataList.push(o)
                })
                var result = json2csv({
                    data: dataList,
                    fields: fields,
                    fieldNames: fieldNames
                })
                var csvContent = 'data:text/csvcharset=GBK,\uFEFF' + result
                var encodedUri = encodeURI(csvContent)
                var link = document.createElement('a')
                link.setAttribute('href', encodedUri)
                link.setAttribute('download', `${(fileName || 'file')}.csv`)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            } catch (err) {
                console.error(err)
            }
        },
		_exportExcel(dataList, fields, filedsName, fileName) {
			if(dataList.length > 0) {
				this._csvExport(dataList, fields, filedsName, fileName)
			}else {
				this.$message({ type: 'info', message: '无导出数据' });
			}
		},
		$exportExcelBySelect(fields, filedsName, fileName) {
			if(this.rowSelection.length > 0) {
				this._csvExport(this.rowSelection, fields, filedsName, fileName)
			}else {
				this.$message({ type: 'info', message: '无导出数据' });
			}
		},
		_delList(apiurl, o) {
			this._ajax({url: apiurl, param: o, arr:true})
			.then((function(d) {
				this.$message({type: 'success', message: '删除成功'});
				this.handleCurrentChange(1)
			}).bind(this))
		},
		_searchDic(name) {
			return this._ajax({url: this.rootAPI, name: 'datadic/list', param: {dataType: name}})
		},
		_dicKey(d) {
			if(d.aaData.length > 0) {
				return d.aaData.map(function(el) {
					el.key = parseInt(el.key)
					return el
				})
			}else {
				return []
			}
		},
		_dicValue(key, dic) {
			var value = ''
			dic.forEach(function(el) {
				if(key === el.key) {
					value = el.value
				}
			})
			return value
		},
		_priceFormat(val) {
            if(typeof val === 'number') {
                return val/100
            }else {
                return val
            }            
        },
        _dateFormat({
            date = '',
            type = 'YYYY-MM-DD'
        } = {}) {
            if (date) {
                return moment(date).format(type)
            } else {
                return ''
            }

        },
        isObject(item) {
            return (item !== null && typeof item === 'object' && !Array.isArray(item));
        },
        isEmptyObject(obj) {
            return obj !== null && Object.keys(obj).length == 0
        },
        _parseFloat(val, num) {
            if (typeof val === "string") {
                return parseFloat(parseFloat(val).toFixed(num))
            } else if (typeof val === "number") {
                return parseFloat(val.toFixed(num))
            } else {
                return val
            }
        },
	},
}