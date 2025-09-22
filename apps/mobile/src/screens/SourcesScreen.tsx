import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const sources = [
  {
    name: "Greenhouse",
    description: "Public Greenhouse boards for Stripe, Dropbox, Databricks, OpenAI and more.",
  },
  {
    name: "Lever",
    description: "Lever postings for early-career software engineering roles.",
  },
  {
    name: "Workday",
    description: "Workday job feeds for Amazon, Microsoft, Meta, Snowflake, Nvidia, etc.",
  },
  {
    name: "LinkedIn (Partner API)",
    description: "Optional integration that requires access to an approved LinkedIn Talent Solutions data feed.",
  },
  {
    name: "Manual Feeds",
    description: "Curated RSS / newsletter sources for new grad and internship programs.",
  },
];

const SourcesScreen: React.FC = () => (
  <ScrollView style={styles.container} contentContainerStyle={styles.content}>
    <Text style={styles.title}>Data Sources</Text>
    <Text style={styles.intro}>
      The ingestion pipeline runs daily via Dagger and persists to Supabase. Each source is de-duplicated and
      normalized before display, keeping the feed focused on entry-level software engineering openings.
    </Text>
    {sources.map((source) => (
      <View key={source.name} style={styles.card}>
        <Text style={styles.name}>{source.name}</Text>
        <Text style={styles.description}>{source.description}</Text>
      </View>
    ))}
    <View style={styles.noticeBox}>
      <Text style={styles.noticeTitle}>Compliance reminder</Text>
      <Text style={styles.noticeText}>
        Access to LinkedIn data must happen through their official Talent Solutions APIs or approved data partnerships. The
        pipeline ships with a stub connector so you can add a compliant integration when you have access.
      </Text>
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    color: "#0f172a",
  },
  intro: {
    color: "#475569",
    lineHeight: 20,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    color: "#0f172a",
  },
  description: {
    color: "#475569",
  },
  noticeBox: {
    marginTop: 24,
    backgroundColor: "#fee2e2",
    padding: 16,
    borderRadius: 12,
  },
  noticeTitle: {
    fontWeight: "700",
    color: "#b91c1c",
    marginBottom: 6,
  },
  noticeText: {
    color: "#991b1b",
    lineHeight: 18,
  },
});

export default SourcesScreen;
