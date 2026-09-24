import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BLOG_URL, ogImage, parseFeed, postUrl } from '../scripts/blog-feed.mjs';

// 네이버 블로그 RSS 형식을 흉내 낸 테스트용 피드입니다. 실제 글이 아닙니다.
const FEED = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title><![CDATA[테스트 블로그]]></title>
<item>
<category><![CDATA[센터 소식]]></category>
<title><![CDATA[테스트 글 &amp; 첫 번째]]></title>
<link><![CDATA[https://blog.naver.com/thehanbang0157/224000000001?fromRss=true&trackingCode=rss]]></link>
<description><![CDATA[<img src="https://blogthumb.pstatic.net/test/one.jpg?type=w2" /> 첫 번째   테스트 본문입니다. <b>굵게</b>]]></description>
<pubDate>Tue, 23 Sep 2025 14:30:00 +0900</pubDate>
</item>
<item>
<title>테스트 글 &lt;두 번째&gt;</title>
<link>https://blog.naver.com/thehanbang0157/224000000002?fromRss=true&amp;trackingCode=rss</link>
<description>두 번째 본문</description>
<pubDate>not a date</pubDate>
</item>
<item>
<title><![CDATA[다른 블로그 글]]></title>
<link><![CDATA[https://blog.naver.com/someoneelse/224000000003]]></link>
<pubDate>Mon, 22 Sep 2025 09:00:00 +0900</pubDate>
</item>
</channel></rss>`;

test('RSS 글을 랜딩페이지용 글 목록으로 바꿉니다', () => {
  const [first, second] = parseFeed(FEED);
  assert.deepEqual(first, {
    title: '테스트 글 & 첫 번째',
    url: `${BLOG_URL}/224000000001`,
    logNo: '224000000001',
    date: '2025-09-23T05:30:00.000Z',
    category: '센터 소식',
    excerpt: '첫 번째 테스트 본문입니다. 굵게',
    image: 'https://blogthumb.pstatic.net/test/one.jpg?type=w2',
  });
  assert.equal(second.title, '테스트 글 <두 번째>');
  assert.equal(second.url, `${BLOG_URL}/224000000002`);
  assert.equal(second.date, null);
  assert.equal(second.category, '');
  assert.equal(second.image, '');
});

test('다른 블로그의 글은 건너뛰고 개수 제한을 지킵니다', () => {
  assert.equal(parseFeed(FEED).length, 2);
  assert.equal(parseFeed(FEED, { limit: 1 }).length, 1);
  assert.equal(postUrl('https://blog.naver.com/someoneelse/1'), null);
  assert.deepEqual(postUrl('https://m.blog.naver.com/thehanbang0157/42'), { url: `${BLOG_URL}/42`, logNo: '42' });
});

test('긴 요약은 줄여서 말줄임표를 붙입니다', () => {
  const excerpt = parseFeed(FEED.replace('두 번째 본문', '가'.repeat(200)))[1].excerpt;
  assert.equal(excerpt.length, 90);
  assert.ok(excerpt.endsWith('…'));
});

test('글 페이지의 대표 이미지(og:image)를 읽습니다', () => {
  assert.equal(ogImage('<meta property="og:image" content="https://blogthumb.pstatic.net/a.jpg?type=w2&amp;x=1">'), 'https://blogthumb.pstatic.net/a.jpg?type=w2&x=1');
  assert.equal(ogImage('<meta content="https://x/y.png" property="og:image">'), 'https://x/y.png');
  assert.equal(ogImage('<meta property="og:title" content="제목">'), '');
});
