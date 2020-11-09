<template>
        <q-card class="c-card q-ma-sm q-mt-md " :flat="tabMode" :bordered="false">
               
                <q-item v-if="!tabMode" class="c-card__header">

                          <q-item-section class="float__left c-card__header__actions" >
        
                                <q-item :style="{'padding':'1px 10px'}" >
                                        <q-btn flat icon='fas fa-arrow-left' :style="{'font-size':'12px'}" 
                                               @click="$emit('back')" >
                                                <q-tooltip>Back</q-tooltip>
                                        </q-btn>
                                </q-item>
                         </q-item-section>

                        <q-space></q-space>
                                        <q-item-section>
                                                <span class="text-h5 q-ml-md" >{{naam}} Details</span>
                                        </q-item-section>
                                <q-space></q-space>
                </q-item>
        <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md c-form"
       
        >
         <q-card-section v-if=" sections &&sections.length"  class="container" >
                 <div  v-for="index in sections.length-1" :key="index">
                         
                        <span class="text-h6 c-text__underline" >{{  sections[index-1][0]?sections[index-1][0].pgdg_section:' Section '+index}} :-</span>

                        <q-card-section :class="inputClasses" 
                        
                        >
                                 <page-design-input 
                                   :class="sections[index-1].length!==1? 'col-xs-12 col-sm-4 col-md-3':'col-xs-12'"                     
                                   v-for="(field, i) in sections[index-1]" :key="i"                                  
                                   :disabled="mode==='view' || disabledFields[field.pgdg_fieldname] || (field.pgdg_edit!==true) || (mode==='edit' && (field.pgdg_fieldupdateable===false)) "
                                   :errors.sync="errors"
                                   :value="value"
                                   :field="field"
                                   :rules="rules"
                                  @focus="errors[field.pgdg_fieldname]=''"
                                  @input="update(field.pgdg_fieldname,$event)"
                                  @validate="updateErrors(field.pgdg_fieldname,$event)"
                                  @on-image-upload="file=>$emit('on-image-upload',field.pgdg_fieldname,file)"
                                  @on-image-remove="update(field.pgdg_fieldname,null)"
                                  :options-obj="optionsObj"

                                  :join="false"
                                  :delimiter="'<>'"
                                  :field-types="fieldTypes"
                                  :hint-obj="hintObj"
                                  :colors="colors" 


                                />



                        </q-card-section> 
                        <q-separator  />
                      
                </div>

                 <div v-if="mode!=='create'" >
                         
                        <span class="text-h6 c-text__underline" >System Information :-</span>

                        <q-card-section :class="inputClasses" 
                        
                        >
                                <q-input 
                                class="col-xs-12 col-sm-4 col-md-3"  
                                readonly filled autogrow  dense
                                :value="`${ userName( value[systemInfo.createdBy]) || value[systemInfo.createdBy]} at ${ formatDate(value [systemInfo.createdDt])}`" 
                                :label="'Created By'" />
                               <q-input 
                                class="col-xs-12 col-sm-4 col-md-3"  
                                readonly filled autogrow dense
                                :value="`${ userName(value[systemInfo.modifiedBy]) || value[systemInfo.modifiedBy]} at ${ formatDate( value[systemInfo.modifiedDt])}`" 
                                label="Modified By" 
                               
                                />


                        </q-card-section>
                </div>
                <q-separator  />
         </q-card-section>

                 <span v-if="error" class="c-error" >{{error}}</span>

        <q-card-actions :style="{'margin':'-5px 10px 5px 0px '}" align="right" >
           
           <q-item>

                     
        <q-btn flat  @click="$emit('back')" color="primary">
                     Back
        </q-btn>
        <q-btn v-if="mode!=='view'" flat type="submit" color="positive" >
                Save
        </q-btn>
        <q-btn v-if="mode!=='view'" label="Reset" flat @dblclick="onReset"  color="info" >
                  <q-tooltip
                  :content-style="{'background-color':'aqua','color':'black'}"
                  >Double Click to Reset</q-tooltip>
        </q-btn>
          </q-item>  
          
      </q-card-actions>
 </q-form>       
    </q-card>
</template>

<script>
import {utilMixin,validationMixin,notificationMixin} from '../../../../mixins'
import {  /* mapGetters */ } from 'vuex'

import {globalService} from '../../../../services'
import {PageDesignInput} from '../../../../components/input'
import getTreatmentTaskDates from './planning'

let yesOrNo={"Yes":true,"No":false}        

export default {
        name:'treatments-form',
        props:['naam','master','pageMode'/* 'mode' */,'fields','value','idField','back',
        'controllingFields','on-image-upload',
        'rules','selectedId','backendErrors','backendError',
        'reset-errors','tabMode','optionsObj','update-options','currentPage',
        'holidaysDates','load-holidays'

        /* 
           we are unable to exclude from keep alive ...in atp 

           so we are not using mode directly...instead...using from pageMode
        */

        ],
        mixins:[utilMixin,validationMixin,notificationMixin],
        components:{
               'page-design-input':PageDesignInput,
              //  'scroll-area':ScrollArea
        },
        /* 
         ***
           if pass v-model prop---> that will be received as 'value'
           and that can be update by emitting  @input event
         */
        data(){
                return({
                  mode:'view',
                   inputClasses:{
                           'row':true,
                           'q-gutter-md':true,
                           'c-form__inputs':false
                   },
                   errors:{},// for field errors
                   error:null, // for specific errors
                   fieldTypes:{},// to change field types logically
                   hintObj:{},// to store hints
                   colors:{},// to pass colors to calender
                   //--------------
                disabledFields:{}, 
                /*   manage dependency fields
                 disabledFields:{
                        disabledField:true || false || null 
                        }
                
                */
                   options:[],
                   checkedIn:null
                })
        },
        computed:{
                        //...mapGetters('ref', ['user']),
                        user(){
                                return this.$store.state['ref'].user
                        },

                sections(){
                        let sections=[]

                       for(let field of this.fields)
                       {

                               if(!sections[field.pgdg_secno])
                                   sections[field.pgdg_secno]=[]


                               sections[field.pgdg_secno].push(field)    
                       }
                       return sections;         

                },
                systemInfo(){
                        
                      let sysInfo=this.sections&&this.sections.find(ele=>ele[0]&&ele[0].pgdg_section==='System Information')
                        if(!sysInfo) sysInfo={}
                        let createdBy,createdDt,modifiedBy,modifiedDt

                            for(let field of sysInfo)
                            {
                                         if(/creat(.*?)y/.test(field.pgdg_fieldname) )
                                         createdBy=field.pgdg_fieldname

                                         if(/creat(.*?)t/.test(field.pgdg_fieldname) )
                                         createdDt=field.pgdg_fieldname

                                         if(/modified(.*?)y/.test(field.pgdg_fieldname) )
                                         modifiedBy=field.pgdg_fieldname

                                         if(/modified(.*?)t/.test(field.pgdg_fieldname) )
                                         modifiedDt=field.pgdg_fieldname
                            }    

                        return ({createdBy,createdDt,modifiedBy,modifiedDt})

                },               
                userName(){
                        return (val)=> this.getRefText({data:this.user,val,fields:['usr_id','usr_name']})
                }
              
        },
        methods:{
                    
                async getDisabilityOptions(suId){
                        //'tr_disability':data.su_disability.split(",")
                        let {data}=await globalService.getAll("/serviceuser",
                                {su_id:suId,fields:"su_disability,su_category"})

                         let options=[]     
                          let tr_category 
                        if(data&&data[0])
                        {
                          options=data[0].su_disability.split(',')
                          tr_category=data[0].su_category
                        }
                         var updatedCopy = Object.assign({}, this.optionsObj, {'tr_disability':options })

                        this.$emit('update-options',updatedCopy) 

                        return tr_category

                },
                async getAssessmentOptions(suId){
                        // assessmentOptions

                        let {data:assmntRes}=await globalService.getAll("/form",
                        {form_serviceuser:suId,form_status:"Completed",
                        form_isActive:true,limit:-1,fields:"form_type",})

                        let assmntsNames=new Set()//unique names

                        assmntRes.forEach(ele => assmntsNames.add(ele.form_type));

                        assmntsNames=[...assmntsNames]

                        let index=assmntsNames.indexOf('General Assessment')
                        if(index>=0)
                        assmntsNames.splice(index,1)

                       // this.optionsObj['tr_assessment']=assmntsNames


                      var updatedCopy = Object.assign({}, this.optionsObj, {'tr_assessment':assmntsNames })

                        this.$emit('update-options',updatedCopy) 
                        
                          if(!assmntsNames.length){
                                this.errors=Object.assign({},this.errors,{'tr_assessment':"Assessments list is empty for the service user disability"})
                        }


                },

               async getClassificationOptions(assmnt)
                {


                         let {data}=await globalService.getAll("/formmap",
                                {limit:-1,fm_isActive:true,fm_form:assmnt,fields:'fm_treatment'})

                        let classificationOptions=data&&data[0]&&data[0].fm_treatment.split(',')
                        if(!classificationOptions)
                        classificationOptions=[]

                      var updatedCopy = Object.assign({}, this.optionsObj, {'tr_classification':classificationOptions })

                        this.$emit('update-options',updatedCopy)  

                },
               customizeProblemOptions(data){
                       
                       /* 
                         {
                                 prblem:{
                                         goal:[treatement,treatement]
                                 }
                         }
                        */
                       let obj={}
                       data.forEach(row => {
                                let { mc_problem, mc_goal, mc_treatment } = row;

                                if((!mc_problem) || (!mc_goal) || (!mc_treatment) )
                                return; // skip ...if any one is null

                                // mc_problem=mc_problem.toLocaleLowerCase();
                                // mc_goal=mc_goal.toLocaleLowerCase();
                                // mc_treatment=mc_treatment.toLocaleLowerCase()

                                mc_problem=mc_problem.trim()
                                mc_goal=mc_goal.trim()
                                mc_treatment=mc_treatment.trim()

                                if (!obj[mc_problem]) obj[mc_problem] = {};

                                if (!obj[mc_problem][`${mc_problem} --> ${mc_goal}`])
                                obj[mc_problem][`${mc_problem} --> ${mc_goal}`] = [];

                                obj[mc_problem][`${mc_problem} --> ${mc_goal}`].push(`${mc_goal} --> ${mc_treatment}`)
                        });
                this.allProblems=obj


               }, 
               async getProblemOptions(values){

                  let {data}=await globalService.getAll("/medicalchart",{
                          limit:-1,mc_category:values.tr_category,
                          mc_classification:values.tr_classification,
                          fields:'mc_problem,mc_goal,mc_treatment'
                  })     
                
                let problemOptions=new Set()//unique names

                data.forEach(ele => problemOptions.add(ele.mc_problem));

                problemOptions=[...problemOptions]

                problemOptions=problemOptions.map(ele=>({label:ele,value:ele}))

                var updatedCopy = Object.assign({}, this.optionsObj, {'tr_problem':problemOptions })
                this.$emit('update-options',updatedCopy) 

                this.customizeProblemOptions(data)


                        if(!problemOptions.length){
                                this.errors=Object.assign({},this.errors,{'tr_problem':"Problems list is empty for the selected claasification"})
                        }

               }, 
                getGoalOptions(problems){

                       let options=[]

                      // let selected=event.split(',')
                       problems.forEach(ele=>this.allProblems[ele]&&options.push(...Object.keys(this.allProblems[ele])))

                       options=options.map(ele=>({label:ele,value:ele}))         

                        var updatedCopy = Object.assign({}, this.optionsObj, {'tr_goal':options })
                        this.$emit('update-options',updatedCopy) 


                        if(!options.length){
                                this.errors=Object.assign({},this.errors,{'tr_goal':"Goals list is empty for the selected problems"})
                        }



                },
                getTreatmentOption(goals){

                let options=[]        
                goals.forEach(ele=>{
                        if(ele)// problem --> goal
                        {
                            let problem=ele.split(' --> ')[0]    

                                if(this.allProblems[problem]&&this.allProblems[problem][ele]){
                                        options.push(...this.allProblems[problem][ele])
                                }

                        }
                   })
                    options=options.map(ele=>({label:ele,value:ele}))         

                        var updatedCopy = Object.assign({}, this.optionsObj, {'tr_treatment':options })
                        this.$emit('update-options',updatedCopy) 


                        if(!options.length){
                                this.errors=Object.assign({},this.errors,{'tr_treatment':"Treatments list is empty for the selected goals"})
                        }


                },
                getTaskdatesOptions(taskDates,holidays){

                                let options=[]

                                options.push(...holidays,...taskDates)   

                                var updatedCopy = Object.assign({}, this.optionsObj, {'tr_treatmentdates':options })
                                this.$emit('update-options',updatedCopy) 

                },
                validateBeforeSubmit(){
                               
                        //let newErrors={}       
                         
                      //  this.errors={...this.errors,...newErrors}


                      // this.error="Please Checkout"


                },
               async  update(key,event) {

                         if(this.error)
                            this.error=null
                        if(key==='tr_treatmentdates')
                          return

                        // never modify the prop.
                        // emit a clone with updated fields.
                        var updatedCopy = Object.assign({}, this.value, {[key]:event })
                        
                        
                        if(key==='tr_serviceuser')
                          {
                              updatedCopy.tr_category =await  this.getDisabilityOptions(event)// return tr_category
                                  this.getAssessmentOptions(event)
                          }

                        if(key==='tr_assessment'){

                                this.getClassificationOptions(event)
                        }
                        if(key==='tr_classification'){
                                this.getProblemOptions(updatedCopy)
                        }
                        if(key==='tr_problem'){
                                this.getGoalOptions(event)
                        }
                        if(key==='tr_goal'){
                                 this.getTreatmentOption(event)
                        }

//--------------------------planning inputs start-------------------

                        if(key==='tr_freq'){

                                if(event==='Custom' || event==='Weekly'){

                                  if(event==='Custom'){
                                          this.fieldTypes['tr_freq_sub']='Number'
                                          this.hintObj['tr_freq_sub']='enter any number, eg: 2 ( for every 2 days )'
                                  }
                                  else  {
                                          this.fieldTypes['tr_freq_sub']=null
                                          this.hintObj['tr_freq_sub']=null

                                  }
                                  this.disabledFields['tr_freq_sub']=null      
                                }
                                else{
                                         this.disabledFields['tr_freq_sub']=true
                                         updatedCopy['tr_freq_sub']=null
                                }

                        }

                        if(key==='tr_startdate'){
                              //  let fromDt=new Date(this.holidaysDates[0])
                                let toDt=new Date(this.holidaysDates[this.holidaysDates.length-1])
                                let dt=new Date(event)
                                if(!( /* fromDt<=dt && */ dt<=toDt )) // if the date is out of fetched holidays
                                {
                                          // all dates are already fetched
                                        if(!this.holidaysDates.length<100) 
                                        await   this.$emit('load-holidays', dt)
                                }
                        }
                        if(key==="tr_freq" || key==="tr_freq_sub" || key==="tr_target" 
                        || key==="tr_startdate"){
                                                        
                               let taskDates= getTreatmentTaskDates(updatedCopy.tr_startdate,updatedCopy.tr_target,
                                updatedCopy.tr_freq,updatedCopy.tr_freq_sub,this.holidaysDates) 
 
                                       updatedCopy.tr_enddate=taskDates[taskDates.length-1]
                                       updatedCopy.tr_treatmentdates=taskDates.join(',')
                                      this.getTaskdatesOptions(taskDates,this.holidaysDates)
                               

                        }

//--------------------------planning inputs end-------------------


                                   
                        let newDisabledFields=this.manageDisabledFields(key,event,updatedCopy)

                        if(newDisabledFields)
                        this.disabledFields={...this.disabledFields,...newDisabledFields}
                        this.$emit('input', updatedCopy)
           
                },
                manageDisabledFields(key,val,updatedCopy)
                {
                         let newDisabledFields={}


                        if(this.controllingFields[key])
                        {
                                for(let depField in this.controllingFields[key])
                                {       
                                        if(!val) // in clear case
                                        {
                                                newDisabledFields[depField]=true
                                                  updatedCopy[depField]=null
                                                  continue;  
                                        } 
                                        
                                        // when all values are accepted
                                        if( this.controllingFields[key][depField]==='*'){
                                                 newDisabledFields[depField]=null
                                                  updatedCopy[depField]=null
                                                  continue;
                                        }

                                        if(val=== this.controllingFields[key][depField] ||
                                           val=== yesOrNo[this.controllingFields[key][depField]] 
                                        )
                                        newDisabledFields[depField]=null
                                        else {
                                                newDisabledFields[depField]=true
                                                updatedCopy[depField]=null
                                        }


                                }
                        }

                        return Object.keys (newDisabledFields).length?newDisabledFields:null

                },

                // based on dependecy field
                getAlldisabledFields(){
                        let newDisabledFields={}
                        for(let key in this.controllingFields){

                                for(let depField in this.controllingFields[key])
                               {
                                
                                       if(this.value[key] && 
                                               ( this.value[key]=== this.controllingFields[key][depField] ||
                                                this.value[key]=== yesOrNo[this.controllingFields[key][depField]]
                                                )
                                       )
                                       newDisabledFields[depField]=null
                                       else {
                                               newDisabledFields[depField]=true
                                       }


                               }
                        }

                        return newDisabledFields
                },
                getLogicalDisabledFields(){

                        let disabledFields={}
                      
                              for(let section of this.sections)
                                {
                                        if(section[0] && section[0].pgdg_section==='Treatment Planning')
                                        {
                                                for (let field of section){
                                                       disabledFields[field.pgdg_fieldname]=true 
                                                }
                                        }
                                }  
                        

                        return disabledFields;
                },
                updateErrors(key,event){
                       // this.errors[key]=event
                  this.errors = Object.assign({}, this.errors, {[key]:event })

                        // default ...validations is not working for checkbox and radios...so

                },
                onSubmit(){
                         
                         
                         this.validateBeforeSubmit()

                        for(let key in this.errors)
                               if(this.errors[key])
                              {
                                      this.negative({message:"Please fix all errors"})
                                       return
                              }
                         
                         if(this.error)
                         {
                                 this.negative({message:this.error})
                                return
                         }
                         
                        var updatedCopy = Object.assign({}, this.value )

                        updatedCopy.tr_problem=updatedCopy.tr_problem.join('<>')
                        updatedCopy.tr_goal=updatedCopy.tr_goal.join('<>')
                        updatedCopy.tr_treatment=updatedCopy.tr_treatment.join('<>')
                        this.$emit('input', updatedCopy)

                
                         this.$emit('handle-submit')
                },
                onReset(){
                       this.$emit('input', {[this.idField]:this.selectedId})
                       this.$emit('reset-errors')
                       this.errors={}
                }
               
        },  
       async created(){

                if(!(this.holidaysDates&&this.holidaysDates.length))
               {
                       this.$emit('load-holidays')
               }
               this.colors['red']=this.holidaysDates 


               this.mode=this.pageMode
                let disabledFields={} 
                if(this.mode==='create'){
                        disabledFields =this.getAlldisabledFields()
                        disabledFields={...disabledFields,...this.getLogicalDisabledFields(this.mode)}
                }
                if(this.mode==='edit'){
                        // make all option available for edit

                        this.getDisabilityOptions(this.value.tr_serviceuser)
                        this.getAssessmentOptions(this.value.tr_serviceuser)
                        this.getClassificationOptions(this.value.tr_assessment)
                       await this.getProblemOptions(this.value)
                       this.getGoalOptions(this.value.tr_problem.split('<>'))
                       this.getTreatmentOption(this.value.tr_goal.split('<>'))

                    if(this.currentPage!=='treatmentplans' && 
                    (!'Waiting For Approval,Rejected'.includes(this.value.tr_status)))   
                    {
                              disabledFields={...disabledFields,...this.getLogicalDisabledFields(this.mode)}
                    } 


                }

                
                this.disabledFields=disabledFields
        },
        watch:{

                $route(to){
                        this.mode=to.query.mode 
                        /* 
                        when we use keep-alive ....exclude is not working..
                        if we click on view mode  the later clicked on edit mode         

                        */
                },
              
                backendErrors(newVal){
                        if(!this.isEmpty(newVal))
                            this.errors=Object.assign({},newVal)
                },
                backendError(newVal){
                        if(newVal)
                          this.error=newVal
                },
              async  pageMode(newVal){
                      // this is to handle when page is refreshed
   // whe it is used as child route --> second time it'll refresh...won't get created again
                   
                        this.mode=newVal
                        let disabledFields={}
                        if(newVal==='create')
                        {
                                disabledFields={...this.getAlldisabledFields(),...this.getLogicalDisabledFields(this.mode)}
                        }
                        if(newVal==='edit'){
                                 // make all option available for edit

                                this.getDisabilityOptions(this.value.tr_serviceuser)
                                this.getAssessmentOptions(this.value.tr_serviceuser)
                                this.getClassificationOptions(this.value.tr_assessment)
                                await this.getProblemOptions(this.value)
                                this.getGoalOptions(this.value.tr_problem.split('<>'))
                                this.getTreatmentOption(this.value.tr_goal.split('<>'))

                               if(this.currentPage!=='treatmentplans' && 
                                 (!'Waiting For Approval,Rejected'.includes(this.value.tr_status)))   
                                disabledFields={...disabledFields,...this.getLogicalDisabledFields(this.mode)}


                        }
                        this.disabledFields=disabledFields
                       
                },
                holidaysDates(newDates){
                        this.colors['red']=newDates

                        let options=[]
                          if(this.value.tr_treatmentdates)
                             options.push(...this.value.tr_treatmentdates.split(','))
                          options.push(...newDates)   

                          var updatedCopy = Object.assign({}, this.optionsObj, {'tr_treatmentdates':options })

                        this.$emit('update-options',updatedCopy) 
                }
             
        }
}
</script>

<style>

</style>