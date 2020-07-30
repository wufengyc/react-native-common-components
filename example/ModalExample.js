/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import { AnimatedModal } from '../libs/index';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const { width } = Dimensions.get('window');

export default class ModalExample extends Component {
    constructor(props) {
      super(props);
      this.state = {
        visible1: false,
        visible2: false,
        visible3: false,
        visible4: false,
        visible5: false,
      }
    }

    onPress(index) {
      this.setState({
        [`visible${index}`]: true,
      });
    }

    onHide(index) {
      this.setState({
        [`visible${index}`]: false,
      });
    }
  
    render() {
        const { visible1, visible2, visible3, visible4, visible5 } = this.state;
        return (
            <ScrollView style={styles.scrollView}>
                <TouchableOpacity
                  onPress={() => this.onPress(1)}
                  style={styles.button}>
                    <Text>下进下出，内容位置中间</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.onPress(2)}
                  style={styles.button}>
                    <Text>左进左出，内容位置下方</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.onPress(3)}
                  style={styles.button}>
                    <Text>上进上出，内容位置上方</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.onPress(4)}
                  style={styles.button}>
                    <Text>右进右出，内容位置右边</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.onPress(5)}
                  style={styles.button}>
                    <Text>偏移（相对屏幕向下偏移）</Text>
                </TouchableOpacity>

                {/* 默认，下进下出，内容位置中间 */}
                <AnimatedModal
                  visible={visible1}
                  onHide={() => this.onHide(1)}
                >
                  <View style={{ width: 200, height: 200, backgroundColor: '#FFFFFF' }} />
                </AnimatedModal>
                {/* 左进左出，内容位置下方 */}
                <AnimatedModal
                  visible={visible2}
                  transition="left-in"
                  position="bottom"
                  onHide={() => this.onHide(2)}
                >
                  <View style={{ width: 200, height: 200, backgroundColor: '#FFFFFF' }} />
                </AnimatedModal>
                {/* 上进上出，内容位置上方 */}
                <AnimatedModal
                  visible={visible3}
                  transition="top-in"
                  position="top"
                  onHide={() => this.onHide(3)}
                >
                  <View style={{ width: width, height: 200, backgroundColor: '#FFFFFF' }} />
                </AnimatedModal>
                {/* 右进右出，内容位置右边 */}
                <AnimatedModal
                  visible={visible4}
                  transition="right-in"
                  position="right"
                  onHide={() => this.onHide(4)}
                >
                  <View style={{ width: 100, height: 500, backgroundColor: '#FFFFFF' }} />
                </AnimatedModal>
                {/* 背景偏移 */}
                <AnimatedModal
                  visible={visible5}
                  transition="top-in"
                  position="top"
                  offset={{ background: { top: 100 } }}
                  onHide={() => this.onHide(5)}
                >
                  <View style={{ width: width, height: 200, backgroundColor: '#FFFFFF' }} />
                </AnimatedModal>
            </ScrollView>
        )
    }

};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  button: {
    marginTop: 12,
    marginHorizontal: 15,
    height: 44,
    backgroundColor: '#EDBF8D',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
