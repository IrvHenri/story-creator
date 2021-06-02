const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};
const createViewedStory = (story, isAuthor) => {
  const {
    title,
    avatar,
    initial_content,
    created_at,
    username,
    id,
    is_complete,
  } = story;
  const safeTitle = escape(title);
  const safeContent = escape(initial_content);
  if (isAuthor) {
    const $story = $(`
  <article class ='story-article' data-id= ${id}>
  <header>
  <h2>${safeTitle}</h2>

   <div><h3> ${username}</h3> <img src = ${avatar} alt= 'avatar' class = 'avatar'> </div>
  </header>

  <p class ='story-content'> ${safeContent}</p>

  <footer> <div><small>${timeago.format(created_at)} </small>/ <small>${
      is_complete ? "Completed" : "In progress"
    }</small></div> <button class = 'mark-complete-btn'>Mark Complete</button></footer>
  </article>

  `);
    return $story;
  }
  const $story = $(`
  <article class ='story-article' data-id= ${id}>
  <header>
  <h2>${safeTitle}</h2>

   <div><h3> ${username}</h3> <img src = ${avatar} alt= 'avatar' class = 'avatar'> </div>
  </header>

  <p class ='story-content'> ${safeContent}</p>

  <footer> <div><small>${timeago.format(created_at)} </small>/ <small>${
    is_complete ? "Completed" : "In progress"
  }</small></div> </footer>
  </article>

  `);
  return $story;
};

const createStory = (story) => {
  const {
    title,
    avatar,
    initial_content,
    created_at,
    username,
    id,
    is_complete,
  } = story;
  const safeTitle = escape(title);
  const safeContent = escape(initial_content);
  const $story = $(`
  <article class ='story-article' data-id= ${id}>
  <header>
  <h2>${safeTitle}</h2>

   <div><h3> ${username}</h3> <img src = ${avatar} alt= 'avatar' class = 'avatar'> </div>
  </header>

  <p class ='story-content'> ${safeContent}</p>

  <footer>  <div><small>${timeago.format(created_at)} </small>/ <small>${
    is_complete ? "Completed" : "In progress"
  }</small></div>  <button class = 'view-story-btn' > View Story </button> </footer>
  </article>

  `);
  return $story;
};

const randomColor = () => {
  const colors = [
    "#35d461",
    "#37b6f6",
    "#639fb0",
    "#047cac",
    "#9ad2a9",
    "#f5f5f5",
  ];
  let randomNum = Math.floor(Math.random() * 5) + 1;
  return colors[randomNum];
};

const creatAcceptContributionBtn = (id) => {
  //${author_id == user_id ? creatAcceptContributionBtn(id) : ""}
  return `
  <button data-id = ${id}>
   Accept <i class="fas fa-check-circle"></i>
  </button>
  `;
};

const createContribution = (contribution, author_id) => {
  const { id, avatar, content, created_at, username, upvotes } = contribution;
  const user_id = localStorage.getItem("user_id");
  const $contribution = $(`<article class='contribution'>
  <h5>Upvotes:
  <span class='upvote-count'>${upvotes}</span>
  </h5>
  <header> <div><p>${username}</p> <img  src = ${avatar} alt = 'avatar' class = 'avatar'>  </div></header>
  <p>${content}</p>
  <footer>
    ${timeago.format(created_at)}
    <div class='contribution-btn-container'>
      ${author_id == user_id ? creatAcceptContributionBtn(id) : ""}
      <button data-id = ${id} class='upvote-btn'>
       Upvote <i class="fas fa-arrow-up"></i>
      </button>
    </div>
  </footer>
  </article>`);
  $($contribution).css("background", randomColor());
  return $contribution;
};

const renderStories = (stories, tab) => {
  stories.forEach((story) => {
    $(tab).prepend(createStory(story));
  });
};

const renderStory = (story, tab) => {
  $(tab).append(createStory(story));
};

const renderViewedStory = (story, tab, isAuthor) => {
  $(tab).append(createViewedStory(story, isAuthor));
};

const renderContributions = (contributions, tab, author_id) => {
  $(tab).empty();
  contributions.map((contribution) => {
    $.get(`/contributions/${contribution.id}/upvotes`).then((data) => {
      contribution.upvotes = data.count;
      $(tab).append(createContribution(contribution, author_id));
    });
  });
};

const isAuthorView = (story, contributions, contributionWidget) => {
  const user_id = Number(localStorage.user_id);
  //console.log(contributions)
  $(".content-container").prepend(contributionWidget);
  if (user_id === story.user_id) {
    renderViewedStory(story, ".content-container", true);
    renderContributions(
      contributions,
      ".contribution-container",
      story.user_id
    );
  } else {
    renderContributions(
      contributions,
      ".contribution-container",
      story.user_id
    );
    renderViewedStory(story, ".content-container", false);
  }
};
