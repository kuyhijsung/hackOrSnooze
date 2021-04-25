"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

function storySubmitClick(evt) {
  console.debug("storySubmitClick", evt);
  hidePageComponents();
  $submitStory.show();
  $allStoriesList.show();
}

$submitStoryButton.on("click", storySubmitClick);

function favoritesClick(evt) {
  console.debug("favoritesClick", evt);
  hidePageComponents();
  $favoritesForm.show();
  putFavoriteStoriesOnPage();
}

$favoritesBtn.on("click", favoritesClick);
/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}