# react-native-wf-common-components
&emsp;ReactNative通用组件：在ReactNative项目开发过程中，经常会碰到一些非常通用的组件，所以这里封装出来使用。

----
### AnimatedModal
其实就是一个Modal，但是对react-native提供的Modal进行了封装。
加入了动画效果、内容位置等功能，使展示效果更完美。
![]("./imgs/animated_modal.gif")

**支持的动画效果**：
- 淡入/淡出
- 左进/左出
- 上进/上出
- 右进/右出
- 下进/下出

**支持的内容位置**：
- 上、下、左、右、中间

**支持的偏移效果**：

- 背景偏移（向上偏移、向下偏移、向左偏移、向右偏移）
- 内容偏移（暂未开发）

----
### 实例
默认效果（动画“下进下出”，内容位置在中间）
```typescript
{/* 默认，下进下出，内容位置中间 */}
<AnimatedModal
  visible={visible1}
  onHide={() => this.onHide(1)}
>
	<View style={{ width: 200, height: 200, backgroundColor: '#FFFFFF' }} />
</AnimatedModal>
```

### ？？？
现在还在持续添加功能，敬请期待

