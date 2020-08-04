/**
 * Sample React Native App
 * https://github.com/wufengyc/react-native-common-components
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { ActionSheet } from 'react-native-wf-common-components';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

export default class ActionSheetExample extends Component {
    actionSheet1;
    actionSheet2;

    constructor(props) {
      super(props);
      this.state = {
        text: '请选择',
      }
    }

    onPress(index) {
        if (this[`actionSheet${index}`]) {
          this[`actionSheet${index}`].show();
        }
    }

    onSelected = (o)=> {
        this.setState({
            text: o.value,
        });
    }

    render() {
        const { text } = this.state;
        return (
            <ScrollView style={styles.scrollView}>
                <Text style={{ alignSelf: 'center', marginVertical: 12 }}>{text}</Text>
                <TouchableOpacity
                  onPress={() => this.onPress(1)}
                  style={styles.button}>
                    <Text>默认效果</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.onPress(2)}
                  style={styles.button}>
                    <Text>自定义效果</Text>
                </TouchableOpacity>

                {/* 默认效果 */}
                <ActionSheet
                  ref={(ref) => { this.actionSheet1 = ref; }}
                  actions={[
                      {key: 'follow', value: '关注'},
                      {key: 'complaint', value: '投诉'},
                  ]}
                  onSelected={this.onSelected}
                >
                </ActionSheet>
                {/* 自定义效果 */}
                <ActionSheet
                  ref={(ref) => { this.actionSheet2 = ref; }}
                  actions={[
                      {key: 'follow', value: '关注'},
                      {key: 'complaint', value: '投诉'},
                  ]}
                  onSelected={this.onSelected}
                  division={false}
                  style={styles.actionSheetStyle}
                  sheetAreaStyle={styles.sheetArea}
                  cancelSheetStyle={styles.cancelSheetStyle}
                >
                </ActionSheet>
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
  actionSheetStyle: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: '#F6F6F6',
  },
  sheetArea: {
    marginHorizontal: 0,
    borderRadius: 0,
    overflow: 'hidden',
  },
  cancelSheetStyle: {
    marginHorizontal: 0,
    marginTop: 10,
    marginBottom: 0,
    borderRadius: 0,
  },
});
