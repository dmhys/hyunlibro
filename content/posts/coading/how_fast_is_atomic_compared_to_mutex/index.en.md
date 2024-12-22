+++
date = 2022-02-06T13:52:00+09:00
lastmod = ''
draft = false

title = "How fast is Atomic compared to mutex?"
summary = ""

isCJKLanguage = false

tags = ["c++", "multithread"]
categories = ["coading"]

+++

### Test Goal

- How fast is Atomic compared to mutex?

- When using a mutex, is the overhead of `lock_guard` significant?

- When using atomic, is there any meaningful benefits with `memory_order_relaxed`?

### Settings

```cpp
void workerWithLock(int work_count, int work_size) {
  thread_local mt19937 gen(random_device{}());
  thread_local normal_distribution<float> nd(0, 10);

  for (int i = 0; i < work_count; i++) {
    int work = 0;
    for (int j = 0; j < work_size; j++)
      work += static_cast<int>(nd(gen));

    mtx.lock();
    critical_data += work;
    mtx.unlock();
  }
}
```

In this manner, I placed the RNG in `thread_local`, and used two parameters, which is `work_count` and `work_size`. The conditions were the following four.

- mutex self lock & unlock

- manage mutex with `lock_guard`

- atomic add with default `memory_order_seq_cst`

- atomic add with `memory_order_relaxed`

&nbsp;


```cpp
// test code
void test(int work_count, int work_size) {
  cout << "work count : " << work_count << \
        " / work size : " << work_size << endl;

  Stopwatch t1;
  thread thread1(workerWithLock, work_count, work_size);
  thread thread2(workerWithLock, work_count, work_size);
  thread1.join();
  thread2.join();
  cout << "    with mutex : " << t1.toc() << "ms" << endl;
  ...
```

For each test, I created two contesting workers.  `work_size` represents the amount of work that can be done without contention at one time, so the smaller the `work_size`, the more frequently contention occurs.  To keep the total time relatively uniform, `work_count` was added. The compilation was done with the `O3` flag.


### Result

###### work_size is big.

```bash
work count : 100 / work size : 100000
    with mutex : 105.623ms
    with lockguard : 105.629ms
    with atomic : 105.555ms
    with atomic Relaxed : 106.172ms
```

###### work_size is small

```bash
work count : 2000000 / work size : 5
    with mutex : 262.214ms
    with lockguard : 260.848ms
    with atomic : 120.265ms
    with atomic Relaxed : 120.621ms
```

###### Whole results
```bash
Lock free atomic is supported
More work count - more race condition
==============================================
work count : 100 / work size : 100000
    with mutex : 105.623ms
    with lockguard : 105.629ms
    with atomic : 105.555ms
    with atomic Relaxed : 106.172ms
==============================================
work count : 1000 / work size : 10000
    with mutex : 106.651ms
    with lockguard : 105.044ms
    with atomic : 108.993ms
    with atomic Relaxed : 105.876ms
==============================================
work count : 10000 / work size : 1000
    with mutex : 105.706ms
    with lockguard : 106.616ms
    with atomic : 106.648ms
    with atomic Relaxed : 106.754ms
==============================================
work count : 100000 / work size : 100
    with mutex : 107.912ms
    with lockguard : 109.505ms
    with atomic : 107.884ms
    with atomic Relaxed : 106.551ms
==============================================
work count : 1000000 / work size : 10
    with mutex : 166.493ms
    with lockguard : 165.845ms
    with atomic : 117.055ms
    with atomic Relaxed : 117.342ms
==============================================
work count : 2000000 / work size : 5
    with mutex : 262.214ms
    with lockguard : 260.848ms
    with atomic : 120.265ms
    with atomic Relaxed : 120.621ms
==============================================
work count : 10000000 / work size : 1
    with mutex : 901.735ms
    with lockguard : 905.303ms
    with atomic : 197.539ms
    with atomic Relaxed : 209.97ms
```

### Conclusions

Naturally, when the race condition is high, atomics become increasingly faster. However, when each work takes about 1ms, the difference between `mutex` and atomic wasn't that significant! Additionally, depending on the experiment, it's worth noting that the overhead of the `lock_guard` constructor and destructor is almost negligible. If there's a possibility of making mistakes, it's better to use the RAII pattern rather than managing the `mutex` directly.

Personally, I was surprised that `memory_order_relaxed` didn't provide any advantages, and in the more extreme cases below, this tendency was clear.

```bash
work count : 10000000 / work size : 1
    with mutex : 901.735ms
    with lockguard : 905.303ms
    with atomic : 197.539ms
    with atomic Relaxed : 209.97ms
```

Under extreme contention conditions, for some reason, `memory_order_relaxed` became slower...? Overall, it became slower as the race condition intensified, which needs further investigation. However, for now, it can be reasonably concluded that there's no need to use relaxed memory order for optimization even under such contention conditions.

Even when contention occurs at around 0.01ms, the mutex was surprisingly fast. The critical section isn't as expensive as expected. When dealing with sensor data in research areas at around 1000Hz, there doesn't seem to be much to worry about. While there is ample room for differences depending on the number of threads, at least in single producer-consumer scenarios, it doesn't seem significant.

1. Don't worry too much about critical sections.

2. RAII is always the right choice. Actively utilize it and use `lock_guard`.

3. Regarding the experimental results of `memory_order_relaxed`, I'm not entirely sure, but it seems acceptable to use the default value.

### Entire test code

```cpp
#include <atomic>
#include <chrono>
#include <iostream>
#include <mutex>
#include <random>
#include <thread>

using namespace std;
using namespace std::chrono_literals;

mutex mtx;
atomic<int> atomic_data{0};
int critical_data = 0.0f;

class Stopwatch {
 public:
  Stopwatch() { tic(); }

  void tic() { start = chrono::high_resolution_clock::now(); }

  // returns time elapsed, in ms as default.
  template <typename Duration = chrono::milliseconds>
  double toc() const {
    auto end = chrono::high_resolution_clock::now();
    chrono::duration<double, typename Duration::period> elapsed = end - start;
    return elapsed.count();
  }

 private:
  chrono::high_resolution_clock::time_point start;
};

void workerWithLock(int work_count, int work_size) {
  thread_local mt19937 gen(random_device{}());
  thread_local normal_distribution<float> nd(0, 10);

  for (int i = 0; i < work_count; i++) {
    int work = 0;
    for (int j = 0; j < work_size; j++) work += static_cast<int>(nd(gen));

    mtx.lock();
    critical_data += work;
    mtx.unlock();
  }
}

void workerWithLockGuard(int work_count, int work_size) {
  thread_local mt19937 gen(random_device{}());
  thread_local normal_distribution<float> nd(0, 10);

  for (int i = 0; i < work_count; i++) {
    int work = 0;
    for (int j = 0; j < work_size; j++) work += static_cast<int>(nd(gen));

    lock_guard<mutex> lock(mtx);
    critical_data += work;
  }
}

void workerWithAtomic(int work_count, int work_size) {
  thread_local mt19937 gen(random_device{}());
  thread_local normal_distribution<float> nd(0, 10);

  for (int i = 0; i < work_count; i++) {
    int work = 0;
    for (int j = 0; j < work_size; j++) work += static_cast<int>(nd(gen));

    atomic_data.fetch_add(work);
  }
}

void workerWithAtomicRelaxed(int work_count, int work_size) {
  thread_local mt19937 gen(random_device{}());
  thread_local normal_distribution<float> nd(0, 10);

  for (int i = 0; i < work_count; i++) {
    int work = 0;
    for (int j = 0; j < work_size; j++) work += static_cast<int>(nd(gen));

    atomic_data.fetch_add(work, memory_order_relaxed);
  }
}

// test code
void test(int work_count, int work_size) {
  cout << "work count : " << work_count << " / work size : " << work_size << endl;

  Stopwatch t1;
  thread thread1(workerWithLock, work_count, work_size);
  thread thread2(workerWithLock, work_count, work_size);
  thread1.join();
  thread2.join();
  cout << "    with mutex : " << t1.toc() << "ms" << endl;

  Stopwatch t2;
  thread thread3(workerWithLockGuard, work_count, work_size);
  thread thread4(workerWithLockGuard, work_count, work_size);
  thread3.join();
  thread4.join();
  cout << "    with lockguard : " << t2.toc() << "ms" << endl;

  Stopwatch t3;
  thread thread5(workerWithAtomic, work_count, work_size);
  thread thread6(workerWithAtomic, work_count, work_size);
  thread5.join();
  thread6.join();
  cout << "    with atomic : " << t3.toc() << "ms" << endl;

  Stopwatch t4;
  thread thread7(workerWithAtomicRelaxed, work_count, work_size);
  thread thread8(workerWithAtomicRelaxed, work_count, work_size);
  thread7.join();
  thread8.join();
  cout << "    with atomic Relaxed : " << t4.toc() << "ms" << endl;
}

int main() {
  if (atomic_data.is_lock_free()) cout << "Lock free atomic is supported" << endl;

  cout << "More work count - more race condition" << endl;

  cout << "==============================================" << endl;
  test(100, 100000);

  cout << "==============================================" << endl;
  test(1000, 10000);

  cout << "==============================================" << endl;
  test(10000, 1000);

  cout << "==============================================" << endl;
  test(100000, 100);

  cout << "==============================================" << endl;
  test(1000000, 10);

  cout << "==============================================" << endl;
  test(2000000, 5);

  cout << "==============================================" << endl;
  test(10000000, 1);

  return 0;
}
```