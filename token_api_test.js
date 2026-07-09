import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    ten_users_for_ten_seconds: {
      executor: 'constant-vus',
      vus: 10,
      duration: '10s',
    },
    five_users_for_five_seconds: {
      executor: 'constant-vus',
      vus: 5,
      duration: '5s',
      startTime: '10s',
    },
  },
  thresholds: {
    http_req_failed: ['rate==0'],
    http_req_duration: ['p(95)<1500'],
    'checks{check:status es 200}': ['rate==1'],
  },
};

const url = 'https://cursotesting.com.ar:3000/token';

const payload = JSON.stringify({
  username: 'institutoweb',
  password: 'cursoperformance',
});

const params = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export default function () {
  const res = http.post(url, payload, params);

  check(res, {
    'status es 200': (r) => r.status === 200,
    'devuelve token': (r) => {
      try {
        const body = r.json();
        return !!(body && body.token);
      } catch (e) {
        return false;
      }
    },
  });
}
