import { StyleSheet } from "react-native";
import { StyleSheet as StyleSheetz } from "react-native/types";


const themeStyle = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  }
});