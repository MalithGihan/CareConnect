import React, { useState, useRef, useContext } from "react";
import { FlatList, StyleSheet, View, Animated, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingItem from "./OnboardingItem";
import Paginator from "./Paginator";
import NextButton from "./NextButton";
import sides from "./sides";
import OnboardingContext from "./OnboardingContext";

const Onboarding = () => {
  const { setViewedOnboarding } = useContext(OnboardingContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollx = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = async () => {
    if (currentIndex < sides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      try {
        await AsyncStorage.setItem("@viewedOnboarding", "true");
        setViewedOnboarding(true); // Update context state to switch navigator
      } catch (err) {
        console.log("Error @setItem:", err);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* CareConnect header in the top-left corner */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>CareConnect</Text>
      </View>

      {/* FlatList to display onboarding items */}
      <View style={{ flex: 3 }}>
        <FlatList
          data={sides}
          renderItem={({ item }) => <OnboardingItem item={item} />}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollx } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      {/* Paginator for navigation between items */}
      <Paginator data={sides} scrollx={scrollx} />

      {/* Button to navigate to next item */}
      <NextButton
        scrollTo={scrollTo}
        percentage={(currentIndex + 1) * (100 / sides.length)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  headerContainer: {
    position: "absolute", 
    top: 15,
    left: 15, 
    zIndex: 10, 
  },
  header: {
    fontSize: 20,
    fontWeight: "900",
    color: "#00BFA5",
  },
});

export default Onboarding;
