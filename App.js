/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import ModalExample from './example/ModalExample';
import ActionSheetExample from './example/ActionSheetExample';


const Drawer = createDrawerNavigator();

const App: () => React$Node = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="ModalExample">
        <Drawer.Screen name="ModalExample" component={ModalExample} />
        <Drawer.Screen name="ActionSheetExample" component={ActionSheetExample} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({

});

export default App;
