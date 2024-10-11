import { child, get, getDatabase, ref, update, push, set, remove, onValue } from "firebase/database";
import { getFirebaseApp } from "../firebaseHelper";
import { getAuth } from 'firebase/auth';

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
        .filter((userId) => usersData[userId].role === 'patient')
        .map((userId) => ({
          id: userId,
          name: usersData[userId].fullName || usersData[userId].userName || '',
          email: usersData[userId].email || '',
          nic: usersData[userId].nic || '',
          clinicDate: usersData[userId].clinicDate || '',
        }));

      return patients;
    } else {
      return [];
    }
  } catch (err) {
    console.error('Error fetching patients:', err);
    return [];
  }
};


export const AddClinicDate = async (userId, newClinicDate, doctorId, doctorName, venue, time) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));

    const userRef = child(dbRef, `user/${userId}`);
    const userSnapshot = await get(userRef);
    const userData = userSnapshot.val();

    const newClinicAppointment = {
      date: newClinicDate,
      doctor: doctorName,
      venue: venue,
      time: time
    };

    const updatedAppointments = userData?.clinicAppointments
      ? [...userData.clinicAppointments, newClinicAppointment]
      : [newClinicAppointment];

    await update(userRef, { clinicAppointments: updatedAppointments });
    console.log(`Clinic appointment updated for user ${userId}`);

    const doctorRef = child(dbRef, `user/${doctorId}/clinicDates`);

    const newDoctorAppointment = {
      patientId: userId,
      venue: venue,
      date: newClinicDate,
      time: time,
      status: false
    };

    await push(doctorRef, newDoctorAppointment);

    console.log(`Clinic appointment added under doctor ${doctorId} for date ${newClinicDate}`);

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


export const addUserNote = async (userId, date, noteText) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, `user/${userId}`);
    const snapshot = await get(userRef);
    const userData = snapshot.val();

    if (!userData.clinicAppointments) {
      throw new Error("No clinic appointments found for this user");
    }

    const appointmentIndex = userData.clinicAppointments.findIndex(
      appointment => appointment.date === date
    );

    if (appointmentIndex === -1) {
      throw new Error(`No appointment found for date ${date}`);
    }

    const newNote = { text: noteText, timestamp: Date.now() };

    if (!userData.clinicAppointments[appointmentIndex].notes) {
      userData.clinicAppointments[appointmentIndex].notes = [];
    }

    userData.clinicAppointments[appointmentIndex].notes.push(newNote);

    await update(userRef, { clinicAppointments: userData.clinicAppointments });
    console.log(`Note added for user ${userId} for date ${date}`);
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

      return notifications;
    } else {

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

  } catch (err) {
    console.error("Error updating news feed item:", err);
    throw err;
  }
};

// Doctor
export const fetchClinicDates = async (doctorId) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const doctorRef = child(dbRef, `user/${doctorId}/clinicDates`);

    const snapshot = await get(doctorRef);

    const dates = snapshot.val() || {};
    const formattedDates = {};

    Object.keys(dates).forEach(key => {
      const date = dates[key].date;
      formattedDates[date] = { marked: true };
    });

    return formattedDates;
  } catch (error) {
    console.error('Error fetching clinic dates:', error);
    return {};
  }
};

export const fetchAppointmentsForToday = async (setAppointments) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const userId = currentUser ? currentUser.uid : null;

  if (!userId) {
    console.log("User ID is not available");
    return;
  }

  try {
    const db = getDatabase();
    //const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    const tomorrow = new Date(yesterday);
    tomorrow.setDate(yesterday.getDate() + 1);
    const today = tomorrow.toISOString().split('T')[0];

    const dateRef = ref(db, `user/${userId}/clinicDates/`);
    const snapshot = await get(dateRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const todayAppointments = Object.entries(data).filter(([key, d]) => d.date === today);

      if (todayAppointments.length > 0) {
        const appointmentPromises = todayAppointments.map(async ([key, appointment]) => {
          const patientName = await fetchPatientName(appointment.patientId);
          return {
            id: appointment.patientId,
            name: patientName,
            time: appointment.time,
            venue: appointment.venue,
            date: appointment.date,
            status: appointment.status || false,
            key: key,
          };
        });
        const resolvedAppointments = await Promise.all(appointmentPromises);
        setAppointments(resolvedAppointments);
      } else {
        setAppointments([]);
      }
    } else {

      setAppointments([]);
    }
  } catch (error) {
    console.error('Error fetching today\'s appointments:', error);
    setAppointments([]);
  }
};

export const fetchPatientName = async (patientId) => {
  const db = getDatabase();
  const patientRef = ref(db, `user/${patientId}`);
  const snapshot = await get(patientRef);

  if (snapshot.exists()) {
    const patientData = snapshot.val();
    return patientData.fullName || 'Name not available';
  }
  return 'Name not available';
};

export const updateStatus = async (userId, appointment, setAppointments) => {
  try {
    const db = getDatabase();
    const appointmentRef = ref(db, `user/${userId}/clinicDates/${appointment.key}`);
    await update(appointmentRef, { status: true });
    alert("Status updated to true!");

    setAppointments((appointments) =>
      appointments.map(app =>
        app.key === appointment.key ? { ...app, status: true } : app
      )
    );
  } catch (error) {
    console.error('Error updating status:', error);
  }
};

export const fetchPatientAppointments = async (patientId, date, setAppointmentKey, setPrescriptions) => {
  try {
    const db = getDatabase();
    const appointmentRef = ref(db, `user/${patientId}/clinicAppointments/`);
    const snapshot = await get(appointmentRef);

    if (snapshot.exists()) {
      const appointments = snapshot.val();
      const matchingAppointment = Object.entries(appointments).find(([key, appointment]) =>
        appointment.date === date
      );

      if (matchingAppointment) {
        const [key, appointment] = matchingAppointment;
        setAppointmentKey(key);
        setPrescriptions(appointment.prescriptions || []);
        return key;
      } else {
        console.log('No matching appointment found for the selected date');
      }
    } else {
      console.log('No appointments found for the patient');
    }
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
  }
};

export const handleAddNote = async (patientId, appointmentKey, note, diagnosis, medications, setPrescriptions) => {
  if (!appointmentKey) {
    console.error('Appointment key is not available, cannot save note');
    return;
  }

  if (note.trim() === '' || diagnosis.trim() === '' || medications.trim() === '') {
    alert('All fields are required');
    return;
  }

  try {
    const db = getDatabase();
    const prescriptionsRef = ref(db, `user/${patientId}/clinicAppointments/${appointmentKey}/doctors_prescription`);
    const newNoteRef = push(prescriptionsRef);

    const newPrescription = {
      note: note,
      diagnosis: diagnosis,
      medications: medications,
      createdAt: new Date().toISOString(),
    };

    await update(newNoteRef, newPrescription);
    setPrescriptions((prevPrescriptions) => [...prevPrescriptions, newPrescription]);
    alert('Prescription added successfully');
  } catch (error) {
    console.error('Error adding prescription:', error);
    alert('Error adding prescription');
  }
};

export const fetchDoctorPrescription = async (patientId, appointmentKey, setPrescriptions) => {
  try {
    const db = getDatabase();
    const prescriptionRef = ref(db, `user/${patientId}/clinicAppointments/${appointmentKey}/doctors_prescription`);
    const snapshot = await get(prescriptionRef);

    if (snapshot.exists()) {
      const prescriptionData = snapshot.val();
      setPrescriptions((prevPrescriptions) => [
        ...prevPrescriptions,
        ...Object.values(prescriptionData),
      ]);
    } else {
      console.log('No prescription found for this appointment');
    }
  } catch (error) {
    console.error('Error fetching doctor\'s prescription:', error);
  }
};

export const fetchClinicDatestoDoc = async (userId) => {
  const db = getDatabase();
  const doctorRef = ref(db, `user/${userId}/clinicDates/`);
  const snapshot = await get(doctorRef);
  const dates = {};
  if (snapshot.exists()) {
    const data = snapshot.val();
    Object.keys(data).forEach(key => {
      const date = data[key].date;
      if (date) {
        dates[date] = { marked: true, dotColor: 'blue' };
      }
    });
  } else {
    console.log("No clinic dates found");
  }
  return dates;
};

export const fetchPatientNamebyid = async (patientId) => {
  try {
    const db = getDatabase();
    const patientRef = ref(db, `user/${patientId}`);
    const snapshot = await get(patientRef);
    if (snapshot.exists()) {
      const patientData = snapshot.val();
      return patientData.fullName || 'Name not available';
    }
    return 'Name not available';
  } catch (error) {
    console.error('Error fetching patient name:', error);
    return 'Error fetching name';
  }
};

export const handleDatePress = async (userId, day, setAppointments) => {
  try {
    const db = getDatabase();
    const dateRef = ref(db, `user/${userId}/clinicDates/`);
    const snapshot = await get(dateRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const selectedDateAppointments = Object.values(data).filter(d => d.date === day.dateString);

      if (selectedDateAppointments.length > 0) {
        const appointmentPromises = selectedDateAppointments.map(async (appointment) => {
          const patientName = await fetchPatientNamebyid(appointment.patientId);
          return {
            id: appointment.patientId,
            name: patientName,
            time: appointment.time,
            venue: appointment.venue,
          };
        });
        const resolvedAppointments = await Promise.all(appointmentPromises);
        setAppointments(resolvedAppointments);
      } else {
        setAppointments([]);
      }
    }
  } catch (error) {
    console.error('Error fetching appointments:', error);
    setAppointments([]);
  }
};

export const fetchAppointments = (setAppointments) => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  const db = getDatabase();
  const appointmentsRef = ref(db, `user/${userId}/clinicAppointments/`);

  onValue(appointmentsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const appointmentsArray = Object.entries(data).map(([key, value]) => ({
        id: key,
        ...value
      }));
      setAppointments(appointmentsArray);
    } else {
      console.log(`No appointments found for user ${userId}`);
    }
  });
};

export const fetchPatientDetails = async (patientId) => {
  const db = getDatabase();
  const patientRef = ref(db, `user/${patientId}`);
  const snapshot = await get(patientRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    return {
      username: data.userName || '',
      dateOfBirth: data.dateOfBrirth || '',
      address: data.address || ''
    };
  } else {
    console.log('No patient data available');
    return { username: '', dateOfBirth: '', address: '' };
  }
};


export const handleEditNote = async (patientId, appointmentKey, noteId, updatedNote, updatedDiagnosis, updatedMedications) => {
  const db = getDatabase();
  const noteRef = ref(db, `user/${patientId}/clinicAppointments/${appointmentKey}/notes/${noteId}`);
  await update(noteRef, {
    note: updatedNote,
    diagnosis: updatedDiagnosis,
    medications: updatedMedications
  });
};

export const handleDeleteNote = async (patientId, appointmentKey, noteId, setPrescriptions) => {
  const db = getDatabase();
  const noteRef = ref(db, `user/${patientId}/clinicAppointments/${appointmentKey}/notes/${noteId}`);
  await remove(noteRef);

  setPrescriptions(prev => prev.filter(note => note.id !== noteId));
};

export const fetchAppointment = (patientId, setAppointments) => {
  if (!patientId) return;

  const db = getDatabase();
  const appointmentsRef = ref(db, `user/${patientId}/clinicAppointments/`);

  onValue(appointmentsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const appointmentsArray = Object.entries(data).map(([key, value]) => ({
        id: key,
        ...value
      }));
      setAppointments(appointmentsArray);
    } else {
      console.log(`No appointments found for patient ${patientId}`);
    }
  });
};

export const updatePrescription = async (patientId, appointmentKey, prescriptionId, note, diagnosis, medications) => {
  if (!appointmentKey) {
    console.error('Appointment key is not available, cannot update prescription');
    return;
  }

  if (note.trim() === '' || diagnosis.trim() === '' || medications.trim() === '') {
    alert('All fields are required');
    return;
  }

  try {
    const db = getDatabase();
    const prescriptionRef = ref(db, `user/${patientId}/clinicAppointments/${appointmentKey}/doctors_prescription/${prescriptionId}`);

    const updatedPrescription = {
      note,
      diagnosis,
      medications,
      updatedAt: new Date().toISOString(),
    };

    await update(prescriptionRef, updatedPrescription);
    alert('Prescription updated successfully');
  } catch (error) {
    console.error('Error updating prescription:', error);
    alert('Error updating prescription');
  }
};

export const fetchDoctorPrescriptions = async (patientId, appointmentKey, setPrescriptions) => {
  const db = getDatabase();
  const prescriptionRef = ref(db, `user/${patientId}/clinicAppointments/${appointmentKey}/doctors_prescription`);

  onValue(prescriptionRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const prescriptionsArray = Object.keys(data).map((key) => ({
        prescriptionId: key,
        ...data[key],
      }));
      setPrescriptions(prescriptionsArray);
    } else {
      setPrescriptions([]);
    }
  }, {
  });
};

export const getallPrescriptions = (patientId, appointmentKey, setPrescriptions) => {
  const db = getDatabase();
  const prescriptionsRef = ref(db, `user/${patientId}/clinicAppointments/${appointmentKey}/doctors_prescription`);

  const unsubscribe = onValue(prescriptionsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const prescriptionList = Object.entries(data).map(([key, value]) => ({
        prescriptionId: key,
        ...value,
      }));
      setPrescriptions(prescriptionList);
    } else {
      setPrescriptions([]);
    }
  });

  return unsubscribe;
};

export const deletePrescription = async (patientId, appointmentKey, prescriptionId) => {
  const db = getDatabase();
  const prescriptionRef = ref(db, `user/${patientId}/clinicAppointments/${appointmentKey}/doctors_prescription/${prescriptionId}`);

  try {
    await remove(prescriptionRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting prescription:", error);
    return { success: false, error };
  }
};

export const fetchPrescriptions = (patientId, appointmentKey, setPrescriptions) => {
  const db = getDatabase();
  const prescriptionsRef = ref(db, `user/${patientId}/clinicAppointments/${appointmentKey}/doctors_prescription`);

  const unsubscribe = onValue(prescriptionsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const prescriptionList = Object.entries(data).map(([key, value]) => ({
        prescriptionId: key,
        ...value,
      }));
      setPrescriptions(prescriptionList);
    } else {
      setPrescriptions([]);
    }
  });

  return unsubscribe;
};

export const savePrescription = async (patientId, appointmentKey, prescriptionId, updatedData) => {
  const db = getDatabase();
  const prescriptionRef = ref(db, `user/${patientId}/clinicAppointments/${appointmentKey}/doctors_prescription/${prescriptionId}`);

  try {
    await update(prescriptionRef, updatedData);
  } catch (error) {
    console.error('Error updating prescription:', error);
    throw error;
  }
};

export const getUsersByRole = async (role) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const usersRef = child(dbRef, 'user');

    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      const usersData = snapshot.val();
      const usersByRole = Object.keys(usersData)
        .filter(userId => usersData[userId].role === role)
        .map(userId => ({
          id: userId,
          username: usersData[userId].userName,
          name: usersData[userId].fullName,
          email: usersData[userId].email,
          phoneNumber: usersData[userId].phoneNumber,
          role: usersData[userId].role,
          address: usersData[userId].address,
          dateOfBirth: usersData[userId].dateOfBirth,
        }));

      return usersByRole;
    } else {
      return [];
    }
  } catch (err) {
    console.error(`Error fetching ${role}s:`, err);
    return [];
  }
};

export const saveUser = async (user, username, email, phoneNumber, address) => {
  try {
    if (user) {
      const app = getFirebaseApp();
      const dbRef = ref(getDatabase(app));
      const userDocRef = child(dbRef, `user/${user.id}`);

      await update(userDocRef, {
        userName: username,
        email: email,
        phoneNumber: phoneNumber,
        address: address
      });

      console.log('User updated:', user.id);
    } else {
      console.error('No user provided for update');
    }
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUserNote = async (userId, appointmentId, noteId) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, `user/${userId}`);

    const snapshot = await get(userRef);
    const userData = snapshot.val();

    const appointmentIndex = userData.clinicAppointments.findIndex(
      appointment => appointment.id === appointmentId
    );

    if (appointmentIndex === -1) {
      throw new Error("Appointment not found");
    }

    const appointment = userData.clinicAppointments[appointmentIndex];

    if (appointment.notes) {
      const noteIndex = appointment.notes.findIndex(note => note.id === noteId);
      if (noteIndex !== -1) {
        appointment.notes.splice(noteIndex, 1);
      } else {
        throw new Error("Note not found in the specified appointment");
      }
    } else {
      throw new Error("No notes found for this appointment");
    }

    userData.clinicAppointments[appointmentIndex] = appointment;

    await update(userRef, { clinicAppointments: userData.clinicAppointments });

    console.log(`Note deleted for user ${userId} from appointment ${appointmentId}`);
  } catch (err) {
    console.error("Error deleting note:", err);
    throw err;
  }
};