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
    const userRef = ref(db, `user/${userId}`);

    // Fetch current medical records
    const snapshot = await get(child(userRef, 'medicalRecords'));
    let medicalRecords = snapshot.exists() ? snapshot.val() : [];

    // Add the new report
    medicalRecords.push(report);

    // Update the database
    await update(userRef, { medicalRecords });

    return medicalRecords;
  } catch (error) {
    console.error('Error adding medical report:', error);
    throw error; // Propagate error for handling
  }
};


export const getMedicalReports = async (userId) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const medicalRecordsRef = child(dbRef, `user/${userId}/medicalRecords`);

    const snapshot = await get(medicalRecordsRef);

    return snapshot.exists() ? snapshot.val() : [];
  } catch (error) {
    console.error('Error fetching medical reports:', error);
    throw error;
  }
};



export const updateMedicalReport = async (userId, reportId, updatedReport) => {
  try {
    const app = getFirebaseApp();
    const db = getDatabase(app);
    const userRef = ref(db, `user/${userId}/medicalRecords/${reportId}`);

    // Update the specific medical report using the report ID
    await update(userRef, updatedReport);
    
    return updatedReport;
  } catch (error) {
    console.error('Error updating medical report:', error);
    throw error;
  }
};



export const deleteMedicalReport = async (userId, recordId) => {
  try {
    const app = getFirebaseApp();
    const db = getDatabase(app);
    const recordRef = ref(db, `user/${userId}/medicalRecords/${recordId}`);

    // Remove the specific medical record
    await remove(recordRef);
    console.log('Record deleted successfully');
  } catch (error) {
    console.error('Error deleting medical report:', error);
    throw error;
  }
};




