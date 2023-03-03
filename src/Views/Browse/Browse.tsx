import { View } from "react-native";
import { Button } from "react-native-paper";

function Browse() {
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Button
          icon="camera"
          mode="outlined"
          onPress={() => console.log('Pressed')}>
          Press me
        </Button>
      </View>
      <View style={{flex: 9}}>
        <Button
          icon="camera"
          mode="outlined"
          onPress={() => console.log('Pressed')}>
          Press me
        </Button>
      </View>
    </View>
  );
}

export default Browse;
