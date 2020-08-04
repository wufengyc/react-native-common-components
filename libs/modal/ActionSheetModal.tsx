import React, { Component } from "react";
import { 
    StyleSheet,
    View,
    ViewStyle,
    Dimensions,
    Text,
    PixelRatio,
    TouchableOpacity,
} from "react-native";
import AnimatedModal, { POSITION } from "./AnimatedModal";

type action = {
    key: string | number,
    value: string,
    o?: any,
}
interface Props {
    actions: action[],
    division?: boolean,
    cancelText?: string,
    onSelected?: (action: action) => void,
    style?: ViewStyle,
    sheetAreaStyle?: ViewStyle,
    sheetStyle?: ViewStyle,
    cancelSheetStyle?: ViewStyle,
    bottomFixView?: JSX.Element,
}
interface State {
    visible: boolean,
    actions: action[],
}

const { width } = Dimensions.get('window');

/**
 * 一个列表选择的弹出框
 */
export default class ActionSheetModal extends Component<Props, State> {
    static defaultProps = {
        cancelText: '取消',
        division: true,
    }
    
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            actions: props.actions || [],
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.actions) != JSON.stringify(nextProps.actions)) {
            this.setState({
                actions: nextProps.actions,
            });
        }
    }

    show(arr?: action[]) {
        const sts: any = {};
        if (arr != undefined) {
            sts.actions = arr;
        }

        this.setState({
            visible: true,
            ...sts,
        });
    }
    
    hide() {
        this.setState({
            visible: false,
        });
    }

    /**
     * sheet被点击
     * 
     * @param action 被点击的sheet的信息
     */
    onSheetPress(action) {
        if (this.props.onSelected) {
            this.props.onSelected(action);
        }
        this.hide();
    }

    renderActions() {
        const { actions } = this.state;
        if (!actions || actions.length == 0) {
            return null;
        }
        const { sheetStyle, sheetAreaStyle, division } = this.props;

        return (
            <View style={[styles.sheetArea, sheetAreaStyle]}>
                {
                    actions.map((action, index) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={0.9}
                                key={`action_sheet_${action.key}${index}`}
                                style={[styles.sheet, division ? styles.defaultDivision : null , sheetStyle]}
                                onPress={() => this.onSheetPress(action)}>
                                <Text style={styles.sheetText}>{action.value}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        );
    }

    render() {
        const { cancelText } = this.props;
        return (
            <AnimatedModal
                visible={this.state.visible}
                position={POSITION.BOTTOM}
                onHide={() => this.hide()}>
                <View style={[styles.container, this.props.style]}>
                    {this.renderActions()}
                    {
                        cancelText ?
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={[styles.cancelSheetStyle, this.props.cancelSheetStyle]}
                                onPress={() => this.hide()}>
                                <Text style={styles.sheetText}>{cancelText}</Text>
                            </TouchableOpacity>
                            : null
                    }
                    {this.props.bottomFixView}
                </View>
            </AnimatedModal>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        width: width,
        overflow: 'hidden',
    },
    sheetArea: {
        marginHorizontal: 15,
        borderRadius: 5,
        overflow: 'hidden',
    },
    sheet: {
        height: 56,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sheetText: {
        fontSize: 17,
        lineHeight: 24,
        color: '#333333',
    },
    cancelSheetStyle: {
        height: 56,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 15,
        marginVertical: 10,
        borderRadius: 5,
    },
    defaultDivision: {
        borderBottomColor: '#EEEEEE',
        borderBottomWidth: 1 / PixelRatio.get(),
    },
});
