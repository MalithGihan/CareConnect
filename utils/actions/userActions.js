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

export const updateClinicDate = async (userId, newClinicDate, doctor, venue, time) => {
  try {
      const app = getFirebaseApp();
      const dbRef = ref(getDatabase(app));
      const userRef = child(dbRef, `user/${userId}`);
      
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      const newClinicAppointment = {
          date: newClinicDate,
          doctor: doctor,
          venue: venue,
          time: time
      };

      const updatedAppointments = userData.clinicAppointments 
          ? [...userData.clinicAppointments, newClinicAppointment] 
          : [newClinicAppointment];

      await update(userRef, { clinicAppointments: updatedAppointments });
      console.log(`Clinic appointment updated for user ${userId}`);
  } catch (err) {
      console.error("Error updating clinic appointment:", err);
      throw err; 
  }
};

export const getUserClinicAppointments = async (userId) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, `user/${userId}`);
    const snapshot = await get(userRef);
    const userData = snapshot.val();
    return userData.clinicAppointments || [];
  } catch (err) {
    console.error("Error fetching user clinic appointments:", err);
    throw err;
  }
};

export const updateClinicAppointmentNotes = async (userId, appointmentId, note) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, `user/${userId}`);
    const snapshot = await get(userRef);
    const userData = snapshot.val();

    const updatedAppointments = userData.clinicAppointments
      ? userData.clinicAppointments.map((appointment) =>
          appointment.id === appointmentId ? { ...appointment, note } : appointment
        )
      : [];

    await update(userRef, { clinicAppointments: updatedAppointments });
    console.log(`Clinic appointment note updated for user ${userId}`);
  } catch (err) {
    console.error("Error updating clinic appointment note:", err);
    throw err;
  }
};

export const updateAndFetchClinicAppointments = async (userId, newAppointment) => {
  try {
    await updateClinicDate(userId, newAppointment.date, newAppointment.doctor, newAppointment.venue, newAppointment.time);
    return await getUserClinicAppointments(userId);
  } catch (error) {
    console.error("Error updating and fetching clinic appointments:", error);
    throw error;
  }
};

export const saveUserNote = async (userId, appointmentId, note) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, `user/${userId}`);
    const snapshot = await get(userRef);
    const userData = snapshot.val();

    const updatedAppointments = userData.clinicAppointments.map(appointment => 
      appointment.id === appointmentId ? { ...appointment, note } : appointment
    );

    await update(userRef, { clinicAppointments: updatedAppointments });
    console.log(`Note saved for user ${userId} for appointment ${appointmentId}`);
  } catch (err) {
    console.error("Error saving note:", err);
    throw err;
  }
};

export const addUserNote = async (userId, appointmentId, noteText) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, `user/${userId}`);
    const snapshot = await get(userRef);
    const userData = snapshot.val();

    const updatedAppointments = userData.clinicAppointments.map(appointment => {
      if (appointment.id === appointmentId) {
        const newNote = { text: noteText, timestamp: Date.now() };
        const notes = appointment.notes ? [...appointment.notes, newNote] : [newNote];
        return { ...appointment, notes };
      }
      return appointment;
    });

    await update(userRef, { clinicAppointments: updatedAppointments });
    console.log(`Note added for user ${userId} for appointment ${appointmentId}`);
  } catch (err) {
    console.error("Error adding note:", err);
    throw err;
  }
};

export const getUserNotes = async (userId) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, `user/${userId}`);
    const snapshot = await get(userRef);
    const userData = snapshot.val();

    if (!userData.clinicAppointments) {
      return {};
    }

    const notes = {};
    userData.clinicAppointments.forEach((appointment, index) => {
      if (appointment.notes) {
        notes[appointment.date] = appointment.notes;
      }
    });

    return notes;
  } catch (err) {
    console.error("Error fetching user notes:", err);
    throw err;
  }
};

export const fetchDoctors = async () => {
  try {
      const app = getFirebaseApp();
      const dbRef = ref(getDatabase(app));
      const usersRef = child(dbRef, 'user');

      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
          const usersData = snapshot.val();
      
          const doctors = Object.keys(usersData)
              .filter(userId => usersData[userId].role === 'doctor')
              .map(userId => ({
                  id: userId,
                  name: usersData[userId].userName,
                  specialty: usersData[userId].specialty 
              }));
          
          return doctors;
      } else {
          return [];
      }
  } catch (err) {
      console.error("Error fetching doctors:", err);
      return [];
  }
};