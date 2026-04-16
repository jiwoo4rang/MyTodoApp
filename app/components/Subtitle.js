import { StyleSheet, Text, View } from 'react-native';

export default function Subtitle({ title, caption }) {
  return (
    <View>
      <Text style={styles.subtitleText}>{title}</Text>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  subtitleText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#6d4254',
    fontFamily: 'GowunDodum_400Regular',
  },
  caption: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
    color: '#95707f',
    fontFamily: 'GowunDodum_400Regular',
  },
});
