import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtForm, AtRadio, AtToast, AtCard } from 'taro-ui'
import './success.less'

export default class Success extends Component {
  config = {
    navigationBarTitleText: '用户调查问卷'
  }

  state = {
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  onShareAppMessage() {
    return {
      title: '用户调查问卷',
      path: '/page/index/index',
      imageUrl: '/assets/images/avatar.jpg'
    }
  }

  render() {
    const { datalist, showError } = this.state
    return (
      <View className="success">
        <View>
          非常感谢您参与本次调查！我们将继续努力提升服务质量，更好地为您服务！
        </View>

        <View className='btn-item'>
          <AtButton openType='share' type='primary'>邀请好友</AtButton>
        </View>
      </View>
    )
  }
}
