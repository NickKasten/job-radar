import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { SummaryResponse } from "@/api/client";

type Props = {
  summary: SummaryResponse;
};

const SummaryCard: React.FC<Props> = ({ summary }) => (
  <View style={styles.container}>
    <Text style={styles.date}>📅 {summary.date}</Text>
    <View style={styles.row}>
      <Text style={styles.metricLabel}>Total roles</Text>
      <Text style={styles.metricValue}>{summary.totalJobs}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.metricLabel}>New companies</Text>
      <Text style={styles.metricValue}>{summary.newCompanies}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.metricLabel}>Remote-friendly</Text>
      <Text style={styles.metricValue}>{summary.remoteRoles}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eff6ff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1d4ed8",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  metricLabel: {
    color: "#1e293b",
  },
  metricValue: {
    fontWeight: "600",
    color: "#1d4ed8",
  },
});

export default SummaryCard;
