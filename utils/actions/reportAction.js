import {
  child,
  get,
  getDatabase,
  ref,
  update,
  push,
  set,
  remove,
  onValue,
} from "firebase/database";
import { getFirebaseApp } from "../firebaseHelper";


export const addMedicalReport = async (userId, report) => {
  try {
    const app = getFirebaseApp();
    const db = getDatabase(app);
    const userRef = ref(db, `user/${userId}/medicalRecords`);

    const snapshot = await get(userRef);
    let medicalRecords = snapshot.exists() ? snapshot.val() : [];

    medicalRecords.push(report);

    await update(ref(db, `user/${userId}`), { medicalRecords });

    return medicalRecords;
  } catch (error) {
    console.error("Error adding medical report:", error);
  }
};


export const getMedicalReports = async (userId) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const medicalRecordsRef = child(dbRef, `user/${userId}/medicalRecords`);

    const snapshot = await get(medicalRecordsRef);

    if (snapshot.exists()) {
      return snapshot.val(); 
    } else {
      return []; 
    }
  } catch (error) {
    console.error("Error fetching medical reports:", error);
  }
};


export const updateMedicalReport = async (
  userId,
  reportIndex,
  updatedReport
) => {
  try {
    const app = getFirebaseApp();
    const db = getDatabase(app);
    const userRef = ref(db, `user/${userId}/medicalRecords`);

    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      let medicalRecords = snapshot.val();

      if (reportIndex >= 0 && reportIndex < medicalRecords.length) {
        medicalRecords[reportIndex] = updatedReport;

        await update(ref(db, `user/${userId}`), { medicalRecords });
        return medicalRecords;
      } else {
        throw new Error("Report index out of bounds");
      }
    } else {
      throw new Error("No medical records found");
    }
  } catch (error) {
    console.error("Error updating medical report:", error);
  }
};


export const deleteMedicalReport = async (userId, reportIndex) => {
  try {
    const app = getFirebaseApp();
    const db = getDatabase(app);
    const userRef = ref(db, `user/${userId}/medicalRecords`);

    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      let medicalRecords = snapshot.val();

      if (reportIndex >= 0 && reportIndex < medicalRecords.length) {
        medicalRecords.splice(reportIndex, 1);

        await update(ref(db, `user/${userId}`), { medicalRecords });
        return medicalRecords;
      } else {
        throw new Error("Report index out of bounds");
      }
    } else {
      throw new Error("No medical records found");
    }
  } catch (error) {
    console.error("Error deleting medical report:", error);
  }
};
