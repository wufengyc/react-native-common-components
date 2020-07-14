
import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Animated,
    Modal,
    Dimensions,
    View,
} from "react-native";

// 过度动画类型：淡入淡出 | 左进左出 | 上进上出 | 右进右出 | 下进下出
export enum TRANSITION_TYPE {
    FADE = 'fade',
    LEFT_IN = 'left-in',
    TOP_IN = 'top-in',
    RIGHT_IN = 'right-in',
    BOTTOM_IN = 'bottom-in',
}
// 内容的位置
export enum POSITION {
    TOP = 'top',
    CENTER = 'center',
    BOTTOM = 'bottom',
    LEFT = 'left',
    RIGHT = 'right',
}
type offset = { // 偏移
    left?: number,
    top?: number,
    right?: number,
    bottom?: number,
}
interface Props {
    contentWidth?: number, // 内容宽度
    contentHeight?: number, // 内容的高度
    canceledOnTouchOutside?: boolean, // 点击空白处是否取消
    onHide?: Function,
    visible?: boolean,
    visibleBackground?: boolean, // 背景是否展示
    transition?: TRANSITION_TYPE,
    position?: POSITION,
    type?: 'modal' | 'view', // 显示类型
    offset?: {
        background?: offset, // 背景偏移
        content?: offset, // TODO: 内容偏移（暂未实现）
    }
}
interface State {
    visible: boolean,
    animBg: Animated.Value, // 背景动画
    animContent: Animated.Value, // 内容动画
    contentWidth: number,
    contentHeight: number, // 内容高度
}

const { width, height } = Dimensions.get('screen');


/**
 * Modal，支持入场动画和内容位置的组合。
 * 
 * Usage:
 * ```
 *   <AnimatedModal
 *       offset={{
 *           background: {top: 44},
 *           content: {left: 44}
 *       }}
 *       type="view"
 *       visible={this.state.visible}
 *       position={POSITION.TOP}
 *       transition={TRANSITION_TYPE.TOP_IN}
 *       onHide={() => this.hide()}>
 *           {children}
 *   </AnimatedModal>
 * ```
 * 
 * @author wufeng
 * @date 2020-04-21
 */
class AnimatedModal extends Component<Props, State> {
    static defaultProps = {
        canceledOnTouchOutside: true,
        transition: TRANSITION_TYPE.BOTTOM_IN,
        position: POSITION.CENTER,
        type: 'modal',
        visibleBackground: true,
    }

    initTimeout;

    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible != undefined ? props.visible : false,
            animBg: new Animated.Value(0), // 0表示隐藏
            animContent: new Animated.Value(0), // 0表示隐藏
            contentWidth: 0,
            contentHeight: 0,
        };
    }

    componentWillReceiveProps(nextProps) {
        // modal状态有变化（显示/隐藏）
        if (nextProps.visible != undefined && this.props.visible != nextProps.visible) {
            if (nextProps.visible) { // 显示
                this.show();
            } else { // 隐藏
                this.hide();
            }
        }
    }

    componentDidMount() {
        // 如果是从屏幕顶部进入，需要刚开始就知道内容高度，这样才能准确的计算从屏幕顶部哪个位置进入（从屏幕顶部再往上 一个内容高度 的位置进入）。
        // 所以先渲染一次
        // P.S 如果是从屏幕底部、左边、右边进入，那直接就可以知道进入的位置，所以哪怕不知道内容尺寸也可以
        if (this.props.transition == TRANSITION_TYPE.TOP_IN) {
            this.setState({ visible: true });
            this.initTimeout = setTimeout(() => {
                this.setState({ visible: this.props.visible != undefined ? this.props.visible : false });
                this.initTimeout && clearTimeout(this.initTimeout);
            }, 200);
        }
    }

    componentWillUnmount() {
        this.initTimeout && clearTimeout(this.initTimeout);
    }

    show() {
        const { animBg, animContent } = this.state;
        // 先设置内容显示出来，然后通过动画将内容从底部进入
        this.setState({
            visible: true,
        }, () => {
            Animated.parallel([
                Animated.timing(animBg, {
                    duration: 250,
                    toValue: 1,
                    useNativeDriver: true,
                }),
                Animated.timing(animContent, {
                    duration: 250,
                    toValue: 1,
                    useNativeDriver: true,
                })
            ]).start()
        });
    }

    /**
     * 隐藏
     * @param to 隐藏到某一个位置（0为全部隐藏，>0 则表示还有"to"的高度被显示 ）
     */
    hide(to: number = 0) {
        // 想要隐藏，但已经隐藏了
        if (to == 0 && this.state.visible == false) {
            return;
        }

        let toValue = 0;
        if (to > 0) { // 不隐藏全部
            const { transition } = this.props;
            const contentSize = this.getContentSize();
            // 动画类型为上下进入，那么已内容高度为基准，计算toValue
            if (transition == TRANSITION_TYPE.BOTTOM_IN || transition == TRANSITION_TYPE.TOP_IN) {
                toValue = to / contentSize.height;
            }
            // 动画类型为左右进入，那么已内容宽度为基准，计算toValue
            else if (transition == TRANSITION_TYPE.LEFT_IN || transition == TRANSITION_TYPE.RIGHT_IN) {
                toValue = to / contentSize.width;
            }
        }

        const { animBg, animContent } = this.state;
        // 通过动画将内容推出底部，然后设置modal不显示
        Animated.parallel([
            Animated.timing(animBg, {
                duration: 250,
                toValue: toValue,
                useNativeDriver: true,
            }),
            Animated.timing(animContent, {
                duration: 250,
                toValue: toValue,
                useNativeDriver: true,
            })
        ]).start(() => {
            if (to == 0) {
                this.setState({ visible: false });
            }
            if (this.props.onHide) {
                this.props.onHide();
            }
        })
    }

    /* 空白区域点击 */
    onOutsidePress = () => {
        this.hide();
    }

    /* 内容布局完成 */
    onContentLayout = (e) => {
        this.setState({
            contentWidth: e.nativeEvent.layout.width,
            contentHeight: e.nativeEvent.layout.height
        });
    }

    /* 渲染最外层容器 */
    renderBox() {
        const boxStyle = this.getBoxStyle();
        return (
            <View style={boxStyle}>
                {this.renderBg()}
                {this.renderContent()}
            </View>
        )
    }

    /* 获取最外层容器/背景的偏移 */
    getBoxStyle() {
        const style: any = {
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
        }
        const { offset } = this.props;
        if (offset && offset.background) {
            Object.keys(offset.background).map(key => {
                style[key] = offset.background[key];
            })
        }
        
        style.height = this.getBoxSize().height;

        return style;
    }

    /* 获取最外层容器/背景的尺寸 */
    getBoxSize() {
        const { offset } = this.props;
        let boxWidth = width;
        let boxHeight = height;
        // 如果有背景偏移，则最外层宽高应该减去偏移量
        if (offset && offset.background) {
            boxWidth -= ((offset.background.left || 0) + (offset.background.right || 0));
            boxHeight -= ((offset.background.top || 0) + (offset.background.bottom || 0));
        }

        return {
            width: boxWidth,
            height: boxHeight,
        }
    }

    renderBg() {
        const { visibleBackground, canceledOnTouchOutside } = this.props;
        if (!visibleBackground) {
            return null;
        }
        const { animBg } = this.state;
        return (
            <Animated.View style={[
                styles.background,
                {
                    opacity: animBg,
                }
            ]} >
                {
                    canceledOnTouchOutside ? 
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.outsideTouch}
                            onPress={this.onOutsidePress}>
                            
                        </TouchableOpacity>
                    : null
                }
            </Animated.View>
        )
    }

    renderContent() {
        const { transition } = this.props;

        if (transition == TRANSITION_TYPE.FADE) {
            return this.renderFadeContent();
        }

        return this.renderTranslateContent(transition);
    }

    /* 获取内容的尺寸 */
    getContentSize() {
        const { contentWidth, contentHeight } = this.props;
        const tempContentWidth = contentWidth ? contentWidth : this.state.contentWidth;
        const tempContentHeight = contentHeight ? contentHeight : this.state.contentHeight;
        let width = 0;
        let height = 0;
        if (tempContentWidth >= 0) {
            width = tempContentWidth;
        }
        if (tempContentHeight >= 0) {
            height = tempContentHeight;
        }

        return {
            width,
            height,
        }
    }

    /* 获取内容的位置（相对于背景而不是屏幕） */
    getContentPosition(): { left: number, top: number } {
        const { position } = this.props;

        const boxSize = this.getBoxSize();
        const contentSize = this.getContentSize();

        let contentTop = 0;
        let contentLeft = 0;
        if (position == POSITION.TOP) {
            // 如果位置是上、中、下，那么左右默认居中
            contentLeft = (boxSize.width - contentSize.width) / 2;
        } else if (position == POSITION.CENTER) {
            contentTop = (boxSize.height - contentSize.height) / 2;
            contentLeft = (boxSize.width - contentSize.width) / 2;
        } else if (position == POSITION.BOTTOM) {
            contentTop = boxSize.height - contentSize.height;
            contentLeft = (boxSize.width - contentSize.width) / 2;
        } else if (position == POSITION.LEFT) {
            // 如果位置是左、右，那么上下默认居中
            contentTop = (boxSize.height - contentSize.height) / 2;
        } else if (position == POSITION.RIGHT) {
            contentTop = (boxSize.height - contentSize.height) / 2;
            contentLeft = boxSize.width - contentSize.width;
        }

        return {
            left: contentLeft,
            top: contentTop,
        }
    }

    /**
     * 渲染淡入淡出类型的内容
     */
    renderFadeContent() {
        const { animContent } = this.state;
        const contentPosition = this.getContentPosition();
        return (
            <Animated.View
                onLayout={this.onContentLayout}
                style={{
                    opacity: animContent,
                    transform: [
                        {translateX: contentPosition.left},
                        {translateY: contentPosition.top},
                    ],
                    position: 'absolute',
                }}>
                {this.renderChildren()}
            </Animated.View>
        )
    }

    /**
     * 渲染外进/外出动画的内容（从屏幕外面进入）
     * @param transition 动画类型
     */
    renderTranslateContent(transition) {
        return (
            <Animated.View
                onLayout={this.onContentLayout}
                style={{
                    transform: this.getTransform(transition),
                    position: 'absolute',
                }}>
                {this.renderChildren()}
            </Animated.View>
        )
    }

    renderChildren() {
        if (this.props.children) {
            return this.props.children;
        }
        return null;
    }

    /**
     * 获取外进/外出动画的transform
     * @param transition 动画类型
     */
    getTransform(transition) {
        const { animContent } = this.state;

        const contentPosition = this.getContentPosition();
        const contentSize = this.getContentSize();

        /* 通过动画类型计算动画 开始/结束 位置 */
        let outputStart = 0;
        let outputEnd = 0;
        if (transition == TRANSITION_TYPE.BOTTOM_IN) {
            outputStart = height;
            outputEnd = contentPosition.top;
        } else if (transition == TRANSITION_TYPE.TOP_IN) {
            outputStart = -contentSize.height;
            outputEnd = contentPosition.top;
        } else if (transition == TRANSITION_TYPE.RIGHT_IN) {
            outputStart = width;
            outputEnd = contentPosition.left;
        } else if (transition == TRANSITION_TYPE.LEFT_IN) {
            outputStart = -contentSize.width;
            outputEnd = contentPosition.left;
        }

        const transform = [];
        const interpolate = animContent.interpolate({
            inputRange: [0, 1],
            outputRange: [outputStart, outputEnd]
        });
        if (transition == TRANSITION_TYPE.BOTTOM_IN || transition == TRANSITION_TYPE.TOP_IN) {
            transform.push({translateY: interpolate});
            transform.push({translateX: contentPosition.left}); // 动画为上下进出，那么左右默认居中
        } else if (transition == TRANSITION_TYPE.LEFT_IN || transition == TRANSITION_TYPE.RIGHT_IN) {
            transform.push({translateX: interpolate});
            transform.push({translateY: contentPosition.top}); // 动画为左右进出，那么上下默认居中
        }

        return transform;
    }

    render() {
        const { type } = this.props;
        if (type === 'view') {
            const { visible } = this.state;
            if (!visible) {
                return null;
            }
            // return (
            //     // 小米8，或者一些刘海屏手机，modal不能完全撑满屏幕，导致底部有空隙，可以看到页面上的内容，所以采用View的方式。
            //     // 但是要注意将这个AnimationModal写在页面最底部，才能覆盖别的控件
            //     <View style={styles.modal} >
            //         {this.renderBg()}
            //         {this.renderContent()}
            //     </View>
            // );
            return this.renderBox();
        }

        return (
            <Modal
                visible={this.state.visible}
                transparent={true}
                onRequestClose={() => this.hide()}>
                {this.renderBox()}
                {/* {this.renderBg()}
                {this.renderContent()} */}
            </Modal>
        );
    }

}

export default AnimatedModal

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    background: {
        position: 'absolute',
        // height: height,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    outsideTouch: {
        flex: 1,
        backgroundColor: 'transparent',
    },
});

