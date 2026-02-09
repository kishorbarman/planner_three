import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { SolarBackground } from '../../components/SolarBackground';
import { GlassCard } from '../../components/GlassCard';
import { CalendarGrid } from '../../components/CalendarGrid';
import { DaySummarySheet } from '../../components/DaySummarySheet';
import { useHistory } from '../../hooks/useHistory';
import { TEXT } from '../../constants/colors';
import { DaySummary } from '../../types';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function HistoryScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const { days, loading, fetchMonth } = useHistory();
  const [selectedSummary, setSelectedSummary] = useState<DaySummary | null>(null);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  // Fetch on mount, month change, and every time screen gains focus
  useEffect(() => {
    if (isFocused) {
      fetchMonth(year, month);
    }
  }, [isFocused, year, month, fetchMonth]);

  // Keep selectedSummary in sync with refreshed days data
  useEffect(() => {
    if (selectedSummary) {
      const updated = days.find(d => d.date === selectedSummary.date);
      if (updated) {
        setSelectedSummary(updated);
      } else {
        setSelectedSummary(null);
      }
    }
  }, [days]);

  const navigateMonth = (direction: -1 | 1) => {
    const newMonth = month + direction;
    if (newMonth < 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else if (newMonth > 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else {
      setMonth(newMonth);
    }
  };

  const handleDayPress = (date: string) => {
    const summary = days.find(d => d.date === date);
    if (summary) setSelectedSummary(summary);
  };

  return (
    <SolarBackground>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <Text style={styles.closeText}>Done</Text>
          </Pressable>
        </View>

        {/* Month Navigation */}
        <View style={styles.monthNav}>
          <Pressable onPress={() => navigateMonth(-1)} style={styles.navButton}>
            <Text style={styles.navButtonText}>‹</Text>
          </Pressable>
          <Text style={styles.monthTitle}>
            {MONTH_NAMES[month]} {year}
          </Text>
          <Pressable onPress={() => navigateMonth(1)} style={styles.navButton}>
            <Text style={styles.navButtonText}>›</Text>
          </Pressable>
        </View>

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <GlassCard>
            {loading ? (
              <View style={styles.center}>
                <ActivityIndicator color="#FFFFFF" />
              </View>
            ) : (
              <CalendarGrid
                year={year}
                month={month}
                days={days}
                onDayPress={handleDayPress}
              />
            )}
          </GlassCard>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#34D399' }]} />
            <Text style={styles.legendText}>All done</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FBBF24' }]} />
            <Text style={styles.legendText}>Partial</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F87171' }]} />
            <Text style={styles.legendText}>None done</Text>
          </View>
        </View>

        {/* Day Detail Sheet (read-only) */}
        <DaySummarySheet
          summary={selectedSummary}
          onClose={() => setSelectedSummary(null)}
        />
      </SafeAreaView>
    </SolarBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  title: {
    color: TEXT.primary,
    fontSize: 28,
    fontWeight: '300',
  },
  closeButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  closeText: {
    color: TEXT.secondary,
    fontSize: 16,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 24,
  },
  navButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    color: TEXT.primary,
    fontSize: 28,
  },
  monthTitle: {
    color: TEXT.primary,
    fontSize: 18,
    fontWeight: '600',
    minWidth: 160,
    textAlign: 'center',
  },
  calendarContainer: {
    paddingHorizontal: 16,
  },
  center: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: TEXT.muted,
    fontSize: 12,
  },
});
