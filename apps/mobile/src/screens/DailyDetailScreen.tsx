import React, { useMemo } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useJobs } from "@/hooks/useJobs";
import { useSummaries } from "@/hooks/useSummaries";
import JobCard from "@/components/JobCard";
import SummaryCard from "@/components/SummaryCard";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { DailyStackParamList } from "@/types/navigation";

const DailyDetailScreen: React.FC<NativeStackScreenProps<DailyStackParamList, "DailyDetail">> = ({ route }) => {
  const { date } = route.params;
  const { jobs, loading, error, reload } = useJobs(date);
  const { summaries } = useSummaries();

  const summaryForDay = useMemo(() => summaries.find((item) => item.date === date), [summaries, date]);

  return (
    <View style={styles.container}>
      {error && <Text style={styles.error}>Unable to load jobs: {error}</Text>}
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Results for {date}</Text>
            {summaryForDay && <SummaryCard summary={summaryForDay} />}
            <Text style={styles.subtitle}>Roles captured</Text>
          </View>
        }
        renderItem={({ item }) => <JobCard job={item} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingTop: 48,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    marginVertical: 12,
  },
  error: {
    color: "#dc2626",
    textAlign: "center",
    marginBottom: 8,
  },
});

export default DailyDetailScreen;
