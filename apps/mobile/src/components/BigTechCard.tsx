import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import type { BigTechOpeningResponse } from "@/api/client";

type Props = {
  opening: BigTechOpeningResponse;
};

const BigTechCard: React.FC<Props> = ({ opening }) => {
  const handlePress = () => {
    Linking.openURL(opening.url);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text style={styles.company}>{opening.company}</Text>
      <Text style={styles.role}>{opening.role}</Text>
      <Text style={styles.location}>{opening.location ?? "Location varies"}</Text>
      <View style={styles.footer}>
        <Text style={styles.source}>{opening.source}</Text>
        <Text style={styles.updated}>Updated {opening.updatedAt.slice(0, 10)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff7ed",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderColor: "#fed7aa",
    borderWidth: 1,
  },
  company: {
    fontSize: 18,
    fontWeight: "700",
    color: "#9a3412",
  },
  role: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "500",
    color: "#7c2d12",
  },
  location: {
    marginTop: 4,
    color: "#b45309",
  },
  footer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  source: {
    textTransform: "capitalize",
    fontWeight: "500",
    color: "#f97316",
  },
  updated: {
    color: "#b45309",
  },
});

export default BigTechCard;
