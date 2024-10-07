import { child, get, getDatabase, ref, update, push, set, remove, addDoc } from "firebase/database";
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

export const getPatientsByClinicDate = async (date) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const usersRef = child(dbRef, 'user');
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      const usersData = snapshot.val();
      const patients = [];

      Object.keys(usersData).forEach(userId => {
        const user = usersData[userId];
        if (user.role === 'patient') {
          const clinicAppointments = user.clinicAppointments || [];
          clinicAppointments.forEach(appointment => {
            if (appointment.date === date) {
              patients.push({
                id: userId,
                name: user.name,
                email: user.email,
                clinicDate: appointment.date,
              });
            }
          });
        }
      });
      return patients;
    } else {
      return [];
    }
  } catch (err) {
    console.error("Error fetching patients for date:", err);
    return [];
  }
};

export const deleteClinicDateAndAppointments = async (selectedDate) => {
  try {
    const app = getFirebaseApp();
    const db = getDatabase(app);
    const dateSlotRef = ref(db, `dateSlots/${selectedDate}`);
    await remove(dateSlotRef);
    console.log(`Deleted dateSlot for ${selectedDate}`);

    const usersRef = ref(db, 'user');
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      const usersData = snapshot.val();

      for (const userId in usersData) {
        const user = usersData[userId];
        console.log(`Processing user: ${userId}`);

        if (user.clinicAppointments) {
          const updatedAppointments = user.clinicAppointments.filter(
            (appointment) => appointment.date !== selectedDate
          );

          console.log(`Updated appointments for user ${userId}:`, updatedAppointments);

          if (updatedAppointments.length > 0) {
            await set(ref(db, `user/${userId}/clinicAppointments`), updatedAppointments);
          } else {
            await remove(ref(db, `user/${userId}/clinicAppointments`));
          }
          console.log(`Clinic appointments updated for user ${userId}`);
        }
      }
      console.log(`Deleted clinicAppointments for ${selectedDate}`);
    } else {
      console.log("No users found in the database.");
    }
  } catch (error) {
    console.error('Error deleting clinic date and appointments:', error);
    throw error;
  }
};

export const recordCancellation = async (selectedDate, cancellationReason) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const cancellationRef = child(dbRef, 'cancellationRecords');

    const cancellationData = {
      date: selectedDate,
      reason: cancellationReason,
      cancelledAt: new Date().toISOString(),
    };
    const newCancellationRef = push(cancellationRef);

    await set(newCancellationRef, cancellationData);

    console.log('Cancellation record saved successfully:', cancellationData);

    return selectedDate;
  } catch (error) {
    console.error('Error saving cancellation record:', error);
    throw error;
  }
};

export const addNewsItem = async (title, description, date, imageUrl = null) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const newsFeedRef = child(dbRef, 'newsFeed');

    const newNewsItem = {
      title,
      description,
      date: date,
      imageUrl,  
      createdAt: Date.now()
    };

    const newNewsRef = push(newsFeedRef);
    await set(newNewsRef, newNewsItem);

    console.log("News feed item successfully added:", newNewsItem);
    return newNewsItem;
  } catch (err) {
    console.error("Error adding news feed item:", err.message);
    throw new Error("Failed to add news feed item.");
  }
};


export const fetchNewsFeed = async () => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const newsFeedRef = child(dbRef, 'newsFeed');

    const snapshot = await get(newsFeedRef);

    if (snapshot.exists()) {
      const newsFeedData = snapshot.val();
      const newsItems = Object.keys(newsFeedData).map(newsId => ({
        id: newsId,
        ...newsFeedData[newsId]
      }));

      console.log("News feed items fetched:", newsItems);
      return newsItems;
    } else {
      console.log("No news feed items found.");
      return [];
    }
  } catch (err) {
    console.error("Error fetching news feed items:", err);
    throw err;
  }
};

export const deleteNewsFeedItem = async (newsId) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const newsItemRef = child(dbRef, `newsFeed/${newsId}`);

    await remove(newsItemRef);
    console.log(`News feed item ${newsId} deleted.`);
  } catch (err) {
    console.error("Error deleting news feed item:", err);
    throw err;
  }
};

export const updateNewsFeedItem = async (newsId, updatedFields) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const newsItemRef = child(dbRef, `newsFeed/${newsId}`);

    await update(newsItemRef, updatedFields);
    console.log(`News feed item ${newsId} updated with fields:`, updatedFields);
  } catch (err) {
    console.error("Error updating news feed item:", err);
    throw err;
  }
};
