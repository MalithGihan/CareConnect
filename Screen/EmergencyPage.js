import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Linking,
  Dimensions,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const emergencyNumbers = [
  { place: "Fire Department", phone: "+94112345678" },
  { place: "Police Station", phone: "+94198765432" },
  { place: "Ambulance Service", phone: "+94112223344" },
  { place: "Disaster Management", phone: "+94116667788" },
  { place: "Electricity Board", phone: "+94118889999" },
  { place: "Water Supply", phone: "+94110000000" },
  { place: "Gas Emergency", phone: "+94117778899" },
  { place: "Poison Control", phone: "+94115556677" },
  { place: "National Hospital", phone: "+94114445555" },
  { place: "Marine Rescue", phone: "+94119998888" },
];

const emergencyTips = [
  {
    topic: "CPR",
    image: "../assets/images/undraw_Healthy_lifestyle_re_ifwg.png",
    steps: [
      "Check Responsiveness: Tap the person and shout, 'Are you okay?'",
      "Call for Help: If there's no response, call emergency services or ask someone else to do so.",
      "Open Airway: Tilt the head back and lift the chin to open the airway.",
      "Check Breathing: Look, listen, and feel for breathing for no more than 10 seconds.",
      "Chest Compression: If the person isn't breathing, start chest compressions. Push hard and fast in the center of the chest at a rate of 100-120 compressions per minute.",
    ],
  },
  {
    topic: "Bleeding Control",
    image: "https://example.com/bleeding-control-image.png",
    steps: [
      "Apply direct pressure: Use a clean cloth or bandage and press firmly on the wound.",
      "Elevate the wound: If possible, raise the injured area above the level of the heart.",
      "Use a tourniquet: If bleeding is severe and cannot be controlled, use a tourniquet as a last resort.",
    ],
  },
];

const EmergencyPage = () => {
  const [activeTab, setActiveTab] = useState("contacts");
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const makeCall = (phoneNumber) => {
    let phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl).catch((err) => {
      console.error("Error occurred while making the call:", err);
    });
  };

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(offsetX / width);
    setCurrentPage(pageIndex);
  };

  const filteredNumbers = emergencyNumbers.filter((item) =>
    item.place.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTips = emergencyTips.filter((tip) =>
    tip.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "contacts" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("contacts")}
        >
          <Ionicons name="call" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "tips" && styles.activeTab]}
          onPress={() => setActiveTab("tips")}
        >
          <MaterialIcons name="health-and-safety" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <TextInput
        style={styles.searchBar}
        placeholder={activeTab === "contacts" ? "Search place" : "Search topic"}
        placeholderTextColor="#32"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Conditional rendering for Contacts and Tips */}
      {activeTab === "contacts" ? (
        <ScrollView contentContainerStyle={styles.phoneNumberList}>
          {filteredNumbers.map((item, index) => (
            <View key={index} style={styles.numberContainer}>
              <Text style={styles.placeText}>{item.place}</Text>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => makeCall(item.phone)}
              >
                <Ionicons name="call" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View>
          <View style={styles.dotContainer}>
            {filteredTips.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  { backgroundColor: currentPage === index ? "#000" : "#ccc" },
                ]}
              />
            ))}
          </View>

          <ScrollView
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {filteredTips.map((tip, index) => (
              <View key={index} style={styles.slide}>
                <ScrollView contentContainerStyle={{ paddingBottom: 180 }}>
                  <LinearGradient
                    colors={["rgba(0, 51, 102, 0.4)", "rgba(0, 191, 165, 0.4)"]}
                    style={styles.stepsScroll}
                  >
                    <Text style={styles.topicText}>{tip.topic}</Text>
                    <Image source={{ uri: tip.image }} style={styles.image} />
                    {tip.steps.map((step, stepIndex) => (
                      <View
                        key={stepIndex} // Add a unique key for each step
                        style={{
                          backgroundColor: "white",
                          padding: 10,
                          borderRadius: 8,
                          marginBottom: 10,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 8 },
                          shadowOpacity: 0.5,
                          shadowRadius: 5,
                        }}
                      >
                        <Text style={styles.step}>{step}</Text>
                      </View>
                    ))}
                  </LinearGradient>
                </ScrollView>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  tabButton: {
    height: 50,
    width: 50,
    borderRadius: 30,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  activeTab: {
    backgroundColor: "#003366",
  },
  searchBar: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#D9E4EC",
    borderRadius: 10,
    placeholder: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderRadius: 10,
  },
  phoneNumberList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  numberContainer: {
    marginVertical: 2,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  placeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#003366",
  },
  callButton: {
    height: 40,
    width: 40,
    borderRadius: 30,
    backgroundColor: "#003366",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  slide: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  topicText: {
    fontSize: 25,
    fontWeight: "900",
    marginBottom: 20,
    color: "#003366",
  },
  image: {
    width: "50%",
    height: 100,
    marginBottom: 20,
    resizeMode: "contain",
  },
  stepsScroll: {
    minHeight: "100%",
    backgroundColor: "rgba(241, 241, 241, 0.3)",
    padding: 20,
    borderRadius: 10,
  },
  step: {
    fontSize: 12,
    fontWeight: "600",
    marginVertical: 5,
    lineHeight: 18,
    color: "#003366",
  },
});

export default EmergencyPage;
