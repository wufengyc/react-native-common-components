# react-native-wf-common-components
&emsp;ReactNative通用组件：在ReactNative项目开发过程中，经常会碰到一些非常通用的组件，所以这里封装出来使用。

---
### 安装
`npm i react-native-wf-common-components --save`

该组件有部分是用typescript写的，你可以自行安装typescript


---
### 使用

```javascript
import { AnimatedModal } from 'react-native-wf-common-components';

<AnimatedModal
  visible={visible5}
  transition="top-in"
  position="top"
  offset={{ background: { top: 100 } }}
  onHide={() => this.onHide(5)}
>
	<View style={{ width: width, height: 200, backgroundColor: '#FFFFFF' }} />
</AnimatedModal>
```


----
### AnimatedModal
更详细的文档[点击这里](https://github.com/wufengyc/react-native-common-components/tree/master/libs/modal)

其实就是一个Modal，但是对react-native提供的Modal进行了封装。
加入了动画效果、内容位置等功能，使展示效果更完美。

<img src="https://github.com/wufengyc/react-native-common-components/blob/master/libs/imgs/animated_modal.gif" style="zoom:75%;" />

<img src="https://github.com/wufengyc/react-native-common-components/blob/master/example/imgs/2.jpg" height=400 />