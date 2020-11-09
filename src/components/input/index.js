export { default as TextInput } from './Text.vue'
export { default as NumberInput } from './Number.vue'
export { default as DecimalInput } from './Decimal.vue'
export { default as GenericInput } from './Generic.vue'
export { default as RadioInput } from './Radio.vue'
export { default as CheckBoxInput } from './CheckBox.vue'
export { default as SelectInput } from './Select.vue'
export { default as DateInput } from './Date.vue'
export { default as DateTimeInput } from './DateTime.vue'
export { default as ReferenceSelectInput } from './ReferenceSelect.vue' // this is for normal fk
export { default as ReferenceSelectDepInput } from './ReferenceSelectDep.vue' 
/* 
// this is for conditional fk 
eg:  village -> is dependent on block and panchayat
     and thg block , panchayat from different tables
 */
export { default as ReferenceObjectDepInput } from './ReferenceObjectDep.vue'
/*  // the reference related data will come in object form   --- so named as 'ReferenceObject'
// this is for conditional fk obj
eg:  hi_subactivity -> is dependent on hi_objective and hi_activity
     and thg hi_objective , hi_activity from same table
 */


export { default as ImageInput } from './Image.vue'



export { default as PageDesignInput } from './PageDesign.vue'