import { child,get,getDatabase,ref , update ,push} from "firebase/database";
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
  
  export const updateClinicDateNotes = async (userId, clinicDate, note) => {
    try {
      const app = getFirebaseApp();
      const dbRef = ref(getDatabase(app));
      const userRef = child(dbRef, `user/${userId}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();
  
      const updatedDates = userData.clinicDates
        ? userData.clinicDates.map((dateObj) =>
            dateObj.date === clinicDate ? { ...dateObj, note } : dateObj
          )
        : [{ date: clinicDate, note }];
  
      await update(userRef, { clinicDates: updatedDates });
      console.log(`Clinic date and note updated for user ${userId}`);
    } catch (err) {
      console.error("Error updating clinic date and note:", err);
    }
  };

  export const updateAndFetchClinicDates = async (userId, newClinicDate) => {
    try {
      await updateClinicDate(userId, newClinicDate);
      return await getUserClinicDates(userId);
    } catch (error) {
      console.error("Error updating and fetching clinic dates:", error);
      throw error;
    }
  };

  export const saveUserNote = async (userId, date, note) => {
    try {
      const app = getFirebaseApp();
      const dbRef = ref(getDatabase(app));
      const userRef = child(dbRef, `user/${userId}/notes/${date}`);
      
      await update(userRef, { note });
      console.log(`Note saved for user ${userId} on date ${date}`);
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };
  

  export const addUserNote = async (userId, date, note) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userNotesRef = child(dbRef, `user/${userId}/notes/${date}`);
    
    // Push the new note to create a unique key
    const newNoteRef = push(userNotesRef);
    await update(newNoteRef, { text: note, timestamp: Date.now() });
    
    console.log(`Note added for user ${userId} on date ${date}`);
  } catch (err) {
    console.error("Error adding note:", err);
  }
};

export const getUserNotes = async (userId) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userNotesRef = child(dbRef, `user/${userId}/notes`);
    const snapshot = await get(userNotesRef);
    const notesData = snapshot.val();
    return notesData || {};
  } catch (err) {
    console.error("Error fetching user notes:", err);
    return {};
  }
};