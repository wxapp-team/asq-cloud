import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtForm, AtRadio, AtToast, AtCard } from 'taro-ui'
import bgImg from '../../assets/images/success-1.png'
import code from '../../assets/images/code.png'
import './success.less'

export default class Success extends Component {
  config = {
    navigationBarTitleText: '用户调查问卷'
  }

  state = {}

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  onShareAppMessage() {
    return {
      title: '用户调查问卷',
      path: '/pages/index/index',
      imageUrl: '/assets/images/avatar.png'
    }
  }

  render() {
    const { datalist, showError } = this.state
    return (
      <View className="success">
        <View className="title">
          非常感谢您参与本次调查！我们将继续努力提升服务质量，更好地为您服务！
        </View>
        <View className="btn-item">
          <AtButton openType="share" type="primary">
            邀请好友
          </AtButton>
        </View>
        <View className="scancode">
          <Image src={code} mode="widthFix" style="width:15vh" />
        </View>
        <Image
          className="bgImg"
          src={bgImg}
          mode="widthFix"
          style="width:750rpx"
        />
        <View className="mask" />
      </View>
    )
  }
}
