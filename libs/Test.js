import React, { Component } from "react";
import { 
    StyleSheet,
    View,
    Text,
} from "react-native";


export default class Test extends Component {
    
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Test</Text>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {

    },
});
