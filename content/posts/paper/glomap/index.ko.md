+++
date = 2025-01-06T20:40:03+09:00
lastmod = ''
draft = true

title = "GLOMAP"
summary = "Revisiting colmap"

isCJKLanguage = true

tags = ["3d reconstruction","colmap","multiple view geometry","sfm",]
categories = ["paper"]

+++

### Introduction

-  SFM이라 불리는 문제들의 패러다임 : incremental / global
   -  incremental : accurate / robust하지만, 매번 새로 수행하는 스텝들로 인해 느림.
   -  global : 한번에 하고, 빠름. 더 scalable함. 그러나 accurate하지않고, 실패도 함.
-  이 페이퍼에서 저자들은 이 문제의 범인을 찾음 → global translation averaging step
-  global averaging은 orientation averaging으로인해 rotation이 확보되고 난 뒤 수행
   -  문제1. scale 모호성. 이 친구를 정렬할 때, skewed traiangle이면 상당히 scale ambiguity가 생긴다.
   -  문제2. rotation과 translation을 정확히 decompose하기 위해선 좋은 intrinsic 이 필요하다.
   -  문제3. co-linear 움직임의 경우 degenerate case가 된다. 
-  따라서 translation averaging, triangulation step 대신, 여기선 joint하게 푼다. 
-  

SFM 쉽지않네...