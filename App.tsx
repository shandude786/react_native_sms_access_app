import {View, Text, PermissionsAndroid, ScrollView} from 'react-native';
import React from 'react';
import SmsAndroid from 'react-native-get-sms-android';

type Props = {};
export interface SmsInboxMessage {
  address: string;
  body: string;
  date: number;
  read: boolean;
  seen: boolean;
  status: number;
  subject: string;
  thread_id: number;
  type: 'inbox' | 'sent' | 'draft' | 'outbox' | 'failed' | 'queued';
}
const App = (props: Props) => {
  const [messageList, setMessageList] = React.useState<SmsInboxMessage[]>([]);

  const fetchSMS = () => {
    var filter = {
      box: 'inbox',
      maxCount: 10,
    };
    SmsAndroid.list(
      JSON.stringify(filter),
      (fail: string) => {
        console.log('Failed with this error: ' + fail);
      },
      (count: any, smsList: any) => {
        console.log('Count: ', count);
        console.log('List: ', smsList);
        setMessageList(JSON.parse(smsList));
        // var arr = JSON.parse(smsList);

        // arr.forEach(function (object) {
        //   console.log('Object: ' + object);
        //   console.log('-->' + object.date);
        //   console.log('-->' + object.body);
        // });
      },
    );
  };

  const requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
      ]);

      if (
        granted[PermissionsAndroid.PERMISSIONS.READ_SMS] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.SEND_SMS] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Permission Grated', granted);
        fetchSMS();
        // Permissions granted, you can proceed to fetch SMS messages
      } else {
        console.log('Permission Denied', granted);
        // Permissions denied, handle the case where permissions are not granted
      }
    } catch (error) {
      console.log('Error', error);
      // Handle the error
    }
  };
  React.useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <View>
      {messageList.length > 0 ? (
        <View>
          <ScrollView>
            {messageList.map((mes, index) => (
              <View
                key={index}
                style={{
                  justifyContent: 'center',
                  backgroundColor: '#fff',
                  marginTop: 20,
                }}>
                <Text>{mes.address}</Text>
                <Text>{mes.body}</Text>
                <Text>-----------------------------</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      ) : (
        <Text>Error</Text>
      )}
    </View>
  );
};

export default App;
