+++
date = 2022-02-06T13:52:00+09:00
lastmod = ''
draft = false

title = "Atomic 이 mutex보다 얼마나 빠를까?"
summary = ""

isCJKLanguage = true

tags = ["multithread"]
categories = ["c++"]

+++

## Test Goal

- Mutex에 비해 atomic 변수를 쓰는게 얼마나 빠를까?

- Mutex 를 쓸 때, `lock_guard`의 overhead가 유의미한가?

- Atomic을 쓸 때, `memory_order_relaxed` 가 어떤 유의미함을 가져다주는가?

## 세팅

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

이런 식으로 난수 생성기를 `thread_local` 에 배치하고, `work_count`와 `work_size`를 입력받는다. 조건은 다음 넷이었다.

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

그리고 각각의 test는 두 개의 경합 worker를 생성한다. `work_size`는 한 번에 경합 없이 할 일이므로, `work_size`가 작을수록 경합은 자주 일어난다. 전체 시간을 어느정도 균일하게 하기 위해 `work_count`를 추가했다. 컴파일은 `O3` 플래그를 제공했다.


## 결과

#### work_size가 클 때

```bash
work count : 100 / work size : 100000
    with mutex : 105.623ms
    with lockguard : 105.629ms
    with atomic : 105.555ms
    with atomic Relaxed : 106.172ms
```

#### work_size가 작을 때

```bash
work count : 2000000 / work size : 5
    with mutex : 262.214ms
    with lockguard : 260.848ms
    with atomic : 120.265ms
    with atomic Relaxed : 120.621ms
```

#### 전체

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

## 결론

당연하지만, race가 클 때는 atomic이 점점 빨라진다. 그런데 work 하나에 1ms정도 걸릴 때, mutex와 atomic의 차이가 그리 크지 않았다! 또 실험 따라 다르겠지만, `lock_guard`의 생성자-소멸자 오버헤드가 거의 존재하지 않는 것도 알아둘만 하다. 기왕 실수할 여지가 있으면, `mutex`를 직접 관리하기보단 RAII 패턴을 쓰는게 맞다.

개인적으론 `memory_order_relaxed`가 어떠한 이점도 가져다주지 못한 점이 놀라운데, 아래 더 극단적인 케이스에서도 이 경향성은 뚜렷했다.

```bash
work count : 10000000 / work size : 1
    with mutex : 901.735ms
    with lockguard : 905.303ms
    with atomic : 197.539ms
    with atomic Relaxed : 209.97ms
```

극단적인 경합조건에서 어째서인지 `memory_order_relaxed`가 더 느려졌다...? 전체적으로 race가 심해질 때 더 느려진건데, 이는 더 살펴봐야하긴 할 것 같지만 우선은 이런 경합조건에서도 굳이 최적화를 위해 relaxed memory order를 사용할 필요는 없다는 것으로 적당히 결론 내려도 될 것 같다.

0.01ms정도 단위에서 경합이 일어나도 mutex가 생각보다 빨랐다. 생각보다도 더욱 임계영역이 비싸지 않다. 연구영역에서 센서 데이터를 다룰 때 1000hz정도에서도 크게 조심할 것은 없어 보인다. 쓰레드 숫자 따라서 더 차이가 날 여지는 충분하지만, 적어도 단일 생산-단일 소비에선 중요하지 않아 보인다.

1. 임계영역은 크게 신경쓰지 말자.

2. RAII는 언제나 옳다. 적극적으로 활용하고 `lock_guard`를 사용하자.

3. `memory_order_relaxed`의 실험결과에 대해선 잘 모르겠지만, 그냥 기본 값을 써도 될거같다.

## 전체 실험 코드

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