import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ScrollView,
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import SearchBarView from '../components/SearchBarView'
import SearchTipView from '../components/SearchTipView'
import SearchCardView from '../components/SearchCardView'
import showToast from '../utils/showToast'
import * as appAct from '../store/actions/app'
import {WinPadding, WinWidth} from '../constants/appConsts'
import * as db from '../store/db'
import {myTheme} from '../constants/appThemes'


class SearchPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      searchType: null,
      searchTypeStr: '',
      searchText: '',
      poets: [],
      showMoreInit: false,
      showMoreLen: 0,
      recentSearch: [],
      progress: 0,
    }

  }

  componentWillReceiveProps(nextProps) {
  }

  componentDidMount() {
    this.setState({recentSearch: db.getRecentSearch()})
  }


  onReturn() {
    if (this.state.searchType || this.state.searchText) {
      this.setState({
        searchType: null,
        searchTypeStr: '',
        searchText: '',
        poets: [],
        showMoreInit: false,
        showMoreLen: 0,
        recentSearch: db.getRecentSearch(),
        progress: 0,
      })

    } else {
      this.props.navigation.goBack()
    }
  }

  onMore(text, type) {
    if (!this.state.showMoreInit) {
      this.setState({showMoreInit: true, showMoreLen: 0, searchType: type,poets: []})
    }
    this.searchPoet(text, type, true)
  }
  setRecentSearch(text) {
    if (text.length > 0) {
      let index = this.state.recentSearch.findIndex(it => {
        return it.startsWith(text) || text.startsWith(it)
      })
      if (index === -1) {
        this.state.recentSearch.push(text)
        if (this.state.recentSearch.length > 30) {
          this.state.recentSearch.splice(0, 1)
        }
      } else {
        if (text.startsWith(this.state.recentSearch[index])) {
          this.state.recentSearch[index] = text
        } else {
          return
        }
      }
      this.setState({recentSearch: this.state.recentSearch})
      db.setRecentSearch(this.state.recentSearch)
    }
  }
  searchPoet(text, type, isMore) {
    this.setRecentSearch(text)

    let poets = []
    const moreStep = 15
    if (type !== null) {
      let start = 0
      let end = isMore ? this.state.showMoreLen + moreStep: 3
      this.setState({progress: 0.1})
      switch (type) {
        case 'song-title':
          poets = db.getPoetByTitle(text, 'PoetSong', start, end)
          break
        case 'song-cont':
          poets = db.getPoetByContent(text, 'PoetSong', start, end)
          break
        case 'song-author':
          poets = db.getPoetByAuthor(text, 'PoetSong', start, end)
          break
        case 'tang-title':
          poets = db.getPoetByTitle(text, 'PoetTang', start, end)
          break
        case 'tang-cont':
          poets = db.getPoetByContent(text, 'PoetTang', start, end)
          break
        case 'tang-author':
          poets = db.getPoetByAuthor(text, 'PoetTang', start, end)
          break
        case 'shijing-title':
          poets = db.getPoetByTitle(text, 'Shijing', start, end)
          break
        case 'shijing-cont':
          poets = db.getPoetByContent(text, 'Shijing', start, end)
          break
      }
      this.setState({progress: 0.8})
      if (poets.length > 0 && poets[0].poet.length > 0) {
        let poet = this.state.poets.find(it => {
          return it.type === poets[0].type
        })
        if (poet && poet.poet.length === poets[0].poet.length) {
          if (isMore) {
            showToast('无更多数据')
          }
        }
        this.setState({poets, showMoreLen: isMore ? this.state.showMoreLen + moreStep : 0})
      }
      this.setState({progress: 1})
    } else {
      this.setState({progress: 0.1})
      let poet = db.getPoetByTitle(text, 'PoetSong', 0, 3)
      poets = poets.concat(poet)
      this.setState({progress: 0.2})
      poet = db.getPoetByContent(text, 'PoetSong', 0, 3)
      poets = poets.concat(poet)
      this.setState({progress: 0.3})
      poet = db.getPoetByAuthor(text, 'PoetSong', 0, 3)
      poets = poets.concat(poet)
      this.setState({progress: 0.4})

      db.getPoetByTitle(text, 'PoetTang', 0, 3)
      poets = poets.concat(poet)
      this.setState({progress: 0.5})
      poet = db.getPoetByContent(text, 'PoetTang', 0, 3)
      poets = poets.concat(poet)
      this.setState({progress: 0.6})
      poet = db.getPoetByAuthor(text, 'PoetTang', 0, 3)
      poets = poets.concat(poet)
      this.setState({progress: 0.7})

      db.getPoetByTitle(text, 'Shijing', 0, 3)
      poets = poets.concat(poet)
      this.setState({progress: 0.8})
      poet = db.getPoetByContent(text, 'Shijing', 0, 3)
      poets = poets.concat(poet)
      this.setState({progress: 0.9})

      this.setState({poets, progress: 1})
    }
  }
  onTextChg(text) {
    this.setState({
      searchText: text,
      poets: [],
      showMoreInit: false,
      showMoreLen: 0,
      progress: 0
    })
    if (text.length > 0) {
      this.searchPoet(text, this.state.searchType, this.state.showMoreInit)
    }
  }
  onTip(text) {
    this.setState({searchText: text})
    this.searchPoet(text, null, false)
  }
  clearHistory() {
    this.setState({recentSearch: []})
    db.setRecentSearch([])
  }

  onSearchType(searchType, searchTypeStr) {
    this.setState({searchType, searchTypeStr, progress: 0})
  }
  onPoet(poetId) {
    this.props.updateContext({poetId})
    this.props.navigation.goBack()
  }
  getSearchTypeView() {
    const theme = myTheme(this.props.app.settings.theme, this.props.app.settings.nightMode)

    return (<View style={styles.searchTypeContainer}>
      <Text style={[styles.searchTypeTitle, {color: theme.color}]}>指定搜索内容</Text>
      <View style={styles.searchTypeRow}>
        <TouchableOpacity activeOpacity={0.5} onPress={() => this.onSearchType('song-title', '宋诗/词(按标题)')}>
          <Text style={{color: theme.color}}>宋诗/词(按标题)</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={() => this.onSearchType('tang-title', '唐诗(按标题)')}>
          <Text style={{color: theme.color}}>唐诗(按标题)</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={() => this.onSearchType('shijing-title', '诗经(按标题)')}>
          <Text style={{color: theme.color}}>诗经(按标题)</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchTypeRow}>
        <TouchableOpacity activeOpacity={0.5} onPress={() => this.onSearchType('song-cont', '宋诗/词(按内容)')}>
          <Text style={{color: theme.color}}>宋诗/词(按内容)</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={() => this.onSearchType('tang-cont', '唐诗(按内容)')}>
          <Text style={{color: theme.color}}>唐诗(按内容)</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={() => this.onSearchType('shijing-cont', '唐诗(按内容)')}>
          <Text style={{color: theme.color}}>诗经(按内容)</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchTypeRow}>
        <TouchableOpacity activeOpacity={0.5} onPress={() => this.onSearchType('song-author', '宋诗/词(按作者)')}>
          <Text style={{color: theme.color}}>宋诗/词(按作者)</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={() => this.onSearchType('tang-author', '唐诗(按作者)')}>
          <Text style={{color: theme.color}}>唐诗(按作者)</Text>
        </TouchableOpacity>
        <Text style={styles.emptySearchType} />
      </View>
    </View>)
  }
  getSearchHistoryView() {
    const theme = myTheme(this.props.app.settings.theme, this.props.app.settings.nightMode)

    return (<View  style={styles.historyContainer}>
      <Text style={[styles.textCenter, {color: theme.color}]}>最近搜索历史</Text>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.historyScroll}>
        {
          this.state.recentSearch.map((it, index) => {
            return <SearchTipView key={index} text={it} onTipPress={(text) => this.onTip(text)}/>
          })
        }
        {
          this.state.recentSearch.length > 0 ?
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.historyBtn}
              onPress={() => this.clearHistory()}>
              <Icon name="trash" color={theme.color} size={18} />
              <Text style={[styles.textCenter, {color: theme.color, marginLeft: 5}]}>清空历史</Text>
            </TouchableOpacity>
            : <View />
        }
      </ScrollView>
    </View>)
  }
  render() {
    const theme = myTheme(this.props.app.settings.theme, this.props.app.settings.nightMode)
    return (<View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <StatusBar hidden/>
      <SearchBarView onBack={this.onReturn.bind(this)}
                     placeholder={"搜索" + this.state.searchTypeStr}
                     searchText={this.state.searchText}
                     progress={this.state.progress}
                     onTextChg={this.onTextChg.bind(this)}/>
      {
        this.state.searchText.length <= 0 && this.state.searchType === null ?
          this.getSearchTypeView() : <View />
      }
      {
        this.state.searchText.length <= 0 && this.state.searchType === null ?
          this.getSearchHistoryView() : <View />
      }
      {
        this.state.poets.length > 0 ?
          <ScrollView style={{marginBottom: 5}} showsVerticalScrollIndicator={false}>
            {
              this.state.poets.map((it, index) => {
                return <SearchCardView key={index}
                                       searchText={this.state.searchText}
                                       poetType={it.type}
                                       onMore={this.onMore.bind(this)}
                                       onPress={this.onPoet.bind(this)}
                                       poetData={it.poet} />

              })
            }
          </ScrollView>
          : <View />
      }

    </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchTypeContainer: {
    marginTop: 20
  },
  searchTypeTitle: {
    width: WinWidth - 2*WinPadding,
    textAlign: 'center'
  },
  searchTypeRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  emptySearchType: {
    width: 80
  },
  historyContainer: {
    width: WinWidth - WinPadding,
    marginTop: 30,
    marginBottom: 5,
    flex: 1,
  },
  textCenter: {
    textAlign: 'center'
  },
  historyScroll: {
    marginTop: 10,
    marginBottom: 10
  },
  historyBtn: {
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'center'
  }
})
const mapStateToProps = (state) => {
  return {
    app: state.app
  }
}
export default connect(mapStateToProps, {
  updateContext: appAct.updateContext
})(SearchPage)
