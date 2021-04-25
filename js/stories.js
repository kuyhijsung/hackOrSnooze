"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */


function generateStoryMarkup(story) {
  console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <span class="star">
        <i class="far fa-star"></i>
        </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function generateOwnStoryMarkUp(story) {
  console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <span class="trash">
        <i class="fas fa-trash-alt"></i>
        </span>
        <span class="star">
        <i class="far fa-star"></i>
        </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

async function submitAddStory(e) {
  e.preventDefault();
  const storyTitle = $("#titleInput").val();
  const storyAuthor = $("#authorInput").val();
  const storyURL = $("#urlInput").val();
  const storyData = await storyList.addStory(currentUser, {
    title: storyTitle,
    author: storyAuthor,
    url: storyURL
  });
  const newStory = generateStoryMarkup(storyData);
  $allStoriesList.prepend(newStory);
  $submitStory.trigger("reset");
  $submitStory.hide();
}

$submitStory.on("submit", submitAddStory);

function favoriteStar(e) {
  // const star = e.target.closest(".far");
  if (e.target.className === "far fa-star") {
    e.target.className = "fas fa-star";
    for (let i = 0; i < storyList.stories.length; i++) {
      if (e.target.parentNode.parentNode.id === storyList.stories[i].storyId) {
        currentUser.favorites.push(storyList.stories[i]);
        console.log(currentUser.favorites)
      }
    }
  } else if (e.target.className === "fas fa-star") {
    e.target.className = "far fa-star";
    let id = e.target.parentNode.parentNode.id;
    const index = currentUser.favorites.findIndex((x) => x.storyId === id);
    currentUser.favorites.splice(index, 1);
    console.log(currentUser);
  }
}

$storiesLists.on("click", ".star", favoriteStar);

async function myOwnStoriesDelete(e) {
  const $closestLi = $(e.target).closest("li");
  const storyId = $closestLi.attr("id");
  await storyList.removeStory(currentUser, storyId);

  await putMyStoriesOnPage();
}
$ownStoriesForm.on("click", ".trash", myOwnStoriesDelete);

function putFavoriteStoriesOnPage() {
  $favoritesForm.empty();
  for (let favorites of currentUser.favorites) {
    const $favorites = generateStoryMarkup(favorites);
    $favoritesForm.append($favorites);
  }
  $favoritesForm.show();
}

function putMyStoriesOnPage() {
  $ownStoriesForm.empty();
  for (let stories of currentUser.ownStories) {
    const $ownStories1 = generateOwnStoryMarkUp(stories);
    $ownStoriesForm.append($ownStories1);
  }
  $ownStoriesForm.show();
  $allStoriesList.hide();
}

$ownStoriesBtn.on("click", putMyStoriesOnPage);

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}