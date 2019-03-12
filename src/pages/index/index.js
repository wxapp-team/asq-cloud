import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtForm, AtInput, AtToast } from 'taro-ui'
import index1Png from '../../assets/images/index-1.png'
import './index.less'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '用户调查问卷'
  }

  state = {
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
        console.log(res)
        const openid = res.result.openid
        this.setState({
          openid
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
    const { formInfo, openid } = this.state
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
      data: { ...formInfo, openid }
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
            // Taro.redirectTo({
            //   url: '/pages/list/list'
            // })
            wx.showToast({
              title: '您已投过票了！',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
  }

  saveUserInfo = () => {
    const { openid, formInfo } = this.state
    this.userDB.add({
      data: { ...formInfo, openid },
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
    const { formInfo } = this.state
    return (
      <View className="index">
        <View className="title">
          国网黑龙江电力2019年3.15信通客服优质服务联合行动
        </View>
        <View className="intro">用户调查问卷</View>
        <View className="info">
          <AtForm>
            <AtInput
              name="name"
              title="姓　　名"
              type="text"
              placeholder="请输入姓名"
              value={formInfo.name}
              onChange={v => this.handleChange('name', v)}
            />
            <AtInput
              name="dept"
              title="部　　门"
              type="text"
              placeholder="请输入部门"
              value={formInfo.dept}
              onChange={v => this.handleChange('dept', v)}
            />
            <AtInput
              name="cs"
              title="处　　室"
              type="text"
              placeholder="请输入处室"
              value={formInfo.cs}
              onChange={v => this.handleChange('cs', v)}
            />
            <AtInput
              name="phone"
              title="电话号码"
              type="number"
              placeholder="请输入电话号码"
              value={formInfo.phone}
              onChange={v => this.handleChange('phone', v)}
            />
          </AtForm>
        </View>
        <View className="introImg">
          <Image src={index1Png} mode="widthFix" style="width:25vh"/>
        </View>
        <AtButton formType="submit" type="primary" className="submitBtn" onClick={this.onSubmit}>
          参与调查
        </AtButton>
      </View>
    )
  }
}
