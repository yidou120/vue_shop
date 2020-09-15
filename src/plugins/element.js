import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Aside,
  Main,
  Header,
  Menu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Switch,
  Table,
  TableColumn,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  Upload
} from 'element-ui'

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Switch)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Upload)
