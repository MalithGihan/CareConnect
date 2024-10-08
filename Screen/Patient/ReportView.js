import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { getAuth } from 'firebase/auth';

const ReportView = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserId(currentUser.uid);
    }
  }, []);

  const qrCodeValue = userId ? `user/${userId}/clinicAppointments/` : null;

  useEffect(() => {
    if (qrCodeValue) {
      console.log('QR Code Value:', qrCodeValue);
    }
  }, [qrCodeValue]);

  return (
    <View style={styles.container}>
      {qrCodeValue && (
        <View style={styles.qrCodeContainer}>
          <Text style={styles.qrCodeText}>Share Medical History:</Text>
          <QRCode
            value={qrCodeValue}
            size={150}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  qrCodeContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  qrCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default ReportView;
