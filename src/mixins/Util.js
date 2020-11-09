import {exportToCSVService,utilService} from '../services'

export default{
    methods:{
        ...exportToCSVService,
        ...utilService
    }
}