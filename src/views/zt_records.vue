<template>
	<div class="zt_records">
		<searchInputItems>
			<searchInputItem name="时间间隔">
				<dateEditorDaterange 
					:disabledAfterDate='disabledAfterDate'  
					:disabledBeforeDate='disabledBeforeDate'
					:dateValue.sync='dateValue'>
				</dateEditorDaterange>
			</searchInputItem>
			<searchInputItem name="单个时间">
				<dateEditorDaterange 
					type='date'
					@change='dateChange'
					:disabledAfterDate='disabledAfterDate'  
					:disabledBeforeDate='disabledBeforeDate'
					:dateValue.sync='dateValue_2'>
				</dateEditorDaterange>
			</searchInputItem>
			<searchInputItem name="所属区域">
				<inputItem @keyup.enter.native="selectArea" :suffix='true' class='i_search'  @focus='selectArea'  :placeHolder="placeHolderSelect" :value.sync='modelForm.areaName' @enter="searchTable">
					<i slot="suffix" @click='clearInput' class="el-icon-circle-close"></i>
				</inputItem>
			</searchInputItem>
			<searchInputItem name="关键字">
				<inputItem :placeHolder="placeHolderGjz"  :value.sync='searchForm.gjz'></inputItem>
			</searchInputItem>
			
			<searchInputItem name="关键字">
				<selectItem
					:selectValue.sync='selectvalue'>
					<el-option 
				    	v-for="item in selectOptions" 
				    	:key="item.value" 
				    	:label="item.label" 
				    	:value="item.value">
	   				</el-option>
				</selectItem>
			</searchInputItem>
			
			<searchInputItem name="节点类型" ref='codeRef' class='codeNameF'>	
					<span :class="[index === 0 ? 'active' : '', 'option-name', 'node-name' , 'codeClass']" v-for="(el, index) in codeList" @click="setCode(el.nodetypeCode, $event)">{{el.nodetypeName}}</span>
			</searchInputItem>
			<searchInputItem name="环节类型" ref='linkRef' class='codeNameF'>
					<span :class="[index === 0 ? 'active' : '', 'option-name', 'node-name', 'linkClass']" v-for="(el, index) in linkList" @click="setLink(el.id, $event)">{{el.name}}</span>
			</searchInputItem>
		</searchInputItems>
		<optionItems>
			<template slot="left">
				<el-button-group>
					<iconBtn iconClass="el-icon-plus" content="新增" @click="recordsModalAdd">新增</iconBtn>
					<iconBtn iconClass="el-icon-minus" content="删除" @click='dele'>删除</iconBtn>
					<iconBtn iconClass="el-icon-search" content="查询" @click="searchTable">查询</iconBtn>
					<iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
				</el-button-group>				
			</template>
		</optionItems>
		<elemTable 
			:dataList="dataList"
			@sizeChange="handleSizeChange"
	        @currentChange="handleCurrentChange"
	        @selectionChange='selectionChange'
	        :currentPage="currentPage"
	        :pageSizes="pageSizes"
	        :pageSize="pageSize"
	        :pageTotal="pageTotal"
	        :loading='dataLoading'
			>
			<!--是否显示selection-->
		    <el-table-column type="selection" width="55"></el-table-column>
		    
		    <el-table-column
		    	v-for="(el,index) in dataHeaderList"  
		    	:prop="el.prop" 
		    	:key="el.prop" 
		    	show-overflow-tooltip min-width="160" 
		    	:label="el.label">
		    	<template slot-scope="scope">
		    		<!--这里不能传index判断，不然会出问题-->
		    		<div v-if='tableSelectRule(el.prop)'>
		    			<selectItem
		    				@selectOnChange='selectOnChange'
							:selectValue.sync='scope.row[el.prop]'>
							<el-option 
						    	v-for="item in selectOptionsUnit" 
						    	:key="item.value" 
						    	:label="item.label" 
						    	:value="item.value">
			   				</el-option>
						</selectItem>
		    		</div>
		    		<span v-else >{{scope.row[el.prop]}}</span>
		    	</template>
		    </el-table-column>
		    
		    <!--<el-table-column prop="loginName" show-overflow-tooltip min-width="150" label="节点名称"></el-table-column>-->
		    <el-table-column fixed="right" label="操作" min-width="153">
		      <template slot-scope="scope">
		        <el-button-group>
				    <iconBtn iconClass="el-icon-view" content="查看" @click="lookOver"></iconBtn>
				    <iconBtn iconClass="el-icon-edit" content="修改" @click="userModalEdit"></iconBtn>
				    <iconBtn iconClass="el-icon-minus" content="删除" @click='delRow(scope.row)'></iconBtn>
		    	</el-button-group>
		      </template>
		    </el-table-column>
		</elemTable>
		
		<selectAreaModal 
			:modal="modalSelectArea"
			 v-if="modalSelectArea" 
			@close="modalSelectAreaClose"
			@rowVal="rowVal">
		</selectAreaModal>
	</div>
</template>
	
<script>
import mixin from '../mixin/mixin.js' // 公共方法，包括主要的ajax
import selectAreaModal from './component/modal/selectAreaModal.vue'
export default {
	mixins: [mixin],
	components: {selectAreaModal},
	data(){
		return{
			dateValue:[],
			dateValue_2:[],
			dataList:[],
			options:[],
			selectvalue:'',
			selectUnit:'',
			selectOptionsUnit:[],
			codeList:[],
			linkList:[],
			nodetypeId:null,
			startTime:'',
			endTime:'',
			dataHeaderList:[],
			modalSelectArea:false,
			modelForm:{
				areaName:''
			},
			searchForm:{
				area:'',
				gjz:'',
			},
			placeHolderGjz:'请输入节点编码、名称或地址',
			placeHolderSelect:'请选择地区',
			tableId:'',
			disabledBeforeDate:'2018-04-23',
			disabledAfterDate:'2018-04-26',
		}
	},
	mounted(){
		this.selectOptions=[{
          value: 1,
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }]
		this.selectOptionsUnit=[{
          value: 1,
          label: 'kg'
        }, {
          value: 2,
          label: '框'
        }, {
          value: 3,
          label: '包'
        }, {
          value: 4,
          label: '件'
        }]
		this.initCode()
	},
	methods:{
		tableSelectRule(prop){
			if(prop == 'batchId' || prop == 'pinglei'){
				return true
			}
			return false
		},
		handleDataList(d){
			this.dataHeaderList=[];
			for(let a=0;a<d.columnText.length;a++){
				var obj={};
				obj.label=d.columnText[a]
				obj.prop=d.columnName[a]
				this.dataHeaderList.push(obj)
			}
			console.log('this.dataHeaderList',this.dataHeaderList)
			this.dataList=d.aaData
			return d.aaData
		},
		searchTable(){
			this._ajax({url:this.rootAPI,name:'runInTerface/list',loading:'dataLoading',
				param:{
					pageNum:this.pageNum,
					pageSize:this.pageSize,
					tableId:this.tableId,
					keyWord:'',
					startTime:this.startTime,
					endTime:this.endTime,
					}
				})
			//.then(这里是函数字符串，不执行函数，所以不加())
			.then(this.renderTable)
		},
		//设置初始化环节，获取点击事件后的环节
		setLink(id,e){
			if(e){
				$('.linkClass').removeClass('active')
				$(e.target).addClass('active')
			}else{
				$('.linkClass').removeClass('active')
				$('.linkClass').first().addClass('active')
			}
			this.tableId=id;
			this.searchTable();	
//			this.searchTable();	
		},
		//设置初始化节点，获取点击事件后的节点
		setCode(val,e){		
			if(e){
				$('.codeClass').removeClass('active')
				$(e.target).addClass('active')
			}
			console.log(this.$refs.codeRef.$el.children[1].children)
			console.log($(this.$refs.codeRef.$el.children[1]))
			this.nodetypeId=val;
			this.initLink();
		},
		//初始化节点类型
		initCode(){
//			nodetype/list
			this._ajax({url:this.rootAPI,name:'basNodetype/list'})
			.then((d)=>{
				if(d.state===0){
					var arr=[]
					for(let a=0;a<d.aaData.length;a++){
						if(d.aaData[a].nodetypeCode=='2002'||d.aaData[a].nodetypeCode=='1006'||d.aaData[a].nodetypeCode=='2003'||d.aaData[a].nodetypeCode=='2004'||d.aaData[a].nodetypeCode=='1008'||d.aaData[a].nodetypeCode=='1007'){
							
						}else{
							if(d.aaData[a].nodetypeCode=='2001'){
								d.aaData[a].nodetypeName=d.aaData[a].nodetypeName+"（电商、拍卖、收储）"
							}else if(d.aaData[a].nodetypeCode=='1002'){
								d.aaData[a].nodetypeName=d.aaData[a].nodetypeName+"（配送）"
							}else if(d.aaData[a].nodetypeCode=='1003'){
								d.aaData[a].nodetypeName=d.aaData[a].nodetypeName+"（专卖店）"
							}
							arr.push(d.aaData[a])
						}
					}
					this.codeList = arr;
					this.setCode(arr[0].nodetypeCode)
				}
			})
		},
		//初始化环节类型
		initLink(){
			this._ajax({url:this.rootAPI,name:'baseNodetypeInfo/queryBynodeTypeId',param:{nodetypeId:this.nodetypeId}})
			.then((d)=>{
				if(d.state===0){
					this.linkList=d.aaData
				}
				return d
			})
			.then((d)=>{
				this.setLink(d.aaData[0].id)
			})
		},
		recordsModalAdd(){
			
		},
		resetParma(){
			this.pageNum=1
			this.pageSize=10
			this.tableId='';
			this.startTime=''
			this.endTime=''
		},
		reset(){
			$('.node-name').removeClass('active')
			$('.linkClass').first().addClass('active')
			$('.codeClass').first().addClass('active')
			this.resetParma()
			this.initCode()
		},
		lookOver(){

		},
		userModalEdit(){
			
		},
		selectArea(){
			this.modalSelectArea=true
		},
		modalSelectAreaClose(){
			this.modalSelectArea=false;
		},
		rowVal(r){
			this.modelForm.areaName=r.name
		},
		clearInput(){
			this.modelForm.areaName=''
		},
		onChangeDate(val){
			console.log('dateValuemodel',this.dateValue)
			console.log('onChangeDate',val)
		},
		//selectionChange在mixin_table中
		dele(){
			this._delSelection({name:'baseNodetypeInfo/queryBynodeTypeId'},this.nodetypeId,(d)=>{
				console.log('3333333',d)
				this.searchTable()
			})
		},
		delRow(row){
			console.log(row)
		},
		selectOnChange(val){
			console.log(this.dataList)
			console.log('selectOnChange',val)
		},
		dateChange(){
			console.log(this.dateValue)
			console.log(this.dateValue_2)
		}
	},
}
</script>
<style scoped>
	
</style>
<style lang="sass">
	/*scoped表示  CSS 只作用于当前组件中的元素*/
	/*lang="sass"表示  可以使用sass写法*/
</style>