import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/Feather'
import {myTheme} from '../constants/appThemes'
import {WinWidth, WinPadding} from '../constants/appConsts'


class SearchCardView extends Component {
  constructor(props) {
    super(props)

    this.matchType = ''
  }

  getTypeText() {
    if (this.props.poetType === 'PoetTang') {
      return '唐诗'
    }
    if (this.props.poetType === 'PoetSong') {
      return '宋诗/词'
    }
    if (this.props.poetType === 'Shijing') {
      return '诗经'
    }
  }

  getMatchText(text) {
    if (text === undefined) {
      text = ''
    }
    let index = text.indexOf(this.props.searchText)
    if (index === -1) {
      return [text, '', '']
    }

    let result = [
      text.slice(0, index),
      text.slice(index, index + this.props.searchText.length),
      text.slice(index + this.props.searchText.length)
    ]
    const WIDTH = 22
    if (result[1].length >= WIDTH) {
      let exLen = Math.floor((result[1].length - WIDTH) / 2)
      if (exLen > 0) {
        result[1] = result[1].slice(exLen, exLen + WIDTH)
      }
      result[0] = '... '
      result[2] = ' ...'
    } else {
      let l = result[0].length
      let m = result[1].length
      let r = result[2].length
      if (l + m + r > WIDTH) {
        let midLen = WIDTH - m
        let exR = 0
        let exL = 0
        while (exR + exL < midLen) {
          if (exL < l) {
            exL += 1
          }
          if (exR < r) {
            exR += 1
          }
        }
        if (exL > 0) {
          result[0] = '... ' + result[0].slice(l - exL)
        } else {
          result[0] = '... ' + result[0]
        }
        if (exR > 0) {
          result[2] = result[2].slice(0, exR) + ' ...'
        } else {
          result[2] = result[2] + ' ...'
        }
      }
    }
    return result
  }

  getTitleView(text) {
    let texts = this.getMatchText(text)
    if (texts[1].length > 0) {
      this.matchType = 'title'
    }
    const theme = myTheme(this.props.settings.theme, this.props.settings.nightMode)
    return <Text style={[styles.titleText, {color: theme.color}]}>
      {texts[0]}
      {texts[1].length > 0 ? <Text style={styles.matchText}>{texts[1]}</Text> : <Text/>}
      {texts[2]}
    </Text>
  }

  getAuthorView(text) {
    let texts = this.getMatchText(text)
    if (texts[1].length > 0) {
      this.matchType = 'author'
    }
    const theme = myTheme(this.props.settings.theme, this.props.settings.nightMode)
    return <Text style={[styles.authorText, {color: theme.color}]}>作者：
      {texts[0]}
      {texts[1].length > 0 ? <Text style={styles.matchText}>{texts[1]}</Text> : <Text/>}
      {texts[2]}
    </Text>
  }

  getPoetView(text) {
    let texts = this.getMatchText(text)
    if (texts[1].length > 0) {
      this.matchType = 'cont'
    } else {
      const WIDTH = 22
      let exLen = Math.floor((texts[0].length - WIDTH) / 2)
      if (exLen > 0) {
        texts[0] = '... ' + texts[0].slice(exLen, exLen + WIDTH) + ' ...'
      } else {
        texts[0] = '... ' + texts[0] + ' ...'
      }
    }
    const theme = myTheme(this.props.settings.theme, this.props.settings.nightMode)
    return <Text style={[styles.poetText, {color: theme.color}]}>
      {texts[0]}
      {texts[1].length > 0 ? <Text style={styles.matchText}>{texts[1]}</Text> : <Text/>}
      {texts[2]}
    </Text>
  }

  onMore() {
    let searchType = ''
    if (this.props.poetType === 'PoetTang') {
      searchType = 'tang-' + this.matchType
    } else if (this.props.poetType === 'PoetSong') {
      searchType = 'song-' + this.matchType
    } else if (this.props.poetType === 'PoetSong') {
      searchType = 'shijing-' + this.matchType
    }
    if (searchType.length > 0) {
      this.props.onMore(this.props.searchText, searchType)
    }
  }

  render() {
    const theme = myTheme(this.props.settings.theme, this.props.settings.nightMode)

    return (
      <View  {...this.props} style={[styles.cardContainer, {backgroundColor: theme.backgroundColor}]}>
        <View style={[styles.cardPadding, {backgroundColor: theme.floatBackgroundColor}]}>
          <View style={[styles.cardTitleContainer, {borderColor: theme.borderColor}]}>
            <Text style={[styles.cardTitle, {color: theme.color}]}>{this.getTypeText()}</Text>
          </View>
          {
            this.props.poetData.map(poet => {
              return <TouchableOpacity activeOpacity={0.5} key={poet.id} onPress={() => this.props.onPress(poet.id)}>
                <View style={[styles.cardPoetContainer, {backgroundColor: theme.floatBackgroundColor}]}>
                  {this.getTitleView(poet.title)}
                  {this.getAuthorView(poet.author)}
                  {this.getPoetView(poet.content)}
                </View>
              </TouchableOpacity>
            })
          }

          <TouchableOpacity activeOpacity={0.5}
            style={[styles.moreBtn, {backgroundColor: theme.floatBackgroundColor}]}
            onPress={() => this.onMore()}>
            <Icon style={[styles.moreIcon, {color: theme.color}]} name="search"/>
            <Text style={[styles.moreText, {color: theme.color}]}>更多记录</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    width: WinWidth,
    padding: 0,
    marginBottom: 5,
//    backgroundColor: '#fff'
  },
  cardPadding: {
    paddingLeft: WinPadding,
    paddingRight: WinPadding,
    marginTop: 5
  },
  cardTitleContainer: {
    paddingTop: 5,
    paddingBottom: 5,
    borderStyle: 'solid',
    borderBottomWidth: 1,
 //   borderColor: '#9c9c9c'
  },
  cardTitle: {
    paddingTop: 2,
    paddingBottom: 2
  },
  titleText: {
    fontSize: 15,
    paddingTop: 2,
    paddingBottom: 2
  },
  authorText: {
    paddingTop: 2,
    paddingBottom: 2,
 //   color: '#9c9c9c'
  },
  poetText: {
    paddingTop: 2,
    paddingBottom: 2,
//    color: '#9c9c9c'
  },
  matchText: {
    color: '#e1850d'
  },
  cardPoetContainer: {
    borderStyle: 'solid',
    borderBottomWidth: 1,
//    borderColor: '#9c9c9c'
  },
  moreBtn: {
    flexDirection: 'row',
    marginTop: 3,
    marginBottom: 5,
    paddingTop: 5,
    paddingBottom: 5,
  },
  moreIcon: {
    fontSize: 18
  },
  moreText: {
    fontSize: 15,
    marginLeft: 5,
    textAlignVertical: 'center',
    textAlign: 'center'
  },
})

SearchCardView.propTypes = {
  poetType: PropTypes.string.isRequired,
  searchText: PropTypes.string.isRequired,
  poetData: PropTypes.array.isRequired,
  onMore: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
}
const mapStateToProps = (state) => {
  return {
    settings: state.app.settings
  }
}
export default connect(mapStateToProps)(SearchCardView)