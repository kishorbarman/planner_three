import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { getDaysInMonth, getFirstDayOfMonth, getTodayString } from '../lib/date';
import { TEXT, ACCENT, GLASS } from '../constants/colors';
import { DaySummary } from '../types';
import { MAX_TASKS } from '../constants/config';

interface Props {
  year: number;
  month: number;
  days: DaySummary[];
  onDayPress: (date: string) => void;
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarGrid({ year, month, days, onDayPress }: Props) {
  const totalDays = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const dayMap = new Map(days.map(d => [d.date, d]));
  const today = getTodayString();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  const getDateString = (day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const getDotColor = (summary: DaySummary | undefined) => {
    if (!summary || !summary.finalized) return null;
    if (summary.completedCount === MAX_TASKS) return ACCENT.success;
    if (summary.completedCount > 0) return ACCENT.warning;
    return ACCENT.error;
  };

  return (
    <View>
      <View style={styles.headerRow}>
        {DAY_LABELS.map(label => (
          <Text key={label} style={styles.headerCell}>{label}</Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((day, index) => {
          if (day === null) {
            return <View key={`empty-${index}`} style={styles.cell} />;
          }
          const dateStr = getDateString(day);
          const summary = dayMap.get(dateStr);
          const dotColor = getDotColor(summary);
          const isToday = dateStr === today;

          return (
            <Pressable
              key={dateStr}
              style={styles.cell}
              onPress={() => summary && onDayPress(dateStr)}
              accessibilityLabel={`${dateStr}${isToday ? ', today' : ''}${summary ? ', has data' : ''}`}
            >
              <View style={[styles.dayCircle, isToday && styles.todayCircle]}>
                <Text style={[styles.dayNumber, isToday && styles.todayText]}>{day}</Text>
              </View>
              {dotColor && <View style={[styles.dot, { backgroundColor: dotColor }]} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    color: TEXT.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 6,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCircle: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dayNumber: {
    color: TEXT.primary,
    fontSize: 14,
  },
  todayText: {
    fontWeight: '700',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
});
