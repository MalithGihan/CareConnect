import { child,get,getDatabase,ref , update } from "firebase/database";
import { getFirebaseApp } from "../firebaseHelper";

export const getUserData = async (userId) => {
    try {
        const app = getFirebaseApp()

        const dbRef = ref(getDatabase(app))

        const userRef = child(dbRef, `user/${userId}`)

        const snapshot = await get(userRef)

        return snapshot.val()

    } catch (err) {
        console.error(err)
    }
}

export const getAllPatients = async () => {
    try {
        const app = getFirebaseApp();
        const dbRef = ref(getDatabase(app));
        const usersRef = child(dbRef, 'user');
        
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
            const usersData = snapshot.val();
        
            const patients = Object.keys(usersData)
                .filter(userId => usersData[userId].role === 'patient')
                .map(userId => ({
                    id: userId,
                    name: usersData[userId].name,
                    email: usersData[userId].email,
                    clinicDate: usersData[userId].clinicDate
                }));
            
            return patients;
        } else {
            return [];
        }
    } catch (err) {
        console.error("Error fetching patients:", err);
        return [];
    }
};

export const updateClinicDate = async (userId, newClinicDate) => {
    try {
        const app = getFirebaseApp();
        const dbRef = ref(getDatabase(app));
        const userRef = child(dbRef, `user/${userId}`);
        
        const snapshot = await get(userRef);
        const userData = snapshot.val();

        const updatedDates = userData.clinicDates ? [...userData.clinicDates, newClinicDate] : [newClinicDate];

        await update(userRef, { clinicDates: updatedDates });
        console.log(`Clinic date updated for user ${userId}`);
    } catch (err) {
        console.error("Error updating clinic date:", err);
    }
};

export const getUserClinicDates = async (userId) => {
    try {
      const app = getFirebaseApp();
      const dbRef = ref(getDatabase(app));
      const userRef = child(dbRef, `user/${userId}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();
      return userData.clinicDates || [];
    } catch (err) {
      console.error("Error fetching user clinic dates:", err);
      return [];
    }
  };