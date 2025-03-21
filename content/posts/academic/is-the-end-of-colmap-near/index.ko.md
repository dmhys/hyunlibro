+++
date = 2025-03-21T14:11:41+09:00
lastmod = ""
draft = true

title = "COLMAP 시대의 끝이 다가오는가? 공간 시각지능의 등장"
summary = "Network 기반 방법들의 부상"

isCJKLanguage = true

tags = ["sfm", "colmap",]
categories = ["academic"]

+++

제목|내용|설명|
|------|---|---|
|테스트1|테스트2|테스트3|
|테스트1|테스트2|테스트3|
|테스트1|테스트2|테스트3|



###

## Introduction

- 흥미로운 cv task들

- 그중 관심을 받지 못하던 task - 사실 아직도 이름이 제대로 정해져있지 않음.

- 초기엔 feature matching task로 꽤 유명했는데, 2020~2024쯤에 뜸했음.

- 최근 이 필드가 드디어 유의미하게 극복되려 하고 있다.

### why colmap?

- 최근 novel view synthesis - 과거엔 view interpolation이라고 자주 불리던 필드-> camera pose / K / D 필요.

- NeRF의 등장

- GS의 등장으로 인해 속도가 빨라짐

- 병목 : colmap - 최소 30분.

### SFM Brief recap

- SFM이 무엇이냐? - photometry

- sfm의 파이프라인

  - feature matching

  - Essential matrix 혹은 Homography이용

  - incremental / hierarchical SLAM

### 최근의 변화

- 2020~2024까지 뭐가 달라졌느냐? -> transformer의 등장으로 backbone이 튼튼해졌음. 그리고 attention mechanism이 inter-image간에 이득을 잘 보게 해주는것같음.

- 기법들이 발전하고, 사람들이 어떤 prior knowledge를 사용하는 것에 더 익숙해진 것 같음.

- 슬슬 통합 공간 지능이 나올 시점이라 생각했음. shape of motion 같은 paper에서 3차원 시각 지능을 가져가서 TAP의 성능을 끌어올리는 것을 보면서. 최근 나온 paper DUNE과 VGGT가 해당 영역의 가능성을 보여주고 있음.

- 이에 글을 작성

- 이 글에서 다룰 paper들

## 비교 정의

### 어디부터 어디까지 neural net인가?

### task에 어떤식으로 접근했는가?

## Papers Review


어떤 측면을 review해야하는가?

어디서부터 어디까지 neural net으로 했는가?

어떤 접근방식을 취했는가?


