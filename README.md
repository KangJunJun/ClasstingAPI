# Classting_School_Feed_API

클래스팅 백엔드 사전과제

## 목차

- [요구사항 분석](#1-요구사항-분석)
- [구현](#2-구현)
- [실행 및 테스트](#3-실행-및-테스트)
- [API 명세](#4-API-명세)

## 1. 요구사항 분석

### 기능 필수 요구사항

- 관리자로 학교페이지를 생성하는 API 개발
- 관리자로 학교소식 작성 API 개발 ( 추가, 수정, 삭제 )
- 사용자로 학교를 구독하는 기능 API 개발
- 사용자로 구독 중인 학교 목록 API 개발
- 사용자로 구독 중인 학교별 소식목록 API 개발 (최신순)

### 기능 추가 요구사항

- 사용자로 구독중인 학교의 모든 소식목록을 보는 API개발
  - 최신순으로 정렬
  - 구독 시점 이후의 소식부터 가져오고, 구독 취소 이전의 소식은 유지

### 선택사항

- 사용자별 권한이 필요한 요구사항이므로 로그인 기능 구현
  - 사용자/관리자 는 별도로 가입/로그인/로그아웃 API 개발
- 테스트 편의상 기능
  - 사용자/관리자는 중복로그인이 가능
  - Authorization 헤더의 “Bearer Token”이 아닌 쿠키만으로 체크
  - 로그인 토큰의 만료시간은 6시간으로 지정하여 refresh 토큰 재발급은 생략

### Modeling

![](https://i.imgur.com/xPQysOH.png)

- 학교 관리자는 학교 등록 및 소식글을 작성할 수 있습니다.
- 학교별로 관리자가 필요할 것으로 판단되므로, 학교와 관리자는 1:1 관계를 가집니다.
- 학교페이지는 같은 지역에 같은 동명의 학교명은 없다고 가정하여 복합 유니크키를 가집니다. 즉, 같은 지역에 같은 이름의 학교는 등록할 수 없습니다.
- 사용자(학생)은 학교마다 구독을 할 수 있기 때문에, 구독은 사용자ID와 학교ID로 복합키를 가집니다.

## 2. 구현

### Tech Stack

- NestJS (Node.js)
- TypeORM (ORM)
- mysql (RDBMS)

#### 요구사항 충족도 100%

✅ 1. 학교페이지를 등록합니다.  
✅ 2. 학교소식을 등록합니다.
✅ 3. 학교소식을 수정합니다.  
✅ 4. 학교소식을 삭제합니다.  
✅ 5. 사용자가 학교를 구독합니다.
✅ 5-1. 사용자가 학교를 구독 취소합니다.
✅ 5-2. 사용자가 학교를 재구독합니다.
✅ 6. 사용자가 구독중엔 학교 목록을 가져옵니다.  
✅ 7. 사용자가 구독중엔 학교의 소식 목록을 가져옵니다.  
✅ 8. 사용자가 구독중엔 학교들의 모든 소식을 가져옵니다.  
✅ 8-1. 구독 시점 이후 소식부터 가져옵니다.
✅ 8-2. 구독 취소 이전 소식을 포함하여 가져옵니다.

### DB 생성 및 App 연결

- Database 는 docker mysql:8 image를 상용하여 컨테이너로 로컬 환경에 구동시켰습니다.
- TypeORM configuration을 위하여 `src/config/env` 폴더에 `.development.env` 파일을 만들어 development environment에서의 환경 변수를 등록하였습니다.
- `ormConfig.ts` 작성
  - TypeOrmModule configuration을 위해 TypeOrmModuleOption을 반환하는 함수를 가진 클래스를 정의하고, 이를 `App.module.ts` 에서 import 하여 설정 값으로 사용하였습니다.
  - .development.env 의 내용은 다음과 같습니다.

    ```
    DATABASE_TYPE=mysql
    DATABASE_HOST=localhost
    DATABASE_NAME=classting_db
    DATABASE_USERNAME=root
    DATABASE_PASSWORD=test
    DATABASE_PORT=3306
    ADMIN_ACCESS_TOKEN_SECRET=AdminTokenSecretTest
    USER_ACCESS_TOKEN_SECRET=UserTokenSecretTest
    ```

## 3. 실행 및 테스트

- Git, Nodejs 는 설치되어 있다고 가정합니다.

```
 $ npm install
 $ npm run start

 $ npm run test:cov
```

- 접속 Base URI: `http://localhost:3000/`

## 4. API 명세

### 요구사항 구현을 위한 부가적인 API 생성

- User (src/user/user.contorller.ts)

  - `POST` /user (사용자 생성)
    - `create-user.dto.ts`: data validation & serialization
      - account : string
      - name: string
      - password: string
  - `POST` /user/login (사용자 로그인)
    - `LoginDto.dto.ts`: data validation & serialization
      - account : string
      - password: string
  - `POST` /user/logout (사용자 로그아웃)

  - Admin (src/admin/admin.contorller.ts)
  - `POST` /admin (관리자 생성)
    - `create-admin.dto.ts`: data validation & serialization
      - account : string
      - name: string
      - password: string
  - `POST` /admin/login (관리자 로그인)
    - `LoginDto.dto.ts`: data validation & serialization
      - account : string
      - password: string
  - `POST` /admin/logout (관리자 로그아웃)

### 요구사항 구현

- School(src/school/school.contorller.ts)

  **학교 페이지 생성 (관리자 전용)**

  - `POST` /school

    - `create-school.dto.ts`: data validation & serialization
      - name: string
      - region: string

    요청 예시

    ```
    {
    	"name": "공항중",
    	"region": "공항동",
    }
    ```

    응답 예시

    ```
    {
    	"name": "공항중",
    	"region": "공항동",
    	"id": 13,
    	"adminId": 6
    }
    ```

- Feed(src/feed/feed.contorller.ts)

  **학교 소식 생성 (관리자 전용)**

  - `POST` /feed

    - `create-feed.dto.ts`: data validation & serialization
      - title: string
      - content: string

    요청 예시

    ```
    {
    	"title":"첫번재 소식",
    	"content":"test입니다."
    }
    ```

    응답 예시

    ```
    {
    	"title": "첫번재 소식",
    	"content": "test입니다.",
    	"school": {
    		"id": 13,
    		"name": "공항중",
    		"region": "공항동"
    	},
    	"id": 10,
    	"createdAt": "2022-08-28T07:04:59.075Z",
    	"updatedAt": "2022-08-28T07:04:59.075Z",
    	"schoolId": 13
    }
    ```

  **학교 소식 수정 (관리자 전용)**

  - `PATCH` /feed/:id

    - `update-feed.dto.ts`: data validation & serialization
      - title: string
      - content: string

    요청 예시

    ```
    PATCH /feed/10
    ```

    ```
    	{
    		"title":"첫번재 소식(수정)",
    		"content":"update test입니다."
    	}
    ```

    응답 예시

    ```
    	{
    		"message": "The feed(id: 10) was successfully updated.",
    		"data": {
    			"id": 10,
    			"title": "첫번재 소식(수정)",
    			"content": "update test입니다.",
    			"createdAt": "2022-08-28T07:04:59.075Z",
    			"updatedAt": "2022-08-28T07:08:31.000Z",
    			"schoolId": 13
    		}
    	}
    ```

  **학교 소식 삭제 (관리자 전용)**

  - `Delete` /feed/:id

    요청 예시

    ```
    Delete /feed/10
    ```

    ```
    	{
    		"title":"첫번재 소식(수정)",
    		"content":"update test입니다."
    	}
    ```

    응답 예시

    ```
    	{
    		"message": "The feed(id: 10) was successfully deleted.",
    		"data": {
    			"id": 10,
    			"title": "첫번재 소식(수정)",
    			"content": "update test입니다.",
    			"createdAt": "2022-08-28T07:04:59.075Z",
    			"updatedAt": "2022-08-28T07:08:31.000Z",
    			"schoolId": 13
    		}
    	}


    ```

  **구독 중인 소식글 모든 목록 (학생 전용)**

  - `GET` /feed

    **응답 예시**

    ```
    	[
    		{
    			"id": 12,
    			"title": "다른학교글",
    			"content": "역시 Test 입니다.",
    			"createdAt": "2022-08-28T07:24:40.651Z",
    			"updatedAt": "2022-08-28T07:24:40.651Z",
    			"schoolId": 9
    		},
    		{
    			"id": 11,
    			"title": "test1",
    			"content": "test입니다.",
    			"createdAt": "2022-08-28T07:21:41.936Z",
    			"updatedAt": "2022-08-28T07:21:41.936Z",
    			"schoolId": 13
    		}
    	]
    ```

- Subscribe(src/subscribe/subscribe.contorller.ts)

  **구독 / 구독취소 / 재구독 (학생 전용)**

  - `POST` /subscribe

    - `subscribe.dto.ts`: data validation & serialization
      - schoolId : number;

    요청 예시

    ```
    {
    	"schoolId ":13,
    }
    ```

    구독

    ```
    {
    	"userId": 3,
    	"schoolId": 13,
    	"createdAt": "2022-08-28T07:47:54.275Z",
    	"deletedAt": null
    }
    ```

    구독 취소

    ```
    {
    	"userId": 3,
    	"schoolId": 13,
    	"createdAt": "2022-08-28T07:47:54.275Z",
    	"deletedAt": "2022-08-28T07:48:03.000Z"
    }
    ```

    재구독

    ```
    {
    	"userId": 3,
    	"schoolId": 13,
    	"deletedAt": null
    }
    ```

  **구독 중인 소식글 모든 목록 (학생 전용)**

  - `GET` /subscribe/schools

    **응답 예시**

    ```
    [
    	{
    		"id": 5,
    		"name": "명덕2",
    		"region": "발산동",
    		"adminId": 1
    	},
    	{
    		"id": 9,
    		"name": "공항중",
    		"region": "공항",
    		"adminId": 5
    	},
    	{
    		"id": 13,
    		"name": "공항중",
    		"region": "공항동",
    		"adminId": 6
    	}
    ]
    ```

  **구독 중인 소식글 모든 목록 (학생 전용)**

  - `GET` /subscribe/schools/id:

    **응답 예시**

    ```
    	[
    		{
    			"id": 12,
    			"title": "다른학교글",
    			"content": "역시 Test 입니다.",
    			"createdAt": "2022-08-28T07:24:40.651Z",
    			"updatedAt": "2022-08-28T07:24:40.651Z",
    			"schoolId": 9
    		},
    		{
    			"id": 9,
    			"title": "공항중 두번글",
    			"content": "test입니다.",
    			"createdAt": "2022-08-27T12:26:31.149Z",
    			"updatedAt": "2022-08-27T12:26:31.149Z",
    			"schoolId": 9
    		},
    		{
    			"id": 8,
    			"title": "공항중 첫글",
    			"content": "test입니다.",
    			"createdAt": "2022-08-27T12:26:24.430Z",
    			"updatedAt": "2022-08-27T12:26:24.430Z",
    			"schoolId": 9
    		}
    	]
    ```
