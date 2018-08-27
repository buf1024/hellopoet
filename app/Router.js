import {
  createStackNavigator,
  createDrawerNavigator
} from 'react-navigation'
import DrawerMenu from './views/DrawerMenu'
import MainPage from './views/MainPage'
import SearchPage from './views/SearchPage'
import BookmarkPage from './views/BookmarkPage'
import AboutPage from './views/AboutPage'

const DrawerRouter = createDrawerNavigator({
  MainPage: {screen: MainPage}
}, {
  initialRouteKey: 'MainPage',
  initialRouteName: 'MainPage',
  contentComponent: DrawerMenu,
  drawerWidth: 120,
})

const Router = createStackNavigator({
  DrawerRouter: {screen: DrawerRouter},
  SearchPage: {screen: SearchPage},
  BookmarkPage: {screen: BookmarkPage},
  AboutPage: {screen: AboutPage}
}, {
  initialRouteKey: 'DrawerRouter',
  initialRouteName: 'DrawerRouter',
  navigationOptions: {
    header: null,
    gesturesEnabled: true
  },
  headerMode: 'screen'
})


export default Router
