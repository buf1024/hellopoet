
import Toast from 'react-native-root-toast'

const showToast = (data, duration)=>{
  if(data) {
    duration = duration ? Toast.durations.SHORT : Toast.durations.LONG
    Toast.show(data,{
      duration,
      position:-50,
      animation: true,
      shadow: true
    })
  }
}

export default showToast