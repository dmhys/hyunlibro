+++
date = 2025-03-21T14:11:41+09:00
lastmod = ""
draft = true

title = "공간 시각 지능의 시대가 다가왔다"
summary = "SFM 필드에서의 공간 시각 지능의 부상"

isCJKLanguage = true

tags = ["sfm", "colmap",]
categories = ["academic"]

+++

제목|내용|설명|
|------|---|---|
|테스트1|테스트2|테스트3|
|테스트1|테스트2|테스트3|
|테스트1|테스트2|테스트3|


Introduction ==============================================
- 최근의 변화
  - 흥미로운 cv task들
  - 그중 관심을 받지 못하던 task - 사실 아직도 이름이 제대로 정해져있지 않음.
  - 초기엔 feature matching task로 꽤 유명했는데, 2020~2024쯤에 뜸했음.
  - 최근 이 필드가 드디어 유의미하게 극복되려 하고 있다. 아니, 되었다.
  - 2020~2024까지 뭐가 달라졌느냐? -> transformer의 등장으로 backbone이 튼튼해졌음. 그리고 attention mechanism이 inter-image간에 이득을 잘 보게 해주는것같음.
  - 기법들이 발전하고, 사람들이 어떤 prior knowledge를 사용하는 것에 더 익숙해진 것 같음.
  - 그와 동시에 흥미로운 직관이 따라옴->  multi-modal knowledge가 도움이 실제로 된다!
  - 슬슬 통합 공간 지능이 나올 시점이라 생각했음. shape of motion 같은 paper에서 3차원 시각 지능을 가져가서 TAP의 성능을 끌어올리는 것을 보면서. 최근 나온 paper DUNE과 VGGT가 해당 영역의 가능성을 보여주고 있음.

- 지금까지 view synthesis field의 변화
  - novel view synthesis - 과거엔 view interpolation이라고 자주 불리던 필드 / light field (ray정의) -> camera pose / K / D 필요.
  - 그와 비슷한 관점에서, implicit representation 으로 인해 NeRF의 등장 (이도 바로 된건 아니고, neural net안에 scene을 넣으려는 다른 시도들이 있긴했다.)
  - 그러나 rendering을 하려면 sampling해야함 -> 당연히 느림. GS의 등장으로 인해 속도가 빨라짐
  - 병목 : colmap - 최소 30분.

- 최근의 변화
  - 이걸 잔뜩 같이 넣으니 시각적 지능이 향상되는 느낌이 난다.
  - VGGT와 DUNE이 같은 결과를 보고함
  - 거대 시각 지능 모델이 등장 가능해지는가?

- 목차
  - depth network와 SFM에 대해 대충 얘기한다.
  - 그다음 sfm network흐름과, 그안에 MAST3R에 대해 담아보고
  - 마지막으로 VGGT와 DUNE에 대해 얘기해본다.
  - 그리고 왜 depth network보다 capacitance가 큰 네트워크라고 생각하는지에 대해 사견을 풀어보겠다.

Depth Network =============================================
- 기존의 대략적인 흐름
  - mono depth
  - depth 센서의 한계
  - synthetic data의 약진

- 카메라의 종류에 따라 사실은 영향
  - 카메라 파라미터가 뭐냐?
  - 그걸 같이 풀어버리려는 시도도 많았음
  - 대충 예시

- 결국은 depth를 학습한다는건 distortion은 무시하게 되는 결과를 내뱉는것
  - 어쨌던, 모델은 나름대로의 시각적 reasoning을 가지고 데이터를 intrinsic을 정제해 가져갈 수 있다.
  - 그런점에서, 오히려 depth 를 예측한다는 것은 머리가 아픔. 왜냐? ray 부터가 잘못되어있기 때문에, depth도 이상하게 학습할 수 있다.

SFM brief recap ===========================================
- SFM이 무엇이냐? - photometry
- sfm의 파이프라인
  - feature matching
  - Essential matrix 혹은 Homography이용
  - incremental / hierarchical sfm
  - glomap이 등장

Neural SFM ===============================================
- 왜 하냐? colmap이 개거슬림
- Neural aided SFM
- Nerual SFM

DUST3R ====================================================
- point map을 직접학습한다!


공간지능 ===================================================
- 본질적으로 같은 loss를 여러가지 방법으로 따로 전달해주는것 -> 실제 어떤 우리가 확실히 알고있는 model을 neural net안에 넣는데에 도움이 된다.
- Multi modal task자체가 도움이 됨
- Dino feature visualize에서 나오는 직관

## Introduction
 
 


  - 흥미로운 cv task들
  - 그중 관심을 받지 못하던 task - 사실 아직도 이름이 제대로 정해져있지 않음.
  - 초기엔 feature matching task로 꽤 유명했는데, 2020~2024쯤에 뜸했음.
  - 최근 이 필드가 드디어 유의미하게 극복되려 하고 있다. 아니, 되었다.

  - 2020~2024까지 뭐가 달라졌느냐? -> transformer의 등장으로 backbone이 튼튼해졌음. 그리고 attention mechanism이 inter-image간에 이득을 잘 보게 해주는것같음.
  - 기법들이 발전하고, 사람들이 어떤 prior knowledge를 사용하는 것에 더 익숙해진 것 같음.
  - 그와 동시에 흥미로운 직관이 따라옴->  multi-modal knowledge가 도움이 실제로 된다!
  - 슬슬 통합 공간 지능이 나올 시점이라 생각했음. shape of motion 같은 paper에서 3차원 시각 지능을 가져가서 TAP의 성능을 끌어올리는 것을 보면서. 최근 나온 paper DUNE과 VGGT가 해당 영역의 가능성을 보여주고 있음.
  
### 
