import Axios from 'axios';
import { Button, Space } from 'antd';

export default function HotelListPage() {
  /*调用test接口，打印消耗的时间*/
  async function request_test() {
    const startTime = Date.now();
    const resp = await Axios.get('http://127.0.0.1:7004/test');
    console.log('request_test result:', resp.data);
    console.log(`耗时：${((Date.now() - startTime) / 1000).toFixed(2)}s`);
  }

  /*调用doubao链*/
  async function request_doubao_endpoint() {
    const resp = await Axios.post('http://127.0.0.1:7004/doubao/invoke', {
      input: { messages: [{ type: 'human', content: '写手50字的诗' }] },
      config: {},
      kwargs: {},
    });
    console.log('request_doubao_endpoint result:', resp.data);
  }

  /*调用同步阻塞接口*/
  async function syncDelay(delay = 3) {
    const resp = await Axios.get(`http://127.0.0.1:7004/sync_delay?delay=${delay}`);
    console.log('syncDelay result:', resp.data);
  }

  /*调用异步阻塞接口*/
  async function asyncDelay() {
    const resp = await Axios.get('http://127.0.0.1:7004/async_delay?delay=3');
    console.log('asyncDelay result:', resp.data);
  }

  /*同时调用“同步阻塞接口”以及“test”接口*/
  async function syncDelayAndTest() {
    syncDelay();
    request_test();
  }

  /*同时调用“异步阻塞接口”以及“test”接口*/
  async function asyncDelayAndTest() {
    asyncDelay();
    request_test();
  }

  /*同时调用“豆包”接口以及test接口*/
  async function doubaoAndTest() {
    request_doubao_endpoint();
    request_test();
  }

  return (
    <div style={{ padding: '1em' }}>
      <Space>
        <Button onClick={request_test}>调用test接口</Button>
        <Button onClick={syncDelayAndTest}>请求接口：同步阻塞、test</Button>
        <Button onClick={asyncDelayAndTest}>请求接口：异步阻塞、test</Button>
        <Button onClick={doubaoAndTest}>请求接口：doubao、test</Button>
      </Space>
    </div>
  );
}
