import { StyleSheet, Text, View } from 'react-native';

export default function Header() {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.eyebrow}>MONGGEUL DAY</Text>
      <Text style={styles.title}>{'\ubabd\uae00\ub370\uc774'}</Text>
      <Text style={styles.description}>
        {
          '\ud560 \uc77c\uacfc \ub0a0\uc9dc\ub97c \ubd80\ub4dc\ub7fd\uace0 \uac00\ubccd\uac8c \ubaa8\uc544\ubcf4\ub294 \uc6b0\ub9ac\ub9cc\uc758 \uce98\ub9b0\ub354 \ud22c\ub450\uc571\uc785\ub2c8\ub2e4.'
        }
      </Text>
      <View style={styles.tagRow}>
        <Text style={styles.tag}>{'\ub0a0\uc9dc\ubcc4\ub85c \ubaa8\uc544\ubcf4\uae30'}</Text>
        <Text style={styles.tag}>{'\ucc28\uadfc\ucc28\uadfc \uc644\ub8cc\ud558\uae30'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 32,
    paddingTop: 14,
    alignItems: 'center',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#c25586',
    fontFamily: 'GowunDodum_400Regular',
  },
  title: {
    marginTop: 8,
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '800',
    color: '#6d4254',
    fontFamily: 'GowunDodum_400Regular',
    textAlign: 'center',
  },
  description: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 23,
    color: '#8a6a78',
    fontFamily: 'GowunDodum_400Regular',
    textAlign: 'center',
    maxWidth: 520,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
  },
  tag: {
    backgroundColor: '#fff8cf',
    color: '#8d6f32',
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    fontFamily: 'GowunDodum_400Regular',
  },
});
