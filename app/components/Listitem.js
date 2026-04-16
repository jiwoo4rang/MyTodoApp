import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ListItem({ name, completed, onToggle, onDelete }) {
  return (
    <View style={[styles.listItemBox, completed && styles.completedBox]}>
      <View style={styles.leftSide}>
        <Pressable
          onPress={onToggle}
          hitSlop={8}
          style={[styles.checkButton, completed && styles.checkButtonDone]}
        >
          <MaterialIcons
            name={completed ? 'favorite' : 'favorite-border'}
            size={20}
            color={completed ? '#ffffff' : '#ff6fa5'}
          />
        </Pressable>
        <Text style={[styles.item, completed && styles.completedItem]}>{name}</Text>
      </View>
      <Pressable onPress={onDelete} hitSlop={8} style={styles.deleteButton}>
        <MaterialIcons name="close" size={18} color="#ba7897" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  listItemBox: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 16,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ffd7e7',
    shadowColor: '#d37aa6',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  completedBox: {
    backgroundColor: '#fff8fb',
  },
  leftSide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    paddingRight: 12,
  },
  item: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: '#6f4d5d',
    fontFamily: 'GowunDodum_400Regular',
  },
  completedItem: {
    color: '#c9a2b4',
    textDecorationLine: 'line-through',
  },
  checkButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff0f6',
    borderWidth: 1,
    borderColor: '#ffc4dd',
  },
  checkButtonDone: {
    backgroundColor: '#ff8fbc',
    borderColor: '#ff8fbc',
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff2f7',
  },
});
