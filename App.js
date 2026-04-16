import AsyncStorage from '@react-native-async-storage/async-storage';
import { GowunDodum_400Regular, useFonts } from '@expo-google-fonts/gowun-dodum';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Header from './app/components/Header';
import Input from './app/components/Input';
import ListItem from './app/components/Listitem';
import Subtitle from './app/components/Subtitle';

const STORAGE_KEY = '@my-todo-app/todos';
const PAGE_MODES = ['home', 'month', 'week', 'day'];
const DAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const PAGE_DETAILS = {
  home: {
    label: '홈',
    caption: '핵심 요약과 오늘의 할 일을 한눈에 보는 화면입니다.',
  },
  month: {
    label: '월간',
    caption: '한 달 단위로 날짜와 일정을 훑어보는 화면입니다.',
  },
  week: {
    label: '주간',
    caption: '일주일을 놓치지 않고 계획하기 좋은 화면입니다.',
  },
  day: {
    label: '일간',
    caption: '하루 단위로 집중해서 할 일을 관리하는 화면입니다.',
  },
};

const today = new Date();

const padNumber = (value) => String(value).padStart(2, '0');

const formatDateKey = (date) =>
  `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`;

const parseDateKey = (dateKey) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const addDays = (date, amount) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
};

const startOfWeek = (date) => {
  const result = new Date(date);
  result.setDate(result.getDate() - result.getDay());
  return result;
};

const endOfWeek = (date) => addDays(startOfWeek(date), 6);

const startOfMonthGrid = (date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return addDays(firstDay, -firstDay.getDay());
};

const isSameDateKey = (left, right) => left === right;
const isTodayKey = (dateKey) => isSameDateKey(dateKey, formatDateKey(today));

const formatMonthTitle = (date) =>
  `${date.getFullYear()}.${padNumber(date.getMonth() + 1)}`;

const formatDateLabel = (dateKey) => {
  const date = parseDateKey(dateKey);
  return `${date.getFullYear()}.${padNumber(date.getMonth() + 1)}.${padNumber(date.getDate())}`;
};

const getWeekRangeLabel = (dateKey) => {
  const baseDate = parseDateKey(dateKey);
  const weekStart = startOfWeek(baseDate);
  const weekEnd = endOfWeek(baseDate);
  return `${formatDateLabel(formatDateKey(weekStart))} - ${formatDateLabel(formatDateKey(weekEnd))}`;
};

const INITIAL_TODOS = [
  {
    id: '1',
    title: '\ud504\ub85c\uc81d\ud2b8 \uad6c\uc870 \ub2e4\uc2dc \uc0b4\ud3b4\ubcf4\uae30',
    completed: false,
    date: formatDateKey(today),
  },
  {
    id: '2',
    title: 'Expo \ud658\uacbd\uc5d0\uc11c \uc2e4\ud589 \ud655\uc778\ud558\uae30',
    completed: true,
    date: formatDateKey(addDays(today, 1)),
  },
  {
    id: '3',
    title: '\uc6d4\uac04 \uce98\ub9b0\ub354 \uad6c\uc131 \uad6c\uc0c1\ud558\uae30',
    completed: false,
    date: formatDateKey(addDays(today, -2)),
  },
  {
    id: '4',
    title: '\uc8fc\uac04 \uacc4\ud68d \uc815\ub9ac\ud558\uae30',
    completed: false,
    date: formatDateKey(addDays(today, 3)),
  },
];

function groupTodosByDate(todos) {
  return todos.reduce((accumulator, todo) => {
    const bucket = accumulator[todo.date] ?? [];
    bucket.push(todo);
    accumulator[todo.date] = bucket;
    return accumulator;
  }, {});
}

function buildMonthDays(selectedDateKey) {
  const selectedDate = parseDateKey(selectedDateKey);
  const cursor = startOfMonthGrid(selectedDate);
  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(cursor, index);
    return {
      key: formatDateKey(date),
      dayNumber: date.getDate(),
      inCurrentMonth: date.getMonth() === selectedDate.getMonth(),
    };
  });
}

export default function App() {
  const [todos, setTodos] = useState(INITIAL_TODOS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedDate, setSelectedDate] = useState(formatDateKey(today));
  const [showSplash, setShowSplash] = useState(true);
  const [fontsLoaded] = useFonts({
    GowunDodum_400Regular,
  });
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const splashScale = useRef(new Animated.Value(0.92)).current;
  const bubbleScaleOne = useRef(new Animated.Value(0.3)).current;
  const bubbleScaleTwo = useRef(new Animated.Value(0.25)).current;
  const bubbleScaleThree = useRef(new Animated.Value(0.2)).current;
  const bubbleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);

        if (storedTodos) {
          setTodos(JSON.parse(storedTodos));
        }
      } catch (error) {
        console.warn('Failed to load todos from storage.', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      } catch (error) {
        console.warn('Failed to save todos to storage.', error);
      }
    };

    saveTodos();
  }, [isLoaded, todos]);

  useEffect(() => {
    if (!isLoaded || !fontsLoaded) {
      return;
    }

    Animated.spring(splashScale, {
      toValue: 1,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();

    const fadeTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(bubbleOpacity, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(bubbleScaleOne, {
          toValue: 2.8,
          duration: 980,
          useNativeDriver: true,
        }),
        Animated.timing(bubbleScaleTwo, {
          toValue: 3.2,
          duration: 1120,
          useNativeDriver: true,
        }),
        Animated.timing(bubbleScaleThree, {
          toValue: 3.6,
          duration: 1240,
          useNativeDriver: true,
        }),
        Animated.timing(splashOpacity, {
          toValue: 0,
          duration: 1080,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setShowSplash(false);
        }
      });
    }, 2100);

    return () => clearTimeout(fadeTimer);
  }, [
    bubbleOpacity,
    bubbleScaleOne,
    bubbleScaleThree,
    bubbleScaleTwo,
    fontsLoaded,
    isLoaded,
    splashOpacity,
    splashScale,
  ]);

  const todosByDate = useMemo(() => groupTodosByDate(todos), [todos]);
  const remainingCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - remainingCount;
  const progressRatio = todos.length === 0 ? 0 : completedCount / todos.length;

  const selectedTodos = (todosByDate[selectedDate] ?? []).sort(
    (left, right) => Number(left.completed) - Number(right.completed)
  );

  const todayTodos = (todosByDate[formatDateKey(today)] ?? []).sort(
    (left, right) => Number(left.completed) - Number(right.completed)
  );

  const monthDays = useMemo(() => buildMonthDays(selectedDate), [selectedDate]);

  const selectedWeekDays = useMemo(() => {
    const weekStart = startOfWeek(parseDateKey(selectedDate));
    return Array.from({ length: 7 }, (_, index) => {
      const date = addDays(weekStart, index);
      return {
        key: formatDateKey(date),
        dayNumber: date.getDate(),
        label: DAY_LABELS[date.getDay()],
      };
    });
  }, [selectedDate]);

  const handleAddTodo = (title) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    setTodos((currentTodos) => [
      {
        id: Date.now().toString(),
        title: trimmedTitle,
        completed: false,
        date: selectedDate,
      },
      ...currentTodos,
    ]);
  };

  const handleToggleTodo = (id) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  const movePeriod = (direction) => {
    const baseDate = parseDateKey(selectedDate);

    if (currentPage === 'month') {
      const movedDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + direction, 1);
      const day = Math.min(
        baseDate.getDate(),
        new Date(movedDate.getFullYear(), movedDate.getMonth() + 1, 0).getDate()
      );
      movedDate.setDate(day);
      setSelectedDate(formatDateKey(movedDate));
      return;
    }

    if (currentPage === 'week') {
      setSelectedDate(formatDateKey(addDays(baseDate, direction * 7)));
      return;
    }

    setSelectedDate(formatDateKey(addDays(baseDate, direction)));
  };

  const renderTodoList = (items, emptyTitle, emptyDescription) => (
    <View style={styles.listShell}>
      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>{emptyTitle}</Text>
          <Text style={styles.emptyDescription}>{emptyDescription}</Text>
        </View>
      ) : (
        items.map((item) => (
          <ListItem
            key={item.id}
            completed={item.completed}
            name={item.title}
            onDelete={() => handleDeleteTodo(item.id)}
            onToggle={() => handleToggleTodo(item.id)}
          />
        ))
      )}
    </View>
  );

  const renderMonthPage = () => (
    <>
      <View style={styles.periodRow}>
        <Pressable style={styles.periodButton} onPress={() => movePeriod(-1)}>
          <Text style={styles.periodButtonText}>{'\u2039'}</Text>
        </Pressable>
        <Text style={styles.periodTitle}>{formatMonthTitle(parseDateKey(selectedDate))}</Text>
        <Pressable style={styles.periodButton} onPress={() => movePeriod(1)}>
          <Text style={styles.periodButtonText}>{'\u203a'}</Text>
        </Pressable>
      </View>

      <View style={styles.calendarCard}>
        <View style={styles.weekdayHeader}>
          {DAY_LABELS.map((label) => (
            <Text key={label} style={styles.weekdayHeaderText}>
              {label}
            </Text>
          ))}
        </View>
        <View style={styles.monthGrid}>
          {monthDays.map((day) => {
            const dayTodos = todosByDate[day.key] ?? [];
            const doneCount = dayTodos.filter((todo) => todo.completed).length;
            const isSelected = isSameDateKey(day.key, selectedDate);

            return (
              <Pressable
                key={day.key}
                style={[
                  styles.monthCell,
                  !day.inCurrentMonth && styles.monthCellMuted,
                  isSelected && styles.monthCellSelected,
                ]}
                onPress={() => setSelectedDate(day.key)}
              >
                <Text
                  style={[
                    styles.monthCellDay,
                    !day.inCurrentMonth && styles.monthCellDayMuted,
                    isTodayKey(day.key) && styles.todayText,
                    isSelected && styles.monthCellDaySelected,
                  ]}
                >
                  {day.dayNumber}
                </Text>
                <View style={styles.monthCellMeta}>
                  {dayTodos.length > 0 ? (
                    <>
                      <View
                        style={[
                          styles.todoDot,
                          doneCount === dayTodos.length && styles.todoDotDone,
                        ]}
                      />
                      <Text style={styles.monthCellCount}>{dayTodos.length}</Text>
                    </>
                  ) : (
                    <Text style={styles.monthCellCountEmpty}> </Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Subtitle
          title={'\uc120\ud0dd\ud55c \ub0a0\uc9dc \uc77c\uc815'}
          caption={`${formatDateLabel(selectedDate)} \uc77c\uc815 ${selectedTodos.length}\uac1c`}
        />
        {renderTodoList(
          selectedTodos,
          '\uc774 \ub0a0\uc9dc\uc5d0\ub294 \uc544\uc9c1 \ud560 \uc77c\uc774 \uc5c6\uc5b4\uc694.',
          '\ub0a0\uc9dc\ub97c \uace0\ub978 \ub2e4\uc74c \ud560 \uc77c\uc744 \ucd94\uac00\ud574\ubcf4\uc138\uc694.'
        )}
      </View>
    </>
  );

  const renderWeekPage = () => (
    <>
      <View style={styles.periodRow}>
        <Pressable style={styles.periodButton} onPress={() => movePeriod(-1)}>
          <Text style={styles.periodButtonText}>{'\u2039'}</Text>
        </Pressable>
        <Text style={styles.periodTitle}>{getWeekRangeLabel(selectedDate)}</Text>
        <Pressable style={styles.periodButton} onPress={() => movePeriod(1)}>
          <Text style={styles.periodButtonText}>{'\u203a'}</Text>
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {selectedWeekDays.map((day) => {
          const dayTodos = todosByDate[day.key] ?? [];
          const isSelected = isSameDateKey(day.key, selectedDate);

          return (
            <Pressable
              key={day.key}
              style={[styles.weekDayCard, isSelected && styles.weekDayCardSelected]}
              onPress={() => setSelectedDate(day.key)}
            >
              <Text style={[styles.weekDayLabel, isSelected && styles.weekDayLabelSelected]}>
                {day.label}
              </Text>
              <Text style={[styles.weekDayNumber, isSelected && styles.weekDayNumberSelected]}>
                {day.dayNumber}
              </Text>
              <Text style={styles.weekDayCount}>{`\ud560 \uc77c ${dayTodos.length}\uac1c`}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.section}>
        <Subtitle
          title={'\uc120\ud0dd\ud55c \ub0a0\uc9dc \uc77c\uc815'}
          caption={`${formatDateLabel(selectedDate)} \uc77c\uc815 ${selectedTodos.length}\uac1c`}
        />
        {renderTodoList(
          selectedTodos,
          '\uc120\ud0dd\ud55c \uc694\uc77c\uc5d0 \uc77c\uc815\uc774 \uc5c6\uc5b4\uc694.',
          '\uc8fc\uac04 \ubdf0\uc5d0\uc11c \ub0a0\uc9dc\ub97c \ub20c\ub7ec \uc77c\uc815\uc744 \ud655\uc778\ud574\ubcf4\uc138\uc694.'
        )}
      </View>
    </>
  );

  const renderDayPage = () => {
    const doneCount = selectedTodos.filter((todo) => todo.completed).length;

    return (
      <>
        <View style={styles.periodRow}>
          <Pressable style={styles.periodButton} onPress={() => movePeriod(-1)}>
            <Text style={styles.periodButtonText}>{'\u2039'}</Text>
          </Pressable>
          <Text style={styles.periodTitle}>{formatDateLabel(selectedDate)}</Text>
          <Pressable style={styles.periodButton} onPress={() => movePeriod(1)}>
            <Text style={styles.periodButtonText}>{'\u203a'}</Text>
          </Pressable>
        </View>

        <View style={styles.dayCard}>
          <Text style={styles.dayCardLabel}>{'\uc120\ud0dd\ud55c \ub0a0\uc9dc'}</Text>
          <Text style={styles.dayCardDate}>{formatDateLabel(selectedDate)}</Text>
          <Text style={styles.dayCardSummary}>
            {`\ucd1d ${selectedTodos.length}\uac1c \uc911 ${doneCount}\uac1c \uc644\ub8cc`}
          </Text>
        </View>

        <View style={styles.section}>
          <Subtitle
            title={'\uc77c\uac04 \ud560 \uc77c \ucd94\uac00'}
            caption={'\uc120\ud0dd\ud55c \ud558\ub8e8\uc5d0 \ub9de\ucdb0 \ud560 \uc77c\uc744 \uc815\ub9ac\ud574\ubcf4\uc138\uc694.'}
          />
          <Input onSubmit={handleAddTodo} helperLabel={formatDateLabel(selectedDate)} />
        </View>

        <View style={styles.section}>
          <Subtitle
            title={'\uc624\ub298\uc758 \uc77c\uc815'}
            caption={`${formatDateLabel(selectedDate)} \uae30\uc900`}
          />
          {renderTodoList(
            selectedTodos,
            '\uc774 \ub0a0\uc9dc\uc5d0\ub294 \uc544\uc9c1 \ud560 \uc77c\uc774 \uc5c6\uc5b4\uc694.',
            '\ud544\uc694\ud55c \uc77c\uc744 \ud558\ub098\uc529 \uc801\uc5b4\ub450\uba74 \uc77c\uac04 \ud398\uc774\uc9c0\uc5d0 \ubaa8\uc5ec\uc694.'
          )}
        </View>
      </>
    );
  };

  const renderHomePage = () => (
    <>
      <View style={styles.summaryCard}>
        <View style={styles.summaryTopRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{remainingCount}</Text>
            <Text style={styles.summaryLabel}>{'\ub0a8\uc740 \ud560 \uc77c'}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{completedCount}</Text>
            <Text style={styles.summaryLabel}>{'\uc644\ub8cc\ub41c \ud56d\ubaa9'}</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressTitle}>{'\uc804\uccb4 \uc9c4\ud589\ub960'}</Text>
            <Text style={styles.progressPercent}>{`${Math.round(progressRatio * 100)}%`}</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressRatio * 100}%` }]} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Subtitle
          title={'\ube60\ub978 \uae30\ub85d'}
          caption={`${formatDateLabel(selectedDate)} \ub0a0\uc9dc\ub85c \ud560 \uc77c\uc744 \ubc14\ub85c \ucd94\uac00\ud560 \uc218 \uc788\uc5b4\uc694.`}
        />
        <Input onSubmit={handleAddTodo} helperLabel={formatDateLabel(selectedDate)} />
      </View>

      <View style={styles.section}>
        <Subtitle
          title={'\uc624\ub298 \ud560 \uc77c'}
          caption={`${formatDateLabel(formatDateKey(today))} \uae30\uc900 ${todayTodos.length}\uac1c`}
        />
        {renderTodoList(
          todayTodos,
          '\uc624\ub298 \ub4f1\ub85d\ub41c \ud560 \uc77c\uc774 \uc5c6\uc5b4\uc694.',
          '\ub2e4\ub978 \ud398\uc774\uc9c0\uc5d0\uc11c \ub0a0\uc9dc\ub97c \uace0\ub974\uac70\ub098 \ube60\ub978 \uae30\ub85d\uc73c\ub85c \ucd94\uac00\ud574\ubcf4\uc138\uc694.'
        )}
      </View>

      <View style={styles.section}>
        <Subtitle
          title={'\uc120\ud0dd \uc0c1\ud0dc'}
          caption={`${formatDateLabel(selectedDate)} \uc120\ud0dd \uc911`}
        />
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>{'\ud604\uc7ac \uc120\ud0dd\ud55c \ub0a0\uc9dc'}</Text>
          <Text style={styles.infoCardDate}>{formatDateLabel(selectedDate)}</Text>
          <Text style={styles.infoCardDescription}>
            {'\uc6d4\uac04, \uc8fc\uac04, \uc77c\uac04 \ud398\uc774\uc9c0\uc5d0\uc11c \ub0a0\uc9dc\ub97c \ubc14\uafb8\uba74 \uc5ec\uae30\uc5d0\ub3c4 \ubc14\ub85c \ubc18\uc601\ub429\ub2c8\ub2e4.'}
          </Text>
        </View>
      </View>
    </>
  );

  const currentPageInfo = PAGE_DETAILS[currentPage];

  if (!isLoaded || !fontsLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingState}>
          <ActivityIndicator size="small" color="#ff8fbc" />
          <Text style={styles.loadingText}>
            {'\ud560 \uc77c \ubaa9\ub85d\uc744 \ubd88\ub7ec\uc624\uace0 \uc788\uc5b4\uc694.'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundBubbleTop} />
      <View style={styles.backgroundBubbleBottom} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator>
        <View style={styles.contentInner}>
          <Header />

          <View style={styles.pageSwitcher}>
            {PAGE_MODES.map((page) => (
              <Pressable
                key={page}
                style={[styles.pageChip, currentPage === page && styles.pageChipActive]}
                onPress={() => setCurrentPage(page)}
              >
                <Text
                  style={[
                    styles.pageChipText,
                    currentPage === page && styles.pageChipTextActive,
                  ]}
                >
                  {PAGE_DETAILS[page].label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.pageHeader}>
            <Subtitle
              title={`${currentPageInfo.label} \ud398\uc774\uc9c0`}
              caption={currentPageInfo.caption}
            />
          </View>

          {currentPage === 'home' ? renderHomePage() : null}
          {currentPage === 'month' ? renderMonthPage() : null}
          {currentPage === 'week' ? renderWeekPage() : null}
          {currentPage === 'day' ? renderDayPage() : null}
        </View>
      </ScrollView>
      {showSplash ? (
        <Animated.View
          style={[
            styles.splashOverlay,
            {
              opacity: splashOpacity,
            },
          ]}
          pointerEvents="none"
        >
          <View style={styles.splashGlowLarge} />
          <View style={styles.splashGlowSmall} />
          <Animated.View
            style={[
              styles.transitionBubble,
              styles.transitionBubbleOne,
              {
                opacity: bubbleOpacity,
                transform: [{ scale: bubbleScaleOne }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.transitionBubble,
              styles.transitionBubbleTwo,
              {
                opacity: bubbleOpacity,
                transform: [{ scale: bubbleScaleTwo }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.transitionBubble,
              styles.transitionBubbleThree,
              {
                opacity: bubbleOpacity,
                transform: [{ scale: bubbleScaleThree }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.splashCard,
              {
                transform: [{ scale: splashScale }],
              },
            ]}
          >
            <Text style={styles.splashEyebrow}>MONGGEUL DAY</Text>
            <Text style={styles.splashTitle}>{'\ubabd\uae00\ub370\uc774'}</Text>
            <Text style={styles.splashCaption}>
              {'\ubabd\uae00\ubabd\uae00 \ud558\ub8e8\ub97c \uc5f4\uc5b4\ubcf4\ub294 \uc911...'}
            </Text>
          </Animated.View>
        </Animated.View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff7fb',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 40,
    zIndex: 1,
  },
  contentInner: {
    width: '100%',
    maxWidth: 880,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#8f6f7e',
    fontFamily: 'GowunDodum_400Regular',
  },
  backgroundBubbleTop: {
    position: 'absolute',
    top: -30,
    right: -20,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#ffd9ea',
  },
  backgroundBubbleBottom: {
    position: 'absolute',
    bottom: 110,
    left: -36,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#ffe9b8',
    opacity: 0.7,
  },
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff7fb',
    overflow: 'hidden',
  },
  splashGlowLarge: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#ffd8ea',
    top: 110,
    right: -50,
    opacity: 0.9,
  },
  splashGlowSmall: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#ffe8b5',
    bottom: 140,
    left: -30,
    opacity: 0.85,
  },
  transitionBubble: {
    position: 'absolute',
    borderRadius: 999,
  },
  transitionBubbleOne: {
    width: 180,
    height: 180,
    backgroundColor: '#ffd7ea',
    top: '24%',
    left: '18%',
  },
  transitionBubbleTwo: {
    width: 240,
    height: 240,
    backgroundColor: '#ffe7bc',
    bottom: '18%',
    right: '14%',
  },
  transitionBubbleThree: {
    width: 140,
    height: 140,
    backgroundColor: '#ffeef5',
    top: '48%',
    right: '28%',
  },
  splashCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: 36,
    paddingHorizontal: 34,
    paddingVertical: 36,
    borderWidth: 1,
    borderColor: '#ffd4e5',
    shadowColor: '#d37aa6',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  splashEyebrow: {
    fontSize: 13,
    letterSpacing: 1.4,
    color: '#c25586',
    fontFamily: 'GowunDodum_400Regular',
  },
  splashTitle: {
    marginTop: 14,
    fontSize: 40,
    lineHeight: 48,
    color: '#6d4254',
    fontFamily: 'GowunDodum_400Regular',
  },
  splashCaption: {
    marginTop: 10,
    fontSize: 15,
    color: '#9c6a80',
    fontFamily: 'GowunDodum_400Regular',
  },
  pageSwitcher: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  pageChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#fff8fb',
    borderWidth: 1,
    borderColor: '#ffd2e5',
  },
  pageChipActive: {
    backgroundColor: '#ff8fbc',
    borderColor: '#ff8fbc',
  },
  pageChipText: {
    fontSize: 13,
    color: '#b06f8b',
    fontFamily: 'GowunDodum_400Regular',
  },
  pageChipTextActive: {
    color: '#ffffff',
  },
  pageHeader: {
    marginBottom: 22,
  },
  summaryCard: {
    backgroundColor: '#fff0f6',
    borderRadius: 28,
    paddingVertical: 20,
    paddingHorizontal: 18,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#ffc4dd',
    shadowColor: '#d37aa6',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#f7bfd7',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#c25586',
    fontFamily: 'GowunDodum_400Regular',
  },
  summaryLabel: {
    marginTop: 6,
    fontSize: 13,
    color: '#9c6a80',
    fontFamily: 'GowunDodum_400Regular',
  },
  progressSection: {
    marginTop: 18,
  },
  progressLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressTitle: {
    fontSize: 14,
    color: '#9c6a80',
    fontFamily: 'GowunDodum_400Regular',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '800',
    color: '#c25586',
    fontFamily: 'GowunDodum_400Regular',
  },
  progressTrack: {
    marginTop: 10,
    height: 12,
    borderRadius: 999,
    backgroundColor: '#ffd9ea',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#ff8fbc',
  },
  section: {
    marginBottom: 24,
  },
  periodRow: {
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  periodButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffe3ef',
    borderWidth: 1,
    borderColor: '#ffc4dd',
  },
  periodButtonText: {
    fontSize: 24,
    lineHeight: 26,
    color: '#c25586',
    fontWeight: '700',
  },
  periodTitle: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
    fontSize: 16,
    color: '#6d4254',
    fontFamily: 'GowunDodum_400Regular',
  },
  calendarCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ffd2e5',
    padding: 12,
    marginBottom: 24,
  },
  weekdayHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekdayHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#b06f8b',
    fontFamily: 'GowunDodum_400Regular',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  monthCell: {
    width: '13.2%',
    minHeight: 66,
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 6,
    backgroundColor: '#fff8fb',
    borderWidth: 1,
    borderColor: '#ffe0ed',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  monthCellMuted: {
    opacity: 0.45,
  },
  monthCellSelected: {
    backgroundColor: '#ffedf5',
    borderColor: '#ff8fbc',
  },
  monthCellDay: {
    fontSize: 14,
    color: '#6d4254',
    fontFamily: 'GowunDodum_400Regular',
  },
  monthCellDayMuted: {
    color: '#ad8b9b',
  },
  monthCellDaySelected: {
    color: '#c25586',
  },
  todayText: {
    textDecorationLine: 'underline',
  },
  monthCellMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  todoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff8fbc',
  },
  todoDotDone: {
    backgroundColor: '#f2c94c',
  },
  monthCellCount: {
    fontSize: 11,
    color: '#b06f8b',
    fontFamily: 'GowunDodum_400Regular',
  },
  monthCellCountEmpty: {
    fontSize: 11,
    color: 'transparent',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 24,
  },
  weekDayCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffd7e7',
    paddingHorizontal: 10,
    paddingVertical: 14,
    minHeight: 112,
  },
  weekDayCardSelected: {
    backgroundColor: '#ffedf5',
    borderColor: '#ff8fbc',
  },
  weekDayLabel: {
    fontSize: 12,
    color: '#b06f8b',
    fontFamily: 'GowunDodum_400Regular',
  },
  weekDayLabelSelected: {
    color: '#c25586',
  },
  weekDayNumber: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: '800',
    color: '#6d4254',
    fontFamily: 'GowunDodum_400Regular',
  },
  weekDayNumberSelected: {
    color: '#c25586',
  },
  weekDayCount: {
    marginTop: 6,
    fontSize: 12,
    color: '#9c6a80',
    fontFamily: 'GowunDodum_400Regular',
  },
  dayCard: {
    backgroundColor: '#fffdf7',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#ffe5a8',
    padding: 18,
    marginBottom: 24,
  },
  dayCardLabel: {
    fontSize: 13,
    color: '#9c7d55',
    fontFamily: 'GowunDodum_400Regular',
  },
  dayCardDate: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: '800',
    color: '#6d4254',
    fontFamily: 'GowunDodum_400Regular',
  },
  dayCardSummary: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: '#8f6f7e',
    fontFamily: 'GowunDodum_400Regular',
  },
  infoCard: {
    marginTop: 12,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#ffd2e5',
    padding: 18,
  },
  infoCardTitle: {
    fontSize: 13,
    color: '#b06f8b',
    fontFamily: 'GowunDodum_400Regular',
  },
  infoCardDate: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: '800',
    color: '#6d4254',
    fontFamily: 'GowunDodum_400Regular',
  },
  infoCardDescription: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: '#8f6f7e',
    fontFamily: 'GowunDodum_400Regular',
  },
  listShell: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ffdbe9',
    paddingHorizontal: 10,
    paddingBottom: 12,
  },
  emptyState: {
    marginTop: 18,
    backgroundColor: '#fffdf7',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#ffe5a8',
  },
  emptyTitle: {
    fontSize: 17,
    color: '#6f4d5d',
    fontFamily: 'GowunDodum_400Regular',
  },
  emptyDescription: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: '#9c7d55',
    fontFamily: 'GowunDodum_400Regular',
  },
});
