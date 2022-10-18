import React, { useCallback, useEffect, useState } from 'react';
import { BrowserQRCodeReader, QRCodeReader } from '@zxing/library';
import { Button } from 'antd'

function App() {
  const [reader, setReader] = useState();
  const [deviceID, setDeviceID] = useState();

  const [message, setMessage] = useState();
  const [result, setResult] = useState();

  const initReader = useCallback(() => {
    const codeReader = new BrowserQRCodeReader();

    return codeReader
      .getVideoInputDevices()
      .then((videoInputDevices) => {
        if (videoInputDevices.length <= 0) {
          throw Error('妹找到摄像头啊');
        }
        return {
          videoDeviceID: videoInputDevices[0].deviceId,
          codeReader,
        };
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    (async function () {
      if (!reader) {
        const { videoDeviceID, codeReader }: any = await initReader();
        setReader(codeReader);
        setDeviceID(videoDeviceID);
      }
    })();
  }, [initReader, reader]);

  const decode = (codeReader: any, selectedDeviceId: any) => {
    codeReader
      .decodeFromInputVideoDevice(selectedDeviceId, 'video')
      .then((result: any) => {
        //console.log(result);
        setResult(result.text);
      })
      .catch((err: any) => {
        setMessage(err.toString());
      });
  };

  return (
    <div className='App'>
      <div className='container' style={{ textAlign: 'center', width: '100%' }}>
        <div>
          
          <video id='video' width='200' height='200' style={{ border: '1px solid gray', margin: '30px' }} />
          <Button style={{ margin: '30px' }} size='large' color='primary' onClick={() => decode(reader, deviceID)}>
            扫一扫
          </Button>
        </div>
      </div>
      <div>{result}</div>
      <div>{message}</div>
    </div>
  );
}

export default App;
