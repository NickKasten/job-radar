import React from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useBigTechOpenings } from "@/hooks/useBigTechOpenings";
import BigTechCard from "@/components/BigTechCard";

const BigTechScreen: React.FC = () => {
  const { openings, loading, error, reload } = useBigTechOpenings();

  return (
    <View style={styles.container}>
      {error && <Text style={styles.error}>Unable to load: {error}</Text>}
      <FlatList
        data={openings}
        keyExtractor={(item) => `${item.company}-${item.url}`}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Big Tech Watchlist</Text>
            <Text style={styles.subtitle}>
              Automatically refreshed each morning. Tap to open the official job posting and apply quickly.
            </Text>
          </View>
        }
        renderItem={({ item }) => <BigTechCard opening={item} />}
        contentContainerStyle={styles.content}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff7ed",
    paddingTop: 48,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#9a3412",
    marginBottom: 8,
  },
  subtitle: {
    color: "#b45309",
    marginBottom: 16,
    lineHeight: 18,
  },
  error: {
    color: "#be123c",
    textAlign: "center",
    marginBottom: 8,
  },
});

export default BigTechScreen;
