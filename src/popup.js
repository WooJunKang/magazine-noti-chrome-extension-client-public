// test for git commit
const ulEle = document.querySelector('#contents-container');
const allReadEle = document.querySelector('#all-read');
const homeEle = document.querySelector('header > span')
const ARTICLE_INFO = 'article_info';
const CLICKED_ARTICLES = 'clicked_articles';
const NEW_ARTICLE_CNT = 'new_article_cnt';
const DEFAULT_IMG_URL = 'https://cdn4.vectorstock.com/i/1000x1000/18/48/article-icon-set-of-great-flat-icons-with-style-vector-24241848.jpg';
const URLCLSS_URL = 'https://urclass.codestates.com/';


const tagAction = {

  removeNewTag: function (element) { // li tag
    let newEle = element.querySelector('.new');
    newEle.remove();
  },

  addNewTag: function (element) {
    // make "new" element
    let newEle = document.createElement('div');
    newEle.classList.add('new');
    newEle.textContent = 'NEW';
    // append "new" element into article element
    let articleEle = element.querySelector('.article');
    articleEle.append(newEle);
  },

  addAllNewTag: function () {
    document.querySelectorAll('.content').forEach(article => {
      let _id = article.getAttribute('value');
      let clickedArticles = JSON.parse(localStorage.getItem(CLICKED_ARTICLES)) || [];
      if (!clickedArticles.includes(_id)) {
        this.addNewTag(article);
      }
    })
  }

}

const clickEvent = {

  getClickedElement: function (evtTarget) { // returns A tag
    let evtTargetClass = evtTarget.className;
    if (evtTargetClass === 'article' || evtTargetClass === 'img-container') {
      return evtTarget.parentElement;
    } else {
      return evtTarget.parentElement.parentElement;
    }
  }

}

const content = {

  renderContent: function (obj) {
    let listEle = document.createElement('li');
    listEle.classList.add('content');
    listEle.setAttribute('value', obj._id);

    let urlEle = document.createElement('a');
    urlEle.setAttribute('href', obj.url);

    // image
    if (obj.img_url === 'none') { obj.img_url = DEFAULT_IMG_URL }
    let imgContainerEle = document.createElement('div')
    imgContainerEle.classList.add('img-container')
    let imgEle = document.createElement('img');
    imgEle.classList.add('content-img');
    imgEle.setAttribute('src', obj.img_url);
    imgContainerEle.append(imgEle);

    // article
    let articleEle = document.createElement('div');
    articleEle.classList.add('article');
    // title
    let articleTitleEle = document.createElement('div');
    articleTitleEle.classList.add('title');
    articleTitleEle.textContent = obj.title.length <= 25 ? obj.title : obj.title.slice(0, 25) + '...';
    // description
    let descEle = document.createElement('div');
    descEle.classList.add('description');
    descEle.textContent = obj.description.slice(0, 70) + '...';
    articleEle.append(articleTitleEle, descEle);

    // merge elements
    urlEle.append(imgContainerEle, articleEle);
    listEle.append(urlEle);
    ulEle.append(listEle);


  },


}

const storage = {

  updateClickedArticle: function (_id) {
    let clickedArticles = JSON.parse(localStorage.getItem(CLICKED_ARTICLES)); // it's array
    clickedArticles = clickedArticles === null ? [] : clickedArticles;
    clickedArticles.push(_id);
    localStorage.setItem(CLICKED_ARTICLES, JSON.stringify(clickedArticles));

  }
}


//----------------------------------------------------


//----------------------------------------------------



addEventListener('DOMContentLoaded', event => {
  let articleInfo = JSON.parse(localStorage.getItem(ARTICLE_INFO));
  articleInfo.forEach(article => content.renderContent(article));
  tagAction.addAllNewTag();
  clickHandler();

})

function clickHandler() {
  document.querySelectorAll('.content').forEach(article => {
    article.addEventListener('click', event => {

      let _element = clickEvent.getClickedElement(event.target);
      let _id = _element.parentElement.getAttribute('value');
      chrome.tabs.create({ url: _element.href });
      // new 였는지 확인 필요 
      if (_element.querySelector('.new') !== null) { // in case of new article

        // update storage
        storage.updateClickedArticle(_id);

        // remove new tag
        tagAction.removeNewTag(_element);

        chrome.runtime.sendMessage({ body: "click-new-article" });
      }

    })
  })
}


allReadEle.addEventListener('click', () => {
  console.log('removing All new tags!')
  document.querySelectorAll('.content').forEach(article => {
    if (article.querySelector('.new') !== null) {
      let _id = article.getAttribute('value');
      // update stroage
      storage.updateClickedArticle(_id);
      // remove new tag
      tagAction.removeNewTag(article);
    }
  })

  chrome.runtime.sendMessage({ body: "click-new-article" });
})

homeEle.addEventListener('click', () => {
  chrome.tabs.create({ url: URLCLSS_URL });
})