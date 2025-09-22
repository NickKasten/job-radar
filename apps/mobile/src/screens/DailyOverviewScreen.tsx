import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { useSummaries } from "@/hooks/useSummaries";
import { useJobDates } from "@/hooks/useJobDates";
import SummaryCard from "@/components/SummaryCard";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { DailyStackParamList } from "@/types/navigation";

const DailyOverviewScreen: React.FC<NativeStackScreenProps<DailyStackParamList, "DailyOverview">> = ({ navigation }) => {
  const { summaries, loading: summariesLoading, error: summariesError, reload: reloadSummaries } = useSummaries();
  const { dates, loading: datesLoading, error: datesError, reload: reloadDates } = useJobDates();

  const loading = summariesLoading || datesLoading;
  const error = summariesError ?? datesError;
  const reload = () => {
    reloadSummaries();
    reloadDates();
  };

  const entries = dates.map((date) => ({
    date,
    summary: summaries.find((item) => item.date === date) ?? null,
  }));

  return (
    <View style={styles.container}>
      {error && <Text style={styles.error}>Unable to load summaries: {error}</Text>}
      <FlatList
        data={entries}
        keyExtractor={(item) => item.date}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Daily Archives</Text>
            <Text style={styles.subtitle}>Tap a day to see every role captured during that run.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("DailyDetail", { date: item.date })}
            style={styles.cardWrapper}
          >
            {item.summary ? (
              <SummaryCard summary={item.summary} />
            ) : (
              <View style={styles.fallbackCard}>
                <Text style={styles.fallbackDate}>📅 {item.date}</Text>
                <Text style={styles.fallbackText}>No summary stored for this run yet.</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
  },
  subtitle: {
    marginTop: 6,
    color: "#475569",
  },
  cardWrapper: {
    marginBottom: 12,
  },
  error: {
    color: "#dc2626",
    textAlign: "center",
    marginTop: 12,
  },
  fallbackCard: {
    backgroundColor: "#e2e8f0",
    padding: 16,
    borderRadius: 12,
  },
  fallbackDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 6,
  },
  fallbackText: {
    color: "#475569",
  },
});

export default DailyOverviewScreen;
