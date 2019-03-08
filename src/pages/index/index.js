import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtForm, AtInput, AtToast } from 'taro-ui'
import './index.less'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '用户调查问卷'
  }

  state = {
    userInfo: {},
    formInfo: {},
    openid: null
  }

  componentWillMount() {}

  componentDidMount() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[login] user openid: ', res.result.openid)
        const openid = res.result.openid
        wx.getUserInfo({
          success: res => {
            const userInfo = res.userInfo
            const nickName = userInfo.nickName
            const avatarUrl = userInfo.avatarUrl
            const gender = userInfo.gender // 性别 0：未知、1：男、2：女
            const province = userInfo.province
            const city = userInfo.city
            const country = userInfo.country
            this.setState({
              userInfo,
              openid
            })
          }
        })
      },
      fail: err => {
        console.error('[login] 调用失败', err)
      }
    })
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  onSubmit = e => {
    const { formInfo, openid, userInfo } = this.state
    if (!formInfo.name || !formInfo.dept || !formInfo.phone) {
      wx.showToast({
        title: '请填写必要信息！',
        icon: 'none',
        duration: 2000
      })
      return
    }

    wx.showLoading({
      mask: true,
      title: '加载中'
    })

    wx.setStorage({
      key: 'userInfo',
      data: { ...userInfo, ...formInfo, openid }
    })

    const db = wx.cloud.database()
    this.userDB = db.collection('user')
    this.checkComplete(openid)
  }

  checkComplete = openid => {
    this.userDB
      .where({
        openid
      })
      .get({
        success: res => {
          console.log(res)
          const { data, errMsg } = res
          if (!data.length) {
            this.saveUserInfo()
          } else {
            wx.hideLoading()
            Taro.redirectTo({
              url: '/pages/list/list'
            })
            // wx.showToast({
            //   title: '您已投过票了！',
            //   icon: 'none',
            //   duration: 2000
            // })
          }
        }
      })
  }

  saveUserInfo = () => {
    const { userInfo, openid, formInfo } = this.state
    this.userDB.add({
      data: { ...userInfo, ...formInfo, openid },
      success(res) {
        wx.hideLoading()
        Taro.redirectTo({
          url: '/pages/list/list'
        })
      }
    })
  }

  handleChange = (key, value) => {
    const { formInfo } = this.state
    formInfo[key] = value

    this.setState({
      formInfo
    })
  }

  render() {
    const { userInfo, formInfo } = this.state
    return (
      <View className="index">
        <View className="title">
          国网黑龙江电力2019年3.15信通客服优质服务联合行动
        </View>
        <View>用户调查问卷</View>
        {/* <Image className="avatar" mode="aspectFit" src={userInfo.avatarUrl} /> */}
        {/* <View>欢迎您{userInfo.nickName}</View> */}
        <View className="info">
          <AtForm onSubmit={this.onSubmit}>
            <AtInput
              name="name"
              title="姓名"
              type="text"
              placeholder="请输入姓名"
              value={formInfo.name}
              onChange={v => this.handleChange('name', v)}
            />
            <AtInput
              name="dept"
              title="部门"
              type="text"
              placeholder="请输入部门"
              value={formInfo.dept}
              onChange={v => this.handleChange('dept', v)}
            />
            <AtInput
              name="phone"
              title="手机号"
              type="number"
              placeholder="请输入手机号"
              value={formInfo.phone}
              onChange={v => this.handleChange('phone', v)}
            />
            <AtButton formType="submit" type="primary" className="submitBtn">
              参与调查
            </AtButton>
          </AtForm>
        </View>
      </View>
    )
  }
}
