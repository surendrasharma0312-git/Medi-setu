import { searchHospitals } from './src/services/directoryService';

async function run() {
  console.time('warmup');
  for(let i=0; i<100; i++) {
    await searchHospitals({ query: 'general' });
  }
  console.timeEnd('warmup');

  const iters = 10000;
  console.time('searchHospitals');
  for (let i = 0; i < iters; i++) {
    await searchHospitals({ query: 'a' });
  }
  console.timeEnd('searchHospitals');
}

run();
