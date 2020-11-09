import Vue from 'vue'

import './styles/quasar.scss'
import iconSet from 'quasar/icon-set/fontawesome-v5.js'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'
import { Quasar ,QSpace, QLayout,QPageContainer,QChip,QBanner,Dialog,QRadio,QOptionGroup,
  QPage,QInput,QForm,QExpansionItem, QTable,QTh,QTr,QTd,QBtnDropdown,QPagination,QDate,Loading,
  QUploader,QTabs,QTab,QRouteTab,QScrollArea,
  Notify,Meta
} from 'quasar'

Vue.use(Quasar, {
  config: {},
  components: { 
    QLayout,QTable,QTh,QTr,QTd,QBanner,QBtnDropdown,QRadio,
    QPageContainer,QExpansionItem,QOptionGroup,QDate,QUploader,
    QPage,QInput,QForm,QSpace,QChip,QPagination,Loading,
    QTabs,QTab,QRouteTab,QScrollArea
   },
  directives: { /* not needed if importStrategy is not 'manual' */ },
  plugins: {
    Notify,Dialog,Meta
  },
  iconSet: iconSet
 })