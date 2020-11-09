
const PAGE_MODES={
    "create":"create",
    "list":"list",
    "view":"view",
    "edit":"edit",
    "default":"list"
  }

export default{

    /* 
     Note:- cmputed property won't work with mixins
     */
  
    methods:{
        //test(par){console.log("par",par,"even")},

        //------ set up methods
     
        async loadPageDesign(){
            let path=`${this.path}/loadPageDesign`
            await this.$store.dispatch(path)
        },
         async  getAll(query={}){
        let path=`${this.path}/getAll`
            await this.$store.dispatch(path,query)
        },

        async refresh(){
         
            if(!this.firstTime)
           await this.getAll({...this.pagination,
                         fields:this.visibleColumns.join(','),
                        
                          ...this.query,...this.defaultQuery,...this.propsQuery
                         })
             this.positive({message:"Page data is refreshed"})
           
         },

         // ----------------------other methods

         onImageUpload(key,file){
            this.files[key]=file
        },
        back(){
          
          let path=this.currentPage || this.path  

          /* 
             currentPage --> treatments page 
           */

          this.selectedId=null
          this.mode=PAGE_MODES.list
          this.$router.push(`/${this.basePath?this.basePath+'/'+path:path}`)
        },

        // pagination
    
   
        async handlePagination(key,val){

            this.loading=true
            this.pagination[key]=val

            if(!this.firstTime){
                await this.getAll({...this.pagination,
                        fields:this.visibleColumns.join(','),
                        ...this.query,...this.defaultQuery,...this.propsQuery})
            }
        
            this.loading=false
        
        },

        addFilter(){

            // https://012.vuejs.org/guide/best-practices.html

            this.addingFilter=false
            let {filterField,filterOperation,filterValue,query}=this

            if(filterField && filterOperation && filterValue)
            {
                if(filterOperation==="is")
                {
                    // if filter is not there or ...if operation already exists
                    if((!query[filterField.pgdg_fieldname]) || (!Array.isArray(query[filterField.pgdg_fieldname])) )                  
                        this.$set(query,filterField.pgdg_fieldname,[]) //  query[filterField.pgdg_fieldname]=[]

                        /* 
                            once we use $set -> then the nested obj becomes reactive (Vue keeps watching)
                        */
                        query[filterField.pgdg_fieldname].push(filterValue)
                }
                else
                {
                // if filter operation is not there or ...already  filter(array) exists..eg: name:['ram']
                if((!query[filterField.pgdg_fieldname]) || Array.isArray(query[filterField.pgdg_fieldname]) )
                    this.$set(query,filterField.pgdg_fieldname,{})
                    query[filterField.pgdg_fieldname][filterOperation]=filterValue

                }
            }

            this.filterField="",this.filterOperation="",this.filterValue=""
        },
        deleteFilter(chip){

            let {field,operation}=chip
            this.$delete(this.query[field],operation)

        },
        exportData(){
            this.notify({message:"downloading....please wait",pregress:true})
            this.exportToCSV({columns:this.columns,data:this.data,fileName:`${this.name}(${this.pageNo})`})
        },


        async fetchWithFilters(){

            this.firstTime=true
            this.pagination={
                offset:0,
                limit:this.pagination.limit
            }

            await this.getAll({...this.pagination,
                            fields:this.visibleColumns.join(','),
                        
                            ...this.query,...this.defaultQuery,...this.propsQuery
                            })

           this.firstTime=false  
           
           this.positive({message:"data fetched successfully"})

        },
        handleFilterFieldChange(field){

            if(field.pgdg_fieldtype==='FK_dep'){
                field.pgdg_fieldtype='FK'
            }
            if(field.pgdg_fieldtype==='Datetime'){
                field.pgdg_fieldtype='Date'
            }
            this.filterField=field

        },

        handleSelectAll(){

            if(this.selectedAll===null)// only few are selected-> deselect all
               {
                    this.selectedAll=false;
                    this.selectedObjs={}
                    return;
               }
            if(this.selectedAll)
            {
                this.selectedAll=false;
                this.selectedObjs={}
                return;
            }   

                this.selectedAll=true;
                this.selectedObjs={}
                this.data.forEach(ele=>this.selectedObjs[ele[this.idField]]=ele)
                return;
               

        },

        handleSelect(id,obj){

            if(this.selectedObjs[id]) // already exists
               this.$delete(this.selectedObjs,id)// this.selectedObjs[id]
            else  this.$set(this.selectedObjs,id,obj) //this.selectedObjs[id]=obj

            switch(Object.keys(this.selectedObjs).length){
                case 0:{
                    this.selectedAll=false
                    break;
                }
                case this.data.length:{
                    this.selectedAll=true
                    break;
                }
                default:{
                    if(this.selectedAll!==null)// avoid changing every time
                    this.selectedAll=null
                    break;
                }
            }

        }

    },

    watch:{
        async visibleColumns(newVal){

            if( !this.firstTime && this.mode===PAGE_MODES.list)
            {
                await this.getAll({...this.pagination,
                                fields:newVal.join(','),             
                                ...this.query,...this.defaultQuery,...this.propsQuery})
            }
           
        },
        async mode(mode){
            if((!this.firstTime)&&mode===PAGE_MODES.list && this.data.length===0){
               
                await this.loadTableView()
            }
        } 
    }
}