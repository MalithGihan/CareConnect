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
    image: "https://example.com/cpr-image-1.png",
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

  // Filtered data based on search query
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
                <ScrollView contentContainerStyle={styles.stepsScroll}>
                  <Text style={styles.topicText}>{tip.topic}</Text>
                  <Image source={{ uri: tip.image }} style={styles.image} />
                  {tip.steps.map((step, stepIndex) => (
                    <Text key={stepIndex} style={styles.step}>
                      {step}
                    </Text>
                  ))}
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
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  activeTab: {
    backgroundColor: "#003366",
  },
  searchBar: {
    marginHorizontal: 20,
    marginVertical:10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  phoneNumberList: {
    paddingHorizontal: 20,
    paddingBottom:100
  },
  numberContainer: {
    marginVertical: 2,
    padding: 15,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  placeText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  callButton: {
    height: 40,
    width: 40,
    borderRadius: 30,
    backgroundColor: "#D9D9D9",
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
    paddingBottom:100
  },
  topicText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    resizeMode: "contain",
  },
  stepsScroll: {
    minHeight: "100%",
    backgroundColor: "#f1f1f1",
    padding: 20,
    borderRadius: 10,
  },
  step: {
    fontSize: 16,
    marginVertical: 5,
    lineHeight: 24,
  },
});

export default EmergencyPage;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   tabContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     paddingVertical: 10,
//   },
//   tabButton: {
//     height: 60,
//     width: 60,
//     borderRadius: 30,
//     backgroundColor: "#D9D9D9",
//     justifyContent: "center",
//     alignItems: "center",
//     margin: 10,
//   },
//   activeTab: {
//     backgroundColor: "#003366",
//   },
//   tabText: {
//     color: "#000",
//     fontWeight: "bold",
//   },
//   phoneNumberList: {
//     padding: 20,
//   },
//   numberContainer: {
//     marginVertical: 2,
//     padding: 15,
//     backgroundColor: "#f1f1f1",
//     borderRadius: 8,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   placeText: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   callButton: {
//     height: 40,
//     width: 40,
//     borderRadius: 30,
//     backgroundColor: "#D9D9D9",
//     justifyContent: "center",
//     alignItems: "center",
//     margin: 10,
//   },
//   callButtonText: {
//     color: "#fff",
//     fontSize: 14,
//   },
//   dotContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginVertical: 10,
//   },
//   dot: {
//     height: 10,
//     width: 10,
//     borderRadius: 5,
//     backgroundColor: "#ccc",
//     marginHorizontal: 5,
//   },
//   slide: {
//     width: width,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   topicText: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   image: {
//     width: "100%",
//     height: 200,
//     marginBottom: 20,
//     resizeMode: "contain",
//   },
//   stepsScroll: {
//     minHeight: "100%",
//     backgroundColor: "#f1f1f1",
//     padding: 20,
//     borderRadius: 10,
//   },
//   step: {
//     fontSize: 16,
//     marginVertical: 5,
//     lineHeight: 24,
//   },
// });

// export default EmergencyPage;
