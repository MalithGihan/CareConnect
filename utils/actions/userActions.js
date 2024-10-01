import { child, get, getDatabase, ref, update, push, set } from "firebase/database";
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

export const AddClinicDate = async (userId, newClinicDate, doctor, venue, time) => {
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

//
export const CreateDateSlots = async (date, timeSlots) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));

    const dateSlotRef = child(dbRef, `dateSlots/${date}`);

    const snapshot = await get(dateSlotRef);
    const existingSlotData = snapshot.val();

    if (existingSlotData && existingSlotData.timeslots) {
      const updatedTimeSlots = [...new Set([...existingSlotData.timeslots, ...timeSlots])];
      await update(dateSlotRef, { timeslots: updatedTimeSlots });
      console.log(`Time slots for ${date} updated successfully`);
    } else {

      await set(dateSlotRef, { timeslots: timeSlots });
      console.log(`Date slot added on ${date}`);
    }
    return date;
  } catch (err) {
    console.error("Error adding date slot:", err);
    throw err;
  }
};


export const getDateSlots = async () => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const dateSlotsRef = child(dbRef, 'dateSlots');

    const snapshot = await get(dateSlotsRef);
    const dateSlotsData = snapshot.val();

    if (!dateSlotsData) {
      throw new Error(`No date slots found`);
    }

    return dateSlotsData;
  } catch (err) {
    console.error("Error getting date slots:", err);
    throw err;
  }
};


export const deleteDateSlot = async (dateSlotId) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const dateSlotRef = child(dbRef, `dateSlots/${dateSlotId}`);

    await update(dateSlotRef, null);
    console.log(`Date slot ${dateSlotId} deleted`);
  } catch (err) {
    console.error("Error deleting date slot:", err);
    throw err;
  }
};



export const blockTimeSlot = async (date, time) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const dateSlotRef = child(dbRef, `dateSlots/${date}`);

    const snapshot = await get(dateSlotRef);
    const existingSlotData = snapshot.val();
    console.log("Existing Slot Data:", existingSlotData);

    if (existingSlotData && existingSlotData.timeslots && existingSlotData.timeslots.timeslots) {
      const updatedTimeSlots = existingSlotData.timeslots.timeslots.map(slot => {
        if (slot.time === time) {
          return { ...slot, booked: true };
        }
        return slot;
      });
      await update(dateSlotRef, { timeslots: { timeslots: updatedTimeSlots } });
      console.log(`Time slot ${time} has been booked for date ${date}.`);
    } else {
      console.log(`No existing time slots found for date ${date}.`);
    }
  } catch (error) {
    console.error('Error blocking time slot:', error);
    throw new Error('Failed to block time slot');
  }
};

export const sendUserNotification = async (userId, notification) => {
  try {
    const db = getDatabase(getFirebaseApp());
    const notificationsRef = ref(db, `user/${userId}/notifications`);

    await push(notificationsRef, notification);
    console.log(`Notification sent to user ${userId}`);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

export const getUserNotifications = async (userId) => {
  try {
    const db = getDatabase(getFirebaseApp());
    const notificationsRef = ref(db, `user/${userId}/notifications`);

    const snapshot = await get(notificationsRef);
    if (snapshot.exists()) {
      const notifications = [];
      snapshot.forEach((childSnapshot) => {
        notifications.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      console.log(`Notifications retrieved for user ${userId}:`, notifications);
      return notifications;
    } else {
      console.log(`No notifications found for user ${userId}`);
      return [];
    }
  } catch (error) {
    console.error("Error retrieving notifications:", error);
    return [];
  }
};

export const markNotificationAsRead = async (userId, notificationId) => {
  try {
    const db = getDatabase(getFirebaseApp());
    const notificationRef = ref(db, `user/${userId}/notifications/${notificationId}`);

    await update(notificationRef, { read: true });
    console.log(`Notification ${notificationId} marked as read for user ${userId}`);
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};