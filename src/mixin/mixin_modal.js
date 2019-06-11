export default {
	data(){
		return{	
			modalShow: false,
			modalType: 'add',
			modalObj: {},
			modalWidth: '60%',
			modalMaxTableHeight: 500,
			modalTableInputWidth: '150px'
		}
	},
	methods: {
		modalCheck(o) {
			this.modalObj = o
			this.modalType = 'check'
			this.modalShow = true
		},
		modalAdd() {
			this.modalType = 'add'
			this.modalShow = true
		},
		modalEdit(o) {
			this.modalObj = o
			this.modalType = 'edit'
			this.modalShow = true
		},
		modalClose() {
			this.modalObj = {}
			this.modalShow = false
			this.modalType = 'add'
		},
		modalSubmit() {			
			this.modalClose()
			this.searchTable()
		}
	},
}