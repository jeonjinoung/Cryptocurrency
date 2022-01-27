# 코인 빌드

### 팀원 : 전진영 <a href="https://github.com/jeonjinoung"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=GitHub&logoColor=white"/></a> , 박준혁 <a href="https://github.com/berrypjh"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=GitHub&logoColor=white"/></a> , 곽지현 <a href="https://github.com/TsukinoHikari"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=GitHub&logoColor=white"/></a> 
---------------------------------------

## 목적
블록체인, POW, 지갑생성 이해하기

---------------------------------------

## 서버 폴더 구조
> blockchain
>> blockclass.js
>> blocks.js
>
> config
>> config.json
>
> models
>> block.js
>> index.js
>> user.js
>
> network
>> message
>>> massage.js
>>> type.js
>>
>> route
>>> BlockRouter.js
>>> PeerRouter.js
>>> UserRouter.js
>>> WalletRouter.js
>>
>> main.js
>> networks.js
>
> passport
>> index.js
>> local.js
>
> scripts
>> average-work.js
>
> utils
>> hash.js
>> isValidBlock.js
>
> wallet
>> wallet.js
>
> package-lock.json
> package.json
> yarn.lock

# 작업일정
## 01.27~28 계획수립 및 복습 ##
1. 이전 프로젝트 서버 및 폴더 재정리 및 내용 파악
2. trensection의 이해 및 구성하기위한 계획
3. 필요코드 및 참고 코드 확인

# 목표 #
◎기존 블록의 트랜잭션 내용 삽입
◎각각의 블록 지갑화
◎각각의 서버 address 연결

