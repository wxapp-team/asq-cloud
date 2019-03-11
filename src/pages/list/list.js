import Taro, { Component } from '@tarojs/taro'
import { View, Radio } from '@tarojs/components'
import { AtButton, AtForm, AtRadio, AtToast, AtCard } from 'taro-ui'
import topImg from '../../assets/images/list-1.png'
import './list.less'

export default class List extends Component {
  config = {
    navigationBarTitleText: '用户调查问卷'
  }

  state = {
    datalist: [
      { title: '您知道186信通客服热线吗?', number: 0, value: null },
      { title: '您知道机关服务班吗?', number: 1, value: null },
      { title: '您是否拨打过186信通客服热线?', number: 2, value: null },
      {
        title: '您对186信通客服人员工作态度和服务质量是否满意?',
        number: 3,
        value: null
      },
      {
        title: '您对各业务系统管理员工作态度和服务质量是否满意?',
        number: 4,
        value: null
      },
      {
        title: '您对机关服务班工作态度和服务质量是否满意?',
        number: 5,
        value: null
      },
      {
        title: '您是否需要门户、新协同办公等常用系统操作指导手册?',
        number: 6,
        value: null
      },
      { title: '您是否愿意接受186信通客服电话回访?', number: 7, value: null },
      {
        title: '您认为186信通客服热线语音菜单分类是否便捷?',
        number: 8,
        value: null
      },
      {
        title: '您每次遇到桌面终端问题时，机关服务班是否能及时到达现场?',
        number: 9,
        value: null
      }
    ],
    showError: false
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  onSubmit = e => {
    const { datalist } = this.state
    if (!datalist.every(item => !!item.value)) {
      wx.showToast({
        title: '请填写必要信息！',
        icon: 'none',
        duration: 2000
      })
      this.setState({
        showError: true
      })
      return
    } else {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      this.onSaveExam(datalist)
      this.setState({
        showError: false
      })
    }
  }

  onSaveExam = datalist => {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      const { openid, name, phone, dept } = userInfo
      // const db = wx.cloud.database()
      // this.examsDB = db.collection('exams')

      // datalist.forEach(item => {
      //   const data = { ...item, openid, nickName, phone, dept }
      //   this.examsDB.add({
      //     data
      //   })
      // })

      wx.cloud.callFunction({
        name: 'insert',
        data: {
          datalist: datalist.map(item => ({
            ...item,
            openid,
            name,
            phone,
            dept
          }))
        },
        success: res => {
          wx.hideLoading()
          wx.showToast({
            title: '谢谢',
            duration: 2000,
            success: () => {
              Taro.redirectTo({
                url: '/pages/success/success'
              })
            }
          })
        },
        fail: err => {
          wx.hideLoading()
        }
      })
    }
  }

  onCheckedChange = (item, value) => {
    item.value = value
    this.setState({})
  }

  render() {
    const { datalist, showError } = this.state
    return (
      <View className="list">
        <View className="top-img">
          <Image src={topImg} mode="widthFix" style="width:660rpx" />
          <View>3.15 信通客服优质服务联合行动</View>
        </View>
        <AtForm
          className={showError ? 'list-form error' : 'list-form'}
          onSubmit={this.onSubmit}
        >
          <View className="panel">
            {datalist.map(item => (
              <AtCard
                className={item.value ? '' : 'not'}
                key={item.number}
                title={`第${item.number + 1}题：${item.title}`}
              >
                <RadioGroup
                  onChange={value => this.onCheckedChange(item, value)}
                >
                  <Label className="radio-list__label">
                    <Radio color="#2571fe" value="1">
                      {' 是'}
                    </Radio>
                  </Label>
                  <Label className="radio-list__label">
                    <Radio color="#2571fe" value="0">
                      {' 否'}
                    </Radio>
                  </Label>
                </RadioGroup>
              </AtCard>
            ))}
          </View>
          <AtButton formType="submit" type="primary" className="submitBtn">
            提交
          </AtButton>
        </AtForm>
      </View>
    )
  }
}
