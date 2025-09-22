import React from "react";
import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";
import type { JobResponse } from "@/api/client";

export type JobCardProps = {
  job: JobResponse;
};

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const handlePress = () => {
    Linking.openURL(job.url);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.header}>
        <Text style={styles.title}>{job.title}</Text>
        <Text style={styles.tag}>{job.source}</Text>
      </View>
      <Text style={styles.company}>{job.company}</Text>
      <Text style={styles.location}>{job.location ?? "Location TBC"}</Text>
      {job.remote && <Text style={styles.remote}>Remote Friendly</Text>}
      <View style={styles.footer}>
        <Text style={styles.date}>Scraped {job.scrapedForDate}</Text>
        {job.postedAt && <Text style={styles.date}>Posted {job.postedAt.slice(0, 10)}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 12,
    color: "#0f172a",
  },
  tag: {
    backgroundColor: "#e0f2fe",
    color: "#0284c7",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    textTransform: "capitalize",
  },
  company: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 6,
    color: "#1e293b",
  },
  location: {
    marginTop: 4,
    color: "#475569",
  },
  remote: {
    marginTop: 6,
    color: "#16a34a",
    fontWeight: "500",
  },
  footer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  date: {
    fontSize: 12,
    color: "#64748b",
  },
});

export default JobCard;
