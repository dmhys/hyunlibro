+++
date = 2026-09-11T16:33:05+09:00
lastmod = ''
draft = true

title = "정보의 최적화 - 코딩의 원칙"
summary = "좋은 코드란 당연한 것이 당연한 곳에 있는 코드다. "
description = ""

isCJKLanguage = true

tags = ["essay", "programming", "abstraction", "code quality", "refactoring",]
categories = ["essays"]

+++

프로그램이란 나열된 행동 지침이다. 그러면 이 행동지침이 좋은지 나쁜지 어떻게 판별 가능할까?

예를 들어 적도에서 극지방으로 갈수록 추워지는건 당연한 사실이다. 그 사이 온도는 다소의 변동은 있을 수 있지만, 기본적으론 연속적으로 분포할 것이다. 그런데 사막 한복판에, 갑자기 커다란 얼음이 있다고 해보자. 어? 우리는 이 순간 의외성을 느끼고, 호기심이 생긴다. 이는 좋은 스토리텔링이다. 그런데 **이 좋은 스토리텔링이 좋은 코딩은 아니다.** 코딩은 소설이 아니기 때문이다.

좋은 코딩이란 의외성이 없는 것이다. 그냥 모래 언덕이 있는 사막이 바로 좋은 코딩이다. 얼음은 있을 필요가 없다. 그냥 우리가 의식하지 않아도, 그냥 관념적으로 당연한 것을 의미한다. 우리 인지자원은 슬프게도 한정되어있고 컨텍스트를 잃어버리면 복원하는 데 한참 걸리기 때문에, 이런 인지자원을 낭비하는 코드는 그 자체로 코드의 이해를 방해한다. 즉, 좋은 코드란 의외성이 있지 않고, 별 생각 안 해도 너무 **당연한 것이 당연한 곳에 있는** 것을 의미한다.

어떠한 행동지침(정보)이 당연히 있어야 할 곳에 있도록 정리정돈이 잘된 코드가 좋은 코드이다. 국자는 주방에서 찾고, 책은 서재, 더 나아가서 책장에서 찾는게 당연하듯이 말이다. 그런데 코딩이란 행동에 한해, 정보가 있어야 할 곳이란 어디를 의미하는가? 우선 정보가 어디에 있는지 정의하기 전에, 우리는 '어디'를 어떻게 정의할 것인가 생각해야 한다.

이런 관점에서, 정보의 위치는 다음 세 가지 축으로 정의 가능하다.

1. Vertical - 순차적. 시계열적으로, 위아래로 진행되는 거리.
2. Horizontal - 공간적. 다른 모듈/클래스/함수.
3. Depth - 추상적. 얼마나 추상화 정도가 차이 나는지.

이제 이 세 가지 축이 어떻게 작용하는지, 유사한 정보가 이 세 축에 따라 어떻게 위치해야 편해지는지 구체적 예시로 살펴보자.

## Vertical

우선 다음 코드로 예제를 시작해보자. 코드 자체가 좀 buggy한건 넘어가길 바란다...(주문 체결 이전 시점에 정보수정이 들어간 점이라든가.)

```cpp
void processOrder(Order& order)
{
    if (order.items.empty())
        throw InvalidOrder{};

    double total = 0.0;

    for (const auto& item : order.items) {
        if (item.quantity <= 0)
            throw InvalidOrder{};

        if (item.unit_price < 0.0)
            throw InvalidOrder{};

        total += item.unit_price * item.quantity;
    }

    if (order.customer_id.empty())
        throw InvalidOrder{};

    if (!order.coupon_code.empty()) {
        auto it = coupons.find(order.coupon_code);

        if (it != coupons.end())
            total *= (1.0 - it->second.discount_rate);
    }

    if (order.shipping_address.empty())
        throw InvalidOrder{};

    for (const auto& item : order.items) {
        if (inventory[item.product_id] < item.quantity)
            throw OutOfStock{};

        inventory[item.product_id] -= item.quantity;
    }

    order.total_price = total;

    std::ofstream file("orders/" + order.id + ".txt");
    file << order.customer_id << '\n';
    file << order.shipping_address << '\n';
    file << order.total_price << '\n';

    for (const auto& item : order.items)
        file << item.product_id << ' ' << item.quantity << '\n';
}
```

코드란 위에서 아래로 순차적으로 내려오면서 실행된다. 그런데, 이 코드는 비슷한 역할이 중간에 따로따로 떨어져있다. 자연어로 예시를 들자면 다음과 같다.

- 빛, 푸름, 사람, 예술, 사자, 붉음, 그림자, 토끼, 공학

이 정보는 취급하기가 불편하다. 순서대로 읽어도 맥락이 없기 때문이다. 반면 다음 정보는 상대적으로 편안하다. (완전히 같은 요소들을 포함함에도 불구하고.)

- 예술, 공학
- 빛, 그림자
- 사람, 사자, 토끼
- 푸름, 붉음

비슷한 정보를 범주화해서 배치하면, 우리는 이 짧은 맥락에서도 추상화를 통해 의외성을 줄일 수 있다. 이런 작업 과정을 거치면, 위의 코드는 아래와 같이 변한다.

```cpp
void processOrder(Order& order)
{
    // validity check
    if (order.items.empty())
        throw InvalidOrder{};
    if (order.customer_id.empty())
        throw InvalidOrder{};
    if (order.shipping_address.empty())
        throw InvalidOrder{};
    for (const auto& item: order.items) {
        if (item.quantity <= 0)
            throw InvalidOrder{};
        if (item.unit_price < 0.0)
            throw InvalidOrder{};
    }

    // calculate total price
    double total = 0.0;
    for (const auto& item : order.items) {
        total += item.unit_price * item.quantity;
    }

    // apply coupons
    if (!order.coupon_code.empty()) {
        auto it = coupons.find(order.coupon_code);
        if (it != coupons.end())
            total *= (1.0 - it->second.discount_rate);
    }

    // check and apply stock
    for (const auto& item : order.items) {
        if (inventory[item.product_id] < item.quantity)
            throw OutOfStock{};
        inventory[item.product_id] -= item.quantity;
    }

    order.total_price = total;

    // save to file
    std::ofstream file("orders/" + order.id + ".txt");
    file << order.customer_id << '\n';
    file << order.shipping_address << '\n';
    file << order.total_price << '\n';

    for (const auto& item : order.items)
        file << item.product_id << ' ' << item.quantity << '\n';
}
```

물론 주석 블럭을 조금 넣긴 했지만, 예외처리를 앞으로 묶어주는 것으로 조금 더 보기 편안한 코드가 되었다. 코드는 순차적으로 실행되며 일종의 맥락을 형성한다. 맥락을 무시하는 코드는 마치 ADHD식 화법과 같다. "아까 지하철에서 누가 쓰러졌더라. 오는 길에 편의점에서 음료수 사왔어. 옆에 사람들이 놀라서 난리도 아니었어."

어떻게 보면 정말 쉬워 보이는 이 행위는 실제론 생각보다 많이 무시당한다. 특히 하나의 함수에선 많이 쉽지만, 다른 API 호출까지 복합적으로 호출스택이 쌓이면 어느 순간 알게 모르게 실제로 일어난다. 당장 함수가 하나의 일을 하지 않고, 복합적인 행위를 하는 경우에 아주 흔하다.

맨 처음 코드에서, 

```cpp
    // ...
    for (const auto& item : order.items) {
        if (item.quantity <= 0)
            throw InvalidOrder{};

        if (item.unit_price < 0.0)
            throw InvalidOrder{};

        total += item.unit_price * item.quantity;
    }
    // ...
```

이 주문의 아이템을 순화하는 반복문 안의 예외처리를 만일 다른 함수로 뽑는다면? 그러면 item iteration을 두 번 돌아야 한다. 맥락이란건 원래 지역 의존적이기 때문에, 이게 또 자연스러울 수도 있다. 코딩을 하면서 이런 복합 작용을 하는 코드를 짜고자 하는 유혹은 상당하고, 실제로 어떤 맥락은 지역적으로는 아주 자연스러울 수 있다. 그러나 아무리 국소적으로 자연스럽더라도, 전체적인 그림에선 전혀 아닐 수 있다. (원숭이 엉덩이는 빨개, 빨가면 사과, 사과는 맛있어)

그러면 다음 질문을 할 수 있다. 이 iteration을 두 번 도는게 성능적으로 무리가 되나? 한군데에서 여러 행동을 하는 것은 성능을 사기 위해서 vertical 방향에서 정보를 흩뿌려 놓는 행위(검증과 계산의 맥락을 뒤섞음)이다. 그 성능 최적화가 정보의 최적화를 방해할 만큼 큰 가치가 있는가? 그렇다면 분산시키는게 맞다. 아닌데도 그냥 분산시켰는가? 그러면 고쳐라. 자기 코드 프로파일링도 안 했는가? 음...

## Horizontal

Horizontal 방향으로 코드가 흩어져 있다는 것은 무엇을 의미하는가? 이는 코드의 중복과도 강하게 연관되어있긴 한데, 항상 그런 것은 아니다. 예를 들어, Order의 생명주기에 따라 각자 다른 역할을 하는 코드를 아래와 같이 작성했다고 생각해보자.

```cpp
// PaymentService.cpp
if (order.items.empty())
    throw InvalidOrder{};

// ShippingService.cpp
if (order.shipping_address.empty())
    throw InvalidOrder{};

// CouponService.cpp
for (const auto& item : order.items) {
    if (item.quantity <= 0)
        throw InvalidOrder{};
}

// CheckoutService.cpp
if (order.customer_id.empty())
    throw InvalidOrder{};

```

이 코드에선 아무 문제가 없다. 동작하는 데에 문제가 없고, 코드가 중복되지도 않았다. 모든 코드는 다르고, 각자의 로직에 필요한 구현체이다. 그러나 실제로 여기서는 *'이 주문이 유효한가?'* 라는 정보의 서로 다른 모습이 서로 다른 파일에 산재되어 존재한다. 즉, 정보가 horizontal 방향으로 흩어져있다. 주문의 유효성 검사 로직에 대해 찾아보기 위해선 InvalidOrder를 찾아서 서로 다른 파일의 서로 다른 맥락을 다 찾아봐야 하는 것이다.

```cpp
// order.h
class Order {
public:
    // ...
    bool isValid() const;
    // ...
};
```

혹은,

```cpp
void validateOrder(const Order& order)
{
    // ...
}

```

Order 자체가 validity 체크에 대한 책임을 질 것인가, 함수를 만들 것인가는 취향 차이이다. 

물론 어떤 경우엔 validity 로직이 여러 모습이 있을 수 있고, 어쩔 수 없이 흩어져 있을 수도 있다. 혹은 validity check 로직이 여러 상황에 따라 나뉘기 때문에 합치기 어려울 수 있다. 핵심은 그것을 당연히 여기기보단, 일종의 대가로 인지하는 점이다. 어떻게든 맥락상으로 자연스럽게 배치하는 대가로, 정보가 horizontal 방향으로 흩어진다는 점을 충분히 인지하고 설계를 해야 한다.

코드 중복도 이 horizontal 방향으로 정보가 흩어져 있는 데에서 나온다. 아까 위에서 봤던 코드의 가장 아랫부분, order를 파일로 저장하는 부분을 살펴보자.

```cpp
// OrderService.cpp
void processOrder(Order& order)
{
    // ...

    std::ofstream file("orders/" + order.id + ".txt");
    file << order.customer_id << '\n';
    file << order.shipping_address << '\n';
    file << order.total_price << '\n';

    for (const auto& item : order.items)
        file << item.product_id << ' ' << item.quantity << '\n';
}
```

만일 다른 모듈에 아래와 같은 코드가 있다면?

```cpp
// OrderEditService.cpp
void changeShippingAddress(Order& order,
                           const std::string& address)
{
    order.shipping_address = address;

    std::ofstream file("orders/" + order.id + ".txt");
    file << order.customer_id << '\n';
    file << order.shipping_address << '\n';
    file << order.total_price << '\n';

    for (const auto& item : order.items)
        file << item.product_id << ' ' << item.quantity << '\n';
}
```

이뿐만 아니라, `refundOrder`와 같은 함수들이 더 들어온다면? 즉, 지금 `Order`를 파일로 저장한다는 목적이 여러 군데에 있다. 코드 중복이 문제인건 당연하지만, 왜 문제인가? 이것 또한 정보가 horizontal 방향으로 전혀 정렬이 되어있지 않은 것이 문제이다. 집에 가위가 있는데, 그 가위가 어딨는지 몰라서, 혹은 가위가 좀 꺼내기 어려운 곳에 있어서 가위를 또 사는 상황이 된 것이다.

코드의 중복은 기본적인 horizontal 방향의 산포 - 하나의 정보를 여러 곳에서 인출해야 하는 문제 - 외에 하나의 문제를 더 끼얹는다. 만약 가위 손잡이가 딱딱해서 부드러운 손잡이로 교체하고 싶다고 하자. 가위가 집에 하나라면 문제가 없다. 그러나 가위가 여러 개라면 **하나를 바꾼다고 해서 다른 가위들이 자동으로 바뀌지 않는다.**

```cpp
void saveOrder(const Order& order)
{
    std::ofstream file("orders/" + order.id + ".txt");
    file << order.customer_id << '\n';
    file << order.shipping_address << '\n';
    file << order.total_price << '\n';
    file << order.refunded << '\n';

    for (const auto& item : order.items)
        file << item.product_id << ' ' << item.quantity << '\n';
}
```

함수를 만든다면 위 코드 중복은

```cpp
// OrderService.cpp
void processOrder(Order& order)
{
    // ...
    saveOrder(order);
}

// OrderEditService.cpp
void changeShippingAddress(Order& order,
                           const std::string& address)
{
    order.shipping_address = address;
    saveOrder(order);
}
```

와 같이 정리 가능하다. 물론 Order class에 save 메소드를 만들 수도 있고, 그건 이제 취향과 설계의 영역이다.

정보는 본질적으로 단일이다. 사본이란 언제나 redundant하다. 물론 비슷해 보여도 본질적으로 다른 역할을 할 수도 있다. 원예가위를 주방가위로 쓰지 않으니까. 다만 그건 다른 일을 하는 방법이 비슷해 보이는 것이고, 본질적으로 다른 정보를 의미한다. (물론 추상화와 상속으로 비슷하게 묶을 수 있겠지만, 그건 선택의 영역이다.)

Practical한 측면에서, vertical locality가 자연스러운 맥락을 담당했다면, horizontal locality는 정보의 인출/편집 난이도를 담당한다.

## Depth

추상화는 이 세 가지 축 중에서 가장 달성하기가 어렵고, 가장 많이 간과당하는 대상이다. 왜냐하면 추상화 수준의 차이를 논하기 이전에 추상화에 대한 개념부터가 엉망이기 때문이다.

추상화란 무엇인가? 함수를 정의한다는건 추상화를 해주겠다는 의지표명이다. 추상화란 몰라도 되는 영역을 설계했다는 것을 의미한다. 좋은 인터페이스는 사용자의 이해를 최소로 요구한다. 자동차의 액셀이 좋은 예시다. 사용자는 파워트레인이나 엔진에 대한 개념을 하나도 몰라도 문제없이 자동차를 운전할 수 있다. 즉, 액셀이란 `액셀(깊이)`로 깔끔하게 정의된 인터페이스이다.

### 추상화했다는 착각

함수에 전달인자가 넘쳐나게 되면 실제론 추상화가 전혀 이루어지지 않았음에도 불구하고, 프로그래머 자신만이 추상화를 했다고 착각하고 만족하는 괴상한 구조가 된다. 강조하자면, 추상화의 가치는 더 고차원의 의미를 담고있는 블럭을 설계해서 인지자원의 최적화를 가능케 함에 있다. 따라서 인지자원의 최적화를 야기하지 못하는 추상화는 - 코드 재사용 블럭으로서의 가치까지 부정하진 않겠지만 - 추상화로서의 가치가 없다는 것이다.

예를 들자면,

```cpp
void checkoutOrder(
    Order& order,
    double tax_rate,
    double discount_rate,
    int free_shipping_threshold,
    int shipping_fee,
    Inventory& inventory,
    PaymentGateway& payment_gateway,
    const std::string& storage_path,
    int payment_retry_count)
{
    // ...
}
```

여기선 하나도 추상화가 이루어지지 않았다. 심지어 호출부를 보면 이 거지 같은 코드의 끔찍함이 더 드러난다.

```cpp
checkoutOrder(
    order,
    0.1,
    0.05,
    50000,
    3000,
    inventory,
    payment_gateway,
    "./orders",
    3);
```

주문 하나를 처리하는 쪽에서 `0.1`이 뭔지, `0.05`가 뭔지, 저장경로, 처리 재시도 횟수, 기타 디테일을 전부 이해하고 있어야 하므로, 사실상 이 함수의 디테일을 머리 안에 넣어놓고 있어야 한다. 이 과정에서 호출자가 떠안는 인지부담은 추상화와 상관없이 여전히 크다. 인간의 쥐꼬리만 한 램에 계속 저 의미 추적을 상주시켜 놔야 쓸 수 있는 인터페이스가 된다. 코드의 재사용성이라는 가치만 생각하고, 뭔가 더 작은 블럭들을 통해 더 큰 블럭을 만들 수 있는 견고한 주춧돌로서의 역할은 기대할 수 없는 코드가 되는 것이다.

이런 추상화의 함정은 교묘하게 찾아온다. 심지어는 전달인자가 적어도 맥락을 요구하는 경우엔 실패한 추상화라고 할 수 있다. 단 두 가지 전달인자를 가지고도 추상화가 실패한 예시를 들 수 있는데, 개인적으로 정말 싫어하던 `OpenCV`에서의 `imshow` 함수이다. 이 함수는 OpenCV에서 image를 시각화하는 함수인데, 문제는 함수의 시그니처가 `window_name, image` 순이었다. 초기 설계 의도는 window 관리 프로그램에 가까웠고, 이때 named window를 만들고(`cvNamedWindow(name, flags);`) 여기에 이미지를 띄울 수 있는 함수(`cvShowImage(name, image);`)가 제공되는 맥락이었다.

그런데 이건 맥락이 관여한다. 즉, 실패한 추상화다. 사용자의 의도는 이미지를 확인하는 것인데, 이 이미지를 띄울 창의 이름을 정해야 한다는 추가적인 맥락이 달라붙는다. 이 API에서 나온 `imshow`의 경우에, 마치 이미지를 보여줄 것처럼 `imshow(image)`가 상당히 자연스러움에도 불구하고, window name이 필수 전달인자이기 때문에 매번 사용자가 `imshow('image', image)` 같은 느낌으로 전달인자가 있어야 했다. 

자연스러운 image show의 호출을 자연어로 표현하자면 'show image', 아니면 'show image in the window named "image"'와 같을 것이다. 이는 각각 `imshow(image)` 혹은 `imshow(image, 'image')`로 번역가능하다. 그러나 opencv에서 요구하는건, "open window as "image" and show image" 라는 맥락이다. 이런 맥락의 injection으로 인해 다른 사람은 어떨지 몰라도 나는 `imshow(image)`로 아무 생각 없이 썼다가 컴파일 에러를 맞이하는 장면을 정말 많이 봤다. 좋은 API는 좋은 추상화에 추가적으로 정보의 자연스러운 방향까지 고려해야 한다.

추상화의 실패란 개수가 장황해서 생기기도 하지만, 내가 이 함수를 쓸 때 고려해야 하는 어떠한 자연스럽지 않은 맥락까지도 포함한 실패인 것이다. 사용하기 좋은 API는 정보의 간결함을 의미하고, 함수 이름이 길더라도 명확하게 함수 이름대로 동작을 하는 것이 맥락을 요구하는 것보다 낫다.

### 서로 다른 추상화 계층

추상화의 정의를 두었으니, 이제 정보의 locality를 보장해야 하는 마지막 계층인 depth의 실제 예시에 대해 살펴보자. 예를 들어, 위에서 살펴본 코드를 바탕으로 정리하면 지금까지 살펴본 예제는 다음으로 정해진다.

```cpp
void processOrder(Order& order)
{
    // validity check
    validateOrder(order);

    double total = 0.0;

    for (const auto& item : order.items)
        total += item.unit_price * item.quantity;

    if (!order.coupon_code.empty()) {
        auto it = coupons.find(order.coupon_code);

        if (it != coupons.end())
            total *= (1.0 - it->second.discount_rate);
    }

    for (const auto& item : order.items) {
        if (inventory[item.product_id] < item.quantity)
            throw OutOfStock{};

        inventory[item.product_id] -= item.quantity;
    }

    order.total_price = total;

    saveOrder(order);
}
```

여기선 추상화된 계층이 차이가 난다. 즉, 몇몇 부분들이 추상화가 되었지만, 몇몇 부분은 추상화가 끝나지 않아서 추상화 레벨이 다르다. 인간은 맥락 복원 능력이 뛰어나기 때문에 지금까지 문제를 못 느꼈던 사람도 있을 수 있는데, 이 코드 내의 추상화 레벨을 자연언어로 표현하자면 다음과 같이 뒤죽박죽 섞여있다.

>
> 나의 하루
>
> 아침에 집에서 나와 출근하고, 근무를 하다 점심시간이 되어 회사 앞에 있는 햄버거 가게에서 9.89달러짜리 버거 세트를 소셜 미디어 행사를 통해 얻은 쿠폰을 아이폰 18의 스크린을 통해 가게 점원에게 제공하여 받은 다음, 먹고 오후 근무 후 퇴근했다.
>

즉, 어떠한 코드를 볼 때 그 코드의 레벨에 맞지 않는 맥락이 과다하게 주입된다. 잘 설계된 맥락이란 같은 추상화 레벨에서 작동해야 한다.

>
> 나의 하루
>
> 아침에 집에서 나와 출근해서, 오전근무를 하다가 점심 식사를 한 뒤, 오후 근무를 마치고 퇴근했다.
>

더 나아가

>
> 나의 점심식사
>
> 회사 앞에 있는 햄버거 가게에서 버거 세트를 할인받아 주문했다.
>

한 단계 더 들어가면

>
> 할인
>
> 9.89달러짜리 버거 세트를 소셜 미디어 행사를 통해 20% 할인받았다.
>

즉, 내가 현재 추상화 레벨에서 어떤 정보를 파악해야 하는가? 하는 것은 **사실은 상당히 한정적인 질문이다.** 우리는 일상적으로 이 판단을 한다. 마치 전체 회의에서 주니어의 구현 디테일을 한 명이 30분씩 떠들지 않는 것과 같다. 그러면 정보량이 폭발할 것이다.

따라서, 위 코드는 아래와 같이 정리함이 옳다.

```cpp
void processOrder(Order& order)
{
    validateOrder(order);
    updateTotalPrice(order);
    applyToStock(order);
    saveOrder(order);
}
```
