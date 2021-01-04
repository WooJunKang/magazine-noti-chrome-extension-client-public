
const BASE_URL = "https://magazine-notification-app.herokuapp.com";
const ARTICLE_INFO = 'article_info';
const CLICKED_ARTICLES = 'clicked_articles';
const NEW_ARTICLE_CNT = 'new_article_cnt';
const BADGE_BG_COLOR = '#7d3ffb';



const getArticleInfo = () => {
  console.log('fetching...')
  fetch(`${BASE_URL}/contents`)
    .then(res => res.json())
    .then(list => list.slice(0, 5))
    .then(data => {
      if (localStorage.getItem(ARTICLE_INFO) === null) {
        console.log('initial update !')
        localStorage.setItem(ARTICLE_INFO, JSON.stringify(data));
        updateBadge();
      } else if (JSON.parse(localStorage.getItem(ARTICLE_INFO))[0]._id !== data[0]._id) {
        console.log('there is new articles !')
        localStorage.setItem(ARTICLE_INFO, JSON.stringify(data));
        updateBadge();
      } else {
        console.log('there is not new article !')
      }
    })
}

const updateNewArtcleCnt = () => {
  console.log('count of new article is being updated');
  const clickedArticles = JSON.parse(localStorage.getItem(CLICKED_ARTICLES))
  if (clickedArticles !== null) {
    clickedArticles
    const newArticleCount = JSON.parse(localStorage.getItem(ARTICLE_INFO))
      .map(obj => obj._id)
      .filter(id => !clickedArticles.includes(id))
      .length;
    localStorage.setItem(NEW_ARTICLE_CNT, newArticleCount)
  } else {
    localStorage.setItem(NEW_ARTICLE_CNT, 5);
  }
}

// const updateBadge = () => {
//   console.log('updating...')
//   updateNewArtcleCnt();
//   const newArticleCnt = parseInt(localStorage.getItem(NEW_ARTICLE_CNT));
//   chrome.browserAction.setBadgeBackgroundColor({ color: BADGE_BG_COLOR });
//   chrome.browserAction.setBadgeText({ text: `${newArticleCnt === 0 ? '' : newArticleCnt}` })
// }

const updateBadge = () => {
  updateNewArtcleCnt();
  const newArticleCnt = localStorage.getItem(NEW_ARTICLE_CNT);
  chrome.browserAction.setBadgeBackgroundColor({ color: BADGE_BG_COLOR });
  chrome.browserAction.setBadgeText({ text: `${newArticleCnt === '0' ? '' : newArticleCnt}` })
}

getArticleInfo();
window.setInterval(getArticleInfo, 100000);
updateBadge();


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.body == "click-new-article") {
    console.log('got a message')
    updateBadge();
  }
});