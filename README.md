# 더한방 주간보호센터 랜딩페이지

경희대 한의대 출신 한의사 대표가 설계한 한방 건강 케어를 소개하는 한 페이지 홍보 사이트입니다.
GitHub Pages로 무료로 게시하고, 네이버 블로그 최신 글을 매일 자동으로 가져와 보여 줍니다.

게시 주소: https://ube1qa.github.io/landing-page/

## 파일 구성

| 파일 | 설명 |
| --- | --- |
| `index.html` | 랜딩페이지 전체(HTML, CSS, JS가 한 파일). 글꼴(Pretendard)만 jsDelivr CDN에서 불러옵니다. |
| `og.png` | 카카오톡 등에서 링크를 공유할 때 보이는 미리보기 이미지(1200×630) |
| `apple-touch-icon.png` | 휴대폰 홈 화면에 추가했을 때의 아이콘 |
| `scripts/fetch-blog.mjs` | 네이버 블로그 RSS에서 최신 글 6개를 받아 `posts.json`과 썸네일(`blog/`)을 만듭니다. |
| `scripts/blog-feed.mjs` | RSS를 글 목록으로 바꾸는 함수 |
| `tests/blog-feed.test.mjs` | 위 함수의 테스트(`node --test`) |
| `.github/workflows/deploy.yml` | 테스트 → 사이트 준비 → 블로그 글 받기 → GitHub Pages 배포 |

## 처음 한 번 설정

1. 이 폴더의 파일을 저장소의 `main` 브랜치에 올립니다. 점으로 시작하는 `.github` 폴더도 꼭 함께 올려야 자동 배포가 됩니다.
2. 저장소 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 바꿉니다.
3. **Actions** 탭에서 `Deploy`를 열고 **Run workflow**를 눌러 한 번 실행합니다.
4. 1~2분 뒤 https://ube1qa.github.io/landing-page/ 에서 확인합니다.

그다음부터는 `main`에 올릴 때마다, 그리고 매일 오전 6시(한국 시간)에 자동으로 다시 배포되어 블로그 새 글이 반영됩니다.
GitHub는 저장소에 60일 동안 활동이 없으면 예약 실행을 멈추니, 그때는 Actions 탭에서 다시 켜 주세요.

## 공개 전에 바꿀 임시 값

`index.html`에서 아래 값을 실제 정보로 바꿔 주세요.

- 대표 전화 `000-000-0000` (전화 걸기 링크는 `tel:0000000000`)
- 문자 상담을 받을 휴대폰 `010-0000-0000` (문자 링크 `sms:01000000000`, 상담 신청서의 `data-sms="01000000000"`)
- 주소 `○○시 ○○구 ○○로 00, 0층`, 송영 지역 `○○구`
- 운영 시간 `월~토 오전 8시 ~ 오후 8시`
- 바닥글의 대표자 `○○○`, 사업자등록번호 `○○○-○○-○○○○○`

## 네이버 블로그 연동

배포할 때 `scripts/fetch-blog.mjs`가 `https://rss.blog.naver.com/thehanbang0157.xml`에서 최신 글 6개를 읽어
`posts.json`을 만들고, 대표 사진을 `blog/` 폴더에 받아 둡니다. 페이지의 '센터 소식'은 이 파일이 있으면 글 카드를,
없으면 블로그 바로가기만 보여 줍니다. 블로그 주소가 바뀌면 `scripts/blog-feed.mjs`의 `BLOG_ID`와 `index.html`의 블로그 링크를 함께 바꾸세요.

## 로고와 이미지

로고는 센터 간판 사진을 보고 SVG로 다시 그린 것입니다. 원본 로고 파일이 생기면 `index.html`의 `<symbol id="logo-mark">`를 교체하고
`og.png`, `apple-touch-icon.png`도 새 로고로 다시 만들어야 합니다.

## 내 컴퓨터에서 미리 보기

```bash
python3 -m http.server 8000   # http://localhost:8000
node --test                   # 블로그 RSS 처리 테스트
```

블로그 글 카드는 배포된 사이트에서만 나옵니다. 내 컴퓨터에서 보려면 먼저 `node scripts/fetch-blog.mjs .`로 `posts.json`을 만드세요.

## 도메인을 연결하면

**Settings → Pages → Custom domain**에서 도메인을 연결한 뒤, `index.html` 위쪽의 `og:url`, `og:image`, `canonical` 주소를 새 도메인으로 바꿔 주세요.
