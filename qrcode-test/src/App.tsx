import React, { useCallback, useEffect, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/library';
import { Button, message, Modal } from 'antd';
import Vconsole from 'vconsole';

const { info } = Modal;
const vconsole = new Vconsole();

const App: React.FC = () => {
  const [scanVisable, setScanVisable] = useState<boolean>(false);
  const [reader, setReader] = useState();
  const [deviceID, setDeviceID] = useState();

  const [err, setErr] = useState();
  const [result, setResult] = useState();

  const initReader = useCallback(() => {
    const codeReader = new BrowserQRCodeReader();

    return codeReader
      .getVideoInputDevices()
      .then((videoInputDevices) => {
        if (videoInputDevices.length <= 0) {
          throw Error('妹找到摄像头啊');
        }
        console.log(videoInputDevices);
        const userAgent = navigator.userAgent.toLowerCase();

        if (userAgent.includes('android')) {
          return {
            videoDeviceID: videoInputDevices[1].deviceId,
            codeReader,
          };
        } else if (userAgent.includes('iphone')) {
          return {
            videoDeviceID: videoInputDevices[0].deviceId,
            codeReader,
          };
        } else {
          return {
            videoDeviceID: videoInputDevices[0].deviceId,
            codeReader,
          };
        }
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
    const a = codeReader.decodeFromInputVideoDevice(selectedDeviceId, 'video');
    info({
      content: <video id='video' width='100%' height='100%' style={{}} />,
      mask: true,
      icon: null,
      okText: '关闭',
      okType: 'default',
      onOk: () => {
        codeReader.reset();
      },
    });
    a.then((result: any) => {
      if (result) {
        message.success('扫码成功');
        setResult(result.text);
        codeReader.reset();
        Modal.destroyAll();
      }
    }).catch((err: any) => {
      setErr(err.toString());
    });
  };
  return (
    <div className='App'>
      <div className='container' style={{ textAlign: 'center', width: '100%' }}>
        <div>
          <Button style={{ margin: '30px' }} size='large' color='primary' onClick={() => decode(reader, deviceID)}>
            扫一扫
          </Button>
        </div>
      </div>
      <div>{result}</div>
      <div>{err}</div>
    </div>
  );
};

export default App;
