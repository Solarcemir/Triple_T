import { useState } from 'react';
import {
  View, Text, ScrollView, FlatList,
  StyleSheet, Dimensions, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { useFonts, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { DMSans_400Regular, DMSans_600SemiBold } from '@expo-google-fonts/dm-sans';

import { useAppStore } from '../store/appStore';
import { AccountTotal, calcPercentSpent, ShowAvailableBudget } from '../utils/budget';
import { colors, spacing } from '../constants/theme';
import { Budget, Expense } from '../types';

const W = Dimensions.get('window').width;

// Day labels for the weekly chart
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];




export default function HomeScreen() {
  const accounts = useAppStore((s) => s.accounts);
  const budgets  = useAppStore((s) => s.budgets);
  const expenses = useAppStore((s) => s.expenses);

  const [fontsLoaded] = useFonts({
    'Playfair-Bold': PlayfairDisplay_700Bold,
    'DM-Sans':       DMSans_400Regular,
    'DM-Sans-Semi':  DMSans_600SemiBold,
  });


  // Tooltip state: which chart point is selected
  const [tooltip, setTooltip] = useState<{ x: number; y: number; index: number } | null>(null);

  const totalBalance  = AccountTotal(accounts);
  const totalBudgeted = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent    = expenses.reduce((s, e) => s + e.amount, 0);
  const safeToSpend   = totalBudgeted - totalSpent;

  const recentExpenses = [...expenses]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  const chartData = buildWeeklyData(expenses);

  // Don't render until fonts are ready
  if (!fontsLoaded) return <View style={styles.screen} />;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* ── Greeting ── */}
      <Text style={styles.greeting}>Good morning</Text>
      <Text style={styles.date}>{formatToday()}</Text>

      {/* ── Account Cards (horizontal scroll) ── */}
      <Text style={styles.sectionLabel}>ACCOUNTS</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={accounts}
        keyExtractor={(a) => a.id}
        contentContainerStyle={{ paddingBottom: spacing.md }}
        renderItem={({ item }) => (
          <LinearGradient
            colors={['#1A1A2E', '#1c1c1f']}
            style={styles.accountCard}
          >
            <Text style={styles.accountName}>{item.name}</Text>
            <Text style={styles.accountBalance}>${item.balance.toLocaleString('en-CA', { minimumFractionDigits: 2 })}</Text>
          </LinearGradient>
        )}
      />



      {/* ── Safe to Spend ── */}
      <LinearGradient
        colors={['#004D26', '#007A3D', '#00C853']}
        start={{ x: 0.0, y: 1.0 }}
        end={{ x: 1.0, y: 0.0 }}
        style={styles.safeCard}
      >
        <Text style={styles.safeLabel}>SAFE TO SPEND</Text>
        <Text style={styles.safeAmount}>
          ${safeToSpend.toFixed(2)}
        </Text>
        <Text style={styles.safeSub}>remaining this week</Text>

        <View style={styles.safeStats}>
          <View>
            <Text style={styles.safeStatLabel}>BUDGET</Text>
            <Text style={styles.safeStatValue}>${totalBudgeted.toFixed(0)}</Text>
          </View>
          <View style={styles.safeDivider} />
          <View>
            <Text style={styles.safeStatLabel}>SPENT</Text>
            <Text style={styles.safeStatValue}>${totalSpent.toFixed(2)}</Text>
          </View>
          <View style={styles.safeDivider} />
          <View>
            <Text style={styles.safeStatLabel}>BALANCE</Text>
            <Text style={styles.safeStatValue}>${totalBalance.toFixed(0)}</Text>
          </View>
        </View>
      </LinearGradient>




      {/* ── Spending Chart ── */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionLabel}>WEEKLY SPENDING</Text>
        <View style={styles.chartWrap}>
          <LineChart
            data={{ labels: DAY_LABELS, datasets: [{ data: chartData }] }}
            width={W - spacing.md * 2}
            height={180}
            chartConfig={chartConfig}
            bezier
            withInnerLines={false}
            withOuterLines={false}
            withShadow={false}
            style={{ borderRadius: 0, marginLeft: -16 }}
            onDataPointClick={({ x, y, index }) => {
              setTooltip((prev) => (prev?.index === index ? null : { x, y, index }));
            }}
            decorator={() => {
              if (!tooltip) return null;
              const dayExpenses = getExpensesForDayIndex(tooltip.index, expenses);
              const topExpense  = dayExpenses.sort((a, b) => b.amount - a.amount)[0];
              return (
                <View style={[styles.tooltip, { left: clamp(tooltip.x - 50, 0, W - 160), top: tooltip.y - 60 }]}>
                  <Text style={styles.tooltipDay}>{DAY_LABELS[tooltip.index]}</Text>
                  <Text style={styles.tooltipTotal}>${chartData[tooltip.index].toFixed(2)}</Text>
                  {topExpense && (
                    <Text style={styles.tooltipExpense}>{topExpense.name}</Text>
                  )}
                </View>
              );
            }}
          />
        </View>
      </View>




      {/* ── Budget Progress ── */}
      <Text style={styles.sectionLabel}>BUDGETS</Text>
      {budgets.map((b) => (
        <BudgetRow key={b.id} budget={b} expenses={expenses} />
      ))}

      {/* ── Recent Expenses ── */}
      <View style={styles.expensesHeader}>
        <Text style={styles.sectionLabel}>RECENT</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      </View>
      {recentExpenses.map((e) => {
        const budget = budgets.find((b) => b.id === e.budgetId);
        return (
          <View key={e.id} style={styles.expenseRow}>
            <View style={[styles.expensePill, { backgroundColor: budget?.color + '22' }]}>
              <View style={[styles.expenseDot, { backgroundColor: budget?.color }]} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={styles.expenseName}>{e.name}</Text>
              <Text style={styles.expenseCat}>{budget?.name ?? '—'} · {formatDate(e.date)}</Text>
            </View>
            <Text style={styles.expenseAmt}>-${e.amount.toFixed(2)}</Text>
          </View>
        );
      })}

    </ScrollView>
  );
}



// ── Sub-components ─────────────────────────────────────────

function BudgetRow({ budget, expenses }: { budget: Budget; expenses: Expense[] }) {
  const pct  = calcPercentSpent(expenses, budget);
  const avail = ShowAvailableBudget(budget, expenses);
  const isOver = pct > 100;
  const barColor = isOver ? colors.red : pct > 75 ? colors.yellow : budget.color;

  return (
    <View style={styles.budgetRow}>
      <View style={styles.budgetMeta}>
        <Text style={styles.budgetName}>{budget.name}</Text>
        <Text style={[styles.budgetAvail, isOver && { color: colors.red }]}>
          ${avail.toFixed(2)}
        </Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${Math.min(pct, 100)}%`, backgroundColor: barColor }]} />
      </View>
      <Text style={styles.barMeta}>${(budget.limit * pct / 100).toFixed(0)} / ${budget.limit}</Text>
    </View>
  );
}



// ── Helpers ────────────────────────────────────────────────

function buildWeeklyData(expenses: Expense[]): number[] {
  const days: number[] = [0, 0, 0, 0, 0, 0, 0];
  expenses.forEach((e) => {
    const d = new Date(e.date).getDay();
    const i = d === 0 ? 6 : d - 1; // Mon=0 … Sun=6
    days[i] += e.amount;
  });
  // react-native-chart-kit crashes if all values are 0
  return days.map((v) => (v === 0 ? 0.01 : v));
}

function getExpensesForDayIndex(idx: number, expenses: Expense[]): Expense[] {
  return expenses.filter((e) => {
    const d = new Date(e.date).getDay();
    return (d === 0 ? 6 : d - 1) === idx;
  });
}

function formatDate(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return new Date(dateStr).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
}

function formatToday(): string {
  return new Date().toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' });
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

// ── Chart Config ───────────────────────────────────────────

const chartConfig = {
  backgroundGradientFrom:       colors.background,
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo:          colors.background,
  backgroundGradientToOpacity:   0,
  color:       (opacity = 1) => `rgba(0, 200, 83, ${opacity})`,
  labelColor:  ()            => colors.textSecondary,
  strokeWidth: 2,
  propsForDots:   { r: '5', strokeWidth: '2', stroke: '#00C853', fill: colors.background },
  propsForLabels: { fontFamily: 'DM-Sans', fontSize: 12 },
  decimalPlaces: 0,
};

// ── Styles ─────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingTop: spacing.xl + 8, paddingBottom: 60 },

  greeting: { fontFamily: 'Playfair-Bold', fontSize: 30, color: colors.text },
  date:     { fontFamily: 'DM-Sans', fontSize: 13, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.lg },

  sectionLabel: {
    fontFamily: 'DM-Sans-Semi',
    fontSize: 10,
    letterSpacing: 2,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },

  // Accounts
  accountCard: {
    width: 180,
    borderRadius: 16,
    padding: spacing.md,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: '#ffffff0f',
  },
  accountName:    { fontFamily: 'DM-Sans', color: colors.textSecondary, fontSize: 12 },
  accountBalance: { fontFamily: 'Playfair-Bold', color: colors.text, fontSize: 22, marginTop: 8 },

  // Safe to Spend
  safeCard: {
    borderRadius: 24,
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  safeLabel:  { fontFamily: 'DM-Sans-Semi', color: '#ffffff88', fontSize: 11, letterSpacing: 2 },
  safeAmount: { fontFamily: 'Playfair-Bold', color: '#fff', fontSize: 56, marginVertical: 1 },
  safeSub:    { fontFamily: 'DM-Sans', color: '#ffffff88', fontSize: 13, marginBottom: spacing.lg },
  safeStats:  { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#ffffff22', paddingTop: spacing.md, gap: 0 },
  safeStatLabel: { fontFamily: 'DM-Sans-Semi', color: '#ffffff66', fontSize: 10, letterSpacing: 1.5 },
  safeStatValue: { fontFamily: 'DM-Sans-Semi', color: '#fff', fontSize: 16, marginTop: 4 },
  safeDivider:   { width: 1, backgroundColor: '#ffffff22', marginHorizontal: spacing.md },

  // Chart
  chartSection: { marginTop: spacing.sm, marginBottom : spacing.xs },
  chartWrap:    { marginHorizontal: -spacing.md },

  // Tooltip
  tooltip: {
    position: 'absolute',
    backgroundColor: '#1C1C2E',
    borderRadius: 10,
    padding: 8,
    width: 110,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  tooltipDay:     { fontFamily: 'DM-Sans', color: colors.textSecondary, fontSize: 11 },
  tooltipTotal:   { fontFamily: 'Playfair-Bold', color: colors.green, fontSize: 18 },
  tooltipExpense: { fontFamily: 'DM-Sans', color: colors.textSecondary, fontSize: 11, marginTop: 2 },

  // Budgets
  budgetRow:  { marginBottom: spacing.md },
  budgetMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  budgetName: { fontFamily: 'DM-Sans-Semi', color: colors.text, fontSize: 14 },
  budgetAvail:{ fontFamily: 'DM-Sans-Semi', color: colors.green, fontSize: 14 },
  barTrack:   { height: 4, backgroundColor: colors.cardBorder, borderRadius: 2, overflow: 'hidden' },
  barFill:    { height: 4, borderRadius: 2 },
  barMeta:    { fontFamily: 'DM-Sans', color: colors.textSecondary, fontSize: 11, marginTop: 4 },

  // Expenses
  expensesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.sm },
  viewAll:    { fontFamily: 'DM-Sans-Semi', color: colors.green, fontSize: 12 },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  expensePill:  { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  expenseDot:   { width: 10, height: 10, borderRadius: 5 },
  expenseName:  { fontFamily: 'DM-Sans-Semi', color: colors.text, fontSize: 14 },
  expenseCat:   { fontFamily: 'DM-Sans', color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  expenseAmt:   { fontFamily: 'DM-Sans-Semi', color: colors.red, fontSize: 14 },
});
