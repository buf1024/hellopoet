import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  View,
  Text,
  StyleSheet,
  Linking,
  StatusBar,
  ScrollView,
  Image
} from 'react-native'
import HeaderBarView from '../components/HeaderBarView'
import {WinWidth, WinPadding} from '../constants/appConsts'
import * as appAct from '../store/actions/app'
import {myTheme} from '../constants/appThemes'
import config from '../config/appConfig'

class AboutPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showTech: false
    }
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    const theme = myTheme(this.props.settings.theme, this.props.settings.nightMode)

    return (
      <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        <StatusBar hidden/>
        <HeaderBarView navigation={this.props.navigation} />
        <View style={{width: WinWidth, justifyContent: 'center', alignItems: 'center', margin: 10}}>
          <Image source={require('../assets/ic_launcher.png')} />
        </View>

        <View style={[styles.textContainer, {backgroundColor: theme.backgroundColor}]}>
          <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{
            color: theme.color,
            fontSize: 12,
            lineHeight: 22}}>
            程序名称:{' '}<Text style={[styles.linkText, {color: theme.color}]} onPress={() => Linking.openURL('https://github.com/buf1024/hellopoet')}>唐诗宋词</Text>{'\n'}
            程序版本:{' '}<Text style={[styles.linkText, {color: theme.color}]} onPress={() => this.setState({showTech: !this.state.showTech})}>{config.version}</Text>{'\n'}
            开发者{'  '}:{' '}<Text style={[styles.linkText, {color: theme.color}]} onPress={() => Linking.openURL('http://luoguochun.cn')}>buf1024</Text>
            {'\n\n'}
            诗词数据来源(源数据已经简单处理):
            <Text style={[styles.linkText, {color: theme.color}]} onPress={() => Linking.openURL('https://github.com/chinese-poetry/chinese-poetry')}>chinese-poetry</Text>
            {'\n'}数据库中包括（可能存在部分重复）了，9857位两宋时期诗词人，3707位唐朝诗人，275284首两宋时朝诗词，
            57591首唐诗，以及诗经（305首）全文。
            {'\n\n'}
            功能简介:{'\n'}
            主要功能为诗词的检索收藏。包括诗词主页面，搜索页面，收藏页面已经侧滑菜单，页面支持简单的单手势处理，
            左右上下滑动，单击双击长按等奖调出相应的功能。
            {'\n\n'}
            Enjoy it ~
            {'\n\n'}
            {
              this.state.showTech ? <Text style={{color: theme.color}}>
                非前端开发者，后台开发人员。只是觉得，学了react native 不用一下就生疏了。{'\n'}
                react native坑非常之多，对于后台人员来说，如此之多坑还是稍微感到诧异。好在网上都可以google到对应的解决方案。{'\n'}
                可以期待react native变得稳定少坑~~{'\n\n'}
                开发中使用到的依赖:
                {'\n'}
                "dependencies": {'{\n'}
                {'    '}"lodash": "^4.17.10",{'\n'}
                {'    '}"path": "^0.12.7",{'\n'}
                {'    '}"prop-types": "^15.6.2",{'\n'}
                {'    '}"react": "16.3.1",{'\n'}
                {'    '}"react-native": "0.55.3",{'\n'}
                {'    '}"react-native-fs": "^2.10.14",{'\n'}
                {'    '}"react-native-orientation": "^3.1.3",{'\n'}
                {'    '}"react-native-progress": "^3.5.0",{'\n'}
                {'    '}"react-native-root-toast": "^3.0.1",{'\n'}
                {'    '}"react-native-splash-screen": "3.0.6",{'\n'}
                {'    '}"react-native-vector-icons": "^5.0.0",{'\n'}
                {'    '}"react-navigation": "2.9.1",{'\n'}
                {'    '}"react-redux": "^5.0.7",{'\n'}
                {'    '}"realm": "^2.14.0",{'\n'}
                {'    '}"redux": "^4.0.0"{'\n'}
                {'},\n'}
                "devDependencies": {'{\n'}
                {'    '}"babel-jest": "23.4.0",{'\n'}
                {'    '}"babel-preset-react-native": "4.0.0",{'\n'}
                {'    '}"jest": "23.4.1",{'\n'}
                {'    '}"react-test-renderer": "16.3.1",{'\n'}
                {'    '}"redux-logger": "^3.0.6"{'\n'}
                {'}\n'}
                {'\n'}</Text> : <Text />
            }

          </Text>
          </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: WinWidth
    //  backgroundColor: 'white',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    padding: WinPadding
  },
  linkText: {
    textDecorationLine: 'underline'
  }
})

const mapStateToProps = (state) => {
  return {
    settings: state.app.settings
  }
}

export default connect(mapStateToProps, {
  updateSettings: appAct.updateSettings
})(AboutPage)


